using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace TFE.Umbraco.AccessRestriction.Helpers
{
    public class Helper
    {
        public IRuntimeState RuntimeState { get; }

        public Helper(IRuntimeState runtimeState)
        {
            RuntimeState = runtimeState;
        }

        public virtual string GetCacheBuster()
        {
            string version1 = RuntimeState.SemanticVersion.ToSemanticString();
            string version2 = FileVersionInfo.GetVersionInfo(GetType().Assembly.Location).ProductVersion;
            return $"{version1}.{RuntimeState.Level}.{version2}".GenerateHash();
        }
    }
}
