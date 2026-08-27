import { ModelMarketplace, type MarketplaceModel, type ModelSelection } from './ModelMarketplace.js'
import { ApiKeyPanel, type ApiKeySummary } from './ApiKeyPanel.js'
import { UsagePanel, type UsageViewState } from './UsagePanel.js'

function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}

type CredentialStatus = { accessKey: { configured: boolean; writable: boolean }; secretKey: { configured: boolean; writable: boolean }; inferenceApiKey: { configured: boolean; writable: boolean } }
type ModelDetailsState = { kind: 'loading' | 'unavailable' | 'error' | 'success'; model?: MarketplaceModel; message?: string }

function CredentialStatusPanel(props: { status?: CredentialStatus }): unknown {
  const status = props.status
  const state = status === undefined ? 'Loading credential status...' : status.accessKey.configured && status.secretKey.configured ? 'AK/SK credentials configured.' : 'AK/SK credentials required for management data.'
  return el('section', { className: 'qiniu-credential-status', 'aria-live': 'polite' }, el('h2', null, 'Credential status'), el('p', null, state), status ? el('ul', null,
    el('li', null, `Access Key: ${status.accessKey.configured ? 'configured' : 'not configured'}`),
    el('li', null, `Secret Key: ${status.secretKey.configured ? 'configured' : 'not configured'}`),
    el('li', null, `Inference API Key: ${status.inferenceApiKey.configured ? 'configured' : 'not configured'}`),
  ) : null)
}

function ModelDetailsPanel(props: { state?: ModelDetailsState }): unknown {
  const state = props.state
  if (!state) return null
  const text = state.kind === 'loading' ? 'Loading model details...' : state.kind === 'error' ? state.message ?? 'Unable to load model details.' : state.kind === 'unavailable' ? 'Model details unavailable.' : state.model ? `${state.model.name}: ${state.model.description ?? 'No description available.'}` : 'Model details loaded.'
  return el('section', { className: 'qiniu-model-details', 'aria-live': 'polite' }, el('h2', null, 'Model details'), el('p', null, text))
}

export interface SettingsPageProps {
  settings?: { getSnapshot: () => { value?: { models?: readonly ModelSelection[] } } }
  actions?: { load?: () => unknown; refresh?: () => unknown; listModels?: () => unknown; modelDetails?: (id: string) => unknown; setQuery?: (query: string) => void; addModel?: (model: MarketplaceModel) => void | Promise<void>; updateSelection?: (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => void | Promise<void>; useApiKey?: (key: ApiKeySummary) => void | Promise<unknown>; setManualApiKey?: (value: string) => void | Promise<unknown> }
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
  runtime?: { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState; query: string; credentialStatus?: CredentialStatus; modelDetails?: ModelDetailsState }
  useSnapshot?: () => { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState; query?: string; credentialStatus?: CredentialStatus; modelDetails?: ModelDetailsState }
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
  const query = observed?.query ?? runtime?.query ?? ''
  const credentialStatus = observed?.credentialStatus ?? runtime?.credentialStatus
  const modelDetails = observed?.modelDetails ?? runtime?.modelDetails
  const change = (id: string, patch: Partial<ModelSelection> & { remove?: boolean }): void => {
    if (patch.remove) props.onRemoveSelection?.(id)
    else props.onUpdateSelection?.(id, patch)
    if (props.onUpdateSelection === undefined && props.onRemoveSelection === undefined) void actions.updateSelection?.(id, patch)
    props.onSelectionChange?.(id, patch)
  }
  const addModel = props.onAddModel ?? (model => { void actions.addModel?.(model) })
  const showDetails = props.onModelDetails ?? (model => { void actions.modelDetails?.(model.id) })
  return el('div', { className: 'qiniu-settings' },
    ModelMarketplace({ models, selections, query, onQueryChange: actions.setQuery, onAdd: addModel, onDetails: showDetails, onRefresh: () => { void (actions.refresh ?? actions.load ?? actions.listModels)?.() } }),
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
    ModelDetailsPanel({ state: modelDetails }),
    CredentialStatusPanel({ status: credentialStatus }),
  )
}
