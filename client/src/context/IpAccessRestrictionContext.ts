import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { IPAccessRestrictionRepository } from '@repositories/IPAccessRestrictionRepository';
import { IPAccessEntry } from '@api/models/IPAccessEntry';

import { UmbStringState, UmbArrayState, UmbBooleanState } from '@umbraco-cms/backoffice/observable-api';

export class IPAccessRestrictionContext extends UmbControllerBase {
  repository: IPAccessRestrictionRepository;

  #checkIpWhitelistFile = new UmbStringState('');
  public readonly ipWhitelisteTextFileInUse = this.#checkIpWhitelistFile.asObservable();

  #ipEntries = new UmbArrayState(<Array<IPAccessEntry>>[], (x) => x.id);
  public readonly ipEntries = this.#ipEntries.asObservable();

  #ips = new UmbArrayState(<Array<string>>[], (x) => x);
  public readonly ips = this.#ips.asObservable();

  #clientIp = new UmbStringState('');
  public readonly clientIp = this.#clientIp.asObservable();

  #headerInfo = new UmbStringState('');
  public readonly headerInfo = this.#headerInfo.asObservable();

  #isIpInList = new UmbBooleanState(false);
  public readonly isIpInList = this.#isIpInList.asObservable();

  #installationInfo = new UmbStringState('');
  public readonly installationInfo = this.#installationInfo.asObservable();

  constructor(host: UmbControllerHost) {
    super(host);

    this.provideContext(IP_ACCESS_RESTRICTION_CONTEXT_TOKEN, this);
    this.repository = new IPAccessRestrictionRepository(this);
    this.checkIpInList();
  }

  _handleResultError(result: any) {
    if (result.error) {
      throw new Error(result.error.message);
    }
    if (result.data === undefined) {
      throw new Error('Received undefined data');
    }
    return result.data;
  }

  async checkIpInList(): Promise<void> {
    await this.getAllIpAddresses();
    await this.getClientIp();

    let ips = this.#ips.getValue();
    let clientIp = this.#clientIp.getValue();

    if (ips && clientIp) {
      this.#isIpInList.setValue(ips.includes(clientIp));
    } else {
      console.error('Your IP address is not on the list');
      this.#isIpInList.setValue(false);
    }
  }

  async checkIpWhitelistFile() {
    try {
      const result = await this.repository.checkIpWhitelistFile();
      const data = this._handleResultError(result);

      this.#checkIpWhitelistFile?.setValue(data);
    } catch (error) {
      console.error('Error in checkIpWhitelistFile:', error);
    }
  }

  async deleteIpAccessEntry(id: string) {
    try {
      const result = await this.repository.deleteIpAccessEntry(id);
      this._handleResultError(result);

      await this.getAllIpAccessEntries();
      await this.checkIpInList();
    } catch (error) {
      console.error('Error in deleteIpAccessEntry:', error);
    }
  }

  async getAllIpAccessEntries() {
    try {
      const result = await this.repository.getAllIpAccessEntries();
      const data = this._handleResultError(result);

      this.#ipEntries.setValue(data);
    } catch (error) {
      console.error('Error in getAllIpAccessEntries:', error);
    }
  }

  async getAllIpAddresses() {
    try {
      const result = await this.repository.getAllIpAddresses();
      const data = this._handleResultError(result);

      this.#ips.setValue(data);
    } catch (error) {
      console.error('Error in getAllIpAddresses:', error);
    }
  }

  async getIpAccessEntryById(id: string): Promise<IPAccessEntry | undefined> {
    try {
      const result = await this.repository.getIpAccessEntryById(id);

      return this._handleResultError(result);
    } catch (error) {
      console.error('Error in getIpAccessEntryById', error);
      return undefined;
    }
  }

  async getClientIp() {
    try {
      const result = await this.repository.getClientIp();
      const data = this._handleResultError(result);

      this.#clientIp.setValue(data);
    } catch (error) {
      console.error('Error in getClientIp', error);
    }
  }

  async getHeaderInfo() {
    try {
      const result = await this.repository.getHeaderInfo();
      const data = this._handleResultError(result);

      this.#headerInfo.setValue(data);
    } catch (error) {
      console.error('Error in getHeaderInfo:', error);
    }
  }

  async saveIpAccessEntry(entry: IPAccessEntry): Promise<void> {
    try {
      const result = await this.repository.saveIpAccessEntry(entry);
      this._handleResultError(result);

      await this.getAllIpAccessEntries();
      await this.checkIpInList();
    } catch (error) {
      console.error('Error in saveIpAccessEntry:', error);
      console.error('Entry:', entry);
    }
  }

  async getInstallationInfo() {
    try {
      const result = await this.repository.GetInstallationInfo();
      const data = this._handleResultError(result);

      this.#installationInfo.setValue(data);
    } catch (error) {
      console.error('Error in getInstallationInfo:', error);
    }
  }
}

export default IPAccessRestrictionContext;

export const IP_ACCESS_RESTRICTION_CONTEXT_TOKEN = new UmbContextToken<IPAccessRestrictionContext>(
  IPAccessRestrictionContext.name,
);
