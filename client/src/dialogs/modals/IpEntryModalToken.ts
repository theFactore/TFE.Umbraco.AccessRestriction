import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import { IPAccessEntry } from '@models/IPAccessEntry';

export interface IpEntryModalData {
  ipEntry?: IPAccessEntry;
}

export interface IpEntryModalValue {
  ipEntry: IPAccessEntry;
}

export const IP_ENTRY_MODAL_TOKEN = new UmbModalToken<IpEntryModalData, IpEntryModalValue>('ip-entry-modal', {
  modal: {
    type: 'sidebar',
    size: 'small',
  },
});
