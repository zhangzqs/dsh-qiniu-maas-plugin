import type { Model } from './models/model.ts';

const MODEL_MARKET_URLS = {
  /** 国内模型市场服务域名。 */
  cn: 'https://api.qnaigc.com/v1/market/models',
  /** 全球模型市场服务域名。 */
  global: 'https://openai.sufy.com/v1/market/models',
} as const;

export const QINIU_LLM_BASE_URLS = {
  /** 国内 LLM 推理服务地址。 */
  cn: 'https://api.qnaigc.com/v1',
  /** 全球 LLM 推理服务地址。 */
  global: 'https://openai.sufy.com/v1',
} as const;

export type QiniuRegion = keyof typeof QINIU_LLM_BASE_URLS;

export interface ModelMarketOptions {
  /** 选择模型市场服务域名，默认使用国内服务。 */
  region?: QiniuRegion;
  /** 注入 fetch，主要用于测试或宿主环境适配。 */
  fetch?: typeof globalThis.fetch;
}

export class ModelMarketError extends Error {
  /** HTTP 状态码，网络错误时为空。 */
  readonly status?: number;

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ModelMarketError';
    this.status = status;
  }
}

/**
 * 获取模型市场列表。
 *
 * 该接口使用服务域名直接访问，不需要通过其他接口转发；返回值为
 * `{ status: true, data: [...] }`，模型字段保持接口原始命名，不做转换。
 */
export async function listModels(
  options: ModelMarketOptions = {},
): Promise<Model[]> {
  const url = MODEL_MARKET_URLS[options.region ?? 'cn'];
  const fetcher = options.fetch ?? globalThis.fetch;

  let response: Response;
  try {
    response = await fetcher(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });
    if (!response.ok)
      throw new ModelMarketError(
        `model marketplace request failed (${response.status})`,
        response.status,
      );
  } catch (error) {
    if (error instanceof ModelMarketError) throw error;
    throw new ModelMarketError('model marketplace request failed', undefined, {
      cause: error,
    });
  }

  try {
    const payload = await response.json();
    if (!isResponseEnvelope(payload))
      throw new ModelMarketError(
        'model marketplace response is malformed',
        response.status,
      );
    return payload.data as Model[];
  } catch (error) {
    if (error instanceof ModelMarketError) throw error;
    throw new ModelMarketError(
      'model marketplace response is malformed',
      response.status,
      { cause: error },
    );
  }
}

function isResponseEnvelope(
  value: unknown,
): value is { status: true; data: unknown[] } {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    (value as { status?: unknown }).status === true &&
    Array.isArray((value as { data?: unknown }).data)
  );
}
