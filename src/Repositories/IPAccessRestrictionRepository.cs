using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Serilog;
using TFE.Umbraco.AccessRestriction.Constants;
using TFE.Umbraco.AccessRestriction.Middleware;
using TFE.Umbraco.AccessRestriction.Models;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Extensions;

namespace TFE.Umbraco.AccessRestriction.Repositories;

public class IPAccessRestrictionRepository : IIPAccessRestrictionRepository
{
	private readonly IScopeProvider _scopeProvider;
	private readonly IHttpContextAccessor _httpContextAccessor;
	private readonly IAppPolicyCache _globalCache;
	private readonly Config? _config;
	private readonly IWebHostEnvironment _env;
	private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;

	private IEnumerable<WhitelistedIp>? _ipsFromFile = null;
	private readonly string[] _SplitChars = { "#" };

	public IPAccessRestrictionRepository(
		IScopeProvider scopeProvider,
		IHttpContextAccessor httpContextAccessor,
		AppCaches appCaches,
		IConfiguration config,
		IWebHostEnvironment webHostEnvironment,
		IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
		ILogger<IPAccessRestrictionRepository> logger)
	{
		_scopeProvider = scopeProvider;
		_httpContextAccessor = httpContextAccessor;
		_env = webHostEnvironment ?? throw new ArgumentNullException(nameof(webHostEnvironment));

		_globalCache = appCaches.IsolatedCaches.GetOrCreate(typeof(IPAccessRestrictionRepository));

		var configSection = config.GetSection("TFE.Umbraco.AccessRestriction");
		if (!configSection.Exists())
		{
			logger.LogWarning("The configuration section 'TFE.Umbraco.AccessRestriction' is missing in appsettings.json.");
			_config = null;
		}
		else
		{
			_config = configSection.Get<Config>();
		}

		_backOfficeSecurityAccessor = backOfficeSecurityAccessor;
	}

	public string? GetClientIP()
	{
		var context = _httpContextAccessor.HttpContext;

		if (context == null)
		{
			return null;
		}

		if (_config == null)
		{
			return context.Connection.RemoteIpAddress?.ToString(); // Fallback to remote IP if config is null
		}

		var clientIp = context.Connection.RemoteIpAddress?.ToString();
		clientIp = (clientIp == "::1" || clientIp == "0.0.0.1") && !string.IsNullOrWhiteSpace(_config.LocalHost) ? _config.LocalHost : clientIp;

		// On Umbraco Cloud, the website is hosted behind Cloudflare, so we need to get the client IP from the headers
		// If the website is hosted behind a proxy to retreive clients IP you can use this cuts

		string? headerKey = _config.IsCloudflare ? "CF-Connecting-IP" : _config.CustomHeader;
		if (!string.IsNullOrWhiteSpace(headerKey) && context.Request.Headers.TryGetValue(headerKey, out var headerValue))
		{
			clientIp = headerValue;
		}

		return clientIp;
	}

	public bool Delete(Guid id)
	{
		var entry = GetbyId(id);

		if (entry == null)
		{
			return true;
		}

		entry.IsDeleted = true;

		return Save(entry);
	}

	public IEnumerable<IPAccessEntry> GetAll()
	{
		var resultEntries = Enumerable.Empty<IPAccessEntry>();

		using var scope = _scopeProvider.CreateScope();
		var sql = scope.SqlContext.Sql().Select("*").From<IPAccessEntry>().Where<IPAccessEntry>(x => !x.IsDeleted);
		var databaseEntries = scope.Database.Fetch<IPAccessEntry>(sql);
		if (databaseEntries != null && databaseEntries.Any())
		{
			databaseEntries.ForEach(e => e.IsEditable = true);
			resultEntries = resultEntries.Concat(databaseEntries);
		}

		if (_config?.ShowConfigIpsInBackoffice == true)
		{
			var ipsFromConfig = GetIpAddressesFromConfig(_config);
			if (ipsFromConfig != null && ipsFromConfig.Any())
			{
				resultEntries = resultEntries.Concat(ipsFromConfig.Select(ifc => new IPAccessEntry { Ip = ifc, Description = "(appsettings.json)" }));
			}

			var ipsFromTxtFile = GetIpAddressesFromTxtFile();
			if (ipsFromTxtFile != null && ipsFromTxtFile.Any())
			{
				resultEntries = resultEntries.Concat(ipsFromTxtFile.Select(iftf => new IPAccessEntry { Ip = iftf.Ip, Description = $"{(!string.IsNullOrEmpty(iftf.Description) ? $"{iftf.Description} " : string.Empty)}(whitelistedips.txt)" }));
			}
		}

		return resultEntries;
	}

	public IEnumerable<string> GetWhitelistedIpAddresses()
	{
		var result = _globalCache.Get("GetWhitelistedIpAddresses", () =>
		{
			using var scope = _scopeProvider.CreateScope(autoComplete: true);
			var sql = scope.SqlContext.Sql().Select<IPAccessEntry>(x => x.Ip).From<IPAccessEntry>().Where<IPAccessEntry>(x => !x.IsDeleted);
			var result = scope.Database.Fetch<IPAccessEntry>(sql);

			var resultIpList = Enumerable.Empty<string>();

			var ipsFromDatabase = from r in result where !string.IsNullOrWhiteSpace(r.Ip) select r.Ip;
			if (ipsFromDatabase != null && ipsFromDatabase.Any())
			{
				resultIpList = resultIpList.Concat(ipsFromDatabase);
			}

			var ipsFromTxtFile = GetIpAddressesFromTxtFile().ToList();
			if (ipsFromTxtFile != null && ipsFromTxtFile.Any())
			{
				resultIpList = resultIpList.Concat(ipsFromTxtFile.Select(iftf => iftf.Ip));
			}

			var ipsFromConfig = GetIpAddressesFromConfig(_config).ToList();
			if (ipsFromConfig != null && ipsFromConfig.Any())
			{
				resultIpList = resultIpList.Concat(ipsFromConfig);
			}

			return resultIpList;
		}) as IEnumerable<string>;

		return result ?? Enumerable.Empty<string>();
	}

	public IPAccessEntry? GetbyId(Guid id)
	{
		using var scope = _scopeProvider.CreateScope(autoComplete: true);

		var sql = scope.SqlContext.Sql().Select("*").From(Constants.Constants.DatabaseSchema.Tables.IpAccessEntries).Where<IPAccessEntry>(x => x.Id == id);

		return scope.Database.FirstOrDefault<IPAccessEntry>(sql);
	}

	public bool Save(IPAccessEntry entry)
	{
		ArgumentNullException.ThrowIfNull(entry);

		if (!ValidateIp(entry))
		{
			Console.WriteLine($"Invalid IP address format,{entry}");
			return false;
		}

		entry.ModifiedBy = CurrentUser();
		entry.Modified = DateTime.Now;

		using var scope = _scopeProvider.CreateScope(autoComplete: true);

		if (entry.Id != Guid.Empty)
		{
			scope.Database.Update(entry, x => new { x.Id, x.Ip, x.Description, x.Modified, x.ModifiedBy, x.IsDeleted });
		}
		else
		{
			entry.Id = Guid.NewGuid();
			entry.CreatedBy = entry.ModifiedBy;
			entry.Created = entry.Modified;
			entry.IsDeleted = false;
			scope.Database.Insert(entry);
		}

		_globalCache.ClearByKey("GetWhitelistedIpAddresses");

		return true;
	}

	public string GetHeaderInfo()
	{
		if (_config == null)
		{
			return string.Empty;
		}

		if (_config.IsCloudflare && !string.IsNullOrWhiteSpace(_config.CustomHeader))
		{
			return "Attention: Please choose Cloudflare or a custom header";
		}
		else if (_config.IsCloudflare)
		{
			return "Attention: Cloudflare configuration is active";
		}
		else if (!string.IsNullOrWhiteSpace(_config.CustomHeader))
		{
			return $"Attention: Using custom header {_config.CustomHeader}";
		}
		else
		{
			return string.Empty;
		}
	}

	private IEnumerable<string> GetIpAddressesFromConfig(Config? config)
	{
		return config?.Whitelist ?? [];
	}

	private IEnumerable<WhitelistedIp> GetIpAddressesFromTxtFile()
	{
		var whitelistedIpFilePath = Path.Combine(_env.ContentRootPath, "WhitelistedIps.txt");
		var processedLines = new List<WhitelistedIp>();
		if (File.Exists(whitelistedIpFilePath))
		{
			if (_ipsFromFile != null)
			{
				return _ipsFromFile;
			}

			try
			{
				using StreamReader reader = new(whitelistedIpFilePath);
				while (!reader.EndOfStream)
				{
					var line = reader.ReadLine()?.Split(_SplitChars, StringSplitOptions.RemoveEmptyEntries);
					if (line != null && line.Length > 0)
					{
						processedLines.Add(new WhitelistedIp { Ip = line[0].Trim(), Description = line.Length > 1 ? line[1].Trim() : null });
					}
				}

				_ipsFromFile = processedLines.ToArray();
			}
			catch (Exception ex)
			{
				Log.Warning(ex, "WhitelistedIps.txt file cannot be found");
			}
		}

		return processedLines;
	}

	public IEnumerable<string> GetBlacklistedIpAddresses()
	{
		return _config?.Blacklist ?? [];
	}

	private string? CurrentUser()
	{
		var currentUser = _backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser
							?? throw new InvalidOperationException("No backoffice user found");

		return currentUser.Name;
	}

	private bool ValidateIp(IPAccessEntry entry)
	{
		if (string.IsNullOrEmpty(entry.Ip))
		{
			return false;
		}

		int wildcards = entry.Ip.Split('*').Length - 1;
		if (wildcards > 0)
		{
			return wildcards == 1 && entry.Ip.EndsWith('*');
		}

		return RegexConstants.IsValidIP().IsMatch(entry.Ip);
	}

	public string GetInstallationInfo()
	{
		string message = "";

		if (_config == null)
		{
			message = "Configuration in appsettings.json is missing";
		}

		if (!IPAccessRestrictionMiddleware.IsRegistered)
		{
			if (!string.IsNullOrEmpty(message))
			{
				message += "<br>& Middleware is not registered";
			}
			else
			{
				message = "Middleware is not registered";
			}
		}

		if (!string.IsNullOrEmpty(message))
		{
			message += $". <a href='https://www.nuget.org/packages/TFE.Umbraco.AccessRestriction/' target='_blank' rel='noopener noreferrer'>Find more info here</a>";
		}

		return message;
	}
}