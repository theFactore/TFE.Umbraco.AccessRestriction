import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UmbModalExtensionElement } from '@umbraco-cms/backoffice/extension-registry';
import { css, customElement, html, LitElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { IpEntryModalData, IpEntryModalValue } from '@dialogs/modals/IpEntryModalToken';
import { IP_ACCESS_RESTRICTION_CONTEXT_TOKEN, IPAccessRestrictionContext } from '@context/IpAccessRestrictionContext';
import { UmbModalContext } from '@umbraco-cms/backoffice/modal';
import { IPAccessEntry } from '@models/IPAccessEntry';
import { firstValueFrom, of } from '@umbraco-cms/backoffice/external/rxjs';

interface Errors {
  ip?: string;
  description?: string;
  duplicateIp?: string;
}

@customElement('ip-access-restriction-modal')
export default class IpEntryModal
  extends UmbElementMixin(LitElement)
  implements UmbModalExtensionElement<IpEntryModalData, IpEntryModalValue>
{
  #accessRestrictionContext?: IPAccessRestrictionContext;

  @state() isValid: boolean = false;

  @property({ type: Object }) errors: Errors = {};
  @property({ type: String }) id = '';
  @property({ type: String }) ip = '';
  @property({ type: String }) description = '';
  @property({ attribute: false }) data?: IpEntryModalData;
  @property({ attribute: false })
  modalContext?: UmbModalContext<IpEntryModalData, IpEntryModalValue>;

  initialIp: string = '';

  constructor() {
    super();
    this.consumeContext(IP_ACCESS_RESTRICTION_CONTEXT_TOKEN, (instance) => {
      this.#accessRestrictionContext = instance;
    });
  }

  protected firstUpdated() {
    if (this.modalContext?.data?.ipEntry) {
      const { id, ip, description } = this.modalContext.data.ipEntry;
      this.id = id ?? '';
      this.ip = ip ?? '';
      this.description = description ?? '';
      this.initialIp = ip ?? '';
    } else {
      console.error('No IP Entry data found in modal context');
    }
  }

  private _handleClose() {
    this.modalContext?.submit();
  }

  private async _handleSubmit(e: Event) {
    e.preventDefault();
    await this._validateForm();

    if (!this.isValid) {
      console.error('Form validation failed:');
      return;
    }

    const ipEntry: IPAccessEntry = {
      ip: this.ip,
      description: this.description,
    };

    if (this.id) {
      ipEntry.id = this.id;
    }

    try {
      if (this.#accessRestrictionContext) {
        await this.#accessRestrictionContext.saveIpAccessEntry(ipEntry);
      } else {
        console.error('Access restriction context is not available');
      }
      this._handleClose();
    } catch (error) {
      console.error('Failed to save IP access entry:', error);
    }
  }

  private _handleInputChange(event: Event) {
    enum InputFieldNames {
      Id = 'id',
      Ip = 'ip',
      Description = 'description',
    }

    const isValidInputFieldName = (fieldName: any): fieldName is InputFieldNames =>
      Object.values(InputFieldNames).includes(fieldName as InputFieldNames);
    const inputElement = event.target as HTMLInputElement;

    if (isValidInputFieldName(inputElement.name)) {
      this[inputElement.name] = inputElement.value;
    }
    this._validateForm();
  }

  private _validateIp(ip: string): boolean {
    if (!ip) {
      return false;
    }

    const wildcards = (ip.match(/\*/g) || []).length;

    if (wildcards > 0) {
      if (wildcards === 1 && ip.endsWith('*')) {
        return true;
      } else {
        return false;
      }
    } else {
      const expression =
        /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
      return expression.test(ip);
    }
  }

  private async _checkDuplicateIps(ip: string): Promise<boolean> {
    try {
      const ipObservable = this.#accessRestrictionContext?.ips ?? of();
      const allIpEntries = await firstValueFrom(ipObservable);
      return allIpEntries.includes(ip) && this.initialIp !== ip;
    } catch (error) {
      console.error('No duplicates found in ips observable, error:', error);
      return false;
    }
  }

  private async _validateForm() {
    this.errors = {};
    if (!this._validateIp(this.ip)) {
      this.errors.ip = 'Invalid IP';
    } else if (await this._checkDuplicateIps(this.ip)) {
      this.errors.ip = 'The IP Address is already whitelisted';
      this.requestUpdate();
    }

    if (!this.description) {
      this.errors.description = 'A description is required';
    }

    this.isValid = Object.keys(this.errors).length === 0;
  }

  render() {
    return html`
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
                  ${this.errors.ip ? html`<div class="error-message">${this.errors.ip}</div>` : ''}
                </div>
              </uui-form-layout-item>

              <!-- Form input description -->
              <uui-form-layout-item>
                <uui-label slot="label" for="Description" ?required=${true}>Description</uui-label>
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
                  ${this.errors.description ? html`<div class="error-message">${this.errors.description}</div>` : ''}
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

  public static readonly styles = css`
    #id {
      display: none;
    }
    .error-message {
      color: rgb(191, 33, 78);
    }
  `;
}
