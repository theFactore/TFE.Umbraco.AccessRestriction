import { UmbDataSourceResponse } from '@umbraco-cms/backoffice/repository';
import { IPAccessEntry } from '@models/IPAccessEntry';

export interface IIPAccessRestrictionDataSource {
  checkIpWhitelistFile(): Promise<UmbDataSourceResponse<string>>;
  delete(id: string): Promise<UmbDataSourceResponse<boolean>>;
  getAll(): Promise<UmbDataSourceResponse<Array<IPAccessEntry>>>;
  getAllIpAddresses(): Promise<UmbDataSourceResponse<Array<string>>>;
  getbyId(id: string): Promise<UmbDataSourceResponse<IPAccessEntry>>;
  getClientIp(): Promise<UmbDataSourceResponse<string>>;
  getHeaderInfo(): Promise<UmbDataSourceResponse<string>>;
  saveIpAccessEntry(requestBody?: IPAccessEntry): Promise<UmbDataSourceResponse<IPAccessEntry>>;
  GetInstallationInfo(): Promise<UmbDataSourceResponse<string>>;
}
