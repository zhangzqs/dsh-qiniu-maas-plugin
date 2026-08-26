import type { QiniuSettings } from './settings.js'

export interface GenerateOptions {
  provider: string
  model: string
  messages: unknown[]
  [key: string]: unknown
}

export interface StreamChunk { type: string; [key: string]: unknown }

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
  delegate: NativeProviderDelegate
}

export class QiniuAdapter {
  constructor(private readonly options: QiniuAdapterOptions) {}

  providerInfo(provider: string): { id: string; name: string } { return { id: provider, name: 'Qiniu MaaS' } }

  listModels(provider: string): Promise<readonly QiniuModelInfo[]> {
    return Promise.resolve(this.options.snapshot().models.filter(model => model.provider === provider))
  }

  resolveModel(provider: string, model: string): Promise<PreparedAdapterCall['model']> {
    const found = this.options.snapshot().models.find(item => item.provider === provider && item.id === model)
    if (!found) return Promise.reject(new Error(`qiniu-maas model "${model}" is not enabled`))
    return Promise.resolve({
      ...found,
      ...(found.contextWindow === undefined ? {} : { context: { contextWindow: found.contextWindow } }),
      ...(found.maxTokens === undefined ? {} : { defaultMaxTokens: found.maxTokens }),
    })
  }

  prepareCall(provider: string, model: string): Promise<PreparedAdapterCall> {
    return this.resolveModel(provider, model).then(info => ({ model: info, stream: options => this.stream(options) }))
  }

  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const apiKey = await this.options.resolveApiKey()
    if (!apiKey) throw new Error('qiniu-maas inference API Key is not configured')
    const stream = await this.options.delegate({ ...options, apiKey })
    yield* stream
  }
}
