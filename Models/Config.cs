namespace TFE.Umbraco.AccessRestriction.Models;

public class Config
{
    public bool Disable { get; set; }

    public bool LogBlockedIP { get; set; }

    public string? ExcludePaths { get; set; }

    public string? LocalHost { get; set; }
}
