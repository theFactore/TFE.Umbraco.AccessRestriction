import { ManifestModal } from '@umbraco-cms/backoffice/modal';

const modals: Array<ManifestModal> = [
  {
    type: 'modal',
    alias: 'ip-entry-modal',
    name: 'IP Entry Modal',
    js: () => import('@dialogs/modals/IpEntryModal'),
  },
];

export const manifests = [...modals];
