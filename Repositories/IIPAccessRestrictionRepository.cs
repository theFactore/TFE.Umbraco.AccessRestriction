using TFE.Umbraco.AccessRestriction.Models;

namespace TFE.Umbraco.AccessRestriction.Repositories;
public interface IIPAccessRestrictionRepository
{
    IEnumerable<IPAccessEntry> GetAll();

    IEnumerable<string> GetAllIpAddresses();

    IPAccessEntry GetbyId(int id);

    bool Save(IPAccessEntry entry);

    bool Delete(int id);

    string? GetClientIP();

    string GetHeaderInfo();

    string CheckIpWhitelistFile();
}
