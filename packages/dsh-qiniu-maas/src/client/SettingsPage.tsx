import type { ChangeEvent, ReactNode } from 'react'
import { ModelMarketplace, type MarketplaceModel, type ModelSelection } from './ModelMarketplace.js'
import { ApiKeyPanel, type ApiKeySummary } from './ApiKeyPanel.js'
import { UsagePanel, type UsageViewState } from './UsagePanel.js'

type CredentialStatus = { accessKey: { configured: boolean; writable: boolean }; secretKey: { configured: boolean; writable: boolean }; inferenceApiKey: { configured: boolean; writable: boolean } }
type ModelDetailsState = { kind: 'loading' | 'unavailable' | 'error' | 'success'; model?: MarketplaceModel; message?: string }

const managementDraft = { accessKey: '', secretKey: '' }

export function clearManagementCredentialDraft(): void {
  managementDraft.accessKey = ''
  managementDraft.secretKey = ''
}

function ManagementCredentialsPanel(props: { onSave?: (accessKey: string, secretKey: string) => void | Promise<unknown>; error?: string }): ReactNode {
  const save = async (): Promise<void> => {
    try {
      await props.onSave?.(managementDraft.accessKey, managementDraft.secretKey)
      clearManagementCredentialDraft()
    } catch {
      // Keep the transient draft available for retry; the parent renders the error.
    }
  }
  return (
    <section className="qiniu-management-credentials" aria-live="polite">
      <h2>Management credentials</h2>
      {props.error ? <p className="qiniu-management-credentials-error">{props.error}</p> : null}
      <label>Access Key <input type="password" name="accessKey" autoComplete="off" value={managementDraft.accessKey} onChange={(event: ChangeEvent<HTMLInputElement>) => { managementDraft.accessKey = event.target.value }} /></label>
      <label>Secret Key <input type="password" name="secretKey" autoComplete="off" value={managementDraft.secretKey} onChange={(event: ChangeEvent<HTMLInputElement>) => { managementDraft.secretKey = event.target.value }} /></label>
      <button type="button" onClick={() => void save()}>Save</button>
    </section>
  )
}

function CredentialStatusPanel(props: { status?: CredentialStatus; error?: string }): ReactNode {
  const status = props.status
  const state = props.error ? `Unable to load credential status: ${props.error}` : status === undefined ? 'Loading credential status...' : status.accessKey.configured && status.secretKey.configured ? 'AK/SK credentials configured.' : 'AK/SK credentials required for management data.'
  return (
    <section className="qiniu-credential-status" aria-live="polite">
      <h2>Credential status</h2>
      <p>{state}</p>
      {status ? <ul>
        <li>Access Key: {status.accessKey.configured ? 'configured' : 'not configured'}</li>
        <li>Secret Key: {status.secretKey.configured ? 'configured' : 'not configured'}</li>
        <li>Inference API Key: {status.inferenceApiKey.configured ? 'configured' : 'not configured'}</li>
      </ul> : null}
    </section>
  )
}

function ModelDetailsPanel(props: { state?: ModelDetailsState }): ReactNode {
  const state = props.state
  if (!state) return null
  const text = state.kind === 'loading' ? 'Loading model details...' : state.kind === 'error' ? state.message ?? 'Unable to load model details.' : state.kind === 'unavailable' ? 'Model details unavailable.' : state.model ? `${state.model.name}: ${state.model.description ?? 'No description available.'}` : 'Model details loaded.'
  return <section className="qiniu-model-details" aria-live="polite"><h2>Model details</h2><p>{text}</p></section>
}

export interface SettingsPageProps {
  settings?: { getSnapshot: () => { value?: { models?: readonly ModelSelection[] } } }
  actions?: { load?: () => unknown; refresh?: () => unknown; listModels?: () => unknown; modelDetails?: (id: string) => unknown; setQuery?: (query: string) => void; addModel?: (model: MarketplaceModel) => void | Promise<void>; updateSelection?: (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => void | Promise<void>; useApiKey?: (key: ApiKeySummary) => void | Promise<unknown>; setManualApiKey?: (value: string) => void | Promise<unknown>; setManagementCredentials?: (accessKey: string, secretKey: string) => void | Promise<unknown> }
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
  onManagementCredentials?: (accessKey: string, secretKey: string) => void | Promise<unknown>
  manualApiKey?: string
  runtime?: { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState; query: string; marketplaceLoading?: boolean; marketplaceError?: string; apiKeyError?: string; credentialStatus?: CredentialStatus; credentialStatusError?: string; managementCredentialsError?: string; modelDetails?: ModelDetailsState }
  useSnapshot?: () => { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState; query?: string; marketplaceLoading?: boolean; marketplaceError?: string; apiKeyError?: string; managementCredentialsError?: string; credentialStatus?: CredentialStatus; modelDetails?: ModelDetailsState; credentialStatusError?: string }
}

export function SettingsPage(props: SettingsPageProps): ReactNode {
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
  const marketplaceLoading = observed?.marketplaceLoading ?? runtime?.marketplaceLoading
  const marketplaceError = observed?.marketplaceError ?? runtime?.marketplaceError
  const apiKeyError = observed?.apiKeyError ?? runtime?.apiKeyError
  const managementCredentialsError = observed?.managementCredentialsError ?? runtime?.managementCredentialsError
  const change = (id: string, patch: Partial<ModelSelection> & { remove?: boolean }): void => {
    if (patch.remove) props.onRemoveSelection?.(id)
    else props.onUpdateSelection?.(id, patch)
    if (props.onUpdateSelection === undefined && props.onRemoveSelection === undefined) void actions.updateSelection?.(id, patch)
    props.onSelectionChange?.(id, patch)
  }
  const addModel = props.onAddModel ?? (model => { void actions.addModel?.(model) })
  const showDetails = props.onModelDetails ?? (model => { void actions.modelDetails?.(model.id) })
  return (
    <div className="qiniu-settings">
      {ModelMarketplace({ models, selections, query, loading: marketplaceLoading, error: marketplaceError, onQueryChange: actions.setQuery, onAdd: addModel, onDetails: showDetails, onRefresh: () => { void (actions.refresh ?? actions.load ?? actions.listModels)?.() } })}
      <section className="qiniu-enabled-models">
        <h2>Enabled models</h2>
        {selections.map(selection => (
          <div key={selection.id} className="qiniu-enabled-model">
            <strong>{selection.id}</strong><span>{selection.enabled ? ' Enabled' : ' Disabled'}</span>
            <button type="button" onClick={() => change(selection.id, { enabled: !selection.enabled })}>{selection.enabled ? 'Disable' : 'Enable'}</button>
            <span>contextWindow</span>
            <input type="number" name="contextWindow" aria-label="contextWindow" value={selection.contextWindow ?? ''} min={1} onChange={(event: ChangeEvent<HTMLInputElement>) => change(selection.id, { contextWindow: event.target.value ? Number(event.target.value) : undefined })} />
            <span>maxOutputTokens</span>
            <input type="number" name="maxOutputTokens" aria-label="maxOutputTokens" value={selection.maxOutputTokens ?? ''} min={1} onChange={(event: ChangeEvent<HTMLInputElement>) => change(selection.id, { maxOutputTokens: event.target.value ? Number(event.target.value) : undefined })} />
            <button type="button" onClick={() => change(selection.id, { remove: true })}>Remove</button>
          </div>
        ))}
      </section>
      {ManagementCredentialsPanel({ onSave: props.onManagementCredentials ?? ((accessKey, secretKey) => actions.setManagementCredentials?.(accessKey, secretKey)), error: managementCredentialsError })}
      {ApiKeyPanel({ keys: apiKeys, onUse: props.onUseApiKey ?? (key => actions.useApiKey?.(key) as Promise<void>), onManualEntry: props.onManualApiKey ?? (value => actions.setManualApiKey?.(value) as Promise<void>), manualValue: props.manualApiKey, error: apiKeyError })}
      {UsagePanel({ state: usage })}
      {ModelDetailsPanel({ state: modelDetails })}
      {CredentialStatusPanel({ status: credentialStatus, error: observed?.credentialStatusError ?? runtime?.credentialStatusError })}
    </div>
  )
}
