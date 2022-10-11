using System.Collections.Generic;
using Umbraco.Cms.Core.Manifest;

namespace TFE.Umbraco.AccessRestriction.Startup
{
    public class ManifestFilter : IManifestFilter
    {
        void IManifestFilter.Filter(List<PackageManifest> manifests)
        {
            var packageName = "TFE.Umbraco.AccessRestriction";
            var manifest = new PackageManifest()
            {
                PackageName = "TFE Access Restriction",
                BundleOptions = BundleOptions.Independent,
                Scripts = new[]
                {
                   $"/App_Plugins/{packageName}/Views/dashboard.controller.js",
                   $"/App_Plugins/{packageName}/Views/ipValidator.js",
                   $"/App_Plugins/{packageName}/Views/dashboard.html",
                   $"/App_Plugins/{packageName}/Views/ipEntryForm.html",
                   $"/App_Plugins/{packageName}/Lang/en-US.xml",
                }
            };

            manifests.Add(manifest);
        }

    }
}