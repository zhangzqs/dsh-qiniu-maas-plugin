import { SettingsPage } from './SettingsPage.js'
import { qiniuStyles } from './styles.js'
import { createModelSelection, updateModelSelection, type MarketplaceModel, type ModelSelection } from './ModelMarketplace.js'
import { canUseApiKey, clearManualApiKeyDrafts } from './ApiKeyPanel.js'
import type { ApiKeySummary } from './ApiKeyPanel.js'
import { mapRpcError } from './UsagePanel.js'
import type { UsageViewState } from './UsagePanel.js'
import { usageState } from './UsagePanel.js'
import { QINIU_CREDENTIAL_REFS } from '../settings.js'

export const injectClient = ['slots', 'locale', 'connection', 'remote', 'settingsScope', 'settingsSchema'] as const
export const inject = injectClient

type SettingsScope = { bind: (spec: { namespace: string }) => { getSnapshot: () => { value?: { models?: ModelSelection[] } }; subscribe?: (listener: () => void) => () => void; set: (field: string, value: unknown) => Promise<void> } }
type CredentialApi = { set: (request: { ref: string; value: string }) => Promise<unknown> }
type Connection = { api?: { credentials?: CredentialApi }; rpc?: { call: (channel: string, endpoint: string, payload: { args: Record<string, unknown> }) => Promise<unknown> } }
type CredentialState = { configured: boolean; writable: boolean }
type CredentialStatus = { accessKey: CredentialState; secretKey: CredentialState; inferenceApiKey: CredentialState }
type ModelDetailsState = { kind: 'loading' | 'unavailable' | 'error' | 'success'; model?: MarketplaceModel; message?: string }

type SettingsRuntime = {
  models: MarketplaceModel[]
  apiKeys: ApiKeySummary[]
  usage: UsageViewState
  query: string
  credentialStatus?: CredentialStatus
  credentialStatusError?: string
  marketplaceLoading: boolean
  marketplaceError?: string
  apiKeyError?: string
  modelDetails?: ModelDetailsState
  listeners: Set<() => void>
  settingsUnsubscribe?: () => void
}

type ClientContextLike = {
  slots: { inject: (name: string, callback: () => unknown) => unknown; register: (entry: Record<string, unknown>, component?: unknown) => unknown }
  locale: { register: (namespace: string, dictionaries: unknown) => unknown; bind: (namespace: string) => (key: string) => string }
  get?: (name: string) => unknown
  effect: (callback: () => unknown, name?: string) => unknown
}

function createRuntime(): SettingsRuntime {
  return { models: [], apiKeys: [], usage: { kind: 'loading' }, query: '', marketplaceLoading: false, listeners: new Set() }
}

async function hostCall(connection: Connection | undefined, endpoint: string, args: Record<string, unknown> = {}): Promise<unknown> {
  if (!connection?.rpc) return undefined
  const response = await connection.rpc.call('/api', endpoint, { args })
  if (response && typeof response === 'object' && 'ok' in response) {
    const envelope = response as { ok: boolean; value?: unknown; error?: unknown }
    return envelope.ok ? envelope.value : envelope.error
  }
  return response
}

function throwRpcError(value: unknown): unknown {
  if (value && typeof value === 'object' && 'code' in value) {
    const error = value as { code: unknown; message?: unknown }
    throw new Error(typeof error.message === 'string' ? error.message : String(error.code))
  }
  return value
}

export function createSettingsInject(ctx: ClientContextLike, runtime: SettingsRuntime = createRuntime()): Record<string, unknown> {
  const connection = ctx.get?.('connection') as Connection | undefined
  const scopeService = ctx.get?.('settingsScope') as SettingsScope | undefined
  const scope = scopeService?.bind({ namespace: 'qiniu-maas' })
  const settings = scope === undefined
    ? { getSnapshot: () => ({ value: undefined }) }
    : scope
  if (scope?.subscribe && runtime.settingsUnsubscribe === undefined) {
    runtime.settingsUnsubscribe = scope.subscribe(() => runtime.listeners.forEach(listener => listener()))
  }
  const update = async (models: ModelSelection[]): Promise<void> => { await scope?.set('models', models) }
  const actions = {
    listModels: async () => {
      const result = await hostCall(connection, 'qiniu-maas/list-models')
      if (Array.isArray(result)) runtime.models = result as MarketplaceModel[]
      runtime.listeners.forEach(listener => listener())
      return result
    },
    modelDetails: async (id: string) => {
      runtime.modelDetails = { kind: 'loading' }
      runtime.listeners.forEach(listener => listener())
      try {
        const result = await hostCall(connection, 'qiniu-maas/model-details', { id })
          if (result === undefined) runtime.modelDetails = { kind: 'unavailable' }
          else if (result && typeof result === 'object' && 'code' in result) runtime.modelDetails = { kind: 'error', message: String((result as { code: unknown }).code) }
          else runtime.modelDetails = { kind: 'success', model: result as MarketplaceModel }
        runtime.listeners.forEach(listener => listener())
        return result
      } catch (error) {
        runtime.modelDetails = { kind: 'error', message: error instanceof Error ? error.message : 'Unable to load model details.' }
        runtime.listeners.forEach(listener => listener())
        return error
      }
    },
    listApiKeys: async () => {
      const result = await hostCall(connection, 'qiniu-maas/list-api-keys')
      if (Array.isArray(result)) runtime.apiKeys = result as ApiKeySummary[]
      runtime.listeners.forEach(listener => listener())
      return result
    },
    credentialStatus: async () => {
      try {
        const result = await hostCall(connection, 'qiniu-maas/credential-status')
        if (result && typeof result === 'object' && 'accessKey' in result) {
          runtime.credentialStatus = result as CredentialStatus
          runtime.credentialStatusError = undefined
        } else if (result && typeof result === 'object' && 'code' in result) {
          runtime.credentialStatusError = String((result as { code: unknown }).code)
        }
        runtime.listeners.forEach(listener => listener())
        return result
      } catch (error) {
        runtime.credentialStatusError = error instanceof Error ? error.message : 'Unable to load credential status.'
        runtime.listeners.forEach(listener => listener())
        return error
      }
    },
    usage: async (args: Record<string, unknown> = {}) => {
      try {
        const result = await hostCall(connection, 'qiniu-maas/usage', args)
        runtime.usage = usageState(result)
        runtime.listeners.forEach(listener => listener())
        return result
      } catch (error) {
        runtime.usage = { kind: 'error', message: error instanceof Error ? error.message : 'Unable to load usage.' }
        runtime.listeners.forEach(listener => listener())
        return error
      }
    },
    load: async () => {
      const results = await Promise.allSettled([actions.listModels(), actions.listApiKeys(), actions.usage(), actions.credentialStatus()])
      return {
        models: runtime.models,
        apiKeys: runtime.apiKeys,
        usage: runtime.usage,
        credentialStatus: runtime.credentialStatus,
        results: results.map(result => result.status === 'fulfilled' ? result.value : result.reason),
      }
    },
    refresh: async () => actions.load(),
    setQuery: (query: string) => { runtime.query = query; runtime.listeners.forEach(listener => listener()) },
    addModel: async (model: MarketplaceModel) => {
      const current = settings.getSnapshot().value?.models ?? []
      if (!current.some(selection => selection.id === model.id)) await update([...current, createModelSelection(model.id)])
    },
    updateSelection: async (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => {
      const current = settings.getSnapshot().value?.models ?? []
      await update(updateModelSelection(current, id, patch))
    },
    useApiKey: async (key: ApiKeySummary) => {
      if (!key.enabled || !canUseApiKey(key.maskedValue)) throw new Error('A complete API key is required')
      return throwRpcError(await hostCall(connection, 'qiniu-maas/set-inference-api-key', { value: key.maskedValue }))
    },
    setManualApiKey: async (value: string) => {
      if (!canUseApiKey(value)) throw new Error('A complete API key is required')
      return throwRpcError(await hostCall(connection, 'qiniu-maas/set-inference-api-key', { value }))
    },
  }
  const snapshot = {
    getSnapshot: () => ({ models: runtime.models, apiKeys: runtime.apiKeys, usage: runtime.usage, query: runtime.query, credentialStatus: runtime.credentialStatus, credentialStatusError: runtime.credentialStatusError, modelDetails: runtime.modelDetails }),
    subscribe: (listener: () => void) => { runtime.listeners.add(listener); return () => runtime.listeners.delete(listener) },
  }
  const injected: Record<string, unknown> = { settings, actions, runtime, dispose: () => { runtime.settingsUnsubscribe?.(); clearManualApiKeyDrafts() }, hooks: { snapshot }, useSnapshot: () => {
    const react = (globalThis as { React?: { useSyncExternalStore?: (subscribe: (listener: () => void) => () => void, getSnapshot: () => unknown, getServerSnapshot?: () => unknown) => unknown } }).React
    return react?.useSyncExternalStore?.(snapshot.subscribe, snapshot.getSnapshot, snapshot.getSnapshot) ?? snapshot.getSnapshot()
  } }
  Object.defineProperties(injected, {
    models: { enumerable: true, get: () => runtime.models },
    apiKeys: { enumerable: true, get: () => runtime.apiKeys },
    usage: { enumerable: true, get: () => runtime.usage },
  })
  return injected
}

export function createSettingsPageEntry(injected: Record<string, unknown>): (ownerProps: Record<string, unknown>) => unknown {
  return (ownerProps: Record<string, unknown>): unknown => SettingsPage({
    ...injected,
    ...ownerProps,
  })
}

export function applyClient(ctx: ClientContextLike): void {
  ctx.effect(() => {
    const doc = (globalThis as { document?: { createElement?: (tag: string) => { textContent: string; remove: () => void }; head?: { appendChild: (node: unknown) => void } } }).document
    const style = doc?.createElement?.('style')
    if (!doc || !style) return
    style.textContent = qiniuStyles
    const head = doc.head
    if (head) head.appendChild(style)
    return () => style.remove()
  }, 'qiniu-maas: styles')
  const t = ctx.locale.bind('settings.qiniu-maas')
  const injected = createSettingsInject(ctx)
  ctx.effect(() => () => { (injected.dispose as (() => void) | undefined)?.() }, 'qiniu-maas: settings subscription')
  const actions = injected.actions as { load?: () => Promise<unknown> }
  void actions.load?.().catch(() => undefined)
  const SettingsPageEntry = createSettingsPageEntry(injected)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'qiniu-maas', order: 20,
    label: () => t('nav') || 'Qiniu MaaS',
    inject: () => injected,
  }, SettingsPageEntry))
}

export { applyClient as apply }

export { SettingsPage }
export { mapRpcError }
export type { ApiKeySummary, UsageViewState }
