import type { ChangeEvent, ReactNode } from 'react'
import type { QiniuTranslate } from './locales.js'

export interface MarketplaceModel {
  id: string
  name: string
  description?: string
  contextWindow?: number
  maxOutputTokens?: number
  capabilities: string[]
}

export interface ModelSelection {
  id: string
  enabled: boolean
  contextWindow?: number
  maxOutputTokens?: number
}

export function filterMarketplaceModels(models: readonly MarketplaceModel[], query: string): MarketplaceModel[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return [...models]
  return models.filter(model => `${model.id} ${model.name} ${model.description ?? ''} ${model.capabilities.join(' ')}`.toLowerCase().includes(needle))
}

export function createModelSelection(id: string): ModelSelection { return { id, enabled: true } }

export function updateModelSelection(selections: readonly ModelSelection[], id: string, patch: Partial<ModelSelection> & { remove?: boolean }): ModelSelection[] {
  if (patch.remove) return selections.filter(selection => selection.id !== id)
  return selections.map(selection => {
    if (selection.id !== id) return selection
    const next = { ...selection }
    if (Object.prototype.hasOwnProperty.call(patch, 'enabled')) next.enabled = patch.enabled as boolean
    if (Object.prototype.hasOwnProperty.call(patch, 'contextWindow')) {
      if (patch.contextWindow === undefined) delete next.contextWindow
      else next.contextWindow = patch.contextWindow
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'maxOutputTokens')) {
      if (patch.maxOutputTokens === undefined) delete next.maxOutputTokens
      else next.maxOutputTokens = patch.maxOutputTokens
    }
    return next
  })
}

export interface ModelMarketplaceProps {
  models: readonly MarketplaceModel[]
  selections?: readonly ModelSelection[]
  query?: string
  onQueryChange?: (query: string) => void
  onRefresh?: () => void
  onAdd?: (model: MarketplaceModel) => void
  onDetails?: (model: MarketplaceModel) => void
  loading?: boolean
  error?: string
  t?: QiniuTranslate
}

export function ModelMarketplace(props: ModelMarketplaceProps): ReactNode {
  const t = props.t ?? ((key: keyof typeof import('./locales.js').en) => ({
    'tab.marketplace': 'Marketplace', 'tab.enabled': 'Enabled models', 'tab.credentials': 'AK/SK', 'tab.apiKeys': 'API Key', 'tab.usage': 'Usage',
    'section.marketplace': 'Public marketplace', 'section.enabled': 'Enabled models', 'section.credentials': 'Management credentials', 'section.apiKeys': 'API keys', 'section.usage': 'Usage', 'section.status': 'Credential status',
    'button.add': 'Add', 'button.added': 'Added', 'button.details': 'Details', 'button.refresh': 'Refresh', 'button.disable': 'Disable', 'button.enable': 'Enable', 'button.remove': 'Remove', 'button.save': 'Save', 'button.use': 'Use', 'button.useManually': 'Use manually',
    'label.accessKey': 'Access Key', 'label.secretKey': 'Secret Key', 'label.searchModels': 'Search models', 'label.enterApiKey': 'Enter API key', 'label.contextWindow': 'contextWindow', 'label.maxOutputTokens': 'maxOutputTokens',
    'state.loadingMarketplace': 'Loading marketplace...', 'state.noModels': 'No models found.',
  } as Record<string, string>)[key] ?? key)
  const selections = new Set((props.selections ?? []).map(selection => selection.id))
  const models = filterMarketplaceModels(props.models, props.query ?? '')
  const status = props.loading
    ? <p className="qiniu-marketplace-status" aria-live="polite">{t('state.loadingMarketplace')}</p>
    : props.error
      ? <p className="qiniu-marketplace-status" aria-live="polite">{props.error}</p>
      : models.length === 0 ? <p className="qiniu-marketplace-status" aria-live="polite">{t('state.noModels')}</p> : null
  return (
    <section className="qiniu-marketplace" aria-label="Public model marketplace">
      <h2>{t('section.marketplace')}</h2>
      {status}
      <div className="qiniu-model-grid">
        {models.map(model => (
          <article key={model.id} className="qiniu-model-card">
            <h3>{model.name}</h3>
            <code>{model.id}</code>
            {model.description ? <p>{model.description}</p> : null}
            <div className="qiniu-badges">{model.capabilities.map(capability => <span key={capability}>{capability}</span>)}</div>
            <dl>
              {model.contextWindow ? <div><dt>{t('label.context')}</dt><dd>{model.contextWindow}</dd></div> : null}
              {model.maxOutputTokens ? <div><dt>{t('label.maxOutput')}</dt><dd>{model.maxOutputTokens}</dd></div> : null}
            </dl>
            <button type="button" disabled={selections.has(model.id)} onClick={() => props.onAdd?.(model)}>{selections.has(model.id) ? t('button.added') : t('button.add')}</button>
            <button type="button" onClick={() => props.onDetails?.(model)}>{t('button.details')}</button>
          </article>
        ))}
      </div>
      <div className="qiniu-marketplace-tools">
        <input type="search" value={props.query ?? ''} placeholder={t('label.searchModels')} onChange={(event: ChangeEvent<HTMLInputElement>) => props.onQueryChange?.(event.target.value)} />
        <button type="button" onClick={props.onRefresh}>{t('button.refresh')}</button>
      </div>
    </section>
  )
}
