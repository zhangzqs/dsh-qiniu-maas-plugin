import { MaaSTransport } from './transport.js'
import {
  MODEL_MARKETPLACE_API_ROOT, QINIU_MAAS_API_ROOT,
  type CreateApiKeyRequest, type CreateApiKeyResponse, type DeleteApiKeyRequest, type DeleteApiKeyResponse,
  type GetBillAllKeysByRangeQuery, type GetBillAllKeysByRangeResponse, type GetBillAllKeysQuery, type GetBillAllKeysResponse,
  type GetBillByKeyQuery, type GetBillByKeyResponse, type GetBillByRangeQuery, type GetBillByRangeResponse,
  type GetLogDetailQuery, type GetLogDetailResponse, type GetLogsQuery, type GetLogsResponse,
  type GetPricingItemsResponse, type GetUsageQuery, type GetUsageResponse, type MarketModelsQuery, type MarketModelsResponse,
  type ModelMarketplaceClientOptions, type QiniuMaaSClientOptions, type RequestOptions,
  type UpdateApiKeyEnabledRequest, type UpdateApiKeyEnabledResponse, type UpdateApiKeyNameRequest,
  type UpdateApiKeyQuotaPath, type UpdateApiKeyQuotaRequest, type UpdateApiKeyQuotaResponse,
  type UpdateApiKeyNameResponse, type ListApiKeysResponse,
} from './types.js'

/** Authenticated client for the Qiniu MaaS management API. */
export class QiniuMaaSClient {
  private readonly transport: MaaSTransport

  constructor(options: QiniuMaaSClientOptions) {
    if (!options.accessKey.trim() || !options.secretKey.trim()) throw new TypeError('accessKey and secretKey are required')
    this.transport = new MaaSTransport({ baseUrl: options.baseUrl ?? QINIU_MAAS_API_ROOT, fetcher: options.fetch, accessKey: options.accessKey, secretKey: options.secretKey, signal: options.signal })
  }

  /** 启用或禁用 API Key。 */
  updateApiKeyEnabled(body: UpdateApiKeyEnabledRequest, options?: RequestOptions): Promise<UpdateApiKeyEnabledResponse> {
    return this.transport.call('updateApiKeyEnabled', { body }, () => this.transport.client.PUT('/inapi/v2/apikey/enabled', { body, signal: options?.signal }))
  }
  /** 删除 API Key；Key 必须已禁用。 */
  deleteApiKey(body: DeleteApiKeyRequest, options?: RequestOptions): Promise<DeleteApiKeyResponse> {
    return this.transport.call('deleteApiKey', { body }, () => this.transport.client.DELETE('/inapi/v2/apikey', { body, signal: options?.signal }))
  }
  /** 创建新的 API Key。 */
  createApiKey(body: CreateApiKeyRequest, options?: RequestOptions): Promise<CreateApiKeyResponse> {
    return this.transport.call('createApiKey', { body }, () => this.transport.client.POST('/inapi/v2/apikey', { body, signal: options?.signal }))
  }
  /** 获取所有 API Key 列表及配额用量。 */
  listApiKeys(options?: RequestOptions): Promise<ListApiKeysResponse> {
    return this.transport.call('listApiKeys', {}, () => this.transport.client.GET('/inapi/v3/apikeys', { signal: options?.signal }))
  }
  /** 修改 API Key 名称。 */
  updateApiKeyName(body: UpdateApiKeyNameRequest, options?: RequestOptions): Promise<UpdateApiKeyNameResponse> {
    return this.transport.call('updateApiKeyName', { body }, async () => this.transport.client.PUT('/inapi/v2/apikey/name', { body, parseAs: 'text', signal: options?.signal }))
  }
  /** 新增或更新 API Key 限额。 */
  updateApiKeyQuota(apiKey: UpdateApiKeyQuotaPath['api_key'], body: UpdateApiKeyQuotaRequest, options?: RequestOptions): Promise<UpdateApiKeyQuotaResponse> {
    return this.transport.call('updateApiKeyQuota', { path: { api_key: apiKey }, body }, () => this.transport.client.PUT('/inapi/v2/apikey/quota/{api_key}', { params: { path: { api_key: apiKey } }, body, signal: options?.signal }))
  }
  /** 查询指定月份的账单。 */
  getBillByKey(query: GetBillByKeyQuery, options?: RequestOptions): Promise<GetBillByKeyResponse> {
    return this.transport.call('getBillByKey', { query }, () => this.transport.client.GET('/inapi/v3/stat/bill', { params: { query }, signal: options?.signal }))
  }
  /** 查询指定月份所有 API Key 的账单。 */
  getBillAllKeys(query: GetBillAllKeysQuery, options?: RequestOptions): Promise<GetBillAllKeysResponse> {
    return this.transport.call('getBillAllKeys', { query }, () => this.transport.client.GET('/inapi/v3/stat/bill/all_keys', { params: { query }, signal: options?.signal }))
  }
  /** 查询时间范围内的账单。 */
  getBillByRange(query: GetBillByRangeQuery, options?: RequestOptions): Promise<GetBillByRangeResponse> {
    return this.transport.call('getBillByRange', { query }, () => this.transport.client.GET('/inapi/v3/stat/bill/range', { params: { query }, signal: options?.signal }))
  }
  /** 查询时间范围内所有 API Key 的账单。 */
  getBillAllKeysByRange(query: GetBillAllKeysByRangeQuery, options?: RequestOptions): Promise<GetBillAllKeysByRangeResponse> {
    return this.transport.call('getBillAllKeysByRange', { query }, () => this.transport.client.GET('/inapi/v3/stat/bill/range/all_keys', { params: { query }, signal: options?.signal }))
  }
  /** 查询分页请求日志。 */
  getLogs(query: GetLogsQuery, options?: RequestOptions): Promise<GetLogsResponse> {
    return this.transport.call('getLogs', { query }, () => this.transport.client.GET('/inapi/v3/stat/log', { params: { query }, signal: options?.signal }))
  }
  /** 查询单条请求日志详情。 */
  getLogDetail(query: GetLogDetailQuery, options?: RequestOptions): Promise<GetLogDetailResponse> {
    return this.transport.call('getLogDetail', { query }, () => this.transport.client.GET('/inapi/v3/stat/log/detail', { params: { query }, signal: options?.signal }))
  }
  /** 查询用量数据。 */
  getUsage(query?: GetUsageQuery, options?: RequestOptions): Promise<GetUsageResponse> {
    return this.transport.call('getUsage', { query }, () => this.transport.client.GET('/inapi/v3/stat/new', { params: query ? { query } : undefined, signal: options?.signal }))
  }
  /** 获取计费项列表；OpenAPI 未定义具体字段。 */
  getPricingItems(options?: RequestOptions): Promise<GetPricingItemsResponse> {
    return this.transport.call('getPricingItems', {}, () => this.transport.client.GET('/inapi/v3/market/pricingitems', { signal: options?.signal }))
  }
}

/** Unauthenticated client for the public Qiniu MaaS model marketplace. */
export class ModelMarketplaceClient {
  private readonly transport: MaaSTransport

  constructor(options: ModelMarketplaceClientOptions = {}) {
    this.transport = new MaaSTransport({ baseUrl: options.baseUrl ?? MODEL_MARKETPLACE_API_ROOT, fetcher: options.fetch, signal: options.signal })
  }

  /** 获取模型市场列表。 */
  getMarketModels(query?: MarketModelsQuery, options?: RequestOptions): Promise<MarketModelsResponse> {
    return this.transport.call('getMarketModels', { query }, () => this.transport.client.GET('/v1/market/models', { params: query ? { query } : undefined, signal: options?.signal }))
  }
}
