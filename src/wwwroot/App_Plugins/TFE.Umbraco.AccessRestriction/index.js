var K = (e) => {
  throw TypeError(e);
};
var X = (e, t, s) => t.has(e) || K("Cannot " + s);
var i = (e, t, s) => (X(e, t, "read from private field"), s ? s.call(e) : t.get(e)), d = (e, t, s) => t.has(e) ? K("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), l = (e, t, s, r) => (X(e, t, "write to private field"), r ? r.call(e, s) : t.set(e, s), s);
import { UMB_AUTH_CONTEXT as lt } from "@umbraco-cms/backoffice/auth";
import { LitElement as Z, html as N, unsafeHTML as dt, css as tt, property as h, customElement as et, state as ut } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as st } from "@umbraco-cms/backoffice/element-api";
import { UmbModalToken as pt, UMB_MODAL_MANAGER_CONTEXT as ht } from "@umbraco-cms/backoffice/modal";
import { UmbControllerBase as rt } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as yt } from "@umbraco-cms/backoffice/context-api";
import { tryExecuteAndNotify as g } from "@umbraco-cms/backoffice/resources";
import { UmbArrayState as Y, UmbStringState as M, UmbBooleanState as ft } from "@umbraco-cms/backoffice/observable-api";
import { of as bt, firstValueFrom as It } from "@umbraco-cms/backoffice/external/rxjs";
const mt = [
  {
    type: "dashboard",
    name: "Access Restriction",
    alias: "TFE.Umbraco.AccessRestriction",
    elementName: "access-restriction",
    js: () => Promise.resolve().then(() => kt),
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
], At = [...mt], gt = [
  {
    type: "modal",
    alias: "ip-entry-modal",
    name: "IP Entry Modal",
    js: () => Promise.resolve().then(() => Jt)
  }
], Et = [...gt], vt = [
  {
    type: "globalContext",
    alias: "ip-access-restriction-context",
    name: "IP Access Restriction Context",
    js: () => Promise.resolve().then(() => Nt)
  }
], wt = [...vt];
class Q extends Error {
  constructor(t, s, r) {
    super(r), this.name = "ApiError", this.url = s.url, this.status = s.status, this.statusText = s.statusText, this.body = s.body, this.request = t;
  }
}
class Ct extends Error {
  constructor(t) {
    super(t), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
var m, A, f, w, P, F, C;
class _t {
  constructor(t) {
    d(this, m);
    d(this, A);
    d(this, f);
    d(this, w);
    d(this, P);
    d(this, F);
    d(this, C);
    l(this, m, !1), l(this, A, !1), l(this, f, !1), l(this, w, []), l(this, P, new Promise((s, r) => {
      l(this, F, s), l(this, C, r);
      const o = (c) => {
        i(this, m) || i(this, A) || i(this, f) || (l(this, m, !0), i(this, F) && i(this, F).call(this, c));
      }, n = (c) => {
        i(this, m) || i(this, A) || i(this, f) || (l(this, A, !0), i(this, C) && i(this, C).call(this, c));
      }, a = (c) => {
        i(this, m) || i(this, A) || i(this, f) || i(this, w).push(c);
      };
      return Object.defineProperty(a, "isResolved", {
        get: () => i(this, m)
      }), Object.defineProperty(a, "isRejected", {
        get: () => i(this, A)
      }), Object.defineProperty(a, "isCancelled", {
        get: () => i(this, f)
      }), t(o, n, a);
    }));
  }
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }
  then(t, s) {
    return i(this, P).then(t, s);
  }
  catch(t) {
    return i(this, P).catch(t);
  }
  finally(t) {
    return i(this, P).finally(t);
  }
  cancel() {
    if (!(i(this, m) || i(this, A) || i(this, f))) {
      if (l(this, f, !0), i(this, w).length)
        try {
          for (const t of i(this, w))
            t();
        } catch (t) {
          console.warn("Cancellation threw an error", t);
          return;
        }
      i(this, w).length = 0, i(this, C) && i(this, C).call(this, new Ct("Request aborted"));
    }
  }
  get isCancelled() {
    return i(this, f);
  }
}
m = new WeakMap(), A = new WeakMap(), f = new WeakMap(), w = new WeakMap(), P = new WeakMap(), F = new WeakMap(), C = new WeakMap();
const y = {
  BASE: "",
  VERSION: "Latest",
  WITH_CREDENTIALS: !1,
  CREDENTIALS: "include",
  TOKEN: void 0,
  USERNAME: void 0,
  PASSWORD: void 0,
  HEADERS: void 0,
  ENCODE_PATH: void 0
}, W = (e) => e != null, G = (e) => typeof e == "string", k = (e) => G(e) && e !== "", z = (e) => typeof e == "object" && typeof e.type == "string" && typeof e.stream == "function" && typeof e.arrayBuffer == "function" && typeof e.constructor == "function" && typeof e.constructor.name == "string" && /^(Blob|File)$/.test(e.constructor.name) && /^(Blob|File)$/.test(e[Symbol.toStringTag]), it = (e) => e instanceof FormData, Rt = (e) => {
  try {
    return btoa(e);
  } catch {
    return Buffer.from(e).toString("base64");
  }
}, St = (e) => {
  const t = [], s = (o, n) => {
    t.push(`${encodeURIComponent(o)}=${encodeURIComponent(String(n))}`);
  }, r = (o, n) => {
    W(n) && (Array.isArray(n) ? n.forEach((a) => {
      r(o, a);
    }) : typeof n == "object" ? Object.entries(n).forEach(([a, c]) => {
      r(`${o}[${a}]`, c);
    }) : s(o, n));
  };
  return Object.entries(e).forEach(([o, n]) => {
    r(o, n);
  }), t.length > 0 ? `?${t.join("&")}` : "";
}, Pt = (e, t) => {
  const s = encodeURI, r = t.url.replace("{api-version}", e.VERSION).replace(/{(.*?)}/g, (n, a) => {
    var c;
    return (c = t.path) != null && c.hasOwnProperty(a) ? s(String(t.path[a])) : n;
  }), o = `${e.BASE}${r}`;
  return t.query ? `${o}${St(t.query)}` : o;
}, xt = (e) => {
  if (e.formData) {
    const t = new FormData(), s = (r, o) => {
      G(o) || z(o) ? t.append(r, o) : t.append(r, JSON.stringify(o));
    };
    return Object.entries(e.formData).filter(([r, o]) => W(o)).forEach(([r, o]) => {
      Array.isArray(o) ? o.forEach((n) => s(r, n)) : s(r, o);
    }), t;
  }
}, B = async (e, t) => typeof t == "function" ? t(e) : t, Ot = async (e, t) => {
  const [s, r, o, n] = await Promise.all([
    B(t, e.TOKEN),
    B(t, e.USERNAME),
    B(t, e.PASSWORD),
    B(t, e.HEADERS)
  ]), a = Object.entries({
    Accept: "application/json",
    ...n,
    ...t.headers
  }).filter(([c, R]) => W(R)).reduce((c, [R, S]) => ({
    ...c,
    [R]: String(S)
  }), {});
  if (k(s) && (a.Authorization = `Bearer ${s}`), k(r) && k(o)) {
    const c = Rt(`${r}:${o}`);
    a.Authorization = `Basic ${c}`;
  }
  return t.body !== void 0 && (t.mediaType ? a["Content-Type"] = t.mediaType : z(t.body) ? a["Content-Type"] = t.body.type || "application/octet-stream" : G(t.body) ? a["Content-Type"] = "text/plain" : it(t.body) || (a["Content-Type"] = "application/json")), new Headers(a);
}, Tt = (e) => {
  var t;
  if (e.body !== void 0)
    return (t = e.mediaType) != null && t.includes("/json") ? JSON.stringify(e.body) : G(e.body) || z(e.body) || it(e.body) ? e.body : JSON.stringify(e.body);
}, $t = async (e, t, s, r, o, n, a) => {
  const c = new AbortController(), R = {
    headers: n,
    body: r ?? o,
    method: t.method,
    signal: c.signal
  };
  return a(() => c.abort()), await fetch(s, R);
}, Dt = (e, t) => {
  if (t) {
    const s = e.headers.get(t);
    if (G(s))
      return s;
  }
}, Ft = async (e) => {
  if (e.status !== 204)
    try {
      const t = e.headers.get("Content-Type");
      if (t)
        return ["application/json", "application/problem+json"].some((o) => t.toLowerCase().startsWith(o)) ? await e.json() : await e.text();
    } catch (t) {
      console.error(t);
    }
}, Ut = (e, t) => {
  const r = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    ...e.errors
  }[t.status];
  if (r)
    throw new Q(e, t, r);
  if (!t.ok) {
    const o = t.status ?? "unknown", n = t.statusText ?? "unknown", a = (() => {
      try {
        return JSON.stringify(t.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new Q(
      e,
      t,
      `Generic Error: status: ${o}; status text: ${n}; body: ${a}`
    );
  }
}, E = (e, t) => new _t(async (s, r, o) => {
  try {
    const n = Pt(e, t), a = xt(t), c = Tt(t), R = await Ot(e, t);
    if (!o.isCancelled) {
      const S = await $t(e, t, n, c, a, R, o), at = await Ft(S), ct = Dt(S, t.responseHeader), J = {
        url: n,
        ok: S.ok,
        status: S.status,
        statusText: S.statusText,
        body: ct ?? at
      };
      Ut(t, J), s(J.body);
    }
  } catch (n) {
    r(n);
  }
});
class v {
  /**
   * @param id
   * @returns void
   * @throws ApiError
   */
  static deleteUmbracoApiV1IpAccessRestrictionApiDelete(t) {
    return E(y, {
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
    return E(y, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetAll"
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses() {
    return E(y, {
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
    return E(y, {
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
    return E(y, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetClientIP"
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo() {
    return E(y, {
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
    return E(y, {
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
    return E(y, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetInstallationInfo",
      errors: {
        404: "Not Found"
      }
    });
  }
}
const oe = (e, t) => {
  t.registerMany([...At, ...Et, ...wt]), e.consumeContext(lt, (s) => {
    if (!s)
      return;
    const r = s.getOpenApiConfiguration();
    y.BASE = r.base ?? "", y.TOKEN = r.token ?? void 0, y.CREDENTIALS = r.credentials ?? "include";
  });
};
var u;
class jt {
  constructor(t) {
    d(this, u);
    l(this, u, t);
  }
  async delete(t) {
    const s = v.deleteUmbracoApiV1IpAccessRestrictionApiDelete(t).then(() => !0).catch(() => !1);
    return await g(i(this, u), s);
  }
  async getAll() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetAll());
  }
  async getAllIpAddresses() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses());
  }
  async getbyId(t) {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetbyId(t));
  }
  async getClientIp() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetClientIp());
  }
  async getHeaderInfo() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo());
  }
  async saveIpAccessEntry(t) {
    return console.log("DataSource: Saving IP Access Entry:", t), await g(i(this, u), v.postUmbracoApiV1IpAccessRestrictionApiSave(t));
  }
  async GetInstallationInfo() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo());
  }
}
u = new WeakMap();
var p;
class Vt extends rt {
  constructor(s) {
    super(s);
    d(this, p);
    l(this, p, new jt(this));
  }
  async deleteIpAccessEntry(s) {
    return i(this, p).delete(s);
  }
  async getAllIpAccessEntries() {
    return i(this, p).getAll();
  }
  async getAllIpAddresses() {
    return i(this, p).getAllIpAddresses();
  }
  async getIpAccessEntryById(s) {
    return i(this, p).getbyId(s);
  }
  async getClientIp() {
    return i(this, p).getClientIp();
  }
  async getHeaderInfo() {
    return i(this, p).getHeaderInfo();
  }
  async saveIpAccessEntry(s) {
    return i(this, p).saveIpAccessEntry(s);
  }
  async GetInstallationInfo() {
    return i(this, p).GetInstallationInfo();
  }
}
p = new WeakMap();
var U, x, O, j, T, V;
class q extends rt {
  constructor(s) {
    super(s);
    d(this, U);
    d(this, x);
    d(this, O);
    d(this, j);
    d(this, T);
    d(this, V);
    l(this, U, new Y([], (r) => r.id)), this.ipEntries = i(this, U).asObservable(), l(this, x, new Y([], (r) => r)), this.ips = i(this, x).asObservable(), l(this, O, new M("")), this.clientIp = i(this, O).asObservable(), l(this, j, new M("")), this.headerInfo = i(this, j).asObservable(), l(this, T, new ft(!1)), this.isIpInList = i(this, T).asObservable(), l(this, V, new M("")), this.installationInfo = i(this, V).asObservable(), this.provideContext(H, this), this.repository = new Vt(this), this.checkIpInList();
  }
  _handleResultError(s) {
    if (!s && s !== "")
      throw new Error("Received undefined data");
    if (s.error)
      throw new Error(s.error.message);
    return s;
  }
  async checkIpInList() {
    await this.getAllIpAddresses(), await this.getClientIp();
    let s = i(this, x).getValue(), r = i(this, O).getValue();
    s && r ? i(this, T).setValue(s.includes(r)) : (console.error("Your IP address is not on the list"), i(this, T).setValue(!1));
  }
  async deleteIpAccessEntry(s) {
    try {
      const r = await this.repository.deleteIpAccessEntry(s);
      this._handleResultError(r), await this.getAllIpAccessEntries(), await this.checkIpInList();
    } catch (r) {
      console.error("Error in deleteIpAccessEntry:", r);
    }
  }
  async getAllIpAccessEntries() {
    try {
      const s = await this.repository.getAllIpAccessEntries(), r = this._handleResultError(s);
      i(this, U).setValue(r);
    } catch (s) {
      console.error("Error in getAllIpAccessEntries:", s);
    }
  }
  async getAllIpAddresses() {
    try {
      const s = await this.repository.getAllIpAddresses(), r = this._handleResultError(s);
      i(this, x).setValue(r);
    } catch (s) {
      console.error("Error in getAllIpAddresses:", s);
    }
  }
  async getIpAccessEntryById(s) {
    try {
      const r = await this.repository.getIpAccessEntryById(s);
      return this._handleResultError(r);
    } catch (r) {
      console.error("Error in getIpAccessEntryById", r);
      return;
    }
  }
  async getClientIp() {
    try {
      const s = await this.repository.getClientIp(), r = this._handleResultError(s);
      i(this, O).setValue(r);
    } catch (s) {
      console.error("Error in getClientIp", s);
    }
  }
  async getHeaderInfo() {
    try {
      const s = await this.repository.getHeaderInfo(), r = this._handleResultError(s);
      i(this, j).setValue(r);
    } catch (s) {
      console.error("Error in getHeaderInfo:", s);
    }
  }
  async saveIpAccessEntry(s) {
    try {
      const r = await this.repository.saveIpAccessEntry(s);
      this._handleResultError(r), await this.getAllIpAccessEntries(), await this.checkIpInList();
    } catch (r) {
      console.error("Error in saveIpAccessEntry:", r), console.error("Entry:", s);
    }
  }
  async getInstallationInfo() {
    try {
      const s = await this.repository.GetInstallationInfo(), r = this._handleResultError(s);
      i(this, V).setValue(r);
    } catch (s) {
      console.error("Error in getInstallationInfo:", s);
    }
  }
}
U = new WeakMap(), x = new WeakMap(), O = new WeakMap(), j = new WeakMap(), T = new WeakMap(), V = new WeakMap();
const H = new yt(
  q.name
), Nt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  IPAccessRestrictionContext: q,
  IP_ACCESS_RESTRICTION_CONTEXT_TOKEN: H,
  default: q
}, Symbol.toStringTag, { value: "Module" })), Gt = new pt("ip-entry-modal", {
  modal: {
    type: "sidebar",
    size: "small"
  }
});
var Bt = Object.defineProperty, Ht = Object.getOwnPropertyDescriptor, $ = (e, t, s, r) => {
  for (var o = r > 1 ? void 0 : r ? Ht(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (o = (r ? a(t, s, o) : a(o)) || o);
  return r && o && Bt(t, s, o), o;
};
let b = class extends st(Z) {
  constructor() {
    super(), this.isIpInList = !1, this.consumeContext(H, (e) => {
      this.context = e, e && (this.observe(e.ipEntries, (t) => {
        this.ipEntries = t;
      }), this.observe(e.ips, (t) => {
        this.ips = t;
      }), this.observe(e.clientIp, (t) => {
        this.clientIP = t;
      }), this.observe(e.headerInfo, (t) => {
        this.customHeaderInfo = t;
      }), this.observe(e.isIpInList, (t) => {
        this.isIpInList = t;
      }), this.observe(e.installationInfo, (t) => {
        this.installationInfo = t;
      }));
    }), this.consumeContext(ht, (e) => {
      this.modalManagerContext = e;
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.context != null && (this.context.getAllIpAccessEntries(), this.context.getHeaderInfo(), this.context.checkIpInList(), this.context.getInstallationInfo());
  }
  _formatDate(e) {
    if (!e)
      return "";
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
    return N`
      <div class="container">
        <div id="top-bar">
          <uui-button label="Add new IP address" look="primary" @click="${this._openModal}"
            >+ Add new IP address</uui-button
          >

          <div id="installation-alert" ?hidden="${!this.installationInfo}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${dt(this.installationInfo)}</span>
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
              @click="${() => this._openModal({ id: "", ip: this.clientIP, description: "" })}"
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
      (t) => N`
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
                    ?disabled="${!t.isEditable}"
                    >Edit</uui-button
                  >
                  <uui-button
                    label="Delete button"
                    look="primary"
                    color="danger"
                    @click="${() => this._handleDeleteClick(t)}"
                    ?disabled="${!t.isEditable}"
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
b.styles = tt`
    .container {
      padding: 30px;
    }
    #top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
$([
  h({ type: Array })
], b.prototype, "ipEntries", 2);
$([
  h({ type: Array })
], b.prototype, "ips", 2);
$([
  h({ type: String })
], b.prototype, "clientIP", 2);
$([
  h({ type: String })
], b.prototype, "customHeaderInfo", 2);
$([
  h({ type: Boolean })
], b.prototype, "isIpInList", 2);
$([
  h({ type: String })
], b.prototype, "installationInfo", 2);
b = $([
  et("dashboard-element")
], b);
const Mt = b, kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DashboardElement() {
    return b;
  },
  default: Mt
}, Symbol.toStringTag, { value: "Module" }));
var Lt = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, ot = (e) => {
  throw TypeError(e);
}, _ = (e, t, s, r) => {
  for (var o = r > 1 ? void 0 : r ? qt(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (o = (r ? a(t, s, o) : a(o)) || o);
  return r && o && Lt(t, s, o), o;
}, nt = (e, t, s) => t.has(e) || ot("Cannot " + s), L = (e, t, s) => (nt(e, t, "read from private field"), t.get(e)), Wt = (e, t, s) => t.has(e) ? ot("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), zt = (e, t, s, r) => (nt(e, t, "write to private field"), t.set(e, s), s), D;
let I = class extends st(Z) {
  constructor() {
    super(), Wt(this, D), this.isValid = !1, this.errors = {}, this.id = "", this.ip = "", this.description = "", this.initialIp = "", this.consumeContext(H, (e) => {
      zt(this, D, e);
    });
  }
  firstUpdated() {
    var e, t;
    if ((t = (e = this.modalContext) == null ? void 0 : e.data) != null && t.ipEntry) {
      const { id: s, ip: r, description: o } = this.modalContext.data.ipEntry;
      this.id = s ?? "", this.ip = r ?? "", this.description = o ?? "", this.initialIp = r ?? "";
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
      L(this, D) ? await L(this, D).saveIpAccessEntry(t) : console.error("Access restriction context is not available"), this._handleClose();
    } catch (s) {
      console.error("Failed to save IP access entry:", s);
    }
  }
  _handleInputChange(e) {
    let t;
    ((o) => {
      o.Id = "id", o.Ip = "ip", o.Description = "description";
    })(t || (t = {}));
    const s = (o) => Object.values(t).includes(o), r = e.target;
    s(r.name) && (this[r.name] = r.value), this._validateForm();
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
      const s = ((t = L(this, D)) == null ? void 0 : t.ips) ?? bt();
      return (await It(s)).includes(e) && this.initialIp !== e;
    } catch (s) {
      return console.error("No duplicates found in ips observable, error:", s), !1;
    }
  }
  async _validateForm() {
    this.errors = {}, this._validateIp(this.ip) ? await this._checkDuplicateIps(this.ip) && (this.errors.ip = "The IP Address is already whitelisted", this.requestUpdate()) : this.errors.ip = "Invalid IP", this.description || (this.errors.description = "A description is required"), this.isValid = Object.keys(this.errors).length === 0;
  }
  render() {
    return N`
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
                  ${this.errors.ip ? N`<div class="error-message">${this.errors.ip}</div>` : ""}
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
                  ${this.errors.description ? N`<div class="error-message">${this.errors.description}</div>` : ""}
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
I.styles = tt`
    #id {
      display: none;
    }
    .error-message {
      color: rgb(191, 33, 78);
    }
  `;
_([
  ut()
], I.prototype, "isValid", 2);
_([
  h({ type: Object })
], I.prototype, "errors", 2);
_([
  h({ type: String })
], I.prototype, "id", 2);
_([
  h({ type: String })
], I.prototype, "ip", 2);
_([
  h({ type: String })
], I.prototype, "description", 2);
_([
  h({ attribute: !1 })
], I.prototype, "data", 2);
_([
  h({ attribute: !1 })
], I.prototype, "modalContext", 2);
I = _([
  et("ip-access-restriction-modal")
], I);
const Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get default() {
    return I;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  oe as onInit
};
//# sourceMappingURL=index.js.map
