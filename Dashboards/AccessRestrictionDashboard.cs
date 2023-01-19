using Umbraco.Cms.Core.Dashboards;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core;
using TFE.Umbraco.AccessRestriction.Helpers;

namespace TFE.Umbraco.AccessRestriction.Dashboards;

[Weight(100)]
public class AccessRestrictionDashboard : IDashboard
{
    private readonly Helper _helper;

    public string Alias => Constants.PackageName;

    public string[] Sections => new[]
    {
       global::Umbraco.Cms.Core.Constants.Applications.Content,
    };

    public string View => $"/App_Plugins/{Constants.PackageName}/Views/dashboard.html?v={_helper.GetCacheBuster()}";

    public IAccessRule[] AccessRules => Array.Empty<IAccessRule>();

    public AccessRestrictionDashboard(Helper helper)
    {
        _helper = helper; 
    }
}
