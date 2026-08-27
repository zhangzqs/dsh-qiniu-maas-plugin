export type UsageViewState = { kind: 'loading' | 'unavailable' | 'ak-sk-required' | 'error' | 'success'; report?: unknown; message?: string }

export function mapRpcError(value: unknown): UsageViewState {
  if (value && typeof value === 'object' && (value as { code?: unknown }).code === 'AK_SK_REQUIRED') return { kind: 'ak-sk-required' }
  if (value instanceof Error) return { kind: 'error', message: value.message }
  if (value && typeof value === 'object' && typeof (value as { message?: unknown }).message === 'string') return { kind: 'error', message: (value as { message: string }).message }
  return { kind: 'error', message: 'Unable to load usage.' }
}

export function usageState(value: unknown): UsageViewState {
  if (value && typeof value === 'object' && (value as { code?: unknown }).code === 'AK_SK_REQUIRED') return { kind: 'ak-sk-required' }
  if (value instanceof Error || (value && typeof value === 'object' && 'code' in value && (value as { code?: unknown }).code !== undefined)) return mapRpcError(value)
  if (value === undefined) return { kind: 'unavailable' }
  return { kind: 'success', report: value }
}

function reportItems(report: unknown): string[] {
  if (!report || typeof report !== 'object' || !Array.isArray((report as { items?: unknown }).items)) return []
  return (report as { items: unknown[] }).items.flatMap(item => {
    if (!item || typeof item !== 'object') return []
    const value = item as { name?: unknown; total?: unknown; unit?: unknown }
    return typeof value.name === 'string' ? [value.name + (typeof value.total === 'number' ? `: ${value.total}${typeof value.unit === 'string' ? ` ${value.unit}` : ''}` : '')] : []
  })
}

export function UsagePanel(props: { state: UsageViewState }): JSX.Element {
  const text = props.state.kind === 'ak-sk-required' ? 'AK/SK credentials are required for usage.' : props.state.kind === 'loading' ? 'Loading usage...' : props.state.kind === 'unavailable' ? 'Usage unavailable.' : props.state.kind === 'error' ? props.state.message ?? 'Unable to load usage.' : 'Usage loaded.'
  return (
    <section className="qiniu-usage" aria-live="polite">
      <h2>Usage</h2>
      <p>{text}</p>
      {props.state.kind === 'success' ? <ul>{reportItems(props.state.report).map(item => <li key={item}>{item}</li>)}</ul> : null}
    </section>
  )
}
