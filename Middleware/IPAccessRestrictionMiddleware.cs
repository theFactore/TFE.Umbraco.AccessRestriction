using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TFE.Umbraco.AccessRestriction.Helpers;
using TFE.Umbraco.AccessRestriction.Models;
using TFE.Umbraco.AccessRestriction.Repositories;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Services;

namespace TFE.Umbraco.AccessRestriction.Middleware;
public class IPAccessRestrictionMiddleware
{
	private readonly IRuntimeState _runtimeState;
	private readonly RequestDelegate _next;
	private readonly Config? _config;

	public IPAccessRestrictionMiddleware(IRuntimeState runtimeState, RequestDelegate next, IConfiguration config)
	{
		_runtimeState = runtimeState;
		_next = next;
		_config = config.GetSection("TFE.Umbraco.AccessRestriction").Get<Config>();
	}

	public async Task InvokeAsync(HttpContext context, ILogger<IPAccessRestrictionMiddleware> logger, IIPAccessRestrictionRepository iPAccessRestrictionRepository)
	{
		// If Umbraco hasn't been installed yet, the middleware shouldn't do anything (interacting with the
		// redirects service will fail as the database isn't setup yet)
		if (_runtimeState.Level < RuntimeLevel.Run ||
			_config!.Disable ||
			CheckClientIP(context, logger, iPAccessRestrictionRepository))
		{
			await _next(context);
			return;
		}
		context.Response.StatusCode = 403;
		await context.Response.WriteAsync("You don't have permission to access / on this server.");
	}

	private bool CheckClientIP(HttpContext context, ILogger<IPAccessRestrictionMiddleware> logger, IIPAccessRestrictionRepository iPAccessRestrictionRepository)
	{
		var proceed = true;

		var requestPath = context.Request.Path;

		var excludePaths = _config?.ExcludePaths?.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries);

		if (excludePaths == null || !excludePaths.Any(exludePath => requestPath.StartsWithSegments(exludePath.Trim())))
		{
			var clientIp = iPAccessRestrictionRepository.GetClientIP();

			if (!string.IsNullOrWhiteSpace(clientIp))
			{
				var ipWhitelist = iPAccessRestrictionRepository.GetAllIpAddresses();

				proceed = Helper.IsWhitelisted(ipWhitelist, clientIp);

				if (!proceed && _config!.LogBlockedIP)
					logger.LogInformation("IP {IP} blocked", clientIp);
			}
			else
			{
				proceed = false;
			}
		}

		return proceed;
	}
}