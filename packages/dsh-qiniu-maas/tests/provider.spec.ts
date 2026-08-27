import { expect, test, vi } from 'vitest'
import {
  QiniuAdapter,
  buildProviderSnapshot,
  createQiniuProviderState,
  QINIU_INFERENCE_ENDPOINT,
} from '../src/provider.js'

const messages = [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }] as never
const modelSnapshot = () => buildProviderSnapshot({ models: [{ id: 'm', enabled: true }], defaultModel: 'm' })

function response(body: string): Response {
  return new Response(body, { headers: { 'content-type': 'text/event-stream' } })
}

test('native adapter sends OpenAI-compatible request and translates SSE chunks', async () => {
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    expect(input).toBe(QINIU_INFERENCE_ENDPOINT)
    expect(init?.method).toBe('POST')
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer sk-secret')
    expect(new Headers(init?.headers).get('content-type')).toBe('application/json')
    expect(JSON.parse(String(init?.body))).toEqual({ model: 'm', messages: [{ role: 'user', content: 'hello' }], stream: true, temperature: 0.2, max_tokens: 7, stop: ['END'] })
    return response('data: {"choices":[{"delta":{"content":"hi"}}]}\n\ndata: {"choices":[{"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":3,"completion_tokens":2}}\n\ndata: [DONE]\n\n')
  })
  const adapter = new QiniuAdapter({ snapshot: modelSnapshot, resolveApiKey: async () => 'sk-secret', fetch: fetcher })
  await expect(Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages, temperature: 0.2, maxTokens: 7, stop: ['END'] }))).resolves.toEqual([
    { type: 'block-start', index: 0, blockType: 'text' },
    { type: 'text-delta', index: 0, text: 'hi' },
    { type: 'block-end', index: 0, block: { type: 'text', text: 'hi' } },
    { type: 'usage', usage: { inputTokens: 3, outputTokens: 2 } },
    { type: 'finish', reason: { kind: 'stop' } },
  ])
})

test('adapter uses an explicit endpoint override', async () => {
  const fetcher = vi.fn(async () => response('data: {"choices":[{"delta":{"content":"ok"},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n'))
  const adapter = new QiniuAdapter({ snapshot: modelSnapshot, resolveApiKey: async () => 'sk-secret', fetch: fetcher, endpoint: 'https://example.test/chat' })
  await Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages }))
  expect(fetcher).toHaveBeenCalledWith('https://example.test/chat', expect.anything())
})

test('adapter refuses a missing inference API key without making a request', async () => {
  const fetcher = vi.fn()
  const adapter = new QiniuAdapter({ snapshot: modelSnapshot, resolveApiKey: async () => undefined, fetch: fetcher })
  await expect(Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages }))).rejects.toThrow('inference API Key')
  expect(fetcher).not.toHaveBeenCalled()
})

test('adapter passes caller abort signal to fetch', async () => {
  const controller = new AbortController()
  const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    expect(init?.signal).toBe(controller.signal)
    throw new DOMException('aborted', 'AbortError')
  })
  const adapter = new QiniuAdapter({ snapshot: modelSnapshot, resolveApiKey: async () => 'sk-secret', fetch: fetcher })
  await expect(Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages, signal: controller.signal }))).rejects.toThrow()
})

test('settings changes atomically replace the provider snapshot', () => {
  const state = createQiniuProviderState({ models: [], defaultModel: undefined })
  const before = state.snapshot()
  state.replace({ models: [{ id: 'new-model', enabled: true }], defaultModel: 'new-model' })
  expect(before.models).toEqual([])
  expect(state.snapshot()).toEqual({ models: [{ provider: 'qiniu-maas', id: 'new-model', name: 'new-model' }], defaultModel: 'new-model' })
})
