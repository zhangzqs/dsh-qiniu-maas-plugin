import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
import type { QiniuSettings } from './settings.js'

export type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'

export interface QiniuModelInfo {
  provider: string
  id: string
  name: string
  contextWindow?: number
  maxTokens?: number
}

export interface QiniuProviderSnapshot {
  readonly models: readonly QiniuModelInfo[]
  readonly defaultModel?: string
}

export interface PreparedAdapterCall {
  model: QiniuModelInfo & { context?: { contextWindow: number }; defaultMaxTokens?: number }
  stream: (options: GenerateOptions) => AsyncIterable<StreamChunk>
}

export interface NativeProviderDelegate {
  (options: GenerateOptions & { apiKey: string }): AsyncIterable<StreamChunk> | Promise<AsyncIterable<StreamChunk>>
}

export function buildProviderSnapshot(settings: QiniuSettings): QiniuProviderSnapshot {
  const models = settings.models.filter(model => model.enabled).map(model => Object.freeze({
    provider: 'qiniu-maas',
    id: model.id,
    name: model.id,
    ...(model.contextWindow === undefined ? {} : { contextWindow: model.contextWindow }),
    ...(model.maxOutputTokens === undefined ? {} : { maxTokens: model.maxOutputTokens }),
  }))
  return Object.freeze({ models: Object.freeze(models), ...settings.defaultModel === undefined ? {} : { defaultModel: settings.defaultModel } })
}

export function createQiniuProviderState(initial: QiniuSettings): {
  snapshot: () => QiniuProviderSnapshot
  replace: (settings: QiniuSettings) => void
} {
  let current = buildProviderSnapshot(initial)
  return {
    snapshot: () => current,
    replace: (settings) => { current = buildProviderSnapshot(settings) },
  }
}

export interface QiniuAdapterOptions {
  snapshot: () => QiniuProviderSnapshot
  resolveApiKey: () => Promise<string | undefined>
  delegate?: NativeProviderDelegate
}

export class QiniuAdapter extends LlmAdapter {
  private readonly options: QiniuAdapterOptions

  constructor(options: QiniuAdapterOptions) {
    super()
    this.options = options
  }

  providerInfo(provider: string): { id: string; name: string } { return { id: provider, name: 'Qiniu MaaS' } }

  listModels(provider: string): Promise<readonly QiniuModelInfo[]> {
    return Promise.resolve(this.options.snapshot().models.filter(model => model.provider === provider))
  }

  resolveModel(provider: string, model: string, _signal?: AbortSignal): Promise<PreparedAdapterCall['model']> {
    const found = this.options.snapshot().models.find(item => item.provider === provider && item.id === model)
    const info = found ?? { provider, id: model, name: model }
    return Promise.resolve({
      ...info,
      ...(info.contextWindow === undefined ? {} : { context: { contextWindow: info.contextWindow } }),
      ...(info.maxTokens === undefined ? {} : { defaultMaxTokens: info.maxTokens }),
    })
  }

  prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall> {
    return this.resolveModel(provider, model, signal).then(info => ({ model: info, stream: options => this.stream(options) }))
  }

  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    if (!this.options.delegate) throw new Error('qiniu-maas native DSH provider delegate is unavailable')
    const apiKey = await this.options.resolveApiKey()
    if (!apiKey) throw new Error('qiniu-maas inference API Key is not configured')
    const stream = await this.options.delegate({ ...options, apiKey })
    yield* stream
  }
}
