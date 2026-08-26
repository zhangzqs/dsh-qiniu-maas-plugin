import { expect, test, vi } from 'vitest'
import { apply, inject } from '../src/host.js'
import { QiniuSettingsSchema } from '../src/settings.js'

function fakeContext() {
  const cleanups: Array<() => void> = []
  const handlers = new Map<string, (args?: unknown) => unknown>()
  const watcherCleanups: Array<() => void> = []
  const registrations: Array<{ replace?: (routes: unknown[]) => void; dispose: () => void }> = []
  const scope = {
    get: () => ({ models: [], defaultModel: undefined }),
    watch: (callback: (value: unknown) => void) => {
      watcherCleanups.push(() => callback)
      return () => watcherCleanups.shift()?.()
    },
    dispose: vi.fn(),
  }
  const llm = {
    registerConfigurableProviders: vi.fn(() => { const registration = { dispose: vi.fn() }; registrations.push(registration); return registration }),
    registerAdapter: vi.fn(() => { const registration = { replace: vi.fn(), dispose: vi.fn() }; registrations.push(registration); return registration }),
    registerModelDiscovery: vi.fn(() => { const registration = { dispose: vi.fn() }; registrations.push(registration); return registration }),
  }
  const settings = { register: vi.fn(() => scope), replace: vi.fn() }
  const credentials = { resolve: vi.fn(async () => undefined), describe: vi.fn(async () => ({ configured: false, writable: true })), set: vi.fn() }
  const harness = { handle: vi.fn((name: string, handler: (args?: unknown) => unknown) => { handlers.set(name, handler); return () => handlers.delete(name) }) }
  const ctx = {
    llm,
    get: (name: string) => ({ settings, credentials, harness, fetch: fetch, llm } as Record<string, unknown>)[name],
    effect: (effect: () => void | (() => void)) => { const cleanup = effect(); if (typeof cleanup === 'function') cleanups.push(cleanup) },
  }
  return { ctx, cleanups, handlers, watcherCleanups, registrations, scope, llm, settings, credentials, harness }
}

test('applies llm dependency and disposes settings watcher and every registration', async () => {
  expect(inject).toContain('llm')
  const fake = fakeContext()
  apply(fake.ctx, { nativeStream: async function* () {} })
  expect(fake.settings.register).toHaveBeenCalledWith('qiniu-maas', QiniuSettingsSchema, expect.any(Object))
  expect(fake.watcherCleanups).toHaveLength(1)
  fake.cleanups.forEach(cleanup => cleanup())
  expect(fake.scope.dispose).toHaveBeenCalled()
  expect(fake.watcherCleanups).toHaveLength(0)
  for (const registration of fake.registrations) expect(registration.dispose).toHaveBeenCalled()
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

test('discovery checks supported provider and forwards cancellation signal', async () => {
  const fake = fakeContext()
  const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    expect(init?.signal).toBe(signal)
    return new Response(JSON.stringify({ status: true, data: [] }))
  })
  apply(fake.ctx, { nativeStream: async function* () {}, fetch: fetcher })
  const discovery = fake.llm.registerModelDiscovery.mock.calls[0]?.[1] as (request: { provider: string; signal: AbortSignal }) => Promise<unknown>
  const controller = new AbortController()
  const signal = controller.signal
  await expect(discovery({ provider: 'other', signal })).resolves.toEqual([])
  await expect(discovery({ provider: 'qiniu-maas', signal })).resolves.toEqual([])
  expect(fetcher).toHaveBeenCalledTimes(1)
})

test('settings schema describes complete model fields and numeric constraints', () => {
  expect(QiniuSettingsSchema.toJSON()).toEqual({
    type: 'object',
    properties: {
      models: { type: 'array', items: { type: 'object', properties: {
        id: { type: 'string', minLength: 1 }, enabled: { type: 'boolean' },
        contextWindow: { type: 'number', minimum: 1 }, maxOutputTokens: { type: 'number', minimum: 1 },
      }, required: ['id', 'enabled'] } },
      defaultModel: { type: 'string', minLength: 1 },
    }, required: ['models'],
  })
  expect(() => QiniuSettingsSchema({ models: [{ id: 'm', enabled: true, contextWindow: 0 }] })).toThrow()
})
