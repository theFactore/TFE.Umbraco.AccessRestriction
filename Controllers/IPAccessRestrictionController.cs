using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TFE.Umbraco.AccessRestriction.Models;
using TFE.Umbraco.AccessRestriction.Repositories;
using Umbraco.Cms.Web.BackOffice.Controllers;
using Umbraco.Cms.Web.Common.Attributes;
using Umbraco.Cms.Web.Common.Controllers;
namespace TFE.Umbraco.AccessRestriction.Controllers
{
    [PluginController("TFE")]
    public class IPAccessRestrictionController : UmbracoAuthorizedJsonController/*UmbracoAuthorizedApiController*/
    {
        private readonly IIPAccessRestrictionRepository _iPAccessRestrictionRepository;

        public IPAccessRestrictionController(IIPAccessRestrictionRepository iPAccessRestrictionRepository)
        {
            _iPAccessRestrictionRepository = iPAccessRestrictionRepository;
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            return new JsonResult(_iPAccessRestrictionRepository.GetAll());
        }

        [HttpGet]
        public ActionResult GetAllIpAddresses()
        {
            return new JsonResult(_iPAccessRestrictionRepository.GetAllIpAddresses());
        }

        [HttpGet]
        public ActionResult GetbyId(int id)
        {
            return new JsonResult(_iPAccessRestrictionRepository.GetbyId(id));
        }

        [HttpPost]
        public ActionResult Save(IPAccessEntry model)
        {
            if (ModelState.IsValid)
            {
                return new JsonResult(_iPAccessRestrictionRepository.Save(model));
            }
            else
            {
                return new JsonResult(nameof(model));
            }
        }

        [HttpGet]
        public ActionResult Delete(int id)
        {
            return new JsonResult(_iPAccessRestrictionRepository.Delete(id));
        }
    }
}