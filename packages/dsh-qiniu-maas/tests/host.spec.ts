import { LlmAdapter } from '@deepseek-ai/dsh-llm'
import { expect, test, vi } from 'vitest'
import { apply } from '../src/host.js'
import { inject } from '../src/index.js'
import { QiniuSettingsSchema } from '../src/settings.js'

type CallableRegistration = (() => void) & { replace?: ReturnType<typeof vi.fn> }

function fakeContext() {
  const cleanups: Array<() => void> = []
  const handlers = new Map<string, (args?: unknown) => unknown>()
  const watcherCleanups: Array<() => void> = []
  const watchers: Array<(value: unknown) => void> = []
  const registrations: CallableRegistration[] = []
  const makeRegistration = (replace?: ReturnType<typeof vi.fn>): CallableRegistration => {
    const registration = vi.fn() as unknown as CallableRegistration
    if (replace) registration.replace = replace
    registrations.push(registration)
    return registration
  }
  const scope = {
    get: () => ({ models: [], defaultModel: undefined }),
    watch: (callback: (value: unknown) => void) => {
      watchers.push(callback)
      const cleanup = vi.fn(() => { watchers.splice(watchers.indexOf(callback), 1) })
      watcherCleanups.push(cleanup)
      return cleanup
    },
  }
  const llm = {
    registerConfigurableProviders: vi.fn(() => makeRegistration()),
    registerAdapter: vi.fn(() => makeRegistration(vi.fn())),
    registerModelDiscovery: vi.fn(() => makeRegistration()),
  }
  const settings = { register: vi.fn(() => scope), replace: vi.fn() }
  const credentials = { resolve: vi.fn(async () => undefined), describe: vi.fn(async () => ({ configured: false, writable: true })), set: vi.fn() }
  const harness = { handle: vi.fn((name: string, handler: (args?: unknown) => unknown) => { handlers.set(name, handler); return () => handlers.delete(name) }) }
  const ctx = {
    llm,
    get: (name: string) => ({ settings, credentials, harness, fetch: fetch, llm } as Record<string, unknown>)[name],
    effect: (effect: () => void | (() => void)) => { const cleanup = effect(); if (typeof cleanup === 'function') cleanups.push(cleanup) },
  }
  return { ctx, cleanups, handlers, watcherCleanups, watchers, registrations, scope, llm, settings, credentials, harness }
}

test('exports the injected llm dependency from the package entrypoint', () => {
  expect(inject).toEqual(['llm'])
})

test('replaces one callable adapter registration on settings changes and cleans up without scope disposal', () => {
  const fake = fakeContext()
  apply(fake.ctx, { nativeStream: async function* () {} })
  fake.watchers[0]?.({ models: [{ id: 'm', enabled: true }] })
  const adapterRegistration = fake.registrations.find(registration => registration.replace)
  expect(fake.llm.registerAdapter).toHaveBeenCalledTimes(1)
  fake.watchers[0]?.({ models: [] })
  expect(adapterRegistration?.replace).toHaveBeenLastCalledWith([])
  fake.cleanups.forEach(cleanup => cleanup())
  expect(fake.watcherCleanups[0]).toHaveBeenCalled()
  expect(fake.watchers).toHaveLength(0)
  for (const registration of fake.registrations) expect(registration).toHaveBeenCalled()
})

test('registers a QiniuAdapter accepted by the native DSH llm runtime', () => {
  const fake = fakeContext()
  apply(fake.ctx, { nativeStream: async function* () {} })
  fake.watchers[0]?.({ models: [{ id: 'm', enabled: true }] })

  const adapter = fake.llm.registerAdapter.mock.calls[0]?.[1]
  expect(adapter).toBeInstanceOf(LlmAdapter)
})

test('reports the native delegate as unavailable when composition does not provide one', async () => {
  const fake = fakeContext()
  apply(fake.ctx)
  fake.watchers[0]?.({ models: [{ id: 'm', enabled: true }] })

  const adapter = fake.llm.registerAdapter.mock.calls[0]?.[1]
  await expect(Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages: [] }))).rejects.toThrow(
    'qiniu-maas native DSH provider delegate is unavailable',
  )
})

test('does not register a plaintext API-key RPC', () => {
  const fake = fakeContext()
  apply(fake.ctx, { nativeStream: async function* () {} })
  expect(fake.handlers.has('qiniu-maas/use-api-key')).toBe(false)
})

test('rejects malformed model-details, usage, and settings RPC payloads', async () => {
  const fake = fakeContext()
  apply(fake.ctx, { nativeStream: async function* () {} })
  await expect(fake.handlers.get('qiniu-maas/model-details')?.({ id: 7 })).resolves.toEqual({ code: 'INVALID_PAYLOAD' })
  await expect(fake.handlers.get('qiniu-maas/usage')?.({ start: 7 })).resolves.toEqual({ code: 'INVALID_PAYLOAD' })
  await expect(fake.handlers.get('qiniu-maas/update-settings')?.({ settings: { models: [{ id: 'm', enabled: 'yes' }] } })).resolves.toEqual({ ok: false, code: 'INVALID_SETTINGS' })
})

test('discovery checks supported provider, handles omitted provider, and forwards cancellation signal', async () => {
  const fake = fakeContext()
  const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    expect(init?.signal).toBe(signal)
    return new Response(JSON.stringify({ status: true, data: [] }))
  })
  apply(fake.ctx, { nativeStream: async function* () {}, fetch: fetcher })
  const discovery = fake.llm.registerModelDiscovery.mock.calls[0]?.[1] as (request: { provider?: string; signal?: AbortSignal }) => Promise<unknown>
  const controller = new AbortController()
  const signal = controller.signal
  await expect(discovery({ provider: undefined, signal })).resolves.toEqual([])
  await expect(discovery({ provider: 'other', signal })).resolves.toEqual([])
  await expect(discovery({ provider: 'qiniu-maas', signal })).resolves.toEqual([])
  expect(fetcher).toHaveBeenCalledTimes(1)
})

test('settings schema requires models behaviorally as declared', () => {
  expect(QiniuSettingsSchema.toJSON().required).toContain('models')
  expect(() => QiniuSettingsSchema({ defaultModel: 'm' })).toThrow(/models/)
})
