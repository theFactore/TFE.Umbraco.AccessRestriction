using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TFE.Umbraco.AccessRestriction.Middleware;
using TFE.Umbraco.AccessRestriction.Models;
using TFE.Umbraco.AccessRestriction.Repositories;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace TFE.Umbraco.AccessRestriction.Controllers;

[ApiController]
[ApiVersion("1.0")]
[BackOfficeRoute("api/v{version:apiVersion}/[controller]/[action]")]
[Authorize(Policy = AuthorizationPolicies.RequireAdminAccess)]
[MapToApi("IPAccessRestrictionAPI")]
public class IPAccessRestrictionApiController : ControllerBase
{
    private readonly IIPAccessRestrictionRepository _iPAccessRestrictionRepository;

    public IPAccessRestrictionApiController(IIPAccessRestrictionRepository iPAccessRestrictionRepository)
    {
        _iPAccessRestrictionRepository = iPAccessRestrictionRepository;
    }

    [HttpGet]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public IActionResult GetClientIP()
    {
        var ip = _iPAccessRestrictionRepository.GetClientIP();
        return Ok(ip);
    }

    [HttpGet]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(IEnumerable<IPAccessEntry>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        var all = _iPAccessRestrictionRepository.GetAll();
        return Ok(all);
    }

    [HttpGet]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    public IActionResult GetAllIpAddresses()
    {
        var allIpAddresses = _iPAccessRestrictionRepository.GetAllIpAddresses();
        return Ok(allIpAddresses);
    }

    [HttpGet("{id}")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(IPAccessEntry), StatusCodes.Status200OK)]
    public IActionResult GetbyId(Guid id)
    {
        var entry = _iPAccessRestrictionRepository.GetbyId(id);
        return Ok(entry);
    }

    [HttpPost]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(IPAccessEntry), StatusCodes.Status200OK)]
    public IActionResult Save([FromBody] IPAccessEntry model)
    {
        if (ModelState.IsValid)
        {
            var success = _iPAccessRestrictionRepository.Save(model);

            if (success)
            {
                return Ok(model);
            }
        }
        return BadRequest($"Invalid IP address format or the save operation failed. ModelState:${ModelState}");
    }

    [HttpDelete("{id}")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public IActionResult Delete(Guid id)
    {
        var result = _iPAccessRestrictionRepository.Delete(id);
        if (!result)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpGet]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public IActionResult GetHeaderInfo()
    {
        var info = _iPAccessRestrictionRepository.GetHeaderInfo();
        return Ok(info);
    }

    [HttpGet]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public IActionResult CheckIpWhitelistFile()
    {
        var result = _iPAccessRestrictionRepository.CheckIpWhitelistFile();
        return Ok(result);
    }

    [HttpGet]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public IActionResult GetInstallationInfo()
    {
        var result = _iPAccessRestrictionRepository.GetInstallationInfo();
        return Ok(result);
    }
}
