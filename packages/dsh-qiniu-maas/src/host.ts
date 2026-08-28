import type { IncomingMessage, ServerResponse } from 'node:http'
import type { LlmAdapter } from '@deepseek-ai/dsh-llm'
import { ModelMarketplaceClient, QiniuMaaSClient } from 'qiniu-maas-sdk'
import { mapApiKeys, mapBill, mapMarketModels, mapUsage } from './maas-adapter.js'
import { QiniuAdapter, buildProviderSnapshot, createQiniuProviderState } from './provider.js'
import { QINIU_CREDENTIAL_REFS, QINIU_SETTINGS_NS, QiniuSettingsSchema, normalizeQiniuSettings } from './settings.js'
export interface QiniuHostConfig {
  fetch?: typeof globalThis.fetch
}

type CallableRegistration = (() => void) & { replace?: (routes: readonly string[]) => void }
type Registration = CallableRegistration
type SettingsScope = {
  get: () => unknown
  watch: (callback: (value: unknown) => void) => () => void
}
type LlmService = {
  registerConfigurableProviders: (entries: readonly typeof providerEntry[]) => Registration
  registerAdapter: (routes: readonly string[], adapter: LlmAdapter) => Registration
  registerModelDiscovery?: (provider: string, callback: (request: DiscoveryRequest) => Promise<readonly QiniuDiscoveryModel[]>) => Registration
}
type CredentialsService = {
  resolve: (ref: string) => Promise<{ value?: string } | undefined>
  describe: (ref: string) => Promise<{ configured: boolean; writable: boolean }>
  set?: (ref: string, value: string) => Promise<void>
}
type SettingsService = {
  register: (namespace: string, schema: typeof QiniuSettingsSchema, options: { base: unknown }) => SettingsScope
  replace: (namespace: string, value: unknown) => Promise<void>
}
type HarnessService = {
  handle: (name: string, handler: (args?: unknown) => unknown) => () => void
}
type WebServer = {
  register: (route: { kind: 'prefix'; path: string; handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void> }) => () => void
}
type ContextLike = {
  llm: LlmService
  webServer: WebServer
  get: (name: string) => unknown
  effect: (callback: () => void | (() => void), name?: string) => unknown
}
type DiscoveryRequest = { provider?: string; signal?: AbortSignal }
type QiniuDiscoveryModel = { id: string; name: string; contextWindow?: number; maxTokens?: number }

const providerEntry = {
  provider: QINIU_SETTINGS_NS,
  displayName: 'Qiniu MaaS',
  settingsNs: QINIU_SETTINGS_NS,
  settingsPath: [],
}

export const inject = ['llm', 'webServer', 'settings', 'credentials'] as const

function disposeRegistration(registration: Registration | undefined): void {
  registration?.()
}

function replaceRegistration(registration: Registration, routes: readonly string[]): void {
  if (typeof registration.replace === 'function') registration.replace(routes)
  else registration()
}

function fetchFor(ctx: ContextLike, config: QiniuHostConfig): typeof globalThis.fetch {
  return config.fetch ?? (ctx.get('fetch') as typeof globalThis.fetch | undefined) ?? globalThis.fetch
}

function marketClient(ctx: ContextLike, config: QiniuHostConfig): ModelMarketplaceClient {
  return new ModelMarketplaceClient({ fetch: fetchFor(ctx, config) })
}

async function credential(ctx: ContextLike, ref: string): Promise<string | undefined> {
  const credentials = ctx.get('credentials') as CredentialsService | undefined
  return credentials ? (await credentials.resolve(ref))?.value : undefined
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined
}
function stringArg(args: unknown, key: string): string | undefined {
  const value = record(args)?.[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}
function apiKeyArg(args: unknown): string | undefined {
  const value = stringArg(args, 'value')
  return value && value.trim() && !/[*…]|\.\.\./.test(value) ? value : undefined
}
function managementCredentialArg(args: unknown, key: string): string | undefined {
  const value = stringArg(args, key)
  return value && value.trim() && !/[*…]|\.\.\./.test(value) ? value : undefined
}
function usageArgs(args: unknown): Record<string, string> | undefined {
  const value = record(args)
  if (!value) return undefined
  const result: Record<string, string> = {}
  for (const key of ['start', 'end', 'g', 'api_key']) {
    if (value[key] !== undefined && typeof value[key] !== 'string') return undefined
    if (typeof value[key] === 'string') result[key] = value[key]
  }
  return result
}

function billArgs(args: unknown): { start: string; end: string; grain: 'month' | 'day' | 'hour' | 'five_minute' | 'minute'; api_key?: string } | undefined {
  const value = record(args)
  if (!value || typeof value.start !== 'string' || typeof value.end !== 'string' || typeof value.grain !== 'string') return undefined
  if (!['month', 'day', 'hour', 'five_minute', 'minute'].includes(value.grain)) return undefined
  const result: { start: string; end: string; grain: 'month' | 'day' | 'hour' | 'five_minute' | 'minute'; api_key?: string } = { start: value.start, end: value.end, grain: value.grain as 'month' | 'day' | 'hour' | 'five_minute' | 'minute' }
  if (value.api_key !== undefined) {
    if (typeof value.api_key !== 'string' || !value.api_key.trim() || /[*…]|\.\.\./.test(value.api_key)) return undefined
    result.api_key = value.api_key
  }
  return result
}

export function apply(ctx: ContextLike, config: QiniuHostConfig = {}): void {
  let state = createQiniuProviderState(normalizeQiniuSettings({ models: [], defaultModel: undefined }))
  const settingsService = ctx.get('settings') as SettingsService | undefined
  const adapter = new QiniuAdapter({
    snapshot: state.snapshot,
    resolveApiKey: () => credential(ctx, QINIU_CREDENTIAL_REFS.inferenceApiKey),
    fetch: fetchFor(ctx, config),
  })
  let adapterRegistration: Registration | undefined
  let directoryRegistration: Registration | undefined
  let discoveryRegistration: Registration | undefined
  let stopWatching: (() => void) | undefined
  const rebuild = (next: unknown): void => {
    const nextSettings = normalizeQiniuSettings(next)
    const routes = buildProviderSnapshot(nextSettings).models.length > 0 ? [QINIU_SETTINGS_NS] : []
    if (!directoryRegistration) directoryRegistration = ctx.llm.registerConfigurableProviders([providerEntry])
    if (adapterRegistration) replaceRegistration(adapterRegistration, routes)
    else if (routes.length > 0) adapterRegistration = ctx.llm.registerAdapter(routes, adapter)
    state.replace(nextSettings)
  }
  let scope: SettingsScope | undefined
  if (settingsService) {
    scope = settingsService.register(QINIU_SETTINGS_NS, QiniuSettingsSchema, { base: { models: [], defaultModel: undefined } })
    rebuild(scope.get())
    stopWatching = scope.watch(rebuild)
  } else rebuild({ models: [], defaultModel: undefined })
  if (ctx.llm.registerModelDiscovery) {
    discoveryRegistration = ctx.llm.registerModelDiscovery(QINIU_SETTINGS_NS, async (request) => {
      if (request.provider !== QINIU_SETTINGS_NS) return []
      const models = mapMarketModels(await marketClient(ctx, config).getMarketModels(undefined, { signal: request.signal }))
      return models.map(model => ({ id: model.id, name: model.name, contextWindow: model.contextWindow, maxTokens: model.maxOutputTokens }))
    })
  }
  ctx.effect(() => () => {
    stopWatching?.()
    disposeRegistration(discoveryRegistration)
    disposeRegistration(adapterRegistration)
    disposeRegistration(directoryRegistration)
  }, 'qiniu-maas lifecycle')

  const credentials = () => ctx.get('credentials') as CredentialsService | undefined
  const hasManagementCredentials = async (): Promise<boolean> => Boolean(await credential(ctx, QINIU_CREDENTIAL_REFS.accessKey) && await credential(ctx, QINIU_CREDENTIAL_REFS.secretKey))
  const withManagement = async <T>(operation: (client: QiniuMaaSClient) => Promise<T>): Promise<T | { code: 'AK_SK_REQUIRED' }> => {
    if (!await hasManagementCredentials()) return { code: 'AK_SK_REQUIRED' }
    const service = credentials()
    if (!service) return { code: 'AK_SK_REQUIRED' }
    const client = new QiniuMaaSClient({ fetch: fetchFor(ctx, config), accessKey: (await service.resolve(QINIU_CREDENTIAL_REFS.accessKey))?.value ?? '', secretKey: (await service.resolve(QINIU_CREDENTIAL_REFS.secretKey))?.value ?? '' })
    return operation(client)
  }
  const handlers: Record<string, (args?: unknown) => unknown> = {
    'set-management-credentials': async args => {
      const accessKey = managementCredentialArg(args, 'accessKey')
      const secretKey = managementCredentialArg(args, 'secretKey')
      const service = credentials()
      if (!accessKey || !secretKey || !service?.set) return { ok: false as const, code: 'INVALID_MANAGEMENT_CREDENTIALS' as const }
      try { await service.set(QINIU_CREDENTIAL_REFS.accessKey, accessKey); await service.set(QINIU_CREDENTIAL_REFS.secretKey, secretKey); return { ok: true as const } } catch { return { ok: false as const, code: 'CREDENTIAL_WRITE_FAILED' as const } }
    },
    'set-inference-api-key': async args => { const value = apiKeyArg(args); const service = credentials(); if (!value || !service?.set) return { ok: false as const, code: 'INVALID_API_KEY' as const }; try { await service.set(QINIU_CREDENTIAL_REFS.inferenceApiKey, value); return { ok: true as const } } catch { return { ok: false as const, code: 'CREDENTIAL_WRITE_FAILED' as const } } },
    'list-models': async () => mapMarketModels(await marketClient(ctx, config).getMarketModels()),
    'model-details': async args => { const id = stringArg(args, 'id'); if (!id) return { code: 'INVALID_PAYLOAD' as const }; return (await handlers['list-models']() as Awaited<ReturnType<typeof mapMarketModels>>).find(model => model.id === id) },
    'list-api-keys': () => withManagement(async client => mapApiKeys(await client.listApiKeys())),
    'usage': args => { const params = usageArgs(args); return params ? withManagement(async client => mapUsage(await client.getUsage(params))) : Promise.resolve({ code: 'INVALID_PAYLOAD' as const }) },
    'get-bill': args => { const params = billArgs(args); return params ? withManagement(async client => mapBill(await client.getBillByRange(params))) : Promise.resolve({ code: 'INVALID_PAYLOAD' as const }) },
    'update-settings': async args => { const settings = record(args)?.settings; if (!settingsService || !settings) return { ok: false as const, code: 'INVALID_SETTINGS' as const }; try { const normalized = normalizeQiniuSettings(settings); await settingsService.replace(QINIU_SETTINGS_NS, normalized); return { ok: true as const } } catch { return { ok: false as const, code: 'INVALID_SETTINGS' as const } } },
    'credential-status': async () => { const service = credentials(); const describe = async (ref: string) => service ? service.describe(ref) : { configured: false, writable: false }; return { accessKey: await describe(QINIU_CREDENTIAL_REFS.accessKey), secretKey: await describe(QINIU_CREDENTIAL_REFS.secretKey), inferenceApiKey: await describe(QINIU_CREDENTIAL_REFS.inferenceApiKey) } },
  }
  const harness = ctx.get('harness') as HarnessService | undefined
  const handles = harness ? Object.entries(handlers).map(([name, handler]) => harness.handle(`qiniu-maas/${name}`, handler)) : []
  const webServer = ctx.webServer
  const routeDisposer = webServer.register({ kind: 'prefix', path: '/api/qiniu-maas', handler: async (req, res) => {
    if (req.method !== 'POST') { res.writeHead(405); res.end('method not allowed'); return }
    const endpoint = new URL(req.url ?? '/', 'http://dsh.local').pathname.slice('/api/qiniu-maas/'.length)
    const handler = endpoint && handlers[endpoint]
    if (!handler) { res.writeHead(404); res.end('not found'); return }
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    let message: { rpcId?: unknown; method?: unknown; payload?: unknown }
    try { message = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { res.writeHead(400); res.end('body is not JSON'); return }
    if (message.method !== `qiniu-maas/${endpoint}` || typeof message.rpcId !== 'string') { res.writeHead(400); res.end('invalid request'); return }
    try {
      const value = await handler(message.payload)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result: { ok: true, value } }))
    } catch {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ type: 'server-response', rpcId: message.rpcId, result: { ok: false, error: { code: 'handler-failure', message: 'Qiniu MaaS request failed' } } }))
    }
  }})
  ctx.effect(() => () => { for (const dispose of handles) dispose(); routeDisposer?.() }, 'qiniu-maas rpc')
}

export const name = QINIU_SETTINGS_NS
