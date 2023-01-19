using System.Diagnostics;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace TFE.Umbraco.AccessRestriction.Helpers;
public class Helper
{
    private readonly IRuntimeState _runtimeState;

    public Helper(IRuntimeState runtimeState)
    {
        _runtimeState = runtimeState;
    }

    public virtual string GetCacheBuster()
    {
        var version1 = _runtimeState.SemanticVersion.ToSemanticString();           
        var version2 = FileVersionInfo.GetVersionInfo(GetType().Assembly.Location).ProductVersion;
        return $"{version1}.{_runtimeState.Level}.{version2}".GenerateHash();
    }
}