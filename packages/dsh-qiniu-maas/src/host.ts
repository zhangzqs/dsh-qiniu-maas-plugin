import { MaaSClient } from '@qiniu/maas-sdk'
import { QiniuAdapter, buildProviderSnapshot, createQiniuProviderState } from './provider.js'
import { QINIU_CREDENTIAL_REFS, QINIU_SETTINGS_NS, QiniuSettingsSchema, normalizeQiniuSettings } from './settings.js'
import type { GenerateOptions, NativeProviderDelegate, StreamChunk } from './provider.js'

export interface QiniuHostConfig {
  nativeStream?: NativeProviderDelegate
  fetch?: typeof globalThis.fetch
}

type Registration = { dispose?: () => void; replace?: (routes: readonly string[]) => void } | (() => void)
type SettingsScope = {
  get: () => unknown
  watch: (callback: (value: unknown) => void) => () => void
  dispose: () => void
}
type LlmService = {
  registerConfigurableProviders: (entries: readonly typeof providerEntry[]) => Registration
  registerAdapter: (routes: readonly string[], adapter: QiniuAdapter) => Registration
  registerModelDiscovery?: (provider: string, callback: (request: DiscoveryRequest) => Promise<readonly QiniuDiscoveryModel[]>) => Registration
}
type CredentialsService = {
  resolve: (ref: string) => Promise<{ value?: string } | undefined>
  describe: (ref: string) => Promise<{ configured: boolean; writable: boolean }>
}
type SettingsService = {
  register: (namespace: string, schema: typeof QiniuSettingsSchema, options: { base: unknown }) => SettingsScope
  replace: (namespace: string, value: unknown) => Promise<void>
}
type HarnessService = {
  handle: (name: string, handler: (args?: unknown) => unknown) => () => void
}
type ContextLike = {
  llm: LlmService
  get: (name: string) => unknown
  effect: (callback: () => void | (() => void), name?: string) => unknown
}
type DiscoveryRequest = { provider: string; signal?: AbortSignal }
type QiniuDiscoveryModel = { id: string; name: string; contextWindow?: number; maxTokens?: number }

const providerEntry = {
  provider: QINIU_SETTINGS_NS,
  displayName: 'Qiniu MaaS',
  settingsNs: QINIU_SETTINGS_NS,
  settingsPath: [],
}

export const inject = ['llm'] as const

function disposeRegistration(registration: Registration | undefined): void {
  if (typeof registration === 'function') registration()
  else registration?.dispose?.()
}

function fetchFor(ctx: ContextLike, config: QiniuHostConfig): typeof globalThis.fetch {
  return config.fetch ?? (ctx.get('fetch') as typeof globalThis.fetch | undefined) ?? globalThis.fetch
}

function managementClient(ctx: ContextLike, config: QiniuHostConfig, signal?: AbortSignal): MaaSClient {
  return new MaaSClient({ fetch: fetchFor(ctx, config), accessKey: undefined, secretKey: undefined, signal })
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

export function apply(ctx: ContextLike, config: QiniuHostConfig = {}): void {
  let state = createQiniuProviderState(normalizeQiniuSettings({ models: [], defaultModel: undefined }))
  const settingsService = ctx.get('settings') as SettingsService | undefined
  const adapter = new QiniuAdapter({
    snapshot: state.snapshot,
    resolveApiKey: () => credential(ctx, QINIU_CREDENTIAL_REFS.inferenceApiKey),
    delegate: async (options: GenerateOptions & { apiKey: string }): Promise<AsyncIterable<StreamChunk>> => {
      if (!config.nativeStream) throw new Error('qiniu-maas native DSH provider delegate is unavailable')
      return config.nativeStream(options)
    },
  })
  let adapterRegistration: Registration | undefined
  let directoryRegistration: Registration | undefined
  let discoveryRegistration: Registration | undefined
  let stopWatching: (() => void) | undefined
  const rebuild = (next: unknown): void => {
    const nextSettings = normalizeQiniuSettings(next)
    const routes = buildProviderSnapshot(nextSettings).models.length > 0 ? [QINIU_SETTINGS_NS] : []
    if (!directoryRegistration) directoryRegistration = ctx.llm.registerConfigurableProviders([providerEntry])
    if (adapterRegistration && typeof adapterRegistration !== 'function') adapterRegistration.replace?.(routes)
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
      const models = await managementClient(ctx, config, request.signal).listModels({ signal: request.signal })
      return models.map(model => ({ id: model.id, name: model.name, contextWindow: model.contextWindow, maxTokens: model.maxOutputTokens }))
    })
  }
  ctx.effect(() => () => {
    stopWatching?.()
    scope?.dispose()
    disposeRegistration(discoveryRegistration)
    disposeRegistration(adapterRegistration)
    disposeRegistration(directoryRegistration)
  }, 'qiniu-maas lifecycle')

  const harness = ctx.get('harness') as HarnessService | undefined
  const credentials = () => ctx.get('credentials') as CredentialsService | undefined
  if (!harness) return
  const hasManagementCredentials = async (): Promise<boolean> => Boolean(await credential(ctx, QINIU_CREDENTIAL_REFS.accessKey) && await credential(ctx, QINIU_CREDENTIAL_REFS.secretKey))
  const withManagement = async <T>(operation: (client: MaaSClient) => Promise<T>): Promise<T | { code: 'AK_SK_REQUIRED' }> => {
    if (!await hasManagementCredentials()) return { code: 'AK_SK_REQUIRED' }
    const service = credentials()
    if (!service) return { code: 'AK_SK_REQUIRED' }
    const client = new MaaSClient({ fetch: fetchFor(ctx, config), accessKey: (await service.resolve(QINIU_CREDENTIAL_REFS.accessKey))?.value, secretKey: (await service.resolve(QINIU_CREDENTIAL_REFS.secretKey))?.value })
    return operation(client)
  }
  const handles = [
    harness.handle('qiniu-maas/list-models', () => managementClient(ctx, config).listModels()),
    harness.handle('qiniu-maas/model-details', args => { const id = stringArg(args, 'id'); return id ? managementClient(ctx, config).getModelDetails(id) : Promise.resolve({ code: 'INVALID_PAYLOAD' as const }) }),
    harness.handle('qiniu-maas/list-api-keys', () => withManagement(client => client.listApiKeys())),
    harness.handle('qiniu-maas/usage', args => { const params = usageArgs(args); return params ? withManagement(client => client.getUsage(params)) : Promise.resolve({ code: 'INVALID_PAYLOAD' as const }) }),
    harness.handle('qiniu-maas/update-settings', async args => { const settings = record(args)?.settings; if (!settingsService || !settings) return { ok: false as const, code: 'INVALID_SETTINGS' as const }; try { const normalized = normalizeQiniuSettings(settings); await settingsService.replace(QINIU_SETTINGS_NS, normalized); return { ok: true as const } } catch { return { ok: false as const, code: 'INVALID_SETTINGS' as const } } }),
    harness.handle('qiniu-maas/credential-status', async () => { const service = credentials(); const describe = async (ref: string) => service ? service.describe(ref) : { configured: false, writable: false }; return { accessKey: await describe(QINIU_CREDENTIAL_REFS.accessKey), secretKey: await describe(QINIU_CREDENTIAL_REFS.secretKey), inferenceApiKey: await describe(QINIU_CREDENTIAL_REFS.inferenceApiKey) } }),
  ]
  ctx.effect(() => () => { for (const dispose of handles) dispose() }, 'qiniu-maas rpc')
}

export const name = QINIU_SETTINGS_NS
