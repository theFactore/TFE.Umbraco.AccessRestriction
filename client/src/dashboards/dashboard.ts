import { LitElement, css, html, customElement, property, unsafeHTML } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { IP_ACCESS_RESTRICTION_CONTEXT_TOKEN, IPAccessRestrictionContext } from '@context/IpAccessRestrictionContext';
import { IP_ENTRY_MODAL_TOKEN } from '@dialogs/modals/IpEntryModalToken.ts';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import IpEntry, { IPAccessEntry } from '@models/IPAccessEntry.ts';

@customElement('dashboard-element')
export class DashboardElement extends UmbElementMixin(LitElement) {
  modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  context?: IPAccessRestrictionContext;

  @property({ type: String }) ipWhitelisteTextFileInUse?: string;
  @property({ type: Array }) ipEntries?: IpEntry[];
  @property({ type: Array }) ips?: string[];
  @property({ type: String }) clientIP?: string;
  @property({ type: String }) customHeaderInfo?: string;
  @property({ type: Boolean }) isIpInList = false;
  @property({ type: String }) installationInfo?: string;

  constructor() {
    super();
    this.consumeContext(IP_ACCESS_RESTRICTION_CONTEXT_TOKEN, (_instance) => {
      this.context = _instance;

      this.observe(_instance.ipWhitelisteTextFileInUse, (_ipWhitelisteTextFileInUse) => {
        this.ipWhitelisteTextFileInUse = _ipWhitelisteTextFileInUse;
      });

      this.observe(_instance.ipEntries, (_ipEntries) => {
        this.ipEntries = _ipEntries;
      });

      this.observe(_instance.ips, (_ips) => {
        this.ips = _ips;
      });

      this.observe(_instance.clientIp, (_clientIp) => {
        this.clientIP = _clientIp;
      });

      this.observe(_instance.headerInfo, (_headerInfo) => {
        this.customHeaderInfo = _headerInfo;
      });

      this.observe(_instance.isIpInList, (_isIpInList) => {
        console.log('Observed isIpInList:', _isIpInList);
        this.isIpInList = _isIpInList;
      });

      this.observe(_instance.installationInfo, (_installationInfo) => {
        this.installationInfo = _installationInfo;
      });
    });

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.modalManagerContext = instance;
    });
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.context != null) {
      this.context.checkIpWhitelistFile();
      this.context.getAllIpAccessEntries();
      this.context.getHeaderInfo();
      this.context.checkIpInList();
      this.context.getInstallationInfo();
    }
  }

  private _formatDate(dateString?: string): string {
    if (!dateString) {
      return 'N/A';
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  _openModal(ipEntry?: IpEntry) {
    this.modalManagerContext?.open(this, IP_ENTRY_MODAL_TOKEN, {
      data: {
        ipEntry,
      },
    });
  }

  async _handleEditClick(ipEntry: IPAccessEntry) {
    if (ipEntry.id) {
      const ipDetails = await this.context?.getIpAccessEntryById(ipEntry.id);
      this._openModal(ipDetails);
    } else {
      console.error('@handleEditClick IP Address is undefined or null');
    }
  }

  async _handleDeleteClick(ipEntry: IPAccessEntry) {
    if (ipEntry.id) {
      await this.context!.deleteIpAccessEntry(ipEntry.id);
    } else {
      console.error('IP entry ID is undefined or null');
    }
  }

  render() {
    return html`
      <div class="container">
        <div id="top-bar">
          <uui-button label="Add new IP address" look="primary" @click="${this._openModal}"
            >+ Add new IP address</uui-button
          >

          <div id="installation-alert" ?hidden="${!this.installationInfo}">
            <uui-icon name="alert" style="color: orange; margin-bottom: 4px;"></uui-icon>
            <span>${unsafeHTML(this.installationInfo)}</span>
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
              @click="${() =>
                this._openModal({
                  id: '',
                  ip: this.clientIP,
                  description: '',
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

          ${this.ipEntries?.map(
            (ipEntry) => html`
              <uui-table-row>
                <uui-table-cell>${ipEntry.ip}</uui-table-cell>
                <uui-table-cell>${ipEntry.description}</uui-table-cell>
                <uui-table-cell>${this._formatDate(ipEntry.modified!)}</uui-table-cell>
                <uui-table-cell>${ipEntry.modifiedBy}</uui-table-cell>
                <uui-table-cell>
                  <uui-button
                    label="Edit button"
                    look="primary"
                    color="default"
                    @click="${() => this._handleEditClick(ipEntry)}"
                    >Edit</uui-button
                  >
                  <uui-button
                    label="Delete button"
                    look="primary"
                    color="danger"
                    @click="${() => this._handleDeleteClick(ipEntry)}"
                    >Delete</uui-button
                  >
                </uui-table-cell>
              </uui-table-row>
            `,
          )}
        </uui-table>
      </div>
    `;
  }
  public static readonly styles = css`
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

export default DashboardElement;

declare global {
  interface HTMLElementsTagNameMap {
    'access-restriction': DashboardElement;
  }
}
