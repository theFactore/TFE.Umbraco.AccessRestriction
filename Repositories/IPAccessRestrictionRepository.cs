using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using StackExchange.Profiling.Internal;
using System.Security.Claims;
using TFE.Umbraco.AccessRestriction.Models;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Extensions;
using Serilog;

namespace TFE.Umbraco.AccessRestriction.Repositories;
public class IPAccessRestrictionRepository : IIPAccessRestrictionRepository
{
    private readonly IScopeProvider _scopeProvider;
    private readonly IOptionsSnapshot<CookieAuthenticationOptions> _cookieOptionsSnapshot;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IAppPolicyCache globalCache;
    private readonly Config? _config;
    private readonly IWebHostEnvironment _env;

    private static IEnumerable<string>? ipsFromFile = null;

    public IPAccessRestrictionRepository(
        IScopeProvider scopeProvider,
        IOptionsSnapshot<CookieAuthenticationOptions> cookieOptionsSnapshot,
        IHttpContextAccessor httpContextAccessor,
        AppCaches appCaches,
        IConfiguration config, 
        IWebHostEnvironment webHostEnvironment)
    {
        _scopeProvider = scopeProvider;
        _cookieOptionsSnapshot = cookieOptionsSnapshot;
        _httpContextAccessor = httpContextAccessor;
        _env = webHostEnvironment ?? throw new ArgumentNullException(nameof(webHostEnvironment));

        globalCache = appCaches.IsolatedCaches.GetOrCreate(typeof(IPAccessRestrictionRepository));

        _config = config.GetSection("TFE.Umbraco.AccessRestriction").Get<Config>();
    }

    public string? GetClientIP()
    {
        var context = _httpContextAccessor.HttpContext;

        if (context == null)
        {
            return null;
        }

        var clientIp = context.Connection.RemoteIpAddress?.ToString();
        clientIp = (clientIp == "::1" || clientIp == "0.0.0.1") && !string.IsNullOrWhiteSpace(_config?.LocalHost) ? _config.LocalHost : clientIp;

        // On Umbraco Cloud, the website is hosted behind Cloudflare, so we need to get the client IP from the headers
        // If the website is hosted behind a proxy to retreive clients IP you can use this cuts

        string? headerKey = _config!.IsCloudflare ? "CF-Connecting-IP" : _config?.CustomHeader;
        if (!string.IsNullOrWhiteSpace(headerKey) && context.Request.Headers.ContainsKey(headerKey))
        {
            clientIp = context.Request.Headers[headerKey].ToString();
        }

        return clientIp;
    }

    public bool Delete(int id)
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
        using var scope = _scopeProvider.CreateScope();

        var sql = scope.SqlContext.Sql().Select("*").From<IPAccessEntry>().Where<IPAccessEntry>(x => !x.IsDeleted);

        return scope.Database.Fetch<IPAccessEntry>(sql);
    }

    public IEnumerable<string> GetAllIpAddresses()
    {
        var result = globalCache.Get("GetAllIpAddresses", () =>
        {
            using var scope = _scopeProvider.CreateScope(autoComplete: true);

            var sql = scope.SqlContext.Sql().Select<IPAccessEntry>(x => x.Ip).From<IPAccessEntry>().Where<IPAccessEntry>(x => !x.IsDeleted);

            var result = scope.Database.Fetch<IPAccessEntry>(sql);

            var ipsFromDatabase = from r in result where !string.IsNullOrWhiteSpace(r.Ip) select r.Ip;

            var ipsFromTxtFile = GetIpAddressesFromTxtFile(_env.ContentRootPath);
           
            if (ipsFromDatabase.Any())
            {
                return ipsFromDatabase.Concat(ipsFromTxtFile);
            }
            
            return ipsFromDatabase;

        }) as IEnumerable<string>;

        return result ?? Enumerable.Empty<string>();
    }

    public IPAccessEntry GetbyId(int id)
    {
        using var scope = _scopeProvider.CreateScope(autoComplete: true);

        var sql = scope.SqlContext.Sql().Select("*").From(Constants.DatabaseSchema.Tables.IpAccessEntries).Where<IPAccessEntry>(x => x.Id == id);

        return scope.Database.SingleOrDefault<IPAccessEntry>(sql);
    }

    public bool Save(IPAccessEntry entry)
    {
        if (entry == null)
        {
            throw new ArgumentNullException(nameof(entry));
        }

        entry.ModifiedBy = CurrentUser;
        entry.Modified = DateTime.Now;

        using var scope = _scopeProvider.CreateScope(autoComplete: true);

        if (entry.Id == default)
        {
            entry.CreatedBy = entry.ModifiedBy;
            entry.Created = entry.Modified;


            scope.Database.Insert(entry);
        }
        else
        {
            scope.Database.Update(entry, x => new { x.Id, x.Ip, x.Description, x.Modified, x.ModifiedBy, x.IsDeleted });
        }

        globalCache.ClearByKey("GetAllIpAddresses");

        return true;
    }

    public string GetHeaderInfo()
    {
        if (_config!.IsCloudflare && !string.IsNullOrWhiteSpace(_config.CustomHeader))
            return "Attention: Please choose Cloudflare or a custom header";
        else if (_config.IsCloudflare)
            return "Attention: Cloudflare configuration is active";
        else if (!string.IsNullOrWhiteSpace(_config?.CustomHeader))
            return $"Attention: Using custom header {_config?.CustomHeader}";
        else
            return "";
    }

    private static IEnumerable<string> GetIpAddressesFromTxtFile(string path)
    {
        if (ipsFromFile != null)
        {
            return ipsFromFile;
        }

        var processedLines = new List<string>();
        try
        {
            using StreamReader reader = new(Path.Combine(path, "WhitelistedIps.txt"));
            while (!reader.EndOfStream)
            {
                var line = reader.ReadLine()?.Split(new[] { "#", "," }, StringSplitOptions.RemoveEmptyEntries);

                if (line != null && line.Length > 0)
                {
                    processedLines.Add(line[0].Trim());
                }
            }
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "WhitelistedIps.txt file cannot be found");
        }

        ipsFromFile = processedLines ?? Enumerable.Empty<string>();

        return ipsFromFile;
    }
    public string CheckIpWhitelistFile()
    {
        if(ipsFromFile == null)
        {
            GetIpAddressesFromTxtFile(_env.ContentRootPath);
        }
        
        if (ipsFromFile.Any())
            return "Attention: Secondary IP whitelist in use";
        else
            return "";
    }

    private string? CurrentUser
    {
        get
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
                throw new InvalidOperationException($"No httpContext available");


            var cookieOptions = _cookieOptionsSnapshot.Get(global::Umbraco.Cms.Core.Constants.Security.BackOfficeAuthenticationType);

            if (cookieOptions == null)
            {
                throw new InvalidOperationException($"No cookie options found with name {(global::Umbraco.Cms.Core.Constants.Security.BackOfficeAuthenticationType)}");
            }

            if (cookieOptions.Cookie.Name is not null && httpContext.Request.Cookies.TryGetValue(cookieOptions.Cookie.Name, out var cookie))
            {
                AuthenticationTicket? unprotected = cookieOptions.TicketDataFormat.Unprotect(cookie);
                ClaimsIdentity? backOfficeIdentity = unprotected?.Principal.GetUmbracoIdentity();

                if (backOfficeIdentity != null && backOfficeIdentity.Name.HasValue())
                {
                    return backOfficeIdentity?.Name;
                }
            }

            throw new InvalidOperationException($"No backoffice user available");
        }
    }
}
