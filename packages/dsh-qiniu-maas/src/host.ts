import { MaaSClient } from '@qiniu/maas-sdk'
import { QiniuAdapter, buildProviderSnapshot, createQiniuProviderState } from './provider.js'
import { QINIU_CREDENTIAL_REFS, QINIU_SETTINGS_NS, QiniuSettingsSchema, normalizeQiniuSettings } from './settings.js'

export interface QiniuHostConfig {
  nativeStream?: (options: Record<string, unknown> & { apiKey: string }) => AsyncIterable<unknown> | Promise<AsyncIterable<unknown>>
  fetch?: typeof globalThis.fetch
}

type ContextLike = {
  get: (name: string) => any
  effect: (callback: () => void | (() => void), name?: string) => unknown
  inject?: (names: string[], callback: (ctx: any) => void) => void
}

const providerEntry = {
  provider: QINIU_SETTINGS_NS,
  displayName: 'Qiniu MaaS',
  settingsNs: QINIU_SETTINGS_NS,
  settingsPath: [],
}

function managementClient(ctx: ContextLike): MaaSClient {
  const fetcher = (ctx.get('fetch') as typeof fetch | undefined) ?? globalThis.fetch
  return new MaaSClient({
    fetch: fetcher,
    accessKey: undefined,
    secretKey: undefined,
  })
}

async function credential(ctx: ContextLike, ref: string): Promise<string | undefined> {
  const credentials = ctx.get('credentials')
  if (!credentials) return undefined
  return (await credentials.resolve(ref))?.value
}

export function apply(ctx: ContextLike, config: QiniuHostConfig = {}): void {
  let current = normalizeQiniuSettings({ models: [], defaultModel: undefined })
  let state = createQiniuProviderState(current)
  const settingsService = ctx.get('settings')
  const llm = ctx.get('llm')
  const adapter = new QiniuAdapter({
    snapshot: state.snapshot,
    resolveApiKey: () => credential(ctx, QINIU_CREDENTIAL_REFS.inferenceApiKey),
    delegate: async (options) => {
      if (!config.nativeStream) throw new Error('qiniu-maas native DSH provider delegate is unavailable')
      return config.nativeStream(options as Record<string, unknown> & { apiKey: string }) as any
    },
  })
  let adapterRegistration: any
  let directoryRegistration: any
  let discoveryRegistration: (() => void) | undefined
  let stopWatching: (() => void) | undefined
  const rebuild = (next: unknown): void => {
    const nextSettings = normalizeQiniuSettings(next)
    const nextSnapshot = buildProviderSnapshot(nextSettings)
    const routes = nextSnapshot.models.length > 0 ? [QINIU_SETTINGS_NS] : []
    if (llm) {
      if (!directoryRegistration) directoryRegistration = llm.registerConfigurableProviders([providerEntry])
      if (adapterRegistration) adapterRegistration.replace(routes)
      else if (routes.length > 0) adapterRegistration = llm.registerAdapter(routes, adapter)
    }
    current = nextSettings
    state.replace(current)
  }

  if (settingsService) {
    const scope = settingsService.register(QINIU_SETTINGS_NS, QiniuSettingsSchema, { base: current })
    rebuild(scope.get())
    stopWatching = scope.watch((next: unknown) => rebuild(next))
  } else {
    rebuild(current)
  }
  if (llm?.registerModelDiscovery) {
    discoveryRegistration = llm.registerModelDiscovery(QINIU_SETTINGS_NS, async () => {
      const models = await managementClient(ctx).listModels()
      return models.map(model => ({ id: model.id, name: model.name, contextWindow: model.contextWindow, maxTokens: model.maxOutputTokens }))
    })
  }

  ctx.effect(() => () => {
    stopWatching?.()
    discoveryRegistration?.()
    adapterRegistration?.()
    directoryRegistration?.()
  }, 'qiniu-maas lifecycle')

  const harness = ctx.get('harness')
  if (harness?.handle) {
    const hasManagementCredentials = async (): Promise<boolean> => Boolean(
      await credential(ctx, QINIU_CREDENTIAL_REFS.accessKey)
      && await credential(ctx, QINIU_CREDENTIAL_REFS.secretKey),
    )
    const withManagement = async <T>(operation: (client: MaaSClient) => Promise<T>): Promise<T | { code: 'AK_SK_REQUIRED' }> => {
      if (!await hasManagementCredentials()) return { code: 'AK_SK_REQUIRED' }
      const credentials = ctx.get('credentials')
      const client = new MaaSClient({
        fetch: config.fetch ?? globalThis.fetch,
        accessKey: (await credentials.resolve(QINIU_CREDENTIAL_REFS.accessKey))?.value,
        secretKey: (await credentials.resolve(QINIU_CREDENTIAL_REFS.secretKey))?.value,
      })
      return operation(client)
    }
    const describeCredential = async (ref: string): Promise<{ configured: boolean; writable: boolean }> => {
      const credentials = ctx.get('credentials')
      return credentials
        ? credentials.describe(ref)
        : { configured: false, writable: false }
    }
    const handles = [
      harness.handle('qiniu-maas/list-models', () => managementClient(ctx).listModels()),
      harness.handle('qiniu-maas/model-details', (args: { id: string }) => managementClient(ctx).getModelDetails(args.id)),
      harness.handle('qiniu-maas/list-api-keys', () => withManagement(client => client.listApiKeys())),
      harness.handle('qiniu-maas/use-api-key', async (args: { value?: string }) => {
        if (!await hasManagementCredentials()) return { code: 'AK_SK_REQUIRED' as const }
        if (typeof args?.value !== 'string' || args.value.length === 0) return { code: 'API_KEY_MANUAL_REQUIRED' as const }
        const credentials = ctx.get('credentials')
        await credentials.set(QINIU_CREDENTIAL_REFS.inferenceApiKey, args.value)
        return { ok: true as const }
      }),
      harness.handle('qiniu-maas/usage', (args: Record<string, unknown>) => withManagement(client => client.getUsage(args as any))),
      harness.handle('qiniu-maas/update-settings', async (args: { settings: unknown }) => {
        if (!settingsService || !args?.settings) return { ok: false as const, code: 'INVALID_SETTINGS' as const }
        await settingsService.replace(QINIU_SETTINGS_NS, args.settings)
        return { ok: true as const }
      }),
      harness.handle('qiniu-maas/credential-status', async () => ({
        accessKey: await describeCredential(QINIU_CREDENTIAL_REFS.accessKey),
        secretKey: await describeCredential(QINIU_CREDENTIAL_REFS.secretKey),
        inferenceApiKey: await describeCredential(QINIU_CREDENTIAL_REFS.inferenceApiKey),
      })),
    ]
    ctx.effect(() => () => { for (const dispose of handles) dispose?.() }, 'qiniu-maas rpc')
  }
}

export const name = QINIU_SETTINGS_NS
