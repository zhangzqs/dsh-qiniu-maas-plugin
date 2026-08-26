import { expect, test, vi } from 'vitest'
import {
  QiniuAdapter,
  buildProviderSnapshot,
  createQiniuProviderState,
} from '../src/provider.js'

const messages = [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }]

test('empty enabled model settings materialize an empty provider snapshot', () => {
  expect(buildProviderSnapshot({ models: [], defaultModel: undefined })).toEqual({
    models: [],
    defaultModel: undefined,
  })
})

test('enabled models materialize DSH model metadata with user overrides', () => {
  expect(buildProviderSnapshot({
    models: [
      { id: 'deepseek-v4-flash', enabled: true, contextWindow: 64000, maxOutputTokens: 4096 },
      { id: 'disabled', enabled: false },
    ],
    defaultModel: 'deepseek-v4-flash',
  })).toEqual({
    models: [{ provider: 'qiniu-maas', id: 'deepseek-v4-flash', name: 'deepseek-v4-flash', contextWindow: 64000, maxTokens: 4096 }],
    defaultModel: 'deepseek-v4-flash',
  })
})

test('adapter passes user context and output overrides to the native provider delegate', async () => {
  const delegate = vi.fn(async function* (options: unknown) { yield options })
  const adapter = new QiniuAdapter({
    snapshot: () => buildProviderSnapshot({ models: [{ id: 'm', enabled: true, contextWindow: 1000, maxOutputTokens: 200 }], defaultModel: 'm' }),
    resolveApiKey: async () => 'key',
    delegate,
  })

  await Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages, maxTokens: 7 }))
  expect(delegate).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'key', maxTokens: 7 }))
})

test('adapter refuses a missing inference API key before invoking native provider', async () => {
  const delegate = vi.fn()
  const adapter = new QiniuAdapter({
    snapshot: () => buildProviderSnapshot({ models: [{ id: 'm', enabled: true }], defaultModel: 'm' }),
    resolveApiKey: async () => undefined,
    delegate,
  })

  await expect(Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages }))).rejects.toThrow('inference API Key')
  expect(delegate).not.toHaveBeenCalled()
})

test('settings changes atomically replace the provider snapshot', () => {
  const state = createQiniuProviderState({ models: [], defaultModel: undefined })
  const before = state.snapshot()
  state.replace({ models: [{ id: 'new-model', enabled: true }], defaultModel: 'new-model' })
  expect(before.models).toEqual([])
  expect(state.snapshot()).toEqual({
    models: [{ provider: 'qiniu-maas', id: 'new-model', name: 'new-model' }],
    defaultModel: 'new-model',
  })
})
