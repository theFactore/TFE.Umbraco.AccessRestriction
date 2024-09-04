import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { IPAccessRestrictionDataSource } from '@repositories/sources/IPAccessRestrictionDataSource.ts';
import { IPAccessEntry } from '@api/index.ts';

export class IPAccessRestrictionRepository extends UmbControllerBase {
  #dataSource: IPAccessRestrictionDataSource;

  constructor(host: UmbControllerHost) {
    super(host);
    this.#dataSource = new IPAccessRestrictionDataSource(this);
  }

  async checkIpWhitelistFile() {
    return this.#dataSource.checkIpWhitelistFile();
  }

  async deleteIpAccessEntry(id: string) {
    return this.#dataSource.delete(id);
  }

  async getAllIpAccessEntries() {
    return this.#dataSource.getAll();
  }

  async getAllIpAddresses() {
    return this.#dataSource.getAllIpAddresses();
  }

  async getIpAccessEntryById(id: string) {
    return this.#dataSource.getbyId(id);
  }

  async getClientIp() {
    return this.#dataSource.getClientIp();
  }

  async getHeaderInfo() {
    return this.#dataSource.getHeaderInfo();
  }

  async saveIpAccessEntry(requestBody?: IPAccessEntry) {
    return this.#dataSource.saveIpAccessEntry(requestBody);
  }

  async GetInstallationInfo() {
    return this.#dataSource.GetInstallationInfo();
  }
}
