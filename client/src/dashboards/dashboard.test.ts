import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DashboardElement from '@dashboards/dashboard.ts';
import { UmbModalManagerContext } from '@umbraco-cms/backoffice/modal';
import IPAccessRestrictionContext from '@context/IpAccessRestrictionContext';

describe('DashboardElement', () => {
  let dashboard: DashboardElement;
  let modalManagerMock: UmbModalManagerContext;
  let ipAccessRestrictionMock: Partial<IPAccessRestrictionContext>;
  let container: HTMLDivElement;

  beforeEach(async () => {
    container = document.createElement('div');
    dashboard = new DashboardElement();
    container.append(dashboard);
    document.body.append(container);
    await dashboard.updateComplete;

    modalManagerMock = {
      open: vi.fn(),
      close: vi.fn(),
    } as unknown as UmbModalManagerContext;

    dashboard.modalManagerContext = modalManagerMock;

    ipAccessRestrictionMock = {
      getIpAccessEntryById: vi.fn(async (_id: string) => ({
        id: '58B69078-7F0E-4050-95FC-AAE24E93E762',
        ip: '192.168.0.1',
        description: 'Home',
        modified: '2024-07-30 13:51:57.8630594',
        modifiedBy: 'Rutger',
        isDeleted: false,
        isEditable: true,
      })),
      deleteIpAccessEntry: vi.fn(async (_id: string): Promise<void> => {}),
    };

    dashboard.context = ipAccessRestrictionMock as IPAccessRestrictionContext;

    dashboard.ipEntries = [
      {
        id: '58B69078-7F0E-4050-95FC-AAE24E93E762',
        ip: '192.168.0.1',
        description: 'Home',
        modified: '2024-07-30 13:51:57.8630594',
        modifiedBy: 'Rutger',
        isDeleted: false,
        isEditable: true,
      },
      {
        id: '58B69078-7F0E-4059-95FC-AAE24E93E764',
        ip: '10.0.0.1',
        description: 'Office',
        modified: '2024-08-02',
        modifiedBy: 'Admin',
        isDeleted: false,
        isEditable: true,
      },
    ];

    await dashboard.updateComplete;
  });

  afterEach(() => container.remove());

  it('should call delete IP access entry when the "Delete" button is clicked', async () => {
    const deleteButtons = dashboard.shadowRoot?.querySelectorAll('uui-button[label="Delete button"]');

    if (!deleteButtons || deleteButtons.length === 0) {
      throw new Error('Delete buttons not found');
    }

    const firstDeleteButton = deleteButtons[0] as HTMLElement;

    await firstDeleteButton.click();
    await dashboard.updateComplete;

    await vi.waitFor(() => {
      expect(ipAccessRestrictionMock.deleteIpAccessEntry).toHaveBeenCalledExactlyOnceWith(
        '58B69078-7F0E-4050-95FC-AAE24E93E762',
      );
    });
  });

  it('should open the IP entry modal when the "Edit" button is clicked', async () => {
    const editButtons = dashboard.shadowRoot?.querySelectorAll('uui-button[label="Edit button"]');

    if (!editButtons || editButtons.length === 0) {
      throw new Error('Edit buttons not found');
    }

    const fitrstEditButton = editButtons[0] as HTMLElement;
    await fitrstEditButton.click(); //await is needed here!

    await dashboard.updateComplete;
    await vi.waitFor(() => {
      expect(modalManagerMock.open).toHaveBeenCalledOnce();
      expect(ipAccessRestrictionMock.getIpAccessEntryById).toHaveBeenCalledWith(
        '58B69078-7F0E-4050-95FC-AAE24E93E762',
      );
    });
  });

  it('is defined with its own instance', () => {
    expect(dashboard).toBeInstanceOf(DashboardElement);
  });

  it('should have default properties', () => {
    expect(dashboard.ipEntries).toBeDefined();
    expect(dashboard.ips).toBeUndefined();
    expect(dashboard.clientIP).toBeUndefined();
    expect(dashboard.customHeaderInfo).toBeUndefined();
    expect(dashboard.isIpInList).toBe(false);
  });

  it('should render a list of IP entries', async () => {
    await dashboard.updateComplete;

    const rows = dashboard.shadowRoot?.querySelectorAll('uui-table-row');
    expect(rows?.length).toBe(2);

    const firstRow = rows ? rows[0] : null;
    const cells = firstRow ? (firstRow as unknown as HTMLElement).querySelectorAll('uui-table-cell') : [];
    expect(cells[0].textContent).toBe('192.168.0.1');
    expect(cells[1].textContent).toBe('Home');
    expect(cells[2].textContent).toBe('Jul 30, 2024');
    expect(cells[3].textContent).toBe('Rutger');

    console.log(cells[2]);
  });

  it('should open the IP entry modal when the "add new IP address" button is clicked', async () => {
    const addButton = dashboard.shadowRoot?.querySelector('uui-button[label="Add new IP address"]') as HTMLElement;
    addButton.click();

    await dashboard.updateComplete;
    expect(modalManagerMock.open).toHaveBeenCalledOnce();
  });

  it('should open the IP entry modal when the "Your IP address is not on the list" button is clicked', async () => {
    const addButton = dashboard.shadowRoot?.querySelector('uui-button[label="Add current IP address"]') as HTMLElement;
    addButton.click();

    await dashboard.updateComplete;
    expect(modalManagerMock.open).toHaveBeenCalledOnce();
  });

  it('hides the custom header info div when there is no customHeaderInfo', async () => {
    dashboard.customHeaderInfo = '';
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#header-alert');
    expect(div?.hasAttribute('hidden')).toBe(true);
  });

  it('shows the custom header info div when customHeaderInfo is provided', async () => {
    dashboard.customHeaderInfo = 'Important Info';
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#header-alert');
    expect(div?.hasAttribute('hidden')).toBe(false);
    expect(div?.querySelector('span')?.textContent).toBe('Important Info');
  });

  it('hides the IP not in list div when isIpInList is true', async () => {
    dashboard.isIpInList = true;
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#ip-alert');
    expect(div?.hasAttribute('hidden')).toBe(true);
  });

  it('shows the IP not in list div when isIpInList is false', async () => {
    dashboard.isIpInList = false;
    await dashboard.updateComplete;

    const div = dashboard.shadowRoot?.querySelector('#ip-alert');
    expect(div?.hasAttribute('hidden')).toBe(false);
  });
});
