using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using TFE.Umbraco.AccessRestriction.Repositories;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.Services;

namespace TFE.Umbraco.AccessRestriction.Middleware
{
    public class IPAccessRestrictionMiddleware
    {
        private readonly IRuntimeState _runtimeState;
        private readonly RequestDelegate _next;  
        private readonly IConfiguration _config;
     
        public IPAccessRestrictionMiddleware(IRuntimeState runtimeState, RequestDelegate next, IConfiguration config)
        {
            _runtimeState = runtimeState;
            _next = next;      
            _config = config;
        }       

        public async Task InvokeAsync(HttpContext context, ILogger<IPAccessRestrictionMiddleware> logger, IIPAccessRestrictionRepository iPAccessRestrictionRepository)
        {
            // If Umbraco hasn't been installed yet, the middleware shouldn't do anything (interacting with the
            // redirects service will fail as the database isn't setup yet)
            if (_runtimeState.Level == RuntimeLevel.Install)
            {
                await _next(context);
                return;
            }

            var section = _config.GetSection("TFE.Umbraco.AccessRestriction");
            var disable = section.GetValue<bool>("disable");

            if (disable)
            {
                await _next(context);
                return;
            }

            var configExcludePaths = section.GetValue<string>("excludePaths");

            bool proceed = true;

            var path = context.Request.Path;
            var excludePaths = string.IsNullOrEmpty(configExcludePaths) ? null : configExcludePaths.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries);

            if (excludePaths == null || excludePaths != null && !excludePaths.Any(p => path.StartsWithSegments(p.Trim())))
            {
                var configLocalhost = section.GetValue<string>("localhost");

                var clientIp = context.Connection.RemoteIpAddress?.ToString();

                clientIp = (clientIp == "::1" || clientIp == "0.0.0.1") && !string.IsNullOrWhiteSpace(configLocalhost) ? configLocalhost : clientIp;

                // On Umbraco Cloud, the website is hosted behind Cloudflare, so we need to get the client IP from the headers
                if (context.Request.Headers.ContainsKey("CF-Connecting-IP"))
                {
                    clientIp = context.Request.Headers["CF-Connecting-IP"].ToString();
                }

                proceed = !string.IsNullOrWhiteSpace(clientIp);

                if (proceed)
                {
                    var publishedIps = iPAccessRestrictionRepository.GetAllIpAddresses();

                    proceed = publishedIps?.Count() > 0 && publishedIps.Any(p => p == clientIp);
                                    

                    if (!proceed && (section.GetValue<bool>("logBlockedIP")))
                        logger.LogInformation("IP {IP} blocked", clientIp);
                }
            }

            if (!proceed)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("You don't have permission to access / on this server.");
            }
            else if (_next != null)
            {
                await _next(context);
            }
        }
    }
}
