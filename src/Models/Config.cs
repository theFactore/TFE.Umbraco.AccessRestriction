namespace TFE.Umbraco.AccessRestriction.Models;

public class Config
{
    public bool Disable { get; set; }

    public bool LogBlockedIP { get; set; }

    public string[]? ExcludePaths { get; set; }

    public string[]? IncludePaths { get; set; }

    public string? LocalHost { get; set; }

    public bool IsCloudflare { get; set; }

    public string? CustomHeader { get; set; }

    public string[]? Whitelist { get; set; }

    public string[]? Blacklist { get; set; }
    
    public int? HttpStatusCode { get; set; }
    
    public string? HttpResponseMessage { get; set; }
}
