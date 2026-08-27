import type { ChangeEvent, ReactNode } from 'react'

export function canUseApiKey(value: string): boolean { return Boolean(value.trim()) && !/[*…]|\.\.\./.test(value) }
export function maskedKeyRefusal(value: string): string { return canUseApiKey(value) ? '' : 'This masked API key cannot be used. Enter the complete key manually.' }

const manualDrafts = new Map<string, string>()
export function clearManualApiKeyDrafts(): void { manualDrafts.clear() }

export interface ApiKeySummary { name: string; maskedValue: string; enabled: boolean; createdAt?: string; lastUsed?: string }
export interface ApiKeyPanelProps { keys: readonly ApiKeySummary[]; onUse?: (key: ApiKeySummary) => void | Promise<void>; onManualEntry?: (value: string) => void | Promise<void>; manualValue?: string; error?: string }
export function ApiKeyPanel(props: ApiKeyPanelProps): ReactNode {
  return (
    <section className="qiniu-api-keys">
      <h2>API keys</h2>
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
            <span>{key.enabled ? 'Enabled' : 'Disabled'}</span>
            <button type="button" disabled={masked || !key.enabled} title={maskedKeyRefusal(key.maskedValue)} onClick={() => { if (!masked) void props.onUse?.(key) }}>Use</button>
            {masked ? <input type="password" defaultValue={initialDraft} placeholder="Enter API key" autoComplete="off" onChange={(event: ChangeEvent<HTMLInputElement>) => { manualDrafts.set(key.name, event.target.value) }} /> : null}
            {masked ? <button type="button" onClick={() => void onManualClick()}>Use manually</button> : null}
          </article>
        )
      })}
    </section>
  )
}
