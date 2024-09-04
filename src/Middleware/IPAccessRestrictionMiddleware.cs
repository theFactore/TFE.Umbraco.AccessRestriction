using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Serilog.Core;
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
    private static readonly string[] separator = [","];
    public static bool IsRegistered { get; private set; } = false;

    public IPAccessRestrictionMiddleware(IRuntimeState runtimeState, RequestDelegate next, IConfiguration config, ILogger<IPAccessRestrictionMiddleware> logger)
    {
        _runtimeState = runtimeState;
        _next = next;
     
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
        IsRegistered = true;
    }

    public async Task InvokeAsync(HttpContext context, ILogger<IPAccessRestrictionMiddleware> logger, IIPAccessRestrictionRepository iPAccessRestrictionRepository)
    {
        if (_config == null)
        {
            await _next(context);
            return;
        }

        // If Umbraco hasn't been installed yet, the middleware shouldn't do anything (interacting with the
        // redirects service will fail as the database isn't setup yet)
        if (_runtimeState.Level < RuntimeLevel.Run ||
            _config.Disable ||
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

        var excludePaths = _config?.ExcludePaths?.Split(separator, StringSplitOptions.RemoveEmptyEntries);
        var includePaths = _config?.IncludePaths?.Split(separator, StringSplitOptions.RemoveEmptyEntries);

        var isIncludePathMatch = includePaths != null && includePaths.Length > 0 && Array.Exists(includePaths, includePath => requestPath.StartsWithSegments(includePath.Trim()));
        var isExcludePathMatch = excludePaths != null && excludePaths.Length > 0 && Array.Exists(excludePaths, excludePath => requestPath.StartsWithSegments(excludePath.Trim()));

        if ((isIncludePathMatch) || (excludePaths == null || !isExcludePathMatch))
        {
            var clientIp = iPAccessRestrictionRepository.GetClientIP();

            if (!string.IsNullOrWhiteSpace(clientIp))
            {
                var ipWhitelist = iPAccessRestrictionRepository.GetAllIpAddresses();

                proceed = Helper.IsWhitelisted(ipWhitelist, clientIp);

                if (_config != null && !proceed && _config.LogBlockedIP)
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