import { expect, fixture, html } from '@open-wc/testing';
import DashboardElement from '@dashboards/dashboard.ts';
import sinon from 'sinon';
import { UmbModalManagerContext } from '@umbraco-cms/backoffice/modal';
import IPAccessRestrictionContext from '@context/IpAccessRestrictionContext';

describe('DashboardElement', () => {
  let dashboard: DashboardElement;
  let modalManagerMock: UmbModalManagerContext;
  let ipAccessRestrictionMock: Partial<IPAccessRestrictionContext>;

  beforeEach(async () => {
    dashboard = await fixture(html`<dashboard-element></dashboard-element>`);

    modalManagerMock = {
      open: sinon.spy(),
      close: sinon.spy(),
    } as unknown as UmbModalManagerContext;

    dashboard.modalManagerContext = modalManagerMock;

    ipAccessRestrictionMock = {
      getIpAccessEntryById: sinon.stub().resolves({
        id: '58B69078-7F0E-4050-95FC-AAE24E93E762',
        ip: '192.168.0.1',
        description: 'Home',
        modified: '2024-07-30 13:51:57.8630594',
        modifiedBy: 'Rutger',
      }),
      deleteIpAccessEntry: sinon.stub().resolves({
        id: '58B69078-7F0E-4050-95FC-AAE24E93E762',
        ip: '192.168.0.1',
        description: 'Home',
        modified: '2024-07-30 13:51:57.8630594',
        modifiedBy: 'Rutger',
      }),
    };

    dashboard.context = ipAccessRestrictionMock as IPAccessRestrictionContext;

    dashboard.ipEntries = [
      {
        id: '58B69078-7F0E-4050-95FC-AAE24E93E762',
        ip: '192.168.0.1',
        description: 'Home',
        modified: '2024-07-30 13:51:57.8630594',
        modifiedBy: 'Rutger',
      },
      {
        id: '58B69078-7F0E-4059-95FC-AAE24E93E764',
        ip: '10.0.0.1',
        description: 'Office',
        modified: '2024-08-02',
        modifiedBy: 'Admin',
      },
    ];

    await dashboard.updateComplete;
  });

  it('should call delete IP access entry when the "Delete" button is clicked', async () => {
    const deleteButtons = dashboard.shadowRoot?.querySelectorAll('uui-button[label="Delete button"]');

    if (!deleteButtons || deleteButtons.length === 0) {
      throw new Error('Delete buttons not found');
    }

    const firstDeleteButton = deleteButtons[0] as HTMLElement;

    await firstDeleteButton.click();
    await dashboard.updateComplete;

    expect(ipAccessRestrictionMock.deleteIpAccessEntry).to.have.been.calledOnceWith(
      '58B69078-7F0E-4050-95FC-AAE24E93E762',
    );
  });

  it('should open the IP entry modal when the "Edit" button is clicked', async () => {
    const editButtons = dashboard.shadowRoot?.querySelectorAll('uui-button[label="Edit button"]');

    if (!editButtons || editButtons.length === 0) {
      throw new Error('Edit buttons not found');
    }

    const fitrstEditButton = editButtons[0] as HTMLElement;
    await fitrstEditButton.click(); //await is needed here!

    await dashboard.updateComplete;
    expect(modalManagerMock.open).to.have.been.calledOnce;
    expect(ipAccessRestrictionMock.getIpAccessEntryById).to.have.been.calledWith(
      '58B69078-7F0E-4050-95FC-AAE24E93E762',
    );
  });

  it('is defined with its own instance', () => {
    expect(dashboard).to.be.instanceOf(DashboardElement);
  });

  it('should have default properties', () => {
    expect(dashboard.ipWhitelisteTextFileInUse);
    expect(dashboard.ipEntries);
    expect(dashboard.ips);
    expect(dashboard.clientIP);
    expect(dashboard.customHeaderInfo);
    expect(dashboard.isIpInList);
  });

  it('should render a list of IP entries', async () => {
    await dashboard.updateComplete;

    const rows = dashboard.shadowRoot?.querySelectorAll('uui-table-row');
    expect(rows?.length).to.equal(2);

    const firstRow = rows ? rows[0] : null;
    const cells = firstRow ? firstRow.querySelectorAll('uui-table-cell') : [];
    expect(cells[0].textContent).to.equal('192.168.0.1');
    expect(cells[1].textContent).to.equal('Home');
    expect(cells[2].textContent).to.equal('Jul 30, 2024');
    expect(cells[3].textContent).to.equal('Rutger');

    console.log(cells[2]);
  });

  it('should open the IP entry modal when the "add new IP address" button is clicked', async () => {
    const addButton = dashboard.shadowRoot?.querySelector('uui-button[label="Add new IP address"]') as HTMLElement;
    addButton.click();

    await dashboard.updateComplete;
    expect(modalManagerMock.open).to.have.been.calledOnce;
  });

  it('should open the IP entry modal when the "Your IP address is not on the list" button is clicked', async () => {
    const addButton = dashboard.shadowRoot?.querySelector('uui-button[label="Add current IP address"]') as HTMLElement;
    addButton.click();

    await dashboard.updateComplete;
    expect(modalManagerMock.open).to.have.been.calledOnce;
  });

  it('hides the custom header info div when there is no customHeaderInfo', async () => {
    dashboard.customHeaderInfo = '';
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#header-alert');
    expect(div).to.have.attribute('hidden');
  });

  it('shows the custom header info div when customHeaderInfo is provided', async () => {
    dashboard.customHeaderInfo = 'Important Info';
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#header-alert');
    expect(div).not.to.have.attribute('hidden');
    expect(div?.querySelector('span')?.textContent).to.equal('Important Info');
  });

  it('hides the file-alert div when no file is in use', async () => {
    dashboard.ipWhitelisteTextFileInUse = '';
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#file-alert');
    expect(div).to.have.attribute('hidden');
  });

  it('shows file-alert div when a file is in use', async () => {
    dashboard.ipWhitelisteTextFileInUse = 'whitelist.txt';
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#file-alert');
    expect(div).not.to.have.attribute('hidden');
    expect(div?.querySelector('span')?.textContent).to.equal('whitelist.txt');
  });

  it('hides the IP not in list div when isIpInList is true', async () => {
    dashboard.isIpInList = true;
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#ip-alert');
    expect(div).to.have.attribute('hidden');
  });

  it('shows the IP not in list div when isIpInList is false', async () => {
    dashboard.isIpInList = false;
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#ip-alert');
    expect(div).not.to.have.attribute('hidden');
  });
});
