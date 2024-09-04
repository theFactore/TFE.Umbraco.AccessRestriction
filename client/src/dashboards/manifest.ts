import type { ManifestDashboard } from '@umbraco-cms/backoffice/extension-registry';

const dashboards: Array<ManifestDashboard> = [
  {
    type: 'dashboard',
    name: 'Access Restriction',
    alias: 'TFE.Umbraco.AccessRestriction',
    elementName: 'access-restriction',
    js: () => import('@dashboards/dashboard'),
    weight: -10,
    meta: {
      label: 'Access Restriction',
      pathname: 'access-restriction',
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Content',
      },
    ],
  },
];

export const manifests = [...dashboards];
