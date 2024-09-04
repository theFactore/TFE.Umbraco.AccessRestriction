var X = (e) => {
  throw TypeError(e);
};
var Y = (e, t, s) => t.has(e) || X("Cannot " + s);
var r = (e, t, s) => (Y(e, t, "read from private field"), s ? s.call(e) : t.get(e)), d = (e, t, s) => t.has(e) ? X("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), l = (e, t, s, i) => (Y(e, t, "write to private field"), i ? i.call(e, s) : t.set(e, s), s);
import { UMB_AUTH_CONTEXT as dt } from "@umbraco-cms/backoffice/auth";
import { LitElement as tt, html as k, unsafeHTML as ut, css as et, property as y, customElement as st, state as pt } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as it } from "@umbraco-cms/backoffice/element-api";
import { UmbModalToken as ht, UMB_MODAL_MANAGER_CONTEXT as yt } from "@umbraco-cms/backoffice/modal";
import { UmbControllerBase as rt } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as It } from "@umbraco-cms/backoffice/context-api";
import { tryExecuteAndNotify as g } from "@umbraco-cms/backoffice/resources";
import { UmbStringState as H, UmbArrayState as Q, UmbBooleanState as ft } from "@umbraco-cms/backoffice/observable-api";
import { of as bt, firstValueFrom as mt } from "@umbraco-cms/backoffice/external/rxjs";
const At = [
  {
    type: "dashboard",
    name: "Access Restriction",
    alias: "TFE.Umbraco.AccessRestriction",
    elementName: "access-restriction",
    js: () => Promise.resolve().then(() => Lt),
    weight: -10,
    meta: {
      label: "Access Restriction",
      pathname: "access-restriction"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], gt = [...At], Et = [
  {
    type: "modal",
    alias: "ip-entry-modal",
    name: "IP Entry Modal",
    js: () => Promise.resolve().then(() => Kt)
  }
], vt = [...Et], wt = [
  {
    type: "globalContext",
    alias: "ip-access-restriction-context",
    name: "IP Access Restriction Context",
    js: () => Promise.resolve().then(() => kt)
  }
], Ct = [...wt];
class Z extends Error {
  constructor(t, s, i) {
    super(i), this.name = "ApiError", this.url = s.url, this.status = s.status, this.statusText = s.statusText, this.body = s.body, this.request = t;
  }
}
class Rt extends Error {
  constructor(t) {
    super(t), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
var m, A, f, C, x, $, R;
class _t {
  constructor(t) {
    d(this, m);
    d(this, A);
    d(this, f);
    d(this, C);
    d(this, x);
    d(this, $);
    d(this, R);
    l(this, m, !1), l(this, A, !1), l(this, f, !1), l(this, C, []), l(this, x, new Promise((s, i) => {
      l(this, $, s), l(this, R, i);
      const o = (c) => {
        r(this, m) || r(this, A) || r(this, f) || (l(this, m, !0), r(this, $) && r(this, $).call(this, c));
      }, n = (c) => {
        r(this, m) || r(this, A) || r(this, f) || (l(this, A, !0), r(this, R) && r(this, R).call(this, c));
      }, a = (c) => {
        r(this, m) || r(this, A) || r(this, f) || r(this, C).push(c);
      };
      return Object.defineProperty(a, "isResolved", {
        get: () => r(this, m)
      }), Object.defineProperty(a, "isRejected", {
        get: () => r(this, A)
      }), Object.defineProperty(a, "isCancelled", {
        get: () => r(this, f)
      }), t(o, n, a);
    }));
  }
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }
  then(t, s) {
    return r(this, x).then(t, s);
  }
  catch(t) {
    return r(this, x).catch(t);
  }
  finally(t) {
    return r(this, x).finally(t);
  }
  cancel() {
    if (!(r(this, m) || r(this, A) || r(this, f))) {
      if (l(this, f, !0), r(this, C).length)
        try {
          for (const t of r(this, C))
            t();
        } catch (t) {
          console.warn("Cancellation threw an error", t);
          return;
        }
      r(this, C).length = 0, r(this, R) && r(this, R).call(this, new Rt("Request aborted"));
    }
  }
  get isCancelled() {
    return r(this, f);
  }
}
m = new WeakMap(), A = new WeakMap(), f = new WeakMap(), C = new WeakMap(), x = new WeakMap(), $ = new WeakMap(), R = new WeakMap();
const h = {
  BASE: "",
  VERSION: "Latest",
  WITH_CREDENTIALS: !1,
  CREDENTIALS: "include",
  TOKEN: void 0,
  USERNAME: void 0,
  PASSWORD: void 0,
  HEADERS: void 0,
  ENCODE_PATH: void 0
}, z = (e) => e != null, G = (e) => typeof e == "string", L = (e) => G(e) && e !== "", J = (e) => typeof e == "object" && typeof e.type == "string" && typeof e.stream == "function" && typeof e.arrayBuffer == "function" && typeof e.constructor == "function" && typeof e.constructor.name == "string" && /^(Blob|File)$/.test(e.constructor.name) && /^(Blob|File)$/.test(e[Symbol.toStringTag]), ot = (e) => e instanceof FormData, St = (e) => {
  try {
    return btoa(e);
  } catch {
    return Buffer.from(e).toString("base64");
  }
}, Tt = (e) => {
  const t = [], s = (o, n) => {
    t.push(`${encodeURIComponent(o)}=${encodeURIComponent(String(n))}`);
  }, i = (o, n) => {
    z(n) && (Array.isArray(n) ? n.forEach((a) => {
      i(o, a);
    }) : typeof n == "object" ? Object.entries(n).forEach(([a, c]) => {
      i(`${o}[${a}]`, c);
    }) : s(o, n));
  };
  return Object.entries(e).forEach(([o, n]) => {
    i(o, n);
  }), t.length > 0 ? `?${t.join("&")}` : "";
}, xt = (e, t) => {
  const s = encodeURI, i = t.url.replace("{api-version}", e.VERSION).replace(/{(.*?)}/g, (n, a) => {
    var c;
    return (c = t.path) != null && c.hasOwnProperty(a) ? s(String(t.path[a])) : n;
  }), o = `${e.BASE}${i}`;
  return t.query ? `${o}${Tt(t.query)}` : o;
}, Pt = (e) => {
  if (e.formData) {
    const t = new FormData(), s = (i, o) => {
      G(o) || J(o) ? t.append(i, o) : t.append(i, JSON.stringify(o));
    };
    return Object.entries(e.formData).filter(([i, o]) => z(o)).forEach(([i, o]) => {
      Array.isArray(o) ? o.forEach((n) => s(i, n)) : s(i, o);
    }), t;
  }
}, W = async (e, t) => typeof t == "function" ? t(e) : t, Ft = async (e, t) => {
  const [s, i, o, n] = await Promise.all([
    W(t, e.TOKEN),
    W(t, e.USERNAME),
    W(t, e.PASSWORD),
    W(t, e.HEADERS)
  ]), a = Object.entries({
    Accept: "application/json",
    ...n,
    ...t.headers
  }).filter(([c, w]) => z(w)).reduce((c, [w, T]) => ({
    ...c,
    [w]: String(T)
  }), {});
  if (L(s) && (a.Authorization = `Bearer ${s}`), L(i) && L(o)) {
    const c = St(`${i}:${o}`);
    a.Authorization = `Basic ${c}`;
  }
  return t.body !== void 0 && (t.mediaType ? a["Content-Type"] = t.mediaType : J(t.body) ? a["Content-Type"] = t.body.type || "application/octet-stream" : G(t.body) ? a["Content-Type"] = "text/plain" : ot(t.body) || (a["Content-Type"] = "application/json")), new Headers(a);
}, Ot = (e) => {
  var t;
  if (e.body !== void 0)
    return (t = e.mediaType) != null && t.includes("/json") ? JSON.stringify(e.body) : G(e.body) || J(e.body) || ot(e.body) ? e.body : JSON.stringify(e.body);
}, Dt = async (e, t, s, i, o, n, a) => {
  const c = new AbortController(), w = {
    headers: n,
    body: i ?? o,
    method: t.method,
    signal: c.signal
  };
  return e.WITH_CREDENTIALS && (w.credentials = e.CREDENTIALS), a(() => c.abort()), await fetch(s, w);
}, $t = (e, t) => {
  if (t) {
    const s = e.headers.get(t);
    if (G(s))
      return s;
  }
}, Ut = async (e) => {
  if (e.status !== 204)
    try {
      const t = e.headers.get("Content-Type");
      if (t)
        return ["application/json", "application/problem+json"].some((o) => t.toLowerCase().startsWith(o)) ? await e.json() : await e.text();
    } catch (t) {
      console.error(t);
    }
}, Nt = (e, t) => {
  const i = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    ...e.errors
  }[t.status];
  if (i)
    throw new Z(e, t, i);
  if (!t.ok) {
    const o = t.status ?? "unknown", n = t.statusText ?? "unknown", a = (() => {
      try {
        return JSON.stringify(t.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new Z(
      e,
      t,
      `Generic Error: status: ${o}; status text: ${n}; body: ${a}`
    );
  }
}, E = (e, t) => new _t(async (s, i, o) => {
  try {
    const n = xt(e, t), a = Pt(t), c = Ot(t), w = await Ft(e, t);
    if (!o.isCancelled) {
      const T = await Dt(e, t, n, c, a, w, o), ct = await Ut(T), lt = $t(T, t.responseHeader), K = {
        url: n,
        ok: T.ok,
        status: T.status,
        statusText: T.statusText,
        body: lt ?? ct
      };
      Nt(t, K), s(K.body);
    }
  } catch (n) {
    i(n);
  }
});
class v {
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiCheckIpWhitelistFile() {
    return E(h, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/CheckIpWhitelistFile",
      errors: {
        404: "Not Found"
      }
    });
  }
  /**
   * @param id
   * @returns void
   * @throws ApiError
   */
  static deleteUmbracoApiV1IpAccessRestrictionApiDelete(t) {
    return E(h, {
      method: "DELETE",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/Delete/{id}",
      path: {
        id: t
      },
      errors: {
        404: "Not Found"
      }
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetAll() {
    return E(h, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetAll"
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses() {
    return E(h, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetAllIpAddresses"
    });
  }
  /**
   * @param id
   * @returns any OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetbyId(t) {
    return E(h, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetbyId/{id}",
      path: {
        id: t
      },
      errors: {
        404: "Not Found"
      }
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetClientIp() {
    return E(h, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetClientIP"
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo() {
    return E(h, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetHeaderInfo",
      errors: {
        404: "Not Found"
      }
    });
  }
  /**
   * @param requestBody
   * @returns any Created
   * @throws ApiError
   */
  static postUmbracoApiV1IpAccessRestrictionApiSave(t) {
    return E(h, {
      method: "POST",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/Save",
      body: t,
      mediaType: "application/json",
      errors: {
        400: "Bad Request"
      }
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo() {
    return E(h, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetInstallationInfo",
      errors: {
        404: "Not Found"
      }
    });
  }
}
const ne = (e, t) => {
  t.registerMany([...gt, ...vt, ...Ct]), e.consumeContext(dt, (s) => {
    const i = s.getOpenApiConfiguration();
    h.BASE = i.base, h.TOKEN = i.token, h.WITH_CREDENTIALS = i.withCredentials, h.CREDENTIALS = i.credentials;
  });
};
var u;
class Vt {
  constructor(t) {
    d(this, u);
    l(this, u, t);
  }
  async checkIpWhitelistFile() {
    return await g(r(this, u), v.getUmbracoApiV1IpAccessRestrictionApiCheckIpWhitelistFile());
  }
  async delete(t) {
    const s = v.deleteUmbracoApiV1IpAccessRestrictionApiDelete(t).then(() => !0).catch(() => !1);
    return await g(r(this, u), s);
  }
  async getAll() {
    return await g(r(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetAll());
  }
  async getAllIpAddresses() {
    return await g(r(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses());
  }
  async getbyId(t) {
    return await g(r(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetbyId(t));
  }
  async getClientIp() {
    return await g(r(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetClientIp());
  }
  async getHeaderInfo() {
    return await g(r(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo());
  }
  async saveIpAccessEntry(t) {
    return console.log("DataSource: Saving IP Access Entry:", t), await g(r(this, u), v.postUmbracoApiV1IpAccessRestrictionApiSave(t));
  }
  async GetInstallationInfo() {
    return await g(r(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo());
  }
}
u = new WeakMap();
var p;
class jt extends rt {
  constructor(s) {
    super(s);
    d(this, p);
    l(this, p, new Vt(this));
  }
  async checkIpWhitelistFile() {
    return r(this, p).checkIpWhitelistFile();
  }
  async deleteIpAccessEntry(s) {
    return r(this, p).delete(s);
  }
  async getAllIpAccessEntries() {
    return r(this, p).getAll();
  }
  async getAllIpAddresses() {
    return r(this, p).getAllIpAddresses();
  }
  async getIpAccessEntryById(s) {
    return r(this, p).getbyId(s);
  }
  async getClientIp() {
    return r(this, p).getClientIp();
  }
  async getHeaderInfo() {
    return r(this, p).getHeaderInfo();
  }
  async saveIpAccessEntry(s) {
    return r(this, p).saveIpAccessEntry(s);
  }
  async GetInstallationInfo() {
    return r(this, p).GetInstallationInfo();
  }
}
p = new WeakMap();
var U, N, P, F, V, O, j;
class q extends rt {
  constructor(s) {
    super(s);
    d(this, U);
    d(this, N);
    d(this, P);
    d(this, F);
    d(this, V);
    d(this, O);
    d(this, j);
    l(this, U, new H("")), this.ipWhitelisteTextFileInUse = r(this, U).asObservable(), l(this, N, new Q([], (i) => i.id)), this.ipEntries = r(this, N).asObservable(), l(this, P, new Q([], (i) => i)), this.ips = r(this, P).asObservable(), l(this, F, new H("")), this.clientIp = r(this, F).asObservable(), l(this, V, new H("")), this.headerInfo = r(this, V).asObservable(), l(this, O, new ft(!1)), this.isIpInList = r(this, O).asObservable(), l(this, j, new H("")), this.installationInfo = r(this, j).asObservable(), this.provideContext(B, this), this.repository = new jt(this), this.checkIpInList();
  }
  _handleResultError(s) {
    if (s.error)
      throw new Error(s.error.message);
    if (s.data === void 0)
      throw new Error("Received undefined data");
    return s.data;
  }
  async checkIpInList() {
    await this.getAllIpAddresses(), await this.getClientIp();
    let s = r(this, P).getValue(), i = r(this, F).getValue();
    s && i ? r(this, O).setValue(s.includes(i)) : (console.error("Your IP address is not on the list"), r(this, O).setValue(!1));
  }
  async checkIpWhitelistFile() {
    var s;
    try {
      const i = await this.repository.checkIpWhitelistFile(), o = this._handleResultError(i);
      (s = r(this, U)) == null || s.setValue(o);
    } catch (i) {
      console.error("Error in checkIpWhitelistFile:", i);
    }
  }
  async deleteIpAccessEntry(s) {
    try {
      const i = await this.repository.deleteIpAccessEntry(s);
      this._handleResultError(i), await this.getAllIpAccessEntries(), await this.checkIpInList();
    } catch (i) {
      console.error("Error in deleteIpAccessEntry:", i);
    }
  }
  async getAllIpAccessEntries() {
    try {
      const s = await this.repository.getAllIpAccessEntries(), i = this._handleResultError(s);
      r(this, N).setValue(i);
    } catch (s) {
      console.error("Error in getAllIpAccessEntries:", s);
    }
  }
  async getAllIpAddresses() {
    try {
      const s = await this.repository.getAllIpAddresses(), i = this._handleResultError(s);
      r(this, P).setValue(i);
    } catch (s) {
      console.error("Error in getAllIpAddresses:", s);
    }
  }
  async getIpAccessEntryById(s) {
    try {
      const i = await this.repository.getIpAccessEntryById(s);
      return this._handleResultError(i);
    } catch (i) {
      console.error("Error in getIpAccessEntryById", i);
      return;
    }
  }
  async getClientIp() {
    try {
      const s = await this.repository.getClientIp(), i = this._handleResultError(s);
      r(this, F).setValue(i);
    } catch (s) {
      console.error("Error in getClientIp", s);
    }
  }
  async getHeaderInfo() {
    try {
      const s = await this.repository.getHeaderInfo(), i = this._handleResultError(s);
      r(this, V).setValue(i);
    } catch (s) {
      console.error("Error in getHeaderInfo:", s);
    }
  }
  async saveIpAccessEntry(s) {
    try {
      const i = await this.repository.saveIpAccessEntry(s);
      this._handleResultError(i), await this.getAllIpAccessEntries(), await this.checkIpInList();
    } catch (i) {
      console.error("Error in saveIpAccessEntry:", i), console.error("Entry:", s);
    }
  }
  async getInstallationInfo() {
    try {
      const s = await this.repository.GetInstallationInfo(), i = this._handleResultError(s);
      r(this, j).setValue(i);
    } catch (s) {
      console.error("Error in getInstallationInfo:", s);
    }
  }
}
U = new WeakMap(), N = new WeakMap(), P = new WeakMap(), F = new WeakMap(), V = new WeakMap(), O = new WeakMap(), j = new WeakMap();
const B = new It(
  q.name
), kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  IPAccessRestrictionContext: q,
  IP_ACCESS_RESTRICTION_CONTEXT_TOKEN: B,
  default: q
}, Symbol.toStringTag, { value: "Module" })), Gt = new ht("ip-entry-modal", {
  modal: {
    type: "sidebar",
    size: "small"
  }
});
var Ht = Object.defineProperty, Wt = Object.getOwnPropertyDescriptor, _ = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? Wt(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (o = (i ? a(t, s, o) : a(o)) || o);
  return i && o && Ht(t, s, o), o;
};
let I = class extends it(tt) {
  constructor() {
    super(), this.isIpInList = !1, this.consumeContext(B, (e) => {
      this.context = e, this.observe(e.ipWhitelisteTextFileInUse, (t) => {
        this.ipWhitelisteTextFileInUse = t;
      }), this.observe(e.ipEntries, (t) => {
        this.ipEntries = t;
      }), this.observe(e.ips, (t) => {
        this.ips = t;
      }), this.observe(e.clientIp, (t) => {
        this.clientIP = t;
      }), this.observe(e.headerInfo, (t) => {
        this.customHeaderInfo = t;
      }), this.observe(e.isIpInList, (t) => {
        console.log("Observed isIpInList:", t), this.isIpInList = t;
      }), this.observe(e.installationInfo, (t) => {
        this.installationInfo = t;
      });
    }), this.consumeContext(yt, (e) => {
      this.modalManagerContext = e;
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.context != null && (this.context.checkIpWhitelistFile(), this.context.getAllIpAccessEntries(), this.context.getHeaderInfo(), this.context.checkIpInList(), this.context.getInstallationInfo());
  }
  _formatDate(e) {
    if (!e)
      return "N/A";
    const t = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    return new Date(e).toLocaleDateString("en-US", t);
  }
  _openModal(e) {
    var t;
    (t = this.modalManagerContext) == null || t.open(this, Gt, {
      data: {
        ipEntry: e
      }
    });
  }
  async _handleEditClick(e) {
    var t;
    if (e.id) {
      const s = await ((t = this.context) == null ? void 0 : t.getIpAccessEntryById(e.id));
      this._openModal(s);
    } else
      console.error("@handleEditClick IP Address is undefined or null");
  }
  async _handleDeleteClick(e) {
    e.id ? await this.context.deleteIpAccessEntry(e.id) : console.error("IP entry ID is undefined or null");
  }
  render() {
    var e;
    return k`
      <div class="container">
        <div id="top-bar">
          <uui-button label="Add new IP address" look="primary" @click="${this._openModal}"
            >+ Add new IP address</uui-button
          >

          <div id="installation-alert" ?hidden="${!this.installationInfo}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${ut(this.installationInfo)}</span>
          </div>

          <div id="header-alert" ?hidden="${!this.customHeaderInfo}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${this.customHeaderInfo}</span>
          </div>

          <div id="file-alert" ?hidden="${!this.ipWhitelisteTextFileInUse}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${this.ipWhitelisteTextFileInUse}</span>
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
      description: ""
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

          ${(e = this.ipEntries) == null ? void 0 : e.map(
      (t) => k`
              <uui-table-row>
                <uui-table-cell>${t.ip}</uui-table-cell>
                <uui-table-cell>${t.description}</uui-table-cell>
                <uui-table-cell>${this._formatDate(t.modified)}</uui-table-cell>
                <uui-table-cell>${t.modifiedBy}</uui-table-cell>
                <uui-table-cell>
                  <uui-button
                    label="Edit button"
                    look="primary"
                    color="default"
                    @click="${() => this._handleEditClick(t)}"
                    >Edit</uui-button
                  >
                  <uui-button
                    label="Delete button"
                    look="primary"
                    color="danger"
                    @click="${() => this._handleDeleteClick(t)}"
                    >Delete</uui-button
                  >
                </uui-table-cell>
              </uui-table-row>
            `
    )}
        </uui-table>
      </div>
    `;
  }
};
I.styles = et`
    .container {
      padding: 30px;
    }
    #top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
_([
  y({ type: String })
], I.prototype, "ipWhitelisteTextFileInUse", 2);
_([
  y({ type: Array })
], I.prototype, "ipEntries", 2);
_([
  y({ type: Array })
], I.prototype, "ips", 2);
_([
  y({ type: String })
], I.prototype, "clientIP", 2);
_([
  y({ type: String })
], I.prototype, "customHeaderInfo", 2);
_([
  y({ type: Boolean })
], I.prototype, "isIpInList", 2);
_([
  y({ type: String })
], I.prototype, "installationInfo", 2);
I = _([
  st("dashboard-element")
], I);
const Bt = I, Lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DashboardElement() {
    return I;
  },
  default: Bt
}, Symbol.toStringTag, { value: "Module" }));
var Mt = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, nt = (e) => {
  throw TypeError(e);
}, S = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? qt(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (o = (i ? a(t, s, o) : a(o)) || o);
  return i && o && Mt(t, s, o), o;
}, at = (e, t, s) => t.has(e) || nt("Cannot " + s), M = (e, t, s) => (at(e, t, "read from private field"), t.get(e)), zt = (e, t, s) => t.has(e) ? nt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), Jt = (e, t, s, i) => (at(e, t, "write to private field"), t.set(e, s), s), D;
let b = class extends it(tt) {
  constructor() {
    super(), zt(this, D), this.isValid = !1, this.errors = {}, this.id = "", this.ip = "", this.description = "", this.initialIp = "", this.consumeContext(B, (e) => {
      Jt(this, D, e);
    });
  }
  firstUpdated() {
    var e, t;
    if ((t = (e = this.modalContext) == null ? void 0 : e.data) != null && t.ipEntry) {
      const { id: s, ip: i, description: o } = this.modalContext.data.ipEntry;
      this.id = s ?? "", this.ip = i ?? "", this.description = o ?? "", this.initialIp = i ?? "";
    } else
      console.error("No IP Entry data found in modal context");
  }
  _handleClose() {
    var e;
    (e = this.modalContext) == null || e.submit();
  }
  async _handleSubmit(e) {
    if (e.preventDefault(), await this._validateForm(), !this.isValid) {
      console.error("Form validation failed:");
      return;
    }
    const t = {
      ip: this.ip,
      description: this.description
    };
    this.id && (t.id = this.id);
    try {
      M(this, D) ? await M(this, D).saveIpAccessEntry(t) : console.error("Access restriction context is not available"), this._handleClose();
    } catch (s) {
      console.error("Failed to save IP access entry:", s);
    }
  }
  _handleInputChange(e) {
    let t;
    ((o) => {
      o.Id = "id", o.Ip = "ip", o.Description = "description";
    })(t || (t = {}));
    const s = (o) => Object.values(t).includes(o), i = e.target;
    s(i.name) && (this[i.name] = i.value), this._validateForm();
  }
  _validateIp(e) {
    if (!e)
      return !1;
    const t = (e.match(/\*/g) || []).length;
    return t > 0 ? !!(t === 1 && e.endsWith("*")) : /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/.test(e);
  }
  async _checkDuplicateIps(e) {
    var t;
    try {
      const s = ((t = M(this, D)) == null ? void 0 : t.ips) ?? bt();
      return (await mt(s)).includes(e) && this.initialIp !== e;
    } catch (s) {
      return console.error("No duplicates found in ips observable, error:", s), !1;
    }
  }
  async _validateForm() {
    this.errors = {}, this._validateIp(this.ip) ? await this._checkDuplicateIps(this.ip) && (this.errors.ip = "The IP Address is already whitelisted", this.requestUpdate()) : this.errors.ip = "Invalid IP", this.description || (this.errors.description = "A description is required"), this.isValid = Object.keys(this.errors).length === 0;
  }
  render() {
    return k`
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
                  ${this.errors.ip ? k`<div class="error-message">${this.errors.ip}</div>` : ""}
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
                  ${this.errors.description ? k`<div class="error-message">${this.errors.description}</div>` : ""}
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
};
D = /* @__PURE__ */ new WeakMap();
b.styles = et`
    #id {
      display: none;
    }
    .error-message {
      color: rgb(191, 33, 78);
    }
  `;
S([
  pt()
], b.prototype, "isValid", 2);
S([
  y({ type: Object })
], b.prototype, "errors", 2);
S([
  y({ type: String })
], b.prototype, "id", 2);
S([
  y({ type: String })
], b.prototype, "ip", 2);
S([
  y({ type: String })
], b.prototype, "description", 2);
S([
  y({ attribute: !1 })
], b.prototype, "data", 2);
S([
  y({ attribute: !1 })
], b.prototype, "modalContext", 2);
b = S([
  st("ip-access-restriction-modal")
], b);
const Kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get default() {
    return b;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  ne as onInit
};
//# sourceMappingURL=index.js.map
