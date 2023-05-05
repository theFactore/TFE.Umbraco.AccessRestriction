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

    public static bool IsWhitelisted(IEnumerable<string>? whitelist, string clientIp)
    {
        if (whitelist is null)
        {
            return false;
        }
        clientIp = clientIp.ToLower();
        foreach (var ip in whitelist)
        {
            if (string.IsNullOrWhiteSpace(ip))
            {
                continue;
            }
            var listIP = ip.ToLower();
            if(listIP.EndsWith('*'))
            {

            listIP = listIP[..^1];
               
                if(string.IsNullOrEmpty(listIP) || clientIp.StartsWith(listIP))
                {
                    return true;
                }
            }
            else if(ip == clientIp)
            {
                return true;
            }
        }
        return false;
    }
}