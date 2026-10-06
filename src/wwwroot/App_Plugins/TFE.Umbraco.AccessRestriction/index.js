import { LitElement as e, css as t, customElement as n, html as r, property as i, state as a, unsafeHTML as o } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as s } from "@umbraco-cms/backoffice/element-api";
import { UmbControllerBase as c } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as l } from "@umbraco-cms/backoffice/context-api";
import { tryExecuteAndNotify as u } from "@umbraco-cms/backoffice/resources";
import { UmbArrayState as d, UmbBooleanState as ee, UmbStringState as f } from "@umbraco-cms/backoffice/observable-api";
import { UMB_MODAL_MANAGER_CONTEXT as te, UmbModalToken as ne } from "@umbraco-cms/backoffice/modal";
import { firstValueFrom as re, of as ie } from "@umbraco-cms/backoffice/external/rxjs";
import { UMB_AUTH_CONTEXT as ae } from "@umbraco-cms/backoffice/auth";
//#region \0rolldown/runtime.js
var p = Object.defineProperty, m = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, h = (e, t) => {
	let n = {};
	for (var r in e) p(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || p(n, Symbol.toStringTag, { value: "Module" }), n;
}, g, _ = m((() => {
	g = class extends Error {
		constructor(e, t, n) {
			/* istanbul ignore file */
			super(n), this.name = "ApiError", this.url = t.url, this.status = t.status, this.statusText = t.statusText, this.body = t.body, this.request = e;
		}
	};
})), v, y, b = m((() => {
	/* istanbul ignore file */
	v = class extends Error {
		constructor(e) {
			super(e), this.name = "CancelError";
		}
		get isCancelled() {
			return !0;
		}
	}, y = class {
		#e;
		#t;
		#n;
		#r;
		#i;
		#a;
		#o;
		constructor(e) {
			this.#e = !1, this.#t = !1, this.#n = !1, this.#r = [], this.#i = new Promise((t, n) => {
				this.#a = t, this.#o = n;
				let r = (e) => {
					this.#e || this.#t || this.#n || (this.#e = !0, this.#a && this.#a(e));
				}, i = (e) => {
					this.#e || this.#t || this.#n || (this.#t = !0, this.#o && this.#o(e));
				}, a = (e) => {
					this.#e || this.#t || this.#n || this.#r.push(e);
				};
				return Object.defineProperty(a, "isResolved", { get: () => this.#e }), Object.defineProperty(a, "isRejected", { get: () => this.#t }), Object.defineProperty(a, "isCancelled", { get: () => this.#n }), e(r, i, a);
			});
		}
		get [Symbol.toStringTag]() {
			return "Cancellable Promise";
		}
		then(e, t) {
			return this.#i.then(e, t);
		}
		catch(e) {
			return this.#i.catch(e);
		}
		finally(e) {
			return this.#i.finally(e);
		}
		cancel() {
			if (!(this.#e || this.#t || this.#n)) {
				if (this.#n = !0, this.#r.length) try {
					for (let e of this.#r) e();
				} catch (e) {
					console.warn("Cancellation threw an error", e);
					return;
				}
				this.#r.length = 0, this.#o && this.#o(new v("Request aborted"));
			}
		}
		get isCancelled() {
			return this.#n;
		}
	};
})), x, S = m((() => {
	x = {
		BASE: "",
		VERSION: "Latest",
		WITH_CREDENTIALS: !1,
		CREDENTIALS: "include",
		TOKEN: void 0,
		USERNAME: void 0,
		PASSWORD: void 0,
		HEADERS: void 0,
		ENCODE_PATH: void 0
	};
})), C, w, T, E, D, O, k, A, j, M, N, P, F, I, L, R, z, oe = m((() => {
	/* istanbul ignore file */
	/* istanbul ignore file */
	_(), b(), C = (e) => e != null, w = (e) => typeof e == "string", T = (e) => w(e) && e !== "", E = (e) => typeof e == "object" && typeof e.type == "string" && typeof e.stream == "function" && typeof e.arrayBuffer == "function" && typeof e.constructor == "function" && typeof e.constructor.name == "string" && /^(Blob|File)$/.test(e.constructor.name) && /^(Blob|File)$/.test(e[Symbol.toStringTag]), D = (e) => e instanceof FormData, O = (e) => {
		try {
			return btoa(e);
		} catch {
			return Buffer.from(e).toString("base64");
		}
	}, k = (e) => {
		let t = [], n = (e, n) => {
			t.push(`${encodeURIComponent(e)}=${encodeURIComponent(String(n))}`);
		}, r = (e, t) => {
			C(t) && (Array.isArray(t) ? t.forEach((t) => {
				r(e, t);
			}) : typeof t == "object" ? Object.entries(t).forEach(([t, n]) => {
				r(`${e}[${t}]`, n);
			}) : n(e, t));
		};
		return Object.entries(e).forEach(([e, t]) => {
			r(e, t);
		}), t.length > 0 ? `?${t.join("&")}` : "";
	}, A = (e, t) => {
		let n = e.ENCODE_PATH || encodeURI, r = t.url.replace("{api-version}", e.VERSION).replace(/{(.*?)}/g, (e, r) => t.path?.hasOwnProperty(r) ? n(String(t.path[r])) : e), i = `${e.BASE}${r}`;
		return t.query ? `${i}${k(t.query)}` : i;
	}, j = (e) => {
		if (e.formData) {
			let t = new FormData(), n = (e, n) => {
				w(n) || E(n) ? t.append(e, n) : t.append(e, JSON.stringify(n));
			};
			return Object.entries(e.formData).filter(([e, t]) => C(t)).forEach(([e, t]) => {
				Array.isArray(t) ? t.forEach((t) => n(e, t)) : n(e, t);
			}), t;
		}
	}, M = async (e, t) => typeof t == "function" ? t(e) : t, N = async (e, t) => {
		let [n, r, i, a] = await Promise.all([
			M(t, e.TOKEN),
			M(t, e.USERNAME),
			M(t, e.PASSWORD),
			M(t, e.HEADERS)
		]), o = Object.entries({
			Accept: "application/json",
			...a,
			...t.headers
		}).filter(([e, t]) => C(t)).reduce((e, [t, n]) => ({
			...e,
			[t]: String(n)
		}), {});
		return T(n) && (o.Authorization = `Bearer ${n}`), T(r) && T(i) && (o.Authorization = `Basic ${O(`${r}:${i}`)}`), t.body !== void 0 && (t.mediaType ? o["Content-Type"] = t.mediaType : E(t.body) ? o["Content-Type"] = t.body.type || "application/octet-stream" : w(t.body) ? o["Content-Type"] = "text/plain" : D(t.body) || (o["Content-Type"] = "application/json")), new Headers(o);
	}, P = (e) => {
		if (e.body !== void 0) return e.mediaType?.includes("/json") ? JSON.stringify(e.body) : w(e.body) || E(e.body) || D(e.body) ? e.body : JSON.stringify(e.body);
	}, F = async (e, t, n, r, i, a, o) => {
		let s = new AbortController(), c = {
			headers: a,
			body: r ?? i,
			method: t.method,
			signal: s.signal
		};
		return e.WITH_CREDENTIALS && (c.credentials = e.CREDENTIALS), o(() => s.abort()), await fetch(n, c);
	}, I = (e, t) => {
		if (t) {
			let n = e.headers.get(t);
			if (w(n)) return n;
		}
	}, L = async (e) => {
		if (e.status !== 204) try {
			let t = e.headers.get("Content-Type");
			if (t) return ["application/json", "application/problem+json"].some((e) => t.toLowerCase().startsWith(e)) ? await e.json() : await e.text();
		} catch (e) {
			console.error(e);
		}
	}, R = (e, t) => {
		let n = {
			400: "Bad Request",
			401: "Unauthorized",
			403: "Forbidden",
			404: "Not Found",
			500: "Internal Server Error",
			502: "Bad Gateway",
			503: "Service Unavailable",
			...e.errors
		}[t.status];
		if (n) throw new g(e, t, n);
		if (!t.ok) {
			let n = t.status ?? "unknown", r = t.statusText ?? "unknown", i = (() => {
				try {
					return JSON.stringify(t.body, null, 2);
				} catch {
					return;
				}
			})();
			throw new g(e, t, `Generic Error: status: ${n}; status text: ${r}; body: ${i}`);
		}
	}, z = (e, t) => new y(async (n, r, i) => {
		try {
			let r = A(e, t), a = j(t), o = P(t), s = await N(e, t);
			if (!i.isCancelled) {
				let c = await F(e, t, r, o, a, s, i), l = await L(c), u = I(c, t.responseHeader), d = {
					url: r,
					ok: c.ok,
					status: c.status,
					statusText: c.statusText,
					body: u ?? l
				};
				R(t, d), n(d.body);
			}
		} catch (e) {
			r(e);
		}
	});
})), B, se = m((() => {
	S(), oe(), B = class {
		static deleteUmbracoApiV1IpAccessRestrictionApiDelete(e) {
			/* istanbul ignore file */
			return z(x, {
				method: "DELETE",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/Delete/{id}",
				path: { id: e },
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
		static getUmbracoApiV1IpAccessRestrictionApiGetAll() {
			return z(x, {
				method: "GET",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/GetAll",
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
		static getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses() {
			return z(x, {
				method: "GET",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/GetAllIpAddresses",
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
		static getUmbracoApiV1IpAccessRestrictionApiGetbyId(e) {
			return z(x, {
				method: "GET",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/GetbyId/{id}",
				path: { id: e },
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
		static getUmbracoApiV1IpAccessRestrictionApiGetClientIp() {
			return z(x, {
				method: "GET",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/GetClientIP",
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
		static getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo() {
			return z(x, {
				method: "GET",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/GetHeaderInfo",
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
		static getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo() {
			return z(x, {
				method: "GET",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/GetInstallationInfo",
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
		static postUmbracoApiV1IpAccessRestrictionApiSave(e) {
			return z(x, {
				method: "POST",
				url: "/umbraco/api/v1/IPAccessRestrictionApi/Save",
				body: e,
				mediaType: "application/json",
				errors: { 401: "The resource is protected and requires an authentication token" }
			});
		}
	};
})), V = m((() => {
	_(), b(), S(), se();
})), H, ce = m((() => {
	/* istanbul ignore file */
	V(), H = class {
		#e;
		constructor(e) {
			this.#e = e;
		}
		async delete(e) {
			let t = B.deleteUmbracoApiV1IpAccessRestrictionApiDelete(e).then(() => !0).catch(() => !1);
			return await u(this.#e, t);
		}
		async getAll() {
			return await u(this.#e, B.getUmbracoApiV1IpAccessRestrictionApiGetAll());
		}
		async getAllIpAddresses() {
			return await u(this.#e, B.getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses());
		}
		async getbyId(e) {
			return await u(this.#e, B.getUmbracoApiV1IpAccessRestrictionApiGetbyId(e));
		}
		async getClientIp() {
			return await u(this.#e, B.getUmbracoApiV1IpAccessRestrictionApiGetClientIp());
		}
		async getHeaderInfo() {
			return await u(this.#e, B.getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo());
		}
		async saveIpAccessEntry(e) {
			return console.log("DataSource: Saving IP Access Entry:", e), await u(this.#e, B.postUmbracoApiV1IpAccessRestrictionApiSave(e));
		}
		async GetInstallationInfo() {
			return await u(this.#e, B.getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo());
		}
	};
})), U, le = m((() => {
	ce(), U = class extends c {
		#e;
		constructor(e) {
			super(e), this.#e = new H(this);
		}
		async deleteIpAccessEntry(e) {
			return this.#e.delete(e);
		}
		async getAllIpAccessEntries() {
			return this.#e.getAll();
		}
		async getAllIpAddresses() {
			return this.#e.getAllIpAddresses();
		}
		async getIpAccessEntryById(e) {
			return this.#e.getbyId(e);
		}
		async getClientIp() {
			return this.#e.getClientIp();
		}
		async getHeaderInfo() {
			return this.#e.getHeaderInfo();
		}
		async saveIpAccessEntry(e) {
			return this.#e.saveIpAccessEntry(e);
		}
		async GetInstallationInfo() {
			return this.#e.GetInstallationInfo();
		}
	};
})), ue = /* @__PURE__ */ h({
	IPAccessRestrictionContext: () => W,
	IP_ACCESS_RESTRICTION_CONTEXT_TOKEN: () => G,
	default: () => W
}), W, G, K = m((() => {
	le(), W = class extends c {
		#e;
		#t;
		#n;
		#r;
		#i;
		#a;
		constructor(e) {
			super(e), this.#e = new d([], (e) => e.id), this.ipEntries = this.#e.asObservable(), this.#t = new d([], (e) => e), this.ips = this.#t.asObservable(), this.#n = new f(""), this.clientIp = this.#n.asObservable(), this.#r = new f(""), this.headerInfo = this.#r.asObservable(), this.#i = new ee(!1), this.isIpInList = this.#i.asObservable(), this.#a = new f(""), this.installationInfo = this.#a.asObservable(), this.provideContext(G, this), this.repository = new U(this), this.checkIpInList();
		}
		_handleResultError(e) {
			if (!e && e !== "") throw Error("Received undefined data");
			if (e.error) throw Error(e.error.message);
			return e;
		}
		async checkIpInList() {
			await this.getAllIpAddresses(), await this.getClientIp();
			let e = this.#t.getValue(), t = this.#n.getValue();
			e && t ? this.#i.setValue(e.includes(t)) : (console.error("Your IP address is not on the list"), this.#i.setValue(!1));
		}
		async deleteIpAccessEntry(e) {
			try {
				let t = await this.repository.deleteIpAccessEntry(e);
				this._handleResultError(t), await this.getAllIpAccessEntries(), await this.checkIpInList();
			} catch (e) {
				console.error("Error in deleteIpAccessEntry:", e);
			}
		}
		async getAllIpAccessEntries() {
			try {
				let e = await this.repository.getAllIpAccessEntries(), t = this._handleResultError(e);
				this.#e.setValue(t);
			} catch (e) {
				console.error("Error in getAllIpAccessEntries:", e);
			}
		}
		async getAllIpAddresses() {
			try {
				let e = await this.repository.getAllIpAddresses(), t = this._handleResultError(e);
				this.#t.setValue(t);
			} catch (e) {
				console.error("Error in getAllIpAddresses:", e);
			}
		}
		async getIpAccessEntryById(e) {
			try {
				let t = await this.repository.getIpAccessEntryById(e);
				return this._handleResultError(t);
			} catch (e) {
				console.error("Error in getIpAccessEntryById", e);
				return;
			}
		}
		async getClientIp() {
			try {
				let e = await this.repository.getClientIp(), t = this._handleResultError(e);
				this.#n.setValue(t);
			} catch (e) {
				console.error("Error in getClientIp", e);
			}
		}
		async getHeaderInfo() {
			try {
				let e = await this.repository.getHeaderInfo(), t = this._handleResultError(e);
				this.#r.setValue(t);
			} catch (e) {
				console.error("Error in getHeaderInfo:", e);
			}
		}
		async saveIpAccessEntry(e) {
			try {
				let t = await this.repository.saveIpAccessEntry(e);
				this._handleResultError(t), await this.getAllIpAccessEntries(), await this.checkIpInList();
			} catch (t) {
				console.error("Error in saveIpAccessEntry:", t), console.error("Entry:", e);
			}
		}
		async getInstallationInfo() {
			try {
				let e = await this.repository.GetInstallationInfo(), t = this._handleResultError(e);
				this.#a.setValue(t);
			} catch (e) {
				console.error("Error in getInstallationInfo:", e);
			}
		}
	}, G = new l(W.name);
})), q, de = m((() => {
	q = new ne("ip-entry-modal", { modal: {
		type: "sidebar",
		size: "small"
	} });
}));
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/decorate.js
function J(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
var Y = m((() => {})), fe = /* @__PURE__ */ h({
	DashboardElement: () => X,
	default: () => Z
}), X, Z, pe = m((() => {
	K(), de(), Y(), X = class extends s(e) {
		constructor() {
			super(), this.isIpInList = !1, this.consumeContext(G, (e) => {
				this.context = e, e && (this.observe(e.ipEntries, (e) => {
					this.ipEntries = e;
				}), this.observe(e.ips, (e) => {
					this.ips = e;
				}), this.observe(e.clientIp, (e) => {
					this.clientIP = e;
				}), this.observe(e.headerInfo, (e) => {
					this.customHeaderInfo = e;
				}), this.observe(e.isIpInList, (e) => {
					this.isIpInList = e;
				}), this.observe(e.installationInfo, (e) => {
					this.installationInfo = e;
				}));
			}), this.consumeContext(te, (e) => {
				this.modalManagerContext = e;
			});
		}
		connectedCallback() {
			super.connectedCallback(), this.context != null && (this.context.getAllIpAccessEntries(), this.context.getHeaderInfo(), this.context.checkIpInList(), this.context.getInstallationInfo());
		}
		_formatDate(e) {
			return e ? new Date(e).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric"
			}) : "";
		}
		_openModal(e) {
			this.modalManagerContext?.open(this, q, { data: { ipEntry: e } });
		}
		async _handleEditClick(e) {
			if (e.id) {
				let t = await this.context?.getIpAccessEntryById(e.id);
				this._openModal(t);
			} else console.error("@handleEditClick IP Address is undefined or null");
		}
		async _handleDeleteClick(e) {
			e.id ? await this.context.deleteIpAccessEntry(e.id) : console.error("IP entry ID is undefined or null");
		}
		render() {
			return r`
      <div class="container">
        <div id="top-bar">
          <uui-button label="Add new IP address" look="primary" @click="${this._openModal}"
            >+ Add new IP address</uui-button
          >

          <div id="installation-alert" ?hidden="${!this.installationInfo}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${o(this.installationInfo)}</span>
          </div>

          <div id="header-alert" ?hidden="${!this.customHeaderInfo}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${this.customHeaderInfo}</span>
          </div>

          <div id="ip-alert" ?hidden="${this.isIpInList}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 10px;"></uui-icon>
            <span>Your IP address is not on the list</span>
            <uui-button
              label="Add current IP address"
              look="primary"
              @click="${() => this._openModal({
				id: "",
				ip: this.clientIP,
				description: "",
				isDeleted: !1,
				isEditable: !0
			})}"
              >+ Add</uui-button
            >
          </div>
        </div>
        <h3>Whitelisted IP Addresses</h3>
        <uui-table aria-label="IP Address Table">
          <uui-table-column style="width: 20%;"></uui-table-column>
          <uui-table-column style="width: 20%;"></uui-table-column>
          <uui-table-column style="width: 20%;"></uui-table-column>
          <uui-table-column style="width: 20%;"></uui-table-column>
          <uui-table-column style="width: 20%;"></uui-table-column>

          <uui-table-head>
            <uui-table-head-cell>IP</uui-table-head-cell>
            <uui-table-head-cell>Description</uui-table-head-cell>
            <uui-table-head-cell>Modified</uui-table-head-cell>
            <uui-table-head-cell>Modified By</uui-table-head-cell>
            <uui-table-head-cell>Actions</uui-table-head-cell>
          </uui-table-head>

          ${this.ipEntries?.map((e) => r`
              <uui-table-row>
                <uui-table-cell>${e.ip}</uui-table-cell>
                <uui-table-cell>${e.description}</uui-table-cell>
                <uui-table-cell>${this._formatDate(e.modified)}</uui-table-cell>
                <uui-table-cell>${e.modifiedBy}</uui-table-cell>
                <uui-table-cell>
                  <uui-button
                    label="Edit button"
                    look="primary"
                    color="default"
                    @click="${() => this._handleEditClick(e)}"
                    ?disabled="${!e.isEditable}"
                    >Edit</uui-button
                  >
                  <uui-button
                    label="Delete button"
                    look="primary"
                    color="danger"
                    @click="${() => this._handleDeleteClick(e)}"
                    ?disabled="${!e.isEditable}"
                    >Delete</uui-button
                  >
                </uui-table-cell>
              </uui-table-row>
            `)}
        </uui-table>
      </div>
    `;
		}
		static {
			this.styles = t`
    .container {
      padding: 30px;
    }
    #top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
		}
	}, J([i({ type: Array })], X.prototype, "ipEntries", void 0), J([i({ type: Array })], X.prototype, "ips", void 0), J([i({ type: String })], X.prototype, "clientIP", void 0), J([i({ type: String })], X.prototype, "customHeaderInfo", void 0), J([i({ type: Boolean })], X.prototype, "isIpInList", void 0), J([i({ type: String })], X.prototype, "installationInfo", void 0), X = J([n("dashboard-element")], X), Z = X;
})), me = [{
	type: "dashboard",
	name: "Access Restriction",
	alias: "TFE.Umbraco.AccessRestriction",
	elementName: "access-restriction",
	js: () => Promise.resolve().then(() => (pe(), fe)),
	weight: -10,
	meta: {
		label: "Access Restriction",
		pathname: "access-restriction"
	},
	conditions: [{
		alias: "Umb.Condition.SectionAlias",
		match: "Umb.Section.Content"
	}]
}], he = /* @__PURE__ */ h({ default: () => $ }), Q, $, ge = m((() => {
	K(), Y(), Q = class extends s(e) {
		#e;
		constructor() {
			super(), this.isValid = !1, this.errors = {}, this.id = "", this.ip = "", this.description = "", this.initialIp = "", this.consumeContext(G, (e) => {
				this.#e = e;
			});
		}
		firstUpdated() {
			if (this.modalContext?.data?.ipEntry) {
				let { id: e, ip: t, description: n } = this.modalContext.data.ipEntry;
				this.id = e ?? "", this.ip = t ?? "", this.description = n ?? "", this.initialIp = t ?? "";
			} else console.error("No IP Entry data found in modal context");
		}
		_handleClose() {
			this.modalContext?.submit();
		}
		async _handleSubmit(e) {
			if (e.preventDefault(), await this._validateForm(), !this.isValid) {
				console.error("Form validation failed:");
				return;
			}
			let t = {
				id: this.id || "00000000-0000-0000-0000-000000000000",
				ip: this.ip,
				description: this.description,
				isDeleted: !1,
				isEditable: !0
			};
			try {
				this.#e ? await this.#e.saveIpAccessEntry(t) : console.error("Access restriction context is not available"), this._handleClose();
			} catch (e) {
				console.error("Failed to save IP access entry:", e);
			}
		}
		_handleInputChange(e) {
			let t = /* @__PURE__ */ function(e) {
				return e.Id = "id", e.Ip = "ip", e.Description = "description", e;
			}({}), n = (e) => Object.values(t).includes(e), r = e.target;
			n(r.name) && (this[r.name] = r.value), this._validateForm();
		}
		_validateIp(e) {
			if (!e) return !1;
			let t = (e.match(/\*/g) || []).length;
			return t > 0 ? !!(t === 1 && e.endsWith("*")) : /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/.test(e);
		}
		async _checkDuplicateIps(e) {
			try {
				let t = this.#e?.ips ?? ie();
				return (await re(t)).includes(e) && this.initialIp !== e;
			} catch (e) {
				return console.error("No duplicates found in ips observable, error:", e), !1;
			}
		}
		async _validateForm() {
			this.errors = {}, this._validateIp(this.ip) ? await this._checkDuplicateIps(this.ip) && (this.errors.ip = "The IP Address is already whitelisted", this.requestUpdate()) : this.errors.ip = "Invalid IP", this.description || (this.errors.description = "A description is required"), this.isValid = Object.keys(this.errors).length === 0;
		}
		render() {
			return r`
      <umb-body-layout headline="IP Access Restriction">
        <uui-box>
          <p>
            A wildcard is only allowed at the end. When using a wildcard, the entry is no longer checked for a valid IP
            address. Example: 127.0.* or 127.0.0*
          </p>

          <uui-form>
            <form id="IpEntryForm" @submit=${this._handleSubmit}>
              <!-- Form input Id -->
              <uui-input type="text" id="id" name="id" label="hidden" .value="${this.id}"></uui-input>

              <!-- Form input IP Address -->
              <uui-form-layout-item>
                <uui-label id="ipLabel" slot="label" for="IpAddress" required>IP</uui-label>
                <span slot="Ip Address"></span>
                <div>
                  <uui-input
                    id="IpAddress"
                    type="text"
                    name="ip"
                    placeholder="192.168.1.1"
                    label="Ip"
                    required
                    .value="${this.ip}"
                    @input="${this._handleInputChange}"
                  >
                  </uui-input>
                  ${this.errors.ip ? r`<div class="error-message">${this.errors.ip}</div>` : ""}
                </div>
              </uui-form-layout-item>

              <!-- Form input description -->
              <uui-form-layout-item>
                <uui-label slot="label" for="Description" ?required=${!0}>Description</uui-label>
                <span slot="description"></span>
                <div>
                  <uui-input
                    id="Description"
                    type="text"
                    name="description"
                    placeholder="John Doe"
                    label="Description"
                    required
                    .value="${this.description}"
                    @input="${this._handleInputChange}"
                  >
                  </uui-input>
                  ${this.errors.description ? r`<div class="error-message">${this.errors.description}</div>` : ""}
                </div>
              </uui-form-layout-item>

              <!-- Save button -->
              <uui-button type="submit" label="save" look="primary" color="positive">Save</uui-button>
            </form>
          </uui-form>
        </uui-box>

        <!-- Close button -->

        <uui-button
          slot="actions"
          id="cancel"
          label="Cancel"
          look="default"
          color="default"
          type="button"
          @click="${this._handleClose}"
          >close</uui-button
        >
      </umb-body-layout>
    `;
		}
		static {
			this.styles = t`
    #id {
      display: none;
    }
    .error-message {
      color: rgb(191, 33, 78);
    }
  `;
		}
	}, J([a()], Q.prototype, "isValid", void 0), J([i({ type: Object })], Q.prototype, "errors", void 0), J([i({ type: String })], Q.prototype, "id", void 0), J([i({ type: String })], Q.prototype, "ip", void 0), J([i({ type: String })], Q.prototype, "description", void 0), J([i({ attribute: !1 })], Q.prototype, "data", void 0), J([i({ attribute: !1 })], Q.prototype, "modalContext", void 0), Q = J([n("ip-access-restriction-modal")], Q), $ = Q;
})), _e = [{
	type: "modal",
	alias: "ip-entry-modal",
	name: "IP Entry Modal",
	js: () => Promise.resolve().then(() => (ge(), he))
}], ve = [{
	type: "globalContext",
	alias: "ip-access-restriction-context",
	name: "IP Access Restriction Context",
	js: () => Promise.resolve().then(() => (K(), ue))
}];
//#endregion
//#region src/index.ts
V();
var ye = (e, t) => {
	t.registerMany([
		...me,
		..._e,
		...ve
	]), e.consumeContext(ae, (e) => {
		if (!e) return;
		let t = e.getOpenApiConfiguration();
		x.BASE = t.base ?? "", x.TOKEN = t.token ?? void 0, x.CREDENTIALS = t.credentials ?? "include";
	});
};
//#endregion
export { ye as onInit };

//# sourceMappingURL=index.js.map