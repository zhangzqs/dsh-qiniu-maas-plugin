import { createQiniuAuthorization } from './auth.js';
import { MaaSError } from './errors.js';
import type {
  ApiKeySummary, BillItem, BillModel, BillParams, BillReport, BillTimeSeries,
  MarketplaceOptions, MaaSClientOptions, PublicModel, UsageParams, UsageReport
} from './types.js';

export const MAAS_SERVER_ROOT = 'https://api.qiniu.com/ai';

type JsonRecord = Record<string, unknown>;

export class MaaSClient {
  private readonly fetcher: typeof globalThis.fetch;
  private readonly accessKey?: string;
  private readonly secretKey?: string;
  private readonly signal?: AbortSignal;

  constructor(options: MaaSClientOptions) {
    this.fetcher = options.fetch;
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
    this.signal = options.signal;
  }

  async listModels(options: MarketplaceOptions = {}): Promise<PublicModel[]> {
    const { signal, ...query } = options;
    const response = await this.request('/v1/market/models', 'listModels', false, query, signal);
    const payload = await this.json(response, 'listModels');
    const items = payload.data;
    if (!Array.isArray(items)) throw new MaaSError({ operation: 'listModels', message: 'Malformed marketplace response' });
    return items.map((item) => this.normalizeModel(item));
  }

  async getModelDetails(id: string): Promise<PublicModel | undefined> {
    const models = await this.listModels();
    return models.find((model) => model.id === id);
  }

  async listApiKeys(): Promise<ApiKeySummary[]> {
    const response = await this.request('/inapi/v3/apikeys', 'listApiKeys', true);
    const payload = await this.json(response, 'listApiKeys');
    if (!Array.isArray(payload.data)) throw new MaaSError({ operation: 'listApiKeys', message: 'Malformed API key response' });
    return payload.data.map((item) => {
      const value = this.record(item, 'listApiKeys');
      const quota = this.record(value.quota, 'listApiKeys');
      const key = this.string(value.key, 'listApiKeys');
      const maskedValue = key.startsWith('sk-') && !key.includes('*') ? `${key.slice(0, 7)}***${key.slice(-4)}` : key;
      return {
        maskedValue, name: this.string(value.name, 'listApiKeys'),
        createdAt: this.string(value.createdAt, 'listApiKeys'), lastUsed: this.string(value.lastUsed, 'listApiKeys'),
        enabled: this.boolean(value.enabled, 'listApiKeys'), totalTokens: this.number(value.totalTokens, 'listApiKeys'),
        quota: {
          daily: this.normalizeQuota(quota.daily, 'listApiKeys'), monthly: this.normalizeQuota(quota.monthly, 'listApiKeys'),
          total: this.normalizeQuota(quota.total, 'listApiKeys')
        }
      };
    });
  }

  async getUsage(params: UsageParams = {}): Promise<UsageReport> {
    const response = await this.request('/inapi/v3/stat/new', 'getUsage', true, params);
    const payload = await this.json(response, 'getUsage');
    if (!Array.isArray(payload.data)) throw new MaaSError({ operation: 'getUsage', message: 'Malformed usage response' });
    const items = payload.data.flatMap((model) => {
      const value = this.record(model, 'getUsage');
      if (!Array.isArray(value.items)) throw new MaaSError({ operation: 'getUsage', message: 'Malformed usage items' });
      return value.items.map((item) => {
        const usage = this.record(item, 'getUsage');
        if (!Array.isArray(usage.values)) throw new MaaSError({ operation: 'getUsage', message: 'Malformed usage values' });
        return { model: this.string(value.name, 'getUsage'), name: this.string(usage.name, 'getUsage'), unit: this.string(usage.unit, 'getUsage'), total: this.number(usage.total, 'getUsage'), values: usage.values.map((point) => { const p = this.record(point, 'getUsage'); return { time: this.string(p.time, 'getUsage'), value: this.number(p.value, 'getUsage') }; }) };
      });
    });
    return { ...(typeof params.start === 'string' ? { start: params.start } : {}), ...(typeof params.end === 'string' ? { end: params.end } : {}), items };
  }

  async getBill(params: BillParams): Promise<BillReport> {
    const response = await this.request('/inapi/v3/stat/bill/range', 'getBill', true, params);
    const payload = await this.json(response, 'getBill');
    if (!Array.isArray(payload.models)) throw new MaaSError({ operation: 'getBill', message: 'Malformed billing response' });
    return { models: payload.models.map((model) => this.normalizeBillModel(model)) };
  }

  async requestManagement(path: string): Promise<Response> {
    if (!path.startsWith('/inapi/')) throw new MaaSError({ operation: 'requestManagement', message: 'Management path must use /inapi/' });
    return this.request(path, 'requestManagement', true);
  }

  private normalizeModel(item: unknown): PublicModel {
    const model = this.record(item, 'listModels');
    const constraints = this.recordOrUndefined(model.model_constraints) ?? {};
    const architecture = this.recordOrUndefined(model.architecture) ?? {};
    const capabilities: string[] = [];
    if (Array.isArray(model.capabilities)) for (const capability of model.capabilities) if (typeof capability === 'string') capabilities.push(capability);
    if (Array.isArray(architecture.input_modalities)) for (const modality of architecture.input_modalities) if (typeof modality === 'string') capabilities.push(`${modality}-input`);
    if (Array.isArray(architecture.output_modalities)) for (const modality of architecture.output_modalities) if (typeof modality === 'string') capabilities.push(`${modality}-output`);
    for (const [field, label] of [['function_calling', 'function-calling'], ['reasoning', 'reasoning']] as const) if (this.recordOrUndefined(architecture[field])?.supported === true) capabilities.push(label);
    return { id: this.string(model.id, 'listModels'), name: typeof model.name === 'string' ? model.name : this.string(model.id, 'listModels'), ...(typeof model.description === 'string' ? { description: model.description } : {}), ...(typeof constraints.context_length === 'number' ? { contextWindow: constraints.context_length } : typeof model.context_length === 'number' ? { contextWindow: model.context_length } : {}), ...(typeof constraints.max_tokens === 'number' ? { maxOutputTokens: constraints.max_tokens } : {}), capabilities: [...new Set(capabilities)] };
  }

  private normalizeQuota(input: unknown, operation: string) {
    const quota = this.record(input, operation);
    return { enabled: typeof quota.enabled === 'boolean' ? quota.enabled : this.boolean(quota.enables, operation), used: this.number(quota.used, operation), limit: this.number(quota.limit, operation) };
  }

  private normalizeBillModel(input: unknown): BillModel {
    const model = this.record(input, 'getBill');
    if (!Array.isArray(model.time_series)) throw new MaaSError({ operation: 'getBill', message: 'Malformed billing series' });
    return { modelId: this.string(model.model_id, 'getBill'), timeSeries: model.time_series.map((series) => this.normalizeBillSeries(series)), totalFee: this.number(model.total_fee, 'getBill'), ...(typeof model.total_requests === 'number' ? { totalRequests: model.total_requests } : {}) };
  }

  private normalizeBillSeries(input: unknown): BillTimeSeries {
    const series = this.record(input, 'getBill');
    if (!Array.isArray(series.items)) throw new MaaSError({ operation: 'getBill', message: 'Malformed billing items' });
    return { time: this.string(series.time, 'getBill'), items: series.items.map((item) => { const value = this.record(item, 'getBill'); const usage = this.record(value.usage, 'getBill'); return { name: this.string(value.name, 'getBill'), usage: { count: this.number(usage.count, 'getBill'), unit: this.string(usage.unit, 'getBill') }, fee: this.number(value.fee, 'getBill'), ...(typeof value.key === 'string' ? { key: value.key } : {}) } as BillItem; }), totalFee: this.number(series.total_fee, 'getBill'), ...(typeof series.total_requests === 'number' ? { totalRequests: series.total_requests } : {}) };
  }

  private async json(response: Response, operation: string): Promise<JsonRecord> {
    const payload = this.record(await response.json(), operation);
    if (payload.status === false) throw new MaaSError({ operation, status: response.status, providerCode: typeof payload.code === 'string' ? payload.code : undefined, requestId: response.headers.get('x-reqid') ?? response.headers.get('x-request-id') ?? undefined, message: 'Qiniu provider returned an error' });
    return payload;
  }

  private async request(path: string, operation: string, privileged: boolean, query: object = {}, signal?: AbortSignal): Promise<Response> {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value !== undefined) search.set(key, String(value));
    const url = `${MAAS_SERVER_ROOT}${path}${search.size ? `?${search}` : ''}`;
    const headers = new Headers({ accept: 'application/json' });
    if (privileged) {
      if (!this.accessKey || !this.secretKey) throw new MaaSError({ operation, message: 'AK/SK credentials are required' });
      headers.set('authorization', await createQiniuAuthorization(this.accessKey, this.secretKey, url));
    }
    let response: Response;
    try { response = await this.fetcher(url, { method: 'GET', headers, signal: signal ?? this.signal }); } catch { throw new MaaSError({ operation, message: 'Qiniu transport request failed' }); }
    if (!response.ok) {
      let providerCode = response.headers.get('x-error-code') ?? undefined;
      try {
        const body = await response.clone().json() as JsonRecord;
        providerCode = typeof body.code === 'string'
          ? body.code
          : typeof body.error_code === 'string'
            ? body.error_code
            : typeof body.errorCode === 'string' ? body.errorCode : providerCode;
      } catch {
        // Non-JSON error bodies are intentionally ignored.
      }
      throw new MaaSError({ operation, status: response.status, providerCode, requestId: response.headers.get('x-reqid') ?? response.headers.get('x-request-id') ?? undefined, message: `Qiniu request failed (${response.status})` });
    }
    return response;
  }

  private record(value: unknown, operation: string): JsonRecord { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new MaaSError({ operation, message: 'Malformed Qiniu response' }); return value as JsonRecord; }
  private recordOrUndefined(value: unknown): JsonRecord | undefined { return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : undefined; }
  private string(value: unknown, operation: string): string { if (typeof value !== 'string') throw new MaaSError({ operation, message: 'Malformed Qiniu response' }); return value; }
  private number(value: unknown, operation: string): number { if (typeof value !== 'number') throw new MaaSError({ operation, message: 'Malformed Qiniu response' }); return value; }
  private boolean(value: unknown, operation: string): boolean { if (typeof value !== 'boolean') throw new MaaSError({ operation, message: 'Malformed Qiniu response' }); return value; }
}
