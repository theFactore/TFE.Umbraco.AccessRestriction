import { ManifestGlobalContext } from '@umbraco-cms/backoffice/extension-registry';

const contexts: Array<ManifestGlobalContext> = [
  {
    type: 'globalContext',
    alias: 'ip-access-restriction-context',
    name: 'IP Access Restriction Context',
    js: () => import('@context/IpAccessRestrictionContext'),
  },
];

export const manifests = [...contexts];
