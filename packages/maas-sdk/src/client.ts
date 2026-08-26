import { createQiniuAuthorization } from './auth.js';
import { MaaSError } from './errors.js';
import type { MaaSClientOptions, PublicModel } from './types.js';

export const MAAS_SERVER_ROOT = 'https://api.qiniu.com/ai';

type MarketplacePayload = { data?: { items?: unknown[] } };

export class MaaSClient {
  private readonly fetcher: typeof globalThis.fetch;
  private readonly accessKey?: string;
  private readonly secretKey?: string;

  constructor(options: MaaSClientOptions) {
    this.fetcher = options.fetch;
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
  }

  async listModels(): Promise<PublicModel[]> {
    const response = await this.request('/v1/market/models', 'listModels', false);
    const payload = (await response.json()) as MarketplacePayload;
    const items = payload.data?.items;
    if (!Array.isArray(items)) {
      throw new MaaSError({ operation: 'listModels', message: 'Malformed marketplace response' });
    }
    return items.map((item) => {
      if (!item || typeof item !== 'object' || typeof (item as { id?: unknown }).id !== 'string') {
        throw new MaaSError({ operation: 'listModels', message: 'Malformed marketplace model' });
      }
      const model = item as Record<string, unknown>;
      return {
        id: model.id as string,
        name: typeof model.name === 'string' ? model.name : model.id as string,
        ...(typeof model.description === 'string' ? { description: model.description } : {}),
        ...(typeof model.context_length === 'number' ? { contextWindow: model.context_length } : {}),
        capabilities: Array.isArray(model.capabilities)
          ? model.capabilities.filter((value): value is string => typeof value === 'string')
          : []
      };
    });
  }

  async requestManagement(path: string): Promise<Response> {
    if (!path.startsWith('/inapi/')) {
      throw new MaaSError({ operation: 'requestManagement', message: 'Management path must use /inapi/' });
    }
    return this.request(path, 'requestManagement', true);
  }

  private async request(path: string, operation: string, privileged: boolean): Promise<Response> {
    const url = `${MAAS_SERVER_ROOT}${path}`;
    const headers = new Headers({ accept: 'application/json' });
    if (privileged) {
      if (!this.accessKey || !this.secretKey) {
        throw new MaaSError({ operation, message: 'AK/SK credentials are required' });
      }
      headers.set('authorization', await createQiniuAuthorization(this.accessKey, this.secretKey, url));
    }
    const response = await this.fetcher(url, { method: 'GET', headers });
    if (!response.ok) {
      throw new MaaSError({ operation, status: response.status, message: `Qiniu request failed (${response.status})` });
    }
    return response;
  }
}
