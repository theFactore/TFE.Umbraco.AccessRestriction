using Umbraco.Cms.Core.Manifest;
using TFE.Umbraco.AccessRestriction.Extensions;

namespace TFE.Umbraco.AccessRestriction.Startup;
public class ManifestFilter : IManifestFilter
{
    void IManifestFilter.Filter(List<PackageManifest> manifests)
    {        
        var manifest = new PackageManifest()
        {
            PackageName = Constants.PackageName.ToKebabCase(),
            BundleOptions = BundleOptions.Independent,
            Stylesheets = new[]
            {
                 $"/App_Plugins/{Constants.PackageName}/Css/default.css",
            },
            Scripts = new[]
            {
               $"/App_Plugins/{Constants.PackageName}/Scripts/Controllers/Dashboards/default.js",
               $"/App_Plugins/{Constants.PackageName}/Scripts/ipValidator.js",
            }
        };

        manifests.Add(manifest);
    }
}