using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;
using TFE.Umbraco.AccessRestriction.Install;
using TFE.Umbraco.AccessRestriction.Repositories;
using Umbraco.Cms.Core.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using TFE.Umbraco.AccessRestriction.Startup;
using Umbraco.Cms.Web.Common.ApplicationBuilder;

namespace TFE.Umbraco.AccessRestriction.Composers
{
    public class AccessRestrictionComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.AddNotificationHandler<UmbracoApplicationStartingNotification, MigrationRunner>();
            builder.Services.AddScoped<IIPAccessRestrictionRepository, IPAccessRestrictionRepository>();
            builder.Services.AddSingleton<Helpers.Helper>();
            builder.ManifestFilters().Append<ManifestFilter>();
        }
    }
}