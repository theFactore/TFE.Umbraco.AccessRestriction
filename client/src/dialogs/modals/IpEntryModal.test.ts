import { expect, fixture, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { customElement, html, LitElement } from '@umbraco-cms/backoffice/external/lit';
import { of } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbModalContext } from '@umbraco-cms/backoffice/modal';
import { IP_ACCESS_RESTRICTION_CONTEXT_TOKEN, IPAccessRestrictionContext } from '@context/IpAccessRestrictionContext';
import { IPAccessEntry } from '@models/IPAccessEntry';
import IpEntryModal from './IpEntryModal';
import { IpEntryModalData, IpEntryModalValue } from './IpEntryModalToken';

@customElement('ip-entry-modal-test-host')
class TestHost extends UmbElementMixin(LitElement) {
  saveIpAccessEntry = sinon.stub().resolves();

  constructor() {
    super();
    this.provideContext(IP_ACCESS_RESTRICTION_CONTEXT_TOKEN, {
      getHostElement: () => this,
      ips: of([]),
      saveIpAccessEntry: this.saveIpAccessEntry,
    } as unknown as IPAccessRestrictionContext);
  }

  render() {
    return html`<slot></slot>`;
  }
}

describe('IpEntryModal', () => {
  async function saveEntry(id: string) {
    const host = new TestHost();
    const modal = new IpEntryModal();
    const ipEntry = {
      id,
      ip: '192.168.0.1',
      description: 'Home',
      isDeleted: false,
      isEditable: true,
    } satisfies IPAccessEntry;

    modal.modalContext = {
      data: { ipEntry },
      submit: sinon.spy(),
    } as unknown as UmbModalContext<IpEntryModalData, IpEntryModalValue>;

    host.append(modal);
    await fixture(host);
    await modal.updateComplete;

    modal.shadowRoot?.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await waitUntil(() => host.saveIpAccessEntry.calledOnce);

    return host.saveIpAccessEntry.firstCall.args[0] as IPAccessEntry;
  }

  it('sends Guid.Empty when saving a new entry', async () => {
    const entry = await saveEntry('');
    expect(entry.id).to.equal('00000000-0000-0000-0000-000000000000');
  });

  it('preserves the ID when saving an existing entry', async () => {
    const id = '58B69078-7F0E-4050-95FC-AAE24E93E762';
    const entry = await saveEntry(id);
    expect(entry.id).to.equal(id);
  });
});
