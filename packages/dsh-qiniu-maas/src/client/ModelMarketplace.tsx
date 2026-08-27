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
  return selections.map(selection => selection.id === id ? {
    ...selection,
    ...(Object.prototype.hasOwnProperty.call(patch, 'enabled') ? { enabled: patch.enabled } : {}),
    ...(Object.prototype.hasOwnProperty.call(patch, 'contextWindow') ? { contextWindow: patch.contextWindow } : {}),
    ...(Object.prototype.hasOwnProperty.call(patch, 'maxOutputTokens') ? { maxOutputTokens: patch.maxOutputTokens } : {}),
  } : selection)
}

function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}

export interface ModelMarketplaceProps {
  models: readonly MarketplaceModel[]
  selections?: readonly ModelSelection[]
  query?: string
  onQueryChange?: (query: string) => void
  onRefresh?: () => void
  onAdd?: (model: MarketplaceModel) => void
  onDetails?: (model: MarketplaceModel) => void
}

export function ModelMarketplace(props: ModelMarketplaceProps): unknown {
  const selections = new Set((props.selections ?? []).map(selection => selection.id))
  const models = filterMarketplaceModels(props.models, props.query ?? '')
  return el('section', { className: 'qiniu-marketplace', 'aria-label': 'Public model marketplace' },
    el('h2', null, 'Public marketplace'),
    el('div', { className: 'qiniu-model-grid' }, ...models.map(model => el('article', { key: model.id, className: 'qiniu-model-card' },
      el('h3', null, model.name), el('code', null, model.id),
      model.description ? el('p', null, model.description) : null,
      el('div', { className: 'qiniu-badges' }, ...model.capabilities.map(capability => el('span', { key: capability }, capability))),
      el('dl', null, model.contextWindow ? el('div', null, el('dt', null, 'Context'), el('dd', null, String(model.contextWindow))) : null, model.maxOutputTokens ? el('div', null, el('dt', null, 'Max output'), el('dd', null, String(model.maxOutputTokens))) : null),
      el('button', { type: 'button', disabled: selections.has(model.id), onClick: () => props.onAdd?.(model) }, selections.has(model.id) ? 'Added' : 'Add'),
      el('button', { type: 'button', onClick: () => props.onDetails?.(model) }, 'Details'),
    )))
    , el('div', { className: 'qiniu-marketplace-tools' },
      el('input', { type: 'search', value: props.query ?? '', placeholder: 'Search models', onChange: (event: { target: { value: string } }) => props.onQueryChange?.(event.target.value) }),
      el('button', { type: 'button', onClick: props.onRefresh }, 'Refresh'),
    ),
  )
}
