import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbDataSourceResponse } from '@umbraco-cms/backoffice/repository';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import { IPAccessEntry, V1Service } from '@api/index.ts';
import { IIPAccessRestrictionDataSource } from '@repositories/sources/IIPAccessRestrictionDataSource';

export class IPAccessRestrictionDataSource implements IIPAccessRestrictionDataSource {
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async checkIpWhitelistFile(): Promise<UmbDataSourceResponse<string>> {
    return await tryExecuteAndNotify(this.#host, V1Service.getUmbracoApiV1IpAccessRestrictionApiCheckIpWhitelistFile());
  }

  async delete(id: string): Promise<UmbDataSourceResponse<boolean>> {
    const deleteOperation = V1Service.deleteUmbracoApiV1IpAccessRestrictionApiDelete(id)
      .then(() => true)
      .catch(() => false);
    return await tryExecuteAndNotify(this.#host, deleteOperation);
  }

  async getAll(): Promise<UmbDataSourceResponse<Array<IPAccessEntry>>> {
    return await tryExecuteAndNotify(this.#host, V1Service.getUmbracoApiV1IpAccessRestrictionApiGetAll());
  }

  async getAllIpAddresses(): Promise<UmbDataSourceResponse<Array<string>>> {
    return await tryExecuteAndNotify(this.#host, V1Service.getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses());
  }

  async getbyId(id: string): Promise<UmbDataSourceResponse<IPAccessEntry>> {
    return await tryExecuteAndNotify(this.#host, V1Service.getUmbracoApiV1IpAccessRestrictionApiGetbyId(id));
  }

  async getClientIp(): Promise<UmbDataSourceResponse<string>> {
    return await tryExecuteAndNotify(this.#host, V1Service.getUmbracoApiV1IpAccessRestrictionApiGetClientIp());
  }

  async getHeaderInfo(): Promise<UmbDataSourceResponse<string>> {
    return await tryExecuteAndNotify(this.#host, V1Service.getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo());
  }

  async saveIpAccessEntry(requestBody?: IPAccessEntry): Promise<UmbDataSourceResponse<IPAccessEntry>> {
    console.log('DataSource: Saving IP Access Entry:', requestBody);
    return await tryExecuteAndNotify(this.#host, V1Service.postUmbracoApiV1IpAccessRestrictionApiSave(requestBody));
  }

  async GetInstallationInfo(): Promise<UmbDataSourceResponse<string>> {
    return await tryExecuteAndNotify(this.#host, V1Service.getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo());
  }
}
