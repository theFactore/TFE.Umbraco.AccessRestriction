using FluentAssertions;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Net;
using TFE.Umbraco.AccessRestriction.Repositories;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Extensions;

namespace TFE.Umbraco.AccessRestriction.Tests
{
	public class IPAccessRepositoryTest
	{
		private readonly Mock<IScopeProvider> _scopeProvider;
		private readonly Mock<IHttpContextAccessor> _httpContextAccessor;
		private readonly Mock<IWebHostEnvironment> _webHostEnvironment;
		private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;
		private readonly Mock<ILogger<IPAccessRestrictionRepository>> _logger;

		public IPAccessRepositoryTest()
		{
			_scopeProvider = new Mock<IScopeProvider>();
			_httpContextAccessor = new Mock<IHttpContextAccessor>();
			_webHostEnvironment = new Mock<IWebHostEnvironment>();
			_backOfficeSecurityAccessor = new Mock<IBackOfficeSecurityAccessor>().Object;
			_logger = new Mock<ILogger<IPAccessRestrictionRepository>>();
		}

		//------------------------------------- test GetHeaderInfo() -------------------------------------//

		[Fact]
		public void GetHeaderInfo_WhenTrueReturnsCloudflareResponse()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {				
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "true"},
				{"TFE.Umbraco.AccessRestriction:customHeader", ""},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();

			var sut = new IPAccessRestrictionRepository(
				_scopeProvider.Object,
				_httpContextAccessor.Object,
				AppCaches.NoCache,
				config,
				_webHostEnvironment.Object,
				_backOfficeSecurityAccessor,
				_logger.Object);

			// Act
			var test = sut.GetHeaderInfo();

			// Assert
			test.Should().Be("Attention: Cloudflare configuration is active");
		}

		[Fact]
		public void GetHeaderInfo_WhenTrueReturnsCustomHeaderResponse()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "false"},
				{"TFE.Umbraco.AccessRestriction:customHeader", "CustomHeaderName"},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetHeaderInfo();

			// Assert
			test.Should().Be("Attention: Using custom header CustomHeaderName");
		}

		[Fact]
		public void GetHeaderInfo_WhenCloudflareHeaderAndCustomHeaderAreSetReturnsResponse()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "true"},
				{"TFE.Umbraco.AccessRestriction:customHeader", "CustomHeaderName"},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetHeaderInfo();

			// Assert
			test.Should().Be("Attention: Please choose Cloudflare or a custom header");
		}

		[Fact]
		public void GetHeaderInfo_ReturnsEmptyStringWhenNoHeadersAreSet()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "false"},
				{"TFE.Umbraco.AccessRestriction:customHeader", ""},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetHeaderInfo();

			// Assert
			test.Should().Be("");
		}

		//------------------------------------- test GetClientIP() -------------------------------------//
		[Fact]
		public void GetClientIP_ReturnsRemoteIpAdressWhenCloudflareFalseAndCustomHeaderSet()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:Disable", "true"},
				{"TFE.Umbraco.AccessRestriction:LogBlockedIP", "true"},
				{"TFE.Umbraco.AccessRestriction:ExcludePaths", "/umbraco"},
				{"TFE.Umbraco.AccessRestriction:LocalHost", "Localhost"},
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "false"},
				{"TFE.Umbraco.AccessRestriction:customHeader", ""},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();
		
			var httpContext = new DefaultHttpContext()
			{
				Connection =
				{
					RemoteIpAddress = IPAddress.Parse("192.168.1.1")
				}
			};

            httpContext.Request.Headers.Append("MyCustomHeader", "192.168.1.2");
			httpContext.Request.Headers.Append("CF-Connecting-IP", "192.168.1.3");

			_httpContextAccessor.Setup(a => a.HttpContext).Returns(httpContext);

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetClientIP();

			// Assert		
			test.Should().Be("192.168.1.1");
		}


		[Fact]
		public void GetClientIP_ReturnsCloudflareIPWhenCustomHeaderAndCloudflareArebothSet()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:Disable", "true"},
				{"TFE.Umbraco.AccessRestriction:LogBlockedIP", "true"},
				{"TFE.Umbraco.AccessRestriction:ExcludePaths", "/umbraco"},
				{"TFE.Umbraco.AccessRestriction:LocalHost", "Localhost"},
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "true"},
				{"TFE.Umbraco.AccessRestriction:customHeader", "MyCustomHeader"},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();
			var httpContext = new DefaultHttpContext();

			httpContext.Request.Headers.Append("MyCustomHeader", "192.168.1.1");
			httpContext.Request.Headers.Append("CF-Connecting-IP", "192.168.1.2");

			_httpContextAccessor.Setup(a => a.HttpContext).Returns(httpContext);

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetClientIP();

			// Assert		
			test.Should().Be("192.168.1.2");
		}

		[Fact]
		public void GetClientIP_ReturnsCorrectIPCustomHeader()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:Disable", "true"},
				{"TFE.Umbraco.AccessRestriction:LogBlockedIP", "true"},
				{"TFE.Umbraco.AccessRestriction:ExcludePaths", "/umbraco"},
				{"TFE.Umbraco.AccessRestriction:LocalHost", "Localhost"},
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "false"},
				{"TFE.Umbraco.AccessRestriction:customHeader", "MyCustomHeader"},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();
			var httpContext = new DefaultHttpContext();

			httpContext.Request.Headers.Append("MyCustomHeader", "192.168.1.1");

			_httpContextAccessor.Setup(a => a.HttpContext).Returns(httpContext);

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetClientIP();

			// Assert		
			test.Should().Be("192.168.1.1");
		}

		[Fact]
		public void GetClientIP_ReturnsCorrectIPBehindCloudflare()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:Disable", "true"},
				{"TFE.Umbraco.AccessRestriction:LogBlockedIP", "true"},
				{"TFE.Umbraco.AccessRestriction:ExcludePaths", "/umbraco"},
				{"TFE.Umbraco.AccessRestriction:LocalHost", "Localhost"},
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "true"},
				{"TFE.Umbraco.AccessRestriction:customHeader", ""},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();
			var httpContext = new DefaultHttpContext();

			httpContext.Request.Headers.Append("CF-Connecting-IP", "192.168.1.1");

			_httpContextAccessor.Setup(a => a.HttpContext).Returns(httpContext);

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetClientIP();

			// Assert		
			test.Should().Be("192.168.1.1");
					}

		[Fact]
		public void GetClientIP_ReturnsCorrectIP()
		{
			// Arrange
			var appSettingsStub = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:Disable", "true"},
				{"TFE.Umbraco.AccessRestriction:LogBlockedIP", "true"},
				{"TFE.Umbraco.AccessRestriction:ExcludePaths", "/umbraco"},
				{"TFE.Umbraco.AccessRestriction:LocalHost", "Localhost"},
				{"TFE.Umbraco.AccessRestriction:isCloudflare", "false"},
				{"TFE.Umbraco.AccessRestriction:customHeader", "/"},
			};
			var config = new ConfigurationBuilder().AddInMemoryCollection(appSettingsStub).Build();
			var httpContext = new DefaultHttpContext()
			{
				Connection =
				{
					RemoteIpAddress = IPAddress.Parse("192.168.1.1")
				}
			};

			_httpContextAccessor.Setup(a => a.HttpContext).Returns(httpContext);

            var sut = new IPAccessRestrictionRepository(
                _scopeProvider.Object,
                _httpContextAccessor.Object,
                AppCaches.NoCache,
                config,
                _webHostEnvironment.Object,
                _backOfficeSecurityAccessor,
                _logger.Object);

            // Act
            var test = sut.GetClientIP();

			// Assert		
			test.Should().Be("192.168.1.1");
		}

		public static Dictionary<string, string?> GetAppsettingsStub(string customHeader = "", string isCloudflare = "true",  string localhost = "Localhost")
		{
			var result = new Dictionary<string, string?> {
				{"TFE.Umbraco.AccessRestriction:Disable", "true"},
				{"TFE.Umbraco.AccessRestriction:LogBlockedIP", "true"},
				{"TFE.Umbraco.AccessRestriction:ExcludePaths", "/umbraco"}
			};

			if(customHeader != null)
			{
				result.Add("TFE.Umbraco.AccessRestriction:customHeader", customHeader);
			}

			if (isCloudflare != null)
			{
				result.Add("TFE.Umbraco.AccessRestriction:isCloudflare", isCloudflare);
			}

			if (localhost != null)
			{
				result.Add("TFE.Umbraco.AccessRestriction:LocalHost", localhost);
			}

			return result;
		}
	}
}