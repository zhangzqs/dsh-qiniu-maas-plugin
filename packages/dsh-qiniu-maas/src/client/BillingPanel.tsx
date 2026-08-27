import type { BillReport } from '@qiniu/maas-sdk'
import type { QiniuTranslate } from './locales.js'

export type BillingViewState = { kind: 'loading' | 'error' | 'success' | 'ak-sk-required'; report?: BillReport; message?: string }

export function billingState(value: unknown): BillingViewState {
  if (value && typeof value === 'object' && (value as { code?: unknown }).code === 'AK_SK_REQUIRED') return { kind: 'ak-sk-required' }
  if (value instanceof Error) return { kind: 'error', message: value.message }
  if (value && typeof value === 'object' && typeof (value as { message?: unknown }).message === 'string') return { kind: 'error', message: (value as { message: string }).message }
  if (!value || typeof value !== 'object' || !Array.isArray((value as { models?: unknown }).models)) return { kind: 'error', message: 'Unable to load billing.' }
  return { kind: 'success', report: value as BillReport }
}

export function BillingPanel(props: { state: BillingViewState; t?: QiniuTranslate }): JSX.Element {
  const state = props.state
  const t = props.t ?? ((key: keyof typeof import('./locales.js').en) => ({ 'section.usage': 'Usage', 'state.billingLoading': 'Loading billing...', 'state.billingRequired': 'AK/SK credentials are required for billing.', 'state.billingLoaded': 'Billing loaded.' } as Record<string, string>)[key] ?? key)
  const text = state.kind === 'loading' ? t('state.billingLoading') : state.kind === 'ak-sk-required' ? t('state.billingRequired') : state.kind === 'error' ? state.message ?? t('state.billingLoading') : t('state.billingLoaded')
  return <section className="qiniu-billing" aria-live="polite"><h2>{t('section.usage')}</h2><p>{text}</p>{state.kind === 'success' ? <ul>{state.report?.models.map(model => <li key={model.modelId}>{model.modelId}: {model.totalFee}</li>)}</ul> : null}</section>
}
