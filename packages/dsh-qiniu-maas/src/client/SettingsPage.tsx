import { ModelMarketplace, type MarketplaceModel, type ModelSelection } from './ModelMarketplace.js'
import { ApiKeyPanel, type ApiKeySummary } from './ApiKeyPanel.js'
import { UsagePanel, type UsageViewState } from './UsagePanel.js'

function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}

export interface SettingsPageProps {
  settings?: { getSnapshot: () => { value?: { models?: readonly ModelSelection[] } } }
  actions?: { load?: () => unknown; listModels?: () => unknown; addModel?: (model: MarketplaceModel) => void | Promise<void>; updateSelection?: (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => void | Promise<void>; useApiKey?: (key: ApiKeySummary) => void | Promise<unknown>; setManualApiKey?: (value: string) => void | Promise<unknown> }
  models?: readonly MarketplaceModel[]
  selections?: readonly ModelSelection[]
  apiKeys?: readonly ApiKeySummary[]
  usage?: UsageViewState
  onSelectionChange?: (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => void
  onUpdateSelection?: (id: string, patch: Partial<ModelSelection>) => void
  onRemoveSelection?: (id: string) => void
  onAddModel?: (model: MarketplaceModel) => void
  onModelDetails?: (model: MarketplaceModel) => void
  onUseApiKey?: (key: ApiKeySummary) => void
  onManualApiKey?: (value: string) => void
  manualApiKey?: string
  runtime?: { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState; query: string }
  useSnapshot?: () => { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState }
}

export function SettingsPage(props: SettingsPageProps): unknown {
  const injectedSelections = props.settings?.getSnapshot().value?.models
  const selections = props.selections ?? injectedSelections ?? []
  const actions = props.actions ?? {}
  const observed = props.useSnapshot?.()
  const runtime = props.runtime
  const models = props.models ?? observed?.models ?? runtime?.models ?? []
  const apiKeys = props.apiKeys ?? observed?.apiKeys ?? runtime?.apiKeys ?? []
  const usage = props.usage ?? observed?.usage ?? runtime?.usage ?? { kind: 'unavailable' as const }
  const change = (id: string, patch: Partial<ModelSelection> & { remove?: boolean }): void => {
    if (patch.remove) props.onRemoveSelection?.(id)
    else props.onUpdateSelection?.(id, patch)
    if (props.onUpdateSelection === undefined && props.onRemoveSelection === undefined) void actions.updateSelection?.(id, patch)
    props.onSelectionChange?.(id, patch)
  }
  const addModel = props.onAddModel ?? (model => { void actions.addModel?.(model) })
  return el('div', { className: 'qiniu-settings' },
    ModelMarketplace({ models, selections, onAdd: addModel, onDetails: props.onModelDetails, onRefresh: () => { void (actions.load ?? actions.listModels)?.() } }),
    el('section', { className: 'qiniu-enabled-models' },
      el('h2', null, 'Enabled models'),
      ...selections.map(selection => el('div', { key: selection.id, className: 'qiniu-enabled-model' },
        el('strong', null, selection.id),
        el('span', null, selection.enabled ? ' Enabled' : ' Disabled'),
        el('button', { type: 'button', onClick: () => change(selection.id, { enabled: !selection.enabled }) }, selection.enabled ? 'Disable' : 'Enable'),
        el('span', null, 'contextWindow'),
        el('input', { type: 'number', name: 'contextWindow', 'aria-label': 'contextWindow', value: selection.contextWindow ?? '', min: 1, onChange: (event: { target: { value: string } }) => change(selection.id, { contextWindow: event.target.value ? Number(event.target.value) : undefined }) }),
        el('span', null, 'maxOutputTokens'),
        el('input', { type: 'number', name: 'maxOutputTokens', 'aria-label': 'maxOutputTokens', value: selection.maxOutputTokens ?? '', min: 1, onChange: (event: { target: { value: string } }) => change(selection.id, { maxOutputTokens: event.target.value ? Number(event.target.value) : undefined }) }),
        el('button', { type: 'button', onClick: () => change(selection.id, { remove: true }) }, 'Remove'),
      )),
    ),
    ApiKeyPanel({ keys: apiKeys, onUse: props.onUseApiKey ?? (key => { void actions.useApiKey?.(key) }), onManualEntry: props.onManualApiKey ?? (value => { void actions.setManualApiKey?.(value) }), manualValue: props.manualApiKey }),
    UsagePanel({ state: usage }),
  )
}
