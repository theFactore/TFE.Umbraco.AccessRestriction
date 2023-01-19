namespace TFE.Umbraco.AccessRestriction
{
    public static class Constants
    {
        public const string Prefix = "tfe";
        public const string PackageName = "TFE.Umbraco.AccessRestriction";

        public static class DatabaseSchema
        {
            public static class Tables
            {
                public const string IpAccessEntries = Prefix + "IpAccessEntries";
            }
        }

        public static class Migration
        {
            public const string Name = Prefix + "IPAccessRestriction";

            public const string TargetState = Prefix + "IPAccessRestriction_1";
        }
    }
}
