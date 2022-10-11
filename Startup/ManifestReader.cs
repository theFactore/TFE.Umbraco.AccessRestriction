using System.IO;
using System.Reflection;

namespace TFE.Umbraco.AccessRestriction.Startup
{
    public class ManifestReader
    {
        public static string ReadManifest()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "package.manifest";

            using Stream stream = assembly.GetManifestResourceStream(resourceName);
            using StreamReader reader = new(stream);
            string result = reader.ReadToEnd();

            return result;
        }
    }
}