import type { ChangeEvent, ReactNode } from 'react'
import type { QiniuTranslate } from './locales.js'

export function canUseApiKey(value: string): boolean { return Boolean(value.trim()) && !/[*…]|\.\.\./.test(value) }
export function maskedKeyRefusal(value: string): string { return canUseApiKey(value) ? '' : 'This masked API key cannot be used. Enter the complete key manually.' }

const manualDrafts = new Map<string, string>()
export function clearManualApiKeyDrafts(): void { manualDrafts.clear() }

export interface ApiKeySummary { name: string; maskedValue: string; enabled: boolean; createdAt?: string; lastUsed?: string }
export interface ApiKeyPanelProps { keys: readonly ApiKeySummary[]; onUse?: (key: ApiKeySummary) => void | Promise<void>; onManualEntry?: (value: string) => void | Promise<void>; manualValue?: string; error?: string; t?: QiniuTranslate }
export function ApiKeyPanel(props: ApiKeyPanelProps): ReactNode {
  const t = props.t ?? ((key: keyof typeof import('./locales.js').en) => ({ 'section.apiKeys': 'API keys', 'button.use': 'Use', 'button.useManually': 'Use manually', 'label.enterApiKey': 'Enter API key', 'state.maskedKey': maskedKeyRefusal('masked') } as Record<string, string>)[key] ?? key)
  return (
    <section className="qiniu-api-keys">
      <h2>{t('section.apiKeys')}</h2>
      {props.error ? <p className="qiniu-api-key-error" aria-live="polite">{props.error}</p> : null}
      {props.keys.map(key => {
        const masked = !canUseApiKey(key.maskedValue)
        const initialDraft = props.manualValue ?? manualDrafts.get(key.name) ?? ''
        if (props.manualValue !== undefined) manualDrafts.set(key.name, props.manualValue)
        const onManualClick = async (): Promise<void> => {
          const value = manualDrafts.get(key.name) ?? initialDraft
          if (!canUseApiKey(value)) return
          try {
            await props.onManualEntry?.(value)
            manualDrafts.delete(key.name)
          } catch {
            // Parent renders the write error and draft remains for retry.
          }
        }
        return (
          <article key={key.name}>
            <strong>{key.name}</strong>
            <code>{key.maskedValue}</code>
            <span>{key.enabled ? t('label.enabled') : t('label.disabled')}</span>
            <button type="button" disabled={masked || !key.enabled} title={masked ? t('state.maskedKey') : ''} onClick={() => { if (!masked) void props.onUse?.(key) }}>{t('button.use')}</button>
            {masked ? <input type="password" defaultValue={initialDraft} placeholder={t('label.enterApiKey')} autoComplete="off" onChange={(event: ChangeEvent<HTMLInputElement>) => { manualDrafts.set(key.name, event.target.value) }} /> : null}
            {masked ? <button type="button" onClick={() => void onManualClick()}>{t('button.useManually')}</button> : null}
          </article>
        )
      })}
    </section>
  )
}
