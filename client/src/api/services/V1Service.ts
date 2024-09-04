/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IPAccessEntry } from '../models/IPAccessEntry';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class V1Service {
  /**
   * @returns string OK
   * @throws ApiError
   */
  public static getUmbracoApiV1IpAccessRestrictionApiCheckIpWhitelistFile(): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/CheckIpWhitelistFile',
      errors: {
        404: `Not Found`,
      },
    });
  }
  /**
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deleteUmbracoApiV1IpAccessRestrictionApiDelete(id: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/Delete/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public static getUmbracoApiV1IpAccessRestrictionApiGetAll(): CancelablePromise<Array<IPAccessEntry>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/GetAll',
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  public static getUmbracoApiV1IpAccessRestrictionApiGetAllIpAddresses(): CancelablePromise<Array<string>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/GetAllIpAddresses',
    });
  }
  /**
   * @param id
   * @returns any OK
   * @throws ApiError
   */
  public static getUmbracoApiV1IpAccessRestrictionApiGetbyId(id: string): CancelablePromise<IPAccessEntry> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/GetbyId/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  public static getUmbracoApiV1IpAccessRestrictionApiGetClientIp(): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/GetClientIP',
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  public static getUmbracoApiV1IpAccessRestrictionApiGetHeaderInfo(): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/GetHeaderInfo',
      errors: {
        404: `Not Found`,
      },
    });
  }
  /**
   * @param requestBody
   * @returns any Created
   * @throws ApiError
   */
  public static postUmbracoApiV1IpAccessRestrictionApiSave(
    requestBody?: IPAccessEntry,
  ): CancelablePromise<IPAccessEntry> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/Save',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * @returns string OK
   * @throws ApiError
   */
  public static getUmbracoApiV1IpAccessRestrictionApiGetInstallationInfo(): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/umbraco/api/v1/IPAccessRestrictionApi/GetInstallationInfo',
      errors: {
        404: `Not Found`,
      },
    });
  }
}
