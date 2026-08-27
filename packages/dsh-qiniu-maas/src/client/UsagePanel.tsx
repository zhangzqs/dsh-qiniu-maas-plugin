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

export function UsagePanel(props: { state: UsageViewState; t?: QiniuTranslate }): JSX.Element {
  const t = props.t ?? ((key: keyof typeof import('./locales.js').en) => ({ 'section.usage': 'Usage', 'state.usageRequired': 'AK/SK credentials are required for usage.', 'state.loadingUsage': 'Loading usage...', 'state.usageUnavailable': 'Usage unavailable.', 'state.usageLoaded': 'Usage loaded.' } as Record<string, string>)[key] ?? key)
  const text = props.state.kind === 'ak-sk-required' ? t('state.usageRequired') : props.state.kind === 'loading' ? t('state.loadingUsage') : props.state.kind === 'unavailable' ? t('state.usageUnavailable') : props.state.kind === 'error' ? props.state.message ?? t('state.usageUnavailable') : t('state.usageLoaded')
  return (
    <section className="qiniu-usage" aria-live="polite">
      <h2>{t('section.usage')}</h2>
      <p>{text}</p>
      {props.state.kind === 'success' ? <ul>{reportItems(props.state.report).map(item => <li key={item}>{item}</li>)}</ul> : null}
    </section>
  )
}
import type { QiniuTranslate } from './locales.js'
