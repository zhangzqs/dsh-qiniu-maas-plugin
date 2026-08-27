import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
import type { QiniuSettings } from './settings.js'

export type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'

export const QINIU_INFERENCE_ENDPOINT = 'https://api.qnaigc.com/v1/chat/completions'

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

export interface QiniuAdapterOptions {
  snapshot: () => QiniuProviderSnapshot
  resolveApiKey: () => Promise<string | undefined>
  fetch?: typeof globalThis.fetch
  endpoint?: string
}

export function buildProviderSnapshot(settings: QiniuSettings): QiniuProviderSnapshot {
  const models = settings.models.filter(model => model.enabled).map(model => Object.freeze({
    provider: 'qiniu-maas', id: model.id, name: model.id,
    ...(model.contextWindow === undefined ? {} : { contextWindow: model.contextWindow }),
    ...(model.maxOutputTokens === undefined ? {} : { maxTokens: model.maxOutputTokens }),
  }))
  return Object.freeze({ models: Object.freeze(models), ...settings.defaultModel === undefined ? {} : { defaultModel: settings.defaultModel } })
}

export function createQiniuProviderState(initial: QiniuSettings): { snapshot: () => QiniuProviderSnapshot; replace: (settings: QiniuSettings) => void } {
  let current = buildProviderSnapshot(initial)
  return { snapshot: () => current, replace: settings => { current = buildProviderSnapshot(settings) } }
}

function textContent(message: unknown): string {
  if (!message || typeof message !== 'object') return ''
  const content = (message as { content?: unknown }).content
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content.filter(block => block && typeof block === 'object' && (block as { type?: unknown }).type === 'text')
    .map(block => String((block as { text?: unknown }).text ?? '')).join('')
}

function openAiMessages(options: GenerateOptions): Array<{ role: string; content: string }> {
  const messages: Array<{ role: string; content: string }> = []
  if (options.system) messages.push({ role: 'system', content: options.system })
  for (const message of options.messages) messages.push({ role: String(message.role), content: textContent(message) })
  return messages
}

function failure(message: string, code: string, status?: number): Error {
  const error = new Error(message)
  error.name = `QiniuMaaS:${code}${status === undefined ? '' : `:${status}`}`
  return error
}

async function* sseChunks(response: Response): AsyncIterable<StreamChunk> {
  if (!response.body) throw failure('Qiniu MaaS response body is missing', 'MISSING_BODY')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let text = ''
  let started = false
  let finished = false
  const emit = async function* (payload: string): AsyncIterable<StreamChunk> {
    if (payload === '[DONE]') return
    let value: any
    try { value = JSON.parse(payload) } catch { throw failure('Qiniu MaaS returned malformed SSE data', 'MALFORMED_SSE') }
    if (value.error) throw failure(typeof value.error.message === 'string' ? value.error.message : 'Qiniu MaaS stream error', 'PROVIDER_ERROR')
    const choice = Array.isArray(value.choices) ? value.choices[0] : undefined
    const delta = choice?.delta
    if (typeof delta?.content === 'string' && delta.content.length > 0) {
      if (!started) { started = true; yield { type: 'block-start', index: 0, blockType: 'text' } }
      text += delta.content
      yield { type: 'text-delta', index: 0, text: delta.content }
    }
    const reason = choice?.finish_reason
    if (typeof reason === 'string' && !finished) {
      if (started) yield { type: 'block-end', index: 0, block: { type: 'text', text } }
      finished = true
    }
    if (value.usage && typeof value.usage.prompt_tokens === 'number' && typeof value.usage.completion_tokens === 'number') {
      yield { type: 'usage', usage: { inputTokens: value.usage.prompt_tokens, outputTokens: value.usage.completion_tokens } }
    }
    if (typeof reason === 'string' && finished) {
      yield { type: 'finish', reason: { kind: reason === 'length' ? 'max-tokens' : reason === 'tool_calls' ? 'tool-calls' : 'stop' } }
    }
  }
  const process = async function* (complete: boolean): AsyncIterable<StreamChunk> {
    const parts = buffer.split(/\r?\n\r?\n/)
    buffer = complete ? '' : (parts.pop() ?? '')
    for (const part of parts) {
      const data = part.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n')
      if (data) yield* emit(data)
    }
  }
  while (true) {
    const next = await reader.read()
    if (next.done) break
    buffer += decoder.decode(next.value, { stream: true })
    yield* process(false)
  }
  buffer += decoder.decode()
  yield* process(true)
}

export class QiniuAdapter extends LlmAdapter {
  private readonly options: QiniuAdapterOptions
  constructor(options: QiniuAdapterOptions) { super(); this.options = options }
  providerInfo(provider: string): { id: string; name: string } { return { id: provider, name: 'Qiniu MaaS' } }
  listModels(provider: string): Promise<readonly QiniuModelInfo[]> { return Promise.resolve(this.options.snapshot().models.filter(model => model.provider === provider)) }
  resolveModel(provider: string, model: string, _signal?: AbortSignal): Promise<PreparedAdapterCall['model']> {
    const found = this.options.snapshot().models.find(item => item.provider === provider && item.id === model)
    const info = found ?? { provider, id: model, name: model }
    return Promise.resolve({ ...info, ...(info.contextWindow === undefined ? {} : { context: { contextWindow: info.contextWindow } }), ...(info.maxTokens === undefined ? {} : { defaultMaxTokens: info.maxTokens }) })
  }
  prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall> { return this.resolveModel(provider, model, signal).then(info => ({ model: info, stream: options => this.stream(options) })) }
  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const apiKey = await this.options.resolveApiKey()
    if (!apiKey) throw new Error('qiniu-maas inference API Key is not configured')
    const fetcher = this.options.fetch ?? globalThis.fetch
    const body: Record<string, unknown> = { model: options.model, messages: openAiMessages(options), stream: true }
    for (const [key, value] of [['temperature', options.temperature], ['max_tokens', options.maxTokens], ['stop', options.stop]] as const) if (value !== undefined) body[key] = value
    const response = await fetcher(this.options.endpoint ?? QINIU_INFERENCE_ENDPOINT, {
      method: 'POST', headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify(body), signal: options.signal,
    })
    if (!response.ok) throw failure(`Qiniu MaaS inference request failed (${response.status})`, 'HTTP_ERROR', response.status)
    yield* sseChunks(response)
  }
}
