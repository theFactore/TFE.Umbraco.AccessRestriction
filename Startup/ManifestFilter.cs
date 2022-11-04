using System.Collections.Generic;
using Umbraco.Cms.Core.Manifest;
using TFE.Umbraco.AccessRestriction.Extensions;

namespace TFE.Umbraco.AccessRestriction.Startup
{
    public class ManifestFilter : IManifestFilter
    {
        void IManifestFilter.Filter(List<PackageManifest> manifests)
        {        
            var manifest = new PackageManifest()
            {
                PackageName = TFEConstants.PackageName.ToKebabCase(),
                BundleOptions = BundleOptions.Independent,
                Scripts = new[]
                {
                   $"/App_Plugins/{TFEConstants.PackageName}/Scripts/Controllers/Dashboards/default.js",
                   $"/App_Plugins/{TFEConstants.PackageName}/Scripts/ipValidator.js",                   
                }
            };

            manifests.Add(manifest);
        }

    }
}