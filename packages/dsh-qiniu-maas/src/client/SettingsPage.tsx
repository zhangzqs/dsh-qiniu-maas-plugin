import { ModelMarketplace, type MarketplaceModel, type ModelSelection } from './ModelMarketplace.js'
import { ApiKeyPanel, type ApiKeySummary } from './ApiKeyPanel.js'
import { UsagePanel, type UsageViewState } from './UsagePanel.js'

function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}

export interface SettingsPageProps {
  models?: readonly MarketplaceModel[]
  selections?: readonly ModelSelection[]
  apiKeys?: readonly ApiKeySummary[]
  usage?: UsageViewState
}
export function SettingsPage(props: SettingsPageProps): unknown {
  return el('div', { className: 'qiniu-settings' },
    ModelMarketplace({ models: props.models ?? [], selections: props.selections }),
    el('section', { className: 'qiniu-enabled-models' }, el('h2', null, 'Enabled models'), ...(props.selections ?? []).map(selection => el('div', { key: selection.id }, selection.id, selection.enabled ? ' Enabled' : ' Disabled'))),
    ApiKeyPanel({ keys: props.apiKeys ?? [] }),
    UsagePanel({ state: props.usage ?? { kind: 'unavailable' } }),
  )
}
