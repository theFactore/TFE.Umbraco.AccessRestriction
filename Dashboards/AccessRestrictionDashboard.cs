using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Dashboards;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core;
using TFE.Umbraco.AccessRestriction.Helpers;

namespace TFE.Umbraco.AccessRestriction.Dashboards
{
    [Weight(100)]
    public class AccessRestrictionDashboard : IDashboard
    {
        private readonly Helper _helper;               

        public string Alias => "TFE.Umbraco.AccessRestriction";

        public string[] Sections => new[]
        {
           Constants.Applications.Content,          
        };

        public string View => $"/App_Plugins/TFE.Umbraco.AccessRestriction/Views/dashboard.html?v={_helper.GetCacheBuster()}";

        public IAccessRule[] AccessRules => Array.Empty<IAccessRule>();

        public AccessRestrictionDashboard(Helper helper)
        {
            _helper = helper; 
        }
    }
}
