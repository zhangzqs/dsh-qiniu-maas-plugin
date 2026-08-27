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
  const webServer = { register: vi.fn(() => vi.fn()) }
  const ctx = {
    llm,
    webServer,
    get: (name: string) => ({ settings, credentials, harness, fetch: fetch, llm, webServer } as Record<string, unknown>)[name],
    effect: (effect: () => void | (() => void)) => { const cleanup = effect(); if (typeof cleanup === 'function') cleanups.push(cleanup) },
  }
  return { ctx, cleanups, handlers, watcherCleanups, watchers, registrations, scope, llm, settings, credentials, harness, webServer }
}

test('registers the qiniu HTTP RPC prefix and disposes it with the host plugin', () => {
  const fake = fakeContext()
  apply(fake.ctx)
  expect(fake.webServer.register).toHaveBeenCalledWith(expect.objectContaining({ kind: 'prefix', path: '/api/qiniu-maas', handler: expect.any(Function) }))
  expect(fake.webServer.register).toHaveBeenCalledTimes(1)
  fake.cleanups.forEach(cleanup => cleanup())
  expect(fake.webServer.register.mock.results[0]?.value).toHaveBeenCalled()
})
test('web route responds with the shared handler result envelope', async () => {
  const fake = fakeContext()
  apply(fake.ctx)
  const route = fake.webServer.register.mock.calls[0]?.[0]
  const response = { writeHead: vi.fn(), end: vi.fn() }
  const request = {
    method: 'POST',
    url: '/api/qiniu-maas/credential-status',
    async *[Symbol.asyncIterator]() { yield Buffer.from(JSON.stringify({ type: 'client-request', rpcId: 'rpc-1', method: 'qiniu-maas/credential-status', payload: {} })) },
  }
  await route.handler(request as never, response as never)
  expect(response.writeHead).toHaveBeenCalledWith(200, { 'content-type': 'application/json' })
  expect(JSON.parse(response.end.mock.calls[0]?.[0] as string)).toMatchObject({ type: 'server-response', rpcId: 'rpc-1', result: { ok: true } })
})
test('exports the injected llm dependency from the package entrypoint', () => {
  expect(inject).toEqual(['llm', 'webServer', 'settings', 'credentials'])
})

test('replaces one callable adapter registration on settings changes and cleans up without scope disposal', () => {
  const fake = fakeContext()
  apply(fake.ctx)
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
  apply(fake.ctx)
  fake.watchers[0]?.({ models: [{ id: 'm', enabled: true }] })

  const adapter = fake.llm.registerAdapter.mock.calls[0]?.[1]
  expect(adapter).toBeInstanceOf(LlmAdapter)
})

test('reports the missing inference API key before making a request', async () => {
  const fake = fakeContext()
  apply(fake.ctx)
  fake.watchers[0]?.({ models: [{ id: 'm', enabled: true }] })

  const adapter = fake.llm.registerAdapter.mock.calls[0]?.[1]
  await expect(Array.fromAsync(adapter.stream({ provider: 'qiniu-maas', model: 'm', messages: [] }))).rejects.toThrow(
    'qiniu-maas inference API Key is not configured',
  )
})

test('does not register a plaintext API-key RPC', () => {
  const fake = fakeContext()
  apply(fake.ctx)
  expect(fake.handlers.has('qiniu-maas/use-api-key')).toBe(false)
})

test('sets both management credentials through the credentials service and rejects masked or blank values', async () => {
  const fake = fakeContext()
  apply(fake.ctx)
  const handler = fake.handlers.get('qiniu-maas/set-management-credentials')!
  await expect(handler({ accessKey: ' ', secretKey: 'secret' })).resolves.toEqual({ ok: false, code: 'INVALID_MANAGEMENT_CREDENTIALS' })
  await expect(handler({ accessKey: 'ak-****', secretKey: 'secret' })).resolves.toEqual({ ok: false, code: 'INVALID_MANAGEMENT_CREDENTIALS' })
  await expect(handler({ accessKey: 'ak-live', secretKey: 'sk-...1234' })).resolves.toEqual({ ok: false, code: 'INVALID_MANAGEMENT_CREDENTIALS' })
  await expect(handler({ accessKey: 'ak-live', secretKey: 'sk-live' })).resolves.toEqual({ ok: true })
  expect(fake.credentials.set).toHaveBeenNthCalledWith(1, 'QINIU_ACCESS_KEY', 'ak-live')
  expect(fake.credentials.set).toHaveBeenNthCalledWith(2, 'QINIU_SECRET_KEY', 'sk-live')
})
test('rejects masked inference API keys before credential writes', async () => {
  const fake = fakeContext()
  apply(fake.ctx)
  await expect(fake.handlers.get('qiniu-maas/set-inference-api-key')?.({ value: '****1234' })).resolves.toEqual({ ok: false, code: 'INVALID_API_KEY' })
  expect(fake.credentials.set).not.toHaveBeenCalled()
})
test('validates inference API-key payloads before credential writes', async () => {
  const fake = fakeContext()
  apply(fake.ctx)
  const handler = fake.handlers.get('qiniu-maas/set-inference-api-key')!
  await expect(handler({ value: '   ' })).resolves.toEqual({ ok: false, code: 'INVALID_API_KEY' })
  await expect(handler({ value: 'sk-...1234' })).resolves.toEqual({ ok: false, code: 'INVALID_API_KEY' })
  await expect(handler({ value: 'sk-live' })).resolves.toEqual({ ok: true })
  expect(fake.credentials.set).toHaveBeenCalledWith('QINIU_MAAS_API_KEY', 'sk-live')
})
test('rejects malformed model-details, usage, and settings RPC payloads', async () => {
  const fake = fakeContext()
  apply(fake.ctx)
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
