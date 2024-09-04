using Microsoft.Extensions.DependencyInjection;
using TFE.Umbraco.AccessRestriction.Configuration;
using TFE.Umbraco.AccessRestriction.Install;
using TFE.Umbraco.AccessRestriction.Repositories;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;

namespace TFE.Umbraco.AccessRestriction.Composers;
public class AccessRestrictionComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.AddNotificationHandler<UmbracoApplicationStartingNotification, MigrationRunner>();
        builder.Services.AddScoped<IIPAccessRestrictionRepository, IPAccessRestrictionRepository>();
        builder.Services.AddSingleton<Helpers.Helper>();
        builder.Services.ConfigureOptions<ConfigureSwaggerGenOptions>();
    }
}