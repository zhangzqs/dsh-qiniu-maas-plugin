import type { ChangeEvent, ReactNode } from 'react'
import { ModelMarketplace, type MarketplaceModel, type ModelSelection } from './ModelMarketplace.js'
import { ApiKeyPanel, type ApiKeySummary } from './ApiKeyPanel.js'
import { UsagePanel, type UsageViewState } from './UsagePanel.js'
import { BillingPanel, type BillingViewState } from './BillingPanel.js'
import { en, type QiniuTranslate } from './locales.js'

type CredentialStatus = { accessKey: { configured: boolean; writable: boolean }; secretKey: { configured: boolean; writable: boolean }; inferenceApiKey: { configured: boolean; writable: boolean } }
type ModelDetailsState = { kind: 'loading' | 'unavailable' | 'error' | 'success'; model?: MarketplaceModel; message?: string }

const managementDraft = { accessKey: '', secretKey: '' }

export function clearManagementCredentialDraft(): void {
  managementDraft.accessKey = ''
  managementDraft.secretKey = ''
}

function ManagementCredentialsPanel(props: { onSave?: (accessKey: string, secretKey: string) => void | Promise<unknown>; error?: string; t: QiniuTranslate }): ReactNode {
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
      <h2>{props.t('section.credentials')}</h2>
      {props.error ? <p className="qiniu-management-credentials-error">{props.error}</p> : null}
      <label>{props.t('label.accessKey')} <input type="password" name="accessKey" autoComplete="off" value={managementDraft.accessKey} onChange={(event: ChangeEvent<HTMLInputElement>) => { managementDraft.accessKey = event.target.value }} /></label>
      <label>{props.t('label.secretKey')} <input type="password" name="secretKey" autoComplete="off" value={managementDraft.secretKey} onChange={(event: ChangeEvent<HTMLInputElement>) => { managementDraft.secretKey = event.target.value }} /></label>
      <button type="button" onClick={() => void save()}>{props.t('button.save')}</button>
    </section>
  )
}

function CredentialStatusPanel(props: { status?: CredentialStatus; error?: string; t: QiniuTranslate }): ReactNode {
  const status = props.status
  const state = props.error ? `Unable to load credential status: ${props.error}` : status === undefined ? props.t('state.credentialsLoading') : status.accessKey.configured && status.secretKey.configured ? props.t('state.credentialsConfigured') : props.t('state.credentialsRequired')
  return (
    <section className="qiniu-credential-status" aria-live="polite">
      <h2>{props.t('section.status')}</h2>
      <p>{state}</p>
      {status ? <ul>
        <li>Access Key: {status.accessKey.configured ? props.t('state.configured') : props.t('state.notConfigured')}</li>
        <li>Secret Key: {status.secretKey.configured ? props.t('state.configured') : props.t('state.notConfigured')}</li>
        <li>Inference API Key: {status.inferenceApiKey.configured ? props.t('state.configured') : props.t('state.notConfigured')}</li>
      </ul> : null}
    </section>
  )
}

function ModelDetailsPanel(props: { state?: ModelDetailsState; t: QiniuTranslate }): ReactNode {
  const state = props.state
  if (!state) return null
  const text = state.kind === 'loading' ? props.t('state.detailsLoading') : state.kind === 'error' ? state.message ?? props.t('state.detailsUnavailable') : state.kind === 'unavailable' ? props.t('state.detailsUnavailable') : state.model ? `${state.model.name}: ${state.model.description ?? props.t('state.noDescription')}` : props.t('state.detailsLoaded')
  return <section className="qiniu-model-details" aria-live="polite"><h2>{props.t('section.details')}</h2><p>{text}</p></section>
}

export interface SettingsPageProps {
  settings?: { getSnapshot: () => { value?: { models?: readonly ModelSelection[] } } }
  actions?: { load?: () => unknown; refresh?: () => unknown; listModels?: () => unknown; modelDetails?: (id: string) => unknown; setQuery?: (query: string) => void; setTab?: (tab: 'marketplace' | 'enabled' | 'credentials' | 'apiKeys' | 'usage') => void; addModel?: (model: MarketplaceModel) => void | Promise<void>; updateSelection?: (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => void | Promise<void>; useApiKey?: (key: ApiKeySummary) => void | Promise<unknown>; setManualApiKey?: (value: string) => void | Promise<unknown>; setManagementCredentials?: (accessKey: string, secretKey: string) => void | Promise<unknown> }
  models?: readonly MarketplaceModel[]
  selections?: readonly ModelSelection[]
  apiKeys?: readonly ApiKeySummary[]
   usage?: UsageViewState
   billing?: BillingViewState
  onSelectionChange?: (id: string, patch: Partial<ModelSelection> & { remove?: boolean }) => void
  onUpdateSelection?: (id: string, patch: Partial<ModelSelection>) => void
  onRemoveSelection?: (id: string) => void
  onAddModel?: (model: MarketplaceModel) => void
  onModelDetails?: (model: MarketplaceModel) => void
  onUseApiKey?: (key: ApiKeySummary) => void
  onManualApiKey?: (value: string) => void
  onManagementCredentials?: (accessKey: string, secretKey: string) => void | Promise<unknown>
  manualApiKey?: string
  runtime?: { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState; billing?: BillingViewState; query: string; activeTab?: 'marketplace' | 'enabled' | 'credentials' | 'apiKeys' | 'usage'; marketplaceLoading?: boolean; marketplaceError?: string; apiKeyError?: string; credentialStatus?: CredentialStatus; credentialStatusError?: string; managementCredentialsError?: string; modelDetails?: ModelDetailsState }
  useSnapshot?: <T>(selector: (snapshot: { models: readonly MarketplaceModel[]; apiKeys: readonly ApiKeySummary[]; usage: UsageViewState; query?: string; activeTab?: 'marketplace' | 'enabled' | 'credentials' | 'apiKeys' | 'usage'; marketplaceLoading?: boolean; marketplaceError?: string; apiKeyError?: string; managementCredentialsError?: string; credentialStatus?: CredentialStatus; modelDetails?: ModelDetailsState; credentialStatusError?: string }) => T) => T
  translate?: QiniuTranslate
  activeTab?: 'marketplace' | 'enabled' | 'credentials' | 'apiKeys' | 'usage'
  onTabChange?: (tab: 'marketplace' | 'enabled' | 'credentials' | 'apiKeys' | 'usage') => void
}

export function SettingsPage(props: SettingsPageProps): ReactNode {
  const injectedSelections = props.settings?.getSnapshot().value?.models
  const selections = props.selections ?? injectedSelections ?? []
  const actions = props.actions ?? {}
  const observed = props.useSnapshot?.(snapshot => snapshot)
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
  const t = props.translate ?? ((key: keyof typeof en) => en[key])
  const activeTab = props.activeTab ?? observed?.activeTab ?? runtime?.activeTab ?? 'marketplace'
  const tabs = [
    ['marketplace', 'tab.marketplace'], ['enabled', 'tab.enabled'], ['credentials', 'tab.credentials'], ['apiKeys', 'tab.apiKeys'], ['usage', 'tab.usage'],
  ] as const
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
      <div className="qiniu-tabs" role="tablist" aria-label="Qiniu MaaS settings">
        {tabs.map(([id, key]) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} tabIndex={activeTab === id ? 0 : -1} onClick={() => { props.onTabChange?.(id); actions.setTab?.(id) }}>{t(key)}</button>)}
      </div>
      <div className="qiniu-tab-panel" role="tabpanel" aria-label={t(tabs.find(([id]) => id === activeTab)?.[1] ?? 'tab.marketplace')}>
      <div hidden={activeTab !== 'marketplace'}>
        {ModelMarketplace({ models, selections, query, loading: marketplaceLoading, error: marketplaceError, onQueryChange: actions.setQuery, onAdd: addModel, onDetails: showDetails, onRefresh: () => { void (actions.refresh ?? actions.load ?? actions.listModels)?.() }, t })}
        <ModelDetailsPanel state={modelDetails} t={t} />
      </div>
      <section className="qiniu-enabled-models" hidden={activeTab !== 'enabled'}>
        <h2>{t('section.enabled')}</h2>
        {selections.map(selection => (
          <div key={selection.id} className="qiniu-enabled-model">
            <strong>{selection.id}</strong><span>{selection.enabled ? ` ${t('label.enabled')}` : ` ${t('label.disabled')}`}</span>
            <button type="button" onClick={() => change(selection.id, { enabled: !selection.enabled })}>{selection.enabled ? 'Disable' : 'Enable'}</button>
            <span>{t('label.contextWindow')}</span>
            <input type="number" name="contextWindow" aria-label="contextWindow" value={selection.contextWindow ?? ''} min={1} onChange={(event: ChangeEvent<HTMLInputElement>) => change(selection.id, { contextWindow: event.target.value ? Number(event.target.value) : undefined })} />
            <span>{t('label.maxOutputTokens')}</span>
            <input type="number" name="maxOutputTokens" aria-label="maxOutputTokens" value={selection.maxOutputTokens ?? ''} min={1} onChange={(event: ChangeEvent<HTMLInputElement>) => change(selection.id, { maxOutputTokens: event.target.value ? Number(event.target.value) : undefined })} />
            <button type="button" onClick={() => change(selection.id, { remove: true })}>{t('button.remove')}</button>
          </div>
        ))}
      </section>
      <div hidden={activeTab !== 'credentials'}>
        {ManagementCredentialsPanel({ onSave: props.onManagementCredentials ?? ((accessKey, secretKey) => actions.setManagementCredentials?.(accessKey, secretKey)), error: managementCredentialsError, t })}
        <CredentialStatusPanel status={credentialStatus} error={observed?.credentialStatusError ?? runtime?.credentialStatusError} t={t} />
      </div>
      <div hidden={activeTab !== 'apiKeys'}>{ApiKeyPanel({ keys: apiKeys, onUse: props.onUseApiKey ?? (key => actions.useApiKey?.(key) as Promise<void>), onManualEntry: props.onManualApiKey ?? (value => actions.setManualApiKey?.(value) as Promise<void>), manualValue: props.manualApiKey, error: apiKeyError, t })}</div>
      <div hidden={activeTab !== 'usage'}>
        {UsagePanel({ state: usage, t })}
        {BillingPanel({ state: props.billing ?? runtime?.billing ?? { kind: 'loading' }, t })}
      </div>
      </div>
    </div>
  )
}
