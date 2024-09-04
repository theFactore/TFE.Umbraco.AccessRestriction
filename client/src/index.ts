import { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';

// load up the manifests here.
import { manifests as dashboardManifests } from '@dashboards/manifest.ts';
import { manifests as modalManifests } from '@dialogs/modals/manifest.ts';
import { manifests as contextManifests } from '@context/manifest.ts';

import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import { OpenAPI } from '@api/index.ts';

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
  // register them here.
  extensionRegistry.registerMany([...dashboardManifests, ...modalManifests, ...contextManifests]);

  _host.consumeContext(UMB_AUTH_CONTEXT, (_auth) => {
    const umbOpenApi = _auth.getOpenApiConfiguration();
    OpenAPI.BASE = umbOpenApi.base;
    OpenAPI.TOKEN = umbOpenApi.token;
    OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
    OpenAPI.CREDENTIALS = umbOpenApi.credentials;
  });
};
