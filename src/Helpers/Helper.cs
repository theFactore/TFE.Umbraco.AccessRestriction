using Umbraco.Cms.Core.Services;

namespace TFE.Umbraco.AccessRestriction.Helpers;
public class Helper
{
    public readonly IRuntimeState _runtimeState;

    public Helper(IRuntimeState runtimeState)
    {
        _runtimeState = runtimeState;
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