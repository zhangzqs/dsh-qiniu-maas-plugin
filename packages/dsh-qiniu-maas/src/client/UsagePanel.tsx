export type UsageViewState = { kind: 'loading' | 'unavailable' | 'ak-sk-required' | 'error' | 'success'; report?: unknown; message?: string }
export function usageState(value: unknown): UsageViewState {
  if (value && typeof value === 'object' && (value as { code?: unknown }).code === 'AK_SK_REQUIRED') return { kind: 'ak-sk-required' }
  if (value instanceof Error) return { kind: 'error', message: value.message }
  if (value === undefined) return { kind: 'unavailable' }
  return { kind: 'success', report: value }
}
function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}
function reportItems(report: unknown): unknown[] {
  if (!report || typeof report !== 'object' || !Array.isArray((report as { items?: unknown }).items)) return []
  return (report as { items: unknown[] }).items.flatMap(item => {
    if (!item || typeof item !== 'object') return []
    const value = item as { name?: unknown; total?: unknown; unit?: unknown }
    return typeof value.name === 'string' ? [el('li', null, value.name, typeof value.total === 'number' ? `: ${value.total}${typeof value.unit === 'string' ? ` ${value.unit}` : ''}` : '')] : []
  })
}
export function UsagePanel(props: { state: UsageViewState }): unknown {
  const text = props.state.kind === 'ak-sk-required' ? 'AK/SK credentials are required for usage.' : props.state.kind === 'loading' ? 'Loading usage...' : props.state.kind === 'unavailable' ? 'Usage unavailable.' : props.state.kind === 'error' ? props.state.message ?? 'Unable to load usage.' : 'Usage loaded.'
  return el('section', { className: 'qiniu-usage', 'aria-live': 'polite' }, el('h2', null, 'Usage'), el('p', null, text), props.state.kind === 'success' ? el('ul', null, ...reportItems(props.state.report)) : null)
}
