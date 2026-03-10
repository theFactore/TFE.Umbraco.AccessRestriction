namespace TFE.Umbraco.AccessRestriction.Models
{
	public class WhitelistedIp
	{
		public required string Ip { get; set; }

		public string? Description { get; set; }
	}
}