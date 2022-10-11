namespace TFE.Umbraco.AccessRestriction
{
    public static class TFEConstants
    {
        public const string Prefix = "tfe";

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
