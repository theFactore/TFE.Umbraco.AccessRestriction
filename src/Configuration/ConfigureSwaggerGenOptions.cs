using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;

using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Api.Management.OpenApi;

namespace TFE.Umbraco.AccessRestriction.Configuration;

internal class ConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.SwaggerDoc(
            "IPAccessRestrictionAPI",
            new OpenApiInfo
            {
                Title = "IP Access Restriction API",
                Version = "Latest",
                Description = " IP access restriction manager for Umbraco"
            });
         options.OperationFilter<MyBackOfficeSecurityRequirementsOperationFilter>();
    }
}

public class MyBackOfficeSecurityRequirementsOperationFilter : BackOfficeSecurityRequirementsOperationFilterBase
{
    protected override string ApiName => "IPAccessRestrictionAPI";
}