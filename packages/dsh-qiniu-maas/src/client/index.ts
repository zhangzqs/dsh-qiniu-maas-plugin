import { SettingsPage } from './SettingsPage.js'
import { qiniuStyles } from './styles.js'
import { createModelSelection, updateModelSelection, type MarketplaceModel, type ModelSelection } from './ModelMarketplace.js'
import type { ApiKeySummary } from './ApiKeyPanel.js'
import type { UsageViewState } from './UsagePanel.js'

export const injectClient = ['slots', 'locale', 'connection', 'remote', 'settingsScope', 'settingsSchema'] as const
export const inject = injectClient

type SettingsScope = { bind: (spec: { namespace: string }) => { getSnapshot: () => { value?: { models?: ModelSelection[] } }; set: (field: string, value: unknown) => Promise<void> } }
type Connection = { api?: unknown; rpc?: { call: (channel: string, endpoint: string, payload: { args: Record<string, unknown> }) => Promise<unknown> } }
type ClientContextLike = {
  slots: { inject: (name: string, callback: () => unknown) => unknown; register: (entry: Record<string, unknown>, component?: unknown) => unknown }
  locale: { register: (namespace: string, dictionaries: unknown) => unknown; bind: (namespace: string) => (key: string) => string }
  get?: (name: string) => unknown
  effect: (callback: () => unknown, name?: string) => unknown
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

export function createSettingsInject(ctx: ClientContextLike): Record<string, unknown> {
  const connection = ctx.get?.('connection') as Connection | undefined
  const scopeService = ctx.get?.('settingsScope') as SettingsScope | undefined
  const scope = scopeService?.bind({ namespace: 'qiniu-maas' })
  const settings = scope === undefined
    ? { getSnapshot: () => ({ value: undefined }) }
    : scope
  const update = async (models: ModelSelection[]): Promise<void> => { await scope?.set('models', models) }
  const actions = {
    listModels: () => hostCall(connection, 'qiniu-maas/list-models'),
    modelDetails: (id: string) => hostCall(connection, 'qiniu-maas/model-details', { id }),
    listApiKeys: () => hostCall(connection, 'qiniu-maas/list-api-keys'),
    credentialStatus: () => hostCall(connection, 'qiniu-maas/credential-status'),
    usage: (args: Record<string, unknown> = {}) => hostCall(connection, 'qiniu-maas/usage', args),
    addModel: async (model: MarketplaceModel) => {
      const current = settings.getSnapshot().value?.models ?? []
      await update([...current, createModelSelection(model.id)])
    },
    updateSelection: async (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => {
      const current = settings.getSnapshot().value?.models ?? []
      await update(updateModelSelection(current, id, patch))
    },
  }
  return { settings, actions }
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
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'qiniu-maas', order: 20,
    label: () => t('nav') || 'Qiniu MaaS',
    inject: () => createSettingsInject(ctx),
  }, SettingsPage))
}

export { SettingsPage }
export type { ApiKeySummary, UsageViewState }
