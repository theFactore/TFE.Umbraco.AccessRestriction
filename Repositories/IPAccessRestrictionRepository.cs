using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using StackExchange.Profiling.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using TFE.Umbraco.AccessRestriction.Models;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Extensions;

namespace TFE.Umbraco.AccessRestriction.Repositories
{
    public class IPAccessRestrictionRepository : IIPAccessRestrictionRepository
    {
        private readonly IScopeProvider _scopeProvider;

        private readonly IOptionsSnapshot<CookieAuthenticationOptions> _cookieOptionsSnapshot;

        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly IAppPolicyCache globalCache;

        public IPAccessRestrictionRepository(
            IScopeProvider scopeProvider,
            IOptionsSnapshot<CookieAuthenticationOptions> cookieOptionsSnapshot,
            IHttpContextAccessor httpContextAccessor, AppCaches appCaches)
        {
            _scopeProvider = scopeProvider;
            _cookieOptionsSnapshot = cookieOptionsSnapshot;
            _httpContextAccessor = httpContextAccessor;

            globalCache = appCaches.IsolatedCaches.GetOrCreate(typeof(IPAccessRestrictionRepository));
        }

        public bool Delete(int id)
        {
            var entry = GetbyId(id);

            if (entry == null)
            {
                return true;
            }

            entry.IsDeleted = true;

            return Save(entry);
        }

        public IEnumerable<IPAccessEntry> GetAll()
        {
            using var scope = _scopeProvider.CreateScope();

            var sql = scope.SqlContext.Sql().Select("*").From<IPAccessEntry>().Where<IPAccessEntry>(x => !x.IsDeleted);

            return scope.Database.Fetch<IPAccessEntry>(sql);
        }

        public IEnumerable<string>? GetAllIpAddresses()
        {
            return globalCache.Get("GetAllIpAddresses", () =>
            {
                using var scope = _scopeProvider.CreateScope(autoComplete: true);

                var sql = scope.SqlContext.Sql().Select<IPAccessEntry>(x => x.Ip).From<IPAccessEntry>().Where<IPAccessEntry>(x => !x.IsDeleted);

                var result = scope.Database.Fetch<IPAccessEntry>(sql);

                return from r in result where !string.IsNullOrWhiteSpace(r.Ip) select r.Ip;
            }) as IEnumerable<string>;

        }

        public IPAccessEntry GetbyId(int id)
        {
            using var scope = _scopeProvider.CreateScope(autoComplete: true);

            var sql = scope.SqlContext.Sql().Select("*").From(TFEConstants.DatabaseSchema.Tables.IpAccessEntries).Where<IPAccessEntry>(x => x.Id == id);

            return scope.Database.SingleOrDefault<IPAccessEntry>(sql);
        }

        public bool Save(IPAccessEntry entry)
        {
            if (entry == null)
            {
                throw new ArgumentNullException(nameof(entry));
            }

            entry.ModifiedBy = CurrentUser;
            entry.Modified = DateTime.Now;

            using var scope = _scopeProvider.CreateScope(autoComplete: true);

            if (entry.Id == default)
            {
                entry.CreatedBy = entry.ModifiedBy;
                entry.Created = entry.Modified;


                scope.Database.Insert(entry);
            }
            else
            {
                scope.Database.Update(entry, x => new { x.Id, x.Ip, x.Description, x.Modified, x.ModifiedBy, x.IsDeleted });
            }

            globalCache.ClearByKey("GetAllIpAddresses");

            return true;
        }

        private string? CurrentUser
        {
            get
            {
                var httpContext = _httpContextAccessor.HttpContext;

                if (httpContext == null)
                    throw new InvalidOperationException($"No httpContext available");


                var cookieOptions = _cookieOptionsSnapshot.Get(Constants.Security.BackOfficeAuthenticationType);

                if (cookieOptions == null)
                {
                    throw new InvalidOperationException($"No cookie options found with name {Constants.Security.BackOfficeAuthenticationType}");
                }

                if (cookieOptions.Cookie.Name is not null && httpContext.Request.Cookies.TryGetValue(cookieOptions.Cookie.Name, out var cookie))
                {
                    AuthenticationTicket? unprotected = cookieOptions.TicketDataFormat.Unprotect(cookie);
                    ClaimsIdentity? backOfficeIdentity = unprotected?.Principal.GetUmbracoIdentity();

                    if (backOfficeIdentity != null && backOfficeIdentity.Name.HasValue())
                    {
                        return backOfficeIdentity?.Name;
                    }
                }

                throw new InvalidOperationException($"No backoffice user available");

            }
        }
    }
}
