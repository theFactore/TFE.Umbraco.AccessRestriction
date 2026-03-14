var K = (t) => {
  throw TypeError(t);
};
var X = (t, e, s) => e.has(t) || K("Cannot " + s);
var i = (t, e, s) => (X(t, e, "read from private field"), s ? s.call(t) : e.get(t)), d = (t, e, s) => e.has(t) ? K("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), l = (t, e, s, r) => (X(t, e, "write to private field"), r ? r.call(t, s) : e.set(t, s), s);
import { UMB_AUTH_CONTEXT as le } from "@umbraco-cms/backoffice/auth";
import { LitElement as Z, html as k, unsafeHTML as de, css as ee, property as h, customElement as te, state as ue } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as se } from "@umbraco-cms/backoffice/element-api";
import { UmbModalToken as pe, UMB_MODAL_MANAGER_CONTEXT as he } from "@umbraco-cms/backoffice/modal";
import { UmbControllerBase as re } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as ye } from "@umbraco-cms/backoffice/context-api";
import { tryExecuteAndNotify as g } from "@umbraco-cms/backoffice/resources";
import { UmbArrayState as Y, UmbStringState as H, UmbBooleanState as fe } from "@umbraco-cms/backoffice/observable-api";
import { of as be, firstValueFrom as Ie } from "@umbraco-cms/backoffice/external/rxjs";
const me = [
  {
    type: "dashboard",
    name: "Access Restriction",
    alias: "TFE.Umbraco.AccessRestriction",
    elementName: "access-restriction",
    js: () => Promise.resolve().then(() => Me),
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
], Ae = [...me], ge = [
  {
    type: "modal",
    alias: "ip-entry-modal",
    name: "IP Entry Modal",
    js: () => Promise.resolve().then(() => Je)
  }
], Ee = [...ge], ve = [
  {
    type: "globalContext",
    alias: "ip-access-restriction-context",
    name: "IP Access Restriction Context",
    js: () => Promise.resolve().then(() => ke)
  }
], we = [...ve];
class Q extends Error {
  constructor(e, s, r) {
    super(r), this.name = "ApiError", this.url = s.url, this.status = s.status, this.statusText = s.statusText, this.body = s.body, this.request = e;
  }
}
class Ce extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
var m, A, f, w, T, U, C;
class _e {
  constructor(e) {
    d(this, m);
    d(this, A);
    d(this, f);
    d(this, w);
    d(this, T);
    d(this, U);
    d(this, C);
    l(this, m, !1), l(this, A, !1), l(this, f, !1), l(this, w, []), l(this, T, new Promise((s, r) => {
      l(this, U, s), l(this, C, r);
      const n = (c) => {
        i(this, m) || i(this, A) || i(this, f) || (l(this, m, !0), i(this, U) && i(this, U).call(this, c));
      }, o = (c) => {
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
      }), e(n, o, a);
    }));
  }
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }
  then(e, s) {
    return i(this, T).then(e, s);
  }
  catch(e) {
    return i(this, T).catch(e);
  }
  finally(e) {
    return i(this, T).finally(e);
  }
  cancel() {
    if (!(i(this, m) || i(this, A) || i(this, f))) {
      if (l(this, f, !0), i(this, w).length)
        try {
          for (const e of i(this, w))
            e();
        } catch (e) {
          console.warn("Cancellation threw an error", e);
          return;
        }
      i(this, w).length = 0, i(this, C) && i(this, C).call(this, new Ce("Request aborted"));
    }
  }
  get isCancelled() {
    return i(this, f);
  }
}
m = new WeakMap(), A = new WeakMap(), f = new WeakMap(), w = new WeakMap(), T = new WeakMap(), U = new WeakMap(), C = new WeakMap();
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
}, W = (t) => t != null, G = (t) => typeof t == "string", M = (t) => G(t) && t !== "", z = (t) => typeof t == "object" && typeof t.type == "string" && typeof t.stream == "function" && typeof t.arrayBuffer == "function" && typeof t.constructor == "function" && typeof t.constructor.name == "string" && /^(Blob|File)$/.test(t.constructor.name) && /^(Blob|File)$/.test(t[Symbol.toStringTag]), ie = (t) => t instanceof FormData, Re = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, Se = (t) => {
  const e = [], s = (n, o) => {
    e.push(`${encodeURIComponent(n)}=${encodeURIComponent(String(o))}`);
  }, r = (n, o) => {
    W(o) && (Array.isArray(o) ? o.forEach((a) => {
      r(n, a);
    }) : typeof o == "object" ? Object.entries(o).forEach(([a, c]) => {
      r(`${n}[${a}]`, c);
    }) : s(n, o));
  };
  return Object.entries(t).forEach(([n, o]) => {
    r(n, o);
  }), e.length > 0 ? `?${e.join("&")}` : "";
}, Te = (t, e) => {
  const s = encodeURI, r = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (o, a) => {
    var c;
    return (c = e.path) != null && c.hasOwnProperty(a) ? s(String(e.path[a])) : o;
  }), n = `${t.BASE}${r}`;
  return e.query ? `${n}${Se(e.query)}` : n;
}, Pe = (t) => {
  if (t.formData) {
    const e = new FormData(), s = (r, n) => {
      G(n) || z(n) ? e.append(r, n) : e.append(r, JSON.stringify(n));
    };
    return Object.entries(t.formData).filter(([r, n]) => W(n)).forEach(([r, n]) => {
      Array.isArray(n) ? n.forEach((o) => s(r, o)) : s(r, n);
    }), e;
  }
}, N = async (t, e) => typeof e == "function" ? e(t) : e, xe = async (t, e) => {
  const [s, r, n, o] = await Promise.all([
    N(e, t.TOKEN),
    N(e, t.USERNAME),
    N(e, t.PASSWORD),
    N(e, t.HEADERS)
  ]), a = Object.entries({
    Accept: "application/json",
    ...o,
    ...e.headers
  }).filter(([c, R]) => W(R)).reduce((c, [R, S]) => ({
    ...c,
    [R]: String(S)
  }), {});
  if (M(s) && (a.Authorization = `Bearer ${s}`), M(r) && M(n)) {
    const c = Re(`${r}:${n}`);
    a.Authorization = `Basic ${c}`;
  }
  return e.body !== void 0 && (e.mediaType ? a["Content-Type"] = e.mediaType : z(e.body) ? a["Content-Type"] = e.body.type || "application/octet-stream" : G(e.body) ? a["Content-Type"] = "text/plain" : ie(e.body) || (a["Content-Type"] = "application/json")), new Headers(a);
}, Oe = (t) => {
  var e;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("/json") ? JSON.stringify(t.body) : G(t.body) || z(t.body) || ie(t.body) ? t.body : JSON.stringify(t.body);
}, De = async (t, e, s, r, n, o, a) => {
  const c = new AbortController(), R = {
    headers: o,
    body: r ?? n,
    method: e.method,
    signal: c.signal
  };
  return a(() => c.abort()), await fetch(s, R);
}, $e = (t, e) => {
  if (e) {
    const s = t.headers.get(e);
    if (G(s))
      return s;
  }
}, Ue = async (t) => {
  if (t.status !== 204)
    try {
      const e = t.headers.get("Content-Type");
      if (e)
        return ["application/json", "application/problem+json"].some((n) => e.toLowerCase().startsWith(n)) ? await t.json() : await t.text();
    } catch (e) {
      console.error(e);
    }
}, Fe = (t, e) => {
  const r = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    ...t.errors
  }[e.status];
  if (r)
    throw new Q(t, e, r);
  if (!e.ok) {
    const n = e.status ?? "unknown", o = e.statusText ?? "unknown", a = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new Q(
      t,
      e,
      `Generic Error: status: ${n}; status text: ${o}; body: ${a}`
    );
  }
}, E = (t, e) => new _e(async (s, r, n) => {
  try {
    const o = Te(t, e), a = Pe(e), c = Oe(e), R = await xe(t, e);
    if (!n.isCancelled) {
      const S = await De(t, e, o, c, a, R, n), ae = await Ue(S), ce = $e(S, e.responseHeader), J = {
        url: o,
        ok: S.ok,
        status: S.status,
        statusText: S.statusText,
        body: ce ?? ae
      };
      Fe(e, J), s(J.body);
    }
  } catch (o) {
    r(o);
  }
});
class v {
  /**
   * @param id
   * @returns boolean OK
   * @throws ApiError
   */
  static deleteUmbracoApiV1IpAccessRestrictionApiDelete(e) {
    return E(y, {
      method: "DELETE",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/Delete/{id}",
      path: {
        id: e
      },
      errors: {
        401: "The resource is protected and requires an authentication token"
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
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetAll",
      errors: {
        401: "The resource is protected and requires an authentication token"
      }
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses() {
    return E(y, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetAllIpAddresses",
      errors: {
        401: "The resource is protected and requires an authentication token"
      }
    });
  }
  /**
   * @param id
   * @returns any OK
   * @throws ApiError
   */
  static getUmbracoApiV1IpAccessRestrictionApiGetbyId(e) {
    return E(y, {
      method: "GET",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetbyId/{id}",
      path: {
        id: e
      },
      errors: {
        401: "The resource is protected and requires an authentication token"
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
      url: "/umbraco/api/v1/IPAccessRestrictionApi/GetClientIP",
      errors: {
        401: "The resource is protected and requires an authentication token"
      }
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
        401: "The resource is protected and requires an authentication token"
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
        401: "The resource is protected and requires an authentication token"
      }
    });
  }
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  static postUmbracoApiV1IpAccessRestrictionApiSave(e) {
    return E(y, {
      method: "POST",
      url: "/umbraco/api/v1/IPAccessRestrictionApi/Save",
      body: e,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token"
      }
    });
  }
}
const nt = (t, e) => {
  e.registerMany([...Ae, ...Ee, ...we]), t.consumeContext(le, (s) => {
    if (!s)
      return;
    const r = s.getOpenApiConfiguration();
    y.BASE = r.base ?? "", y.TOKEN = r.token ?? void 0, y.CREDENTIALS = r.credentials ?? "include";
  });
};
var u;
class je {
  constructor(e) {
    d(this, u);
    l(this, u, e);
  }
  async delete(e) {
    const s = v.deleteUmbracoApiV1IpAccessRestrictionApiDelete(e).then(() => !0).catch(() => !1);
    return await g(i(this, u), s);
  }
  async getAll() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetAll());
  }
  async getAllIpAddresses() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses());
  }
  async getbyId(e) {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetbyId(e));
  }
  async getClientIp() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetClientIp());
  }
  async getHeaderInfo() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo());
  }
  async saveIpAccessEntry(e) {
    return console.log("DataSource: Saving IP Access Entry:", e), await g(i(this, u), v.postUmbracoApiV1IpAccessRestrictionApiSave(e));
  }
  async GetInstallationInfo() {
    return await g(i(this, u), v.getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo());
  }
}
u = new WeakMap();
var p;
class Ve extends re {
  constructor(s) {
    super(s);
    d(this, p);
    l(this, p, new je(this));
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
var F, P, x, j, O, V;
class q extends re {
  constructor(s) {
    super(s);
    d(this, F);
    d(this, P);
    d(this, x);
    d(this, j);
    d(this, O);
    d(this, V);
    l(this, F, new Y([], (r) => r.id)), this.ipEntries = i(this, F).asObservable(), l(this, P, new Y([], (r) => r)), this.ips = i(this, P).asObservable(), l(this, x, new H("")), this.clientIp = i(this, x).asObservable(), l(this, j, new H("")), this.headerInfo = i(this, j).asObservable(), l(this, O, new fe(!1)), this.isIpInList = i(this, O).asObservable(), l(this, V, new H("")), this.installationInfo = i(this, V).asObservable(), this.provideContext(B, this), this.repository = new Ve(this), this.checkIpInList();
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
    let s = i(this, P).getValue(), r = i(this, x).getValue();
    s && r ? i(this, O).setValue(s.includes(r)) : (console.error("Your IP address is not on the list"), i(this, O).setValue(!1));
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
      i(this, F).setValue(r);
    } catch (s) {
      console.error("Error in getAllIpAccessEntries:", s);
    }
  }
  async getAllIpAddresses() {
    try {
      const s = await this.repository.getAllIpAddresses(), r = this._handleResultError(s);
      i(this, P).setValue(r);
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
      i(this, x).setValue(r);
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
F = new WeakMap(), P = new WeakMap(), x = new WeakMap(), j = new WeakMap(), O = new WeakMap(), V = new WeakMap();
const B = new ye(
  q.name
), ke = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  IPAccessRestrictionContext: q,
  IP_ACCESS_RESTRICTION_CONTEXT_TOKEN: B,
  default: q
}, Symbol.toStringTag, { value: "Module" })), Ge = new pe("ip-entry-modal", {
  modal: {
    type: "sidebar",
    size: "small"
  }
});
var Ne = Object.defineProperty, Be = Object.getOwnPropertyDescriptor, D = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? Be(e, s) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (n = (r ? a(e, s, n) : a(n)) || n);
  return r && n && Ne(e, s, n), n;
};
let b = class extends se(Z) {
  constructor() {
    super(), this.isIpInList = !1, this.consumeContext(B, (t) => {
      this.context = t, t && (this.observe(t.ipEntries, (e) => {
        this.ipEntries = e;
      }), this.observe(t.ips, (e) => {
        this.ips = e;
      }), this.observe(t.clientIp, (e) => {
        this.clientIP = e;
      }), this.observe(t.headerInfo, (e) => {
        this.customHeaderInfo = e;
      }), this.observe(t.isIpInList, (e) => {
        this.isIpInList = e;
      }), this.observe(t.installationInfo, (e) => {
        this.installationInfo = e;
      }));
    }), this.consumeContext(he, (t) => {
      this.modalManagerContext = t;
    });
  }
  connectedCallback() {
    super.connectedCallback(), this.context != null && (this.context.getAllIpAccessEntries(), this.context.getHeaderInfo(), this.context.checkIpInList(), this.context.getInstallationInfo());
  }
  _formatDate(t) {
    if (!t)
      return "";
    const e = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    return new Date(t).toLocaleDateString("en-US", e);
  }
  _openModal(t) {
    var e;
    (e = this.modalManagerContext) == null || e.open(this, Ge, {
      data: {
        ipEntry: t
      }
    });
  }
  async _handleEditClick(t) {
    var e;
    if (t.id) {
      const s = await ((e = this.context) == null ? void 0 : e.getIpAccessEntryById(t.id));
      this._openModal(s);
    } else
      console.error("@handleEditClick IP Address is undefined or null");
  }
  async _handleDeleteClick(t) {
    t.id ? await this.context.deleteIpAccessEntry(t.id) : console.error("IP entry ID is undefined or null");
  }
  render() {
    var t;
    return k`
      <div class="container">
        <div id="top-bar">
          <uui-button label="Add new IP address" look="primary" @click="${this._openModal}"
            >+ Add new IP address</uui-button
          >

          <div id="installation-alert" ?hidden="${!this.installationInfo}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${de(this.installationInfo)}</span>
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
              @click="${() => this._openModal({ id: "", ip: this.clientIP, description: "", isDeleted: !1, isEditable: !0 })}"
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

          ${(t = this.ipEntries) == null ? void 0 : t.map(
      (e) => k`
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
            `
    )}
        </uui-table>
      </div>
    `;
  }
};
b.styles = ee`
    .container {
      padding: 30px;
    }
    #top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
D([
  h({ type: Array })
], b.prototype, "ipEntries", 2);
D([
  h({ type: Array })
], b.prototype, "ips", 2);
D([
  h({ type: String })
], b.prototype, "clientIP", 2);
D([
  h({ type: String })
], b.prototype, "customHeaderInfo", 2);
D([
  h({ type: Boolean })
], b.prototype, "isIpInList", 2);
D([
  h({ type: String })
], b.prototype, "installationInfo", 2);
b = D([
  te("dashboard-element")
], b);
const He = b, Me = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get DashboardElement() {
    return b;
  },
  default: He
}, Symbol.toStringTag, { value: "Module" }));
var Le = Object.defineProperty, qe = Object.getOwnPropertyDescriptor, ne = (t) => {
  throw TypeError(t);
}, _ = (t, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? qe(e, s) : e, o = t.length - 1, a; o >= 0; o--)
    (a = t[o]) && (n = (r ? a(e, s, n) : a(n)) || n);
  return r && n && Le(e, s, n), n;
}, oe = (t, e, s) => e.has(t) || ne("Cannot " + s), L = (t, e, s) => (oe(t, e, "read from private field"), e.get(t)), We = (t, e, s) => e.has(t) ? ne("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), ze = (t, e, s, r) => (oe(t, e, "write to private field"), e.set(t, s), s), $;
let I = class extends se(Z) {
  constructor() {
    super(), We(this, $), this.isValid = !1, this.errors = {}, this.id = "", this.ip = "", this.description = "", this.initialIp = "", this.consumeContext(B, (t) => {
      ze(this, $, t);
    });
  }
  firstUpdated() {
    var t, e;
    if ((e = (t = this.modalContext) == null ? void 0 : t.data) != null && e.ipEntry) {
      const { id: s, ip: r, description: n } = this.modalContext.data.ipEntry;
      this.id = s ?? "", this.ip = r ?? "", this.description = n ?? "", this.initialIp = r ?? "";
    } else
      console.error("No IP Entry data found in modal context");
  }
  _handleClose() {
    var t;
    (t = this.modalContext) == null || t.submit();
  }
  async _handleSubmit(t) {
    if (t.preventDefault(), await this._validateForm(), !this.isValid) {
      console.error("Form validation failed:");
      return;
    }
    const e = {
      id: this.id || crypto.randomUUID(),
      ip: this.ip,
      description: this.description,
      isDeleted: !1,
      isEditable: !0
    };
    try {
      L(this, $) ? await L(this, $).saveIpAccessEntry(e) : console.error("Access restriction context is not available"), this._handleClose();
    } catch (s) {
      console.error("Failed to save IP access entry:", s);
    }
  }
  _handleInputChange(t) {
    let e;
    ((n) => {
      n.Id = "id", n.Ip = "ip", n.Description = "description";
    })(e || (e = {}));
    const s = (n) => Object.values(e).includes(n), r = t.target;
    s(r.name) && (this[r.name] = r.value), this._validateForm();
  }
  _validateIp(t) {
    if (!t)
      return !1;
    const e = (t.match(/\*/g) || []).length;
    return e > 0 ? !!(e === 1 && t.endsWith("*")) : /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/.test(t);
  }
  async _checkDuplicateIps(t) {
    var e;
    try {
      const s = ((e = L(this, $)) == null ? void 0 : e.ips) ?? be();
      return (await Ie(s)).includes(t) && this.initialIp !== t;
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
$ = /* @__PURE__ */ new WeakMap();
I.styles = ee`
    #id {
      display: none;
    }
    .error-message {
      color: rgb(191, 33, 78);
    }
  `;
_([
  ue()
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
  te("ip-access-restriction-modal")
], I);
const Je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get default() {
    return I;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  nt as onInit
};
//# sourceMappingURL=index.js.map
