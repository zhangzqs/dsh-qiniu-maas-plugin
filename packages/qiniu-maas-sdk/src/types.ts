import type { components, paths } from './generated/openapi.js'

type JsonContent<T> = T extends { content: infer Content }
  ? Content extends object ? Content[keyof Content] : never
  : never
type RequestBody<T> = T extends { content: infer Content }
  ? Content extends object ? Content['application/json' & keyof Content] : never
  : never
type Query<T> = T extends { parameters: { query?: infer Value } } ? Value : never
type PathParameters<T> = T extends { parameters: { path?: infer Value } } ? Value : never

/** OpenAPI generated component entities. */
export type { components, paths }
/** JSON object used when the OpenAPI document does not define response fields. */
export type JsonObject = Record<string, unknown>
/** Empty response body represented as an empty object. */
export type EmptyObject = Record<string, never>

/** Request body for enabling or disabling an API Key. */
export type UpdateApiKeyEnabledRequest = RequestBody<paths['/inapi/v2/apikey/enabled']['put']['requestBody']>
/** Response returned after enabling or disabling an API Key. */
export type UpdateApiKeyEnabledResponse = JsonContent<paths['/inapi/v2/apikey/enabled']['put']['responses'][200]>
/** Request body for deleting an API Key. */
export type DeleteApiKeyRequest = RequestBody<paths['/inapi/v2/apikey']['delete']['requestBody']>
/** Response returned after deleting an API Key. */
export type DeleteApiKeyResponse = JsonContent<paths['/inapi/v2/apikey']['delete']['responses'][200]>
/** Request body for creating an API Key. */
export type CreateApiKeyRequest = RequestBody<paths['/inapi/v2/apikey']['post']['requestBody']>
/** Response containing the newly created complete API Key. */
export type CreateApiKeyResponse = JsonContent<paths['/inapi/v2/apikey']['post']['responses'][200]>
/** Complete response for the API Key list endpoint. */
export type ListApiKeysResponse = JsonContent<paths['/inapi/v3/apikeys']['get']['responses'][200]>
/** One API Key item returned by the API Key list endpoint. */
export type ApiKeyItem = ListApiKeysResponse extends { data: readonly (infer Item)[] } ? Item : never
/** Request body for changing an API Key name. */
export type UpdateApiKeyNameRequest = RequestBody<paths['/inapi/v2/apikey/name']['put']['requestBody']>
/** Empty response returned by the API Key name endpoint. */
export type UpdateApiKeyNameResponse = EmptyObject
/** Path parameters for updating API Key quotas. */
export type UpdateApiKeyQuotaPath = PathParameters<paths['/inapi/v2/apikey/quota/{api_key}']['put']>
/** Request body for updating API Key quotas. */
export type UpdateApiKeyQuotaRequest = RequestBody<paths['/inapi/v2/apikey/quota/{api_key}']['put']['requestBody']>
/** Response returned after updating API Key quotas. */
export type UpdateApiKeyQuotaResponse = JsonContent<paths['/inapi/v2/apikey/quota/{api_key}']['put']['responses'][200]>
/** Query parameters for querying a single month's bill. */
export type GetBillByKeyQuery = Query<paths['/inapi/v3/stat/bill']['get']>
/** Response containing a single month's model bills. */
export type GetBillByKeyResponse = JsonContent<paths['/inapi/v3/stat/bill']['get']['responses'][200]>
/** Query parameters for querying all API Key bills for one month. */
export type GetBillAllKeysQuery = Query<paths['/inapi/v3/stat/bill/all_keys']['get']>
/** Response containing all API Key bills for one month. */
export type GetBillAllKeysResponse = JsonContent<paths['/inapi/v3/stat/bill/all_keys']['get']['responses'][200]>
/** Query parameters for querying bills over a time range. */
export type GetBillByRangeQuery = Query<paths['/inapi/v3/stat/bill/range']['get']>
/** Response containing model bill time series. */
export type GetBillByRangeResponse = JsonContent<paths['/inapi/v3/stat/bill/range']['get']['responses'][200]>
/** Query parameters for querying all API Key bills over a time range. */
export type GetBillAllKeysByRangeQuery = Query<paths['/inapi/v3/stat/bill/range/all_keys']['get']>
/** Response containing all API Key bill time series. */
export type GetBillAllKeysByRangeResponse = JsonContent<paths['/inapi/v3/stat/bill/range/all_keys']['get']['responses'][200]>
/** Query parameters for paginated request logs. */
export type GetLogsQuery = Query<paths['/inapi/v3/stat/log']['get']>
/** Response containing a paginated request-log list. */
export type GetLogsResponse = JsonContent<paths['/inapi/v3/stat/log']['get']['responses'][200]>
/** Query parameters for one request-log detail. */
export type GetLogDetailQuery = Query<paths['/inapi/v3/stat/log/detail']['get']>
/** Response containing one request-log detail. */
export type GetLogDetailResponse = JsonContent<paths['/inapi/v3/stat/log/detail']['get']['responses'][200]>
/** Query parameters for usage statistics. */
export type GetUsageQuery = Query<paths['/inapi/v3/stat/new']['get']>
/** Response containing usage statistics. */
export type GetUsageResponse = JsonContent<paths['/inapi/v3/stat/new']['get']['responses'][200]>
/** Conservative response entity for the schema-less pricing-items endpoint. */
export type GetPricingItemsResponse = JsonObject
/** Query parameters for the public model marketplace. */
export type MarketModelsQuery = Query<paths['/v1/market/models']['get']>
/** Complete public model marketplace response. */
export type MarketModelsResponse = JsonContent<paths['/v1/market/models']['get']['responses'][200]>

/** Options shared by individual SDK requests. */
export interface RequestOptions { /** Abort signal passed to fetch. */ signal?: AbortSignal }
/** Options for the authenticated MaaS management client. */
export interface QiniuMaaSClientOptions extends RequestOptions {
  /** Qiniu AccessKey used in the management signature. */ accessKey: string
  /** Qiniu SecretKey used in the management signature. */ secretKey: string
  /** Optional fetch implementation, useful for tests and custom runtimes. */ fetch?: typeof globalThis.fetch
  /** Optional endpoint override for tests or compatible deployments. */ baseUrl?: string
}
/** Options for the unauthenticated public model marketplace client. */
export interface ModelMarketplaceClientOptions extends RequestOptions {
  /** Optional fetch implementation, useful for tests and custom runtimes. */ fetch?: typeof globalThis.fetch
  /** Optional endpoint override for tests or compatible deployments. */ baseUrl?: string
}
/** Default Qiniu MaaS management API root. */
export const QINIU_MAAS_API_ROOT = 'https://api.qiniu.com/ai'
/** Default unauthenticated model marketplace API root. */
export const MODEL_MARKETPLACE_API_ROOT = 'https://api.qnaigc.com'
