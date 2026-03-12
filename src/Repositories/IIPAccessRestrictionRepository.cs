using TFE.Umbraco.AccessRestriction.Models;

namespace TFE.Umbraco.AccessRestriction.Repositories;

public interface IIPAccessRestrictionRepository
{
	IEnumerable<IPAccessEntry?> GetAll();

	IEnumerable<string> GetWhitelistedIpAddresses();

	IEnumerable<string> GetBlacklistedIpAddresses();

	IPAccessEntry? GetbyId(Guid id);

	bool Save(IPAccessEntry entry);

	bool Delete(Guid id);

	string? GetClientIP();

	string GetHeaderInfo();

	string GetInstallationInfo();
}