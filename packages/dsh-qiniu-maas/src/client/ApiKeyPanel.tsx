export function canUseApiKey(value: string): boolean { return Boolean(value.trim()) && !/[*…]|\.\.\./.test(value) }
export function maskedKeyRefusal(value: string): string { return canUseApiKey(value) ? '' : 'This masked API key cannot be used. Enter the complete key manually.' }

function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}

const manualDrafts = new Map<string, string>()
export function clearManualApiKeyDrafts(): void { manualDrafts.clear() }

export interface ApiKeySummary { name: string; maskedValue: string; enabled: boolean; createdAt?: string; lastUsed?: string }
export interface ApiKeyPanelProps { keys: readonly ApiKeySummary[]; onUse?: (key: ApiKeySummary) => void | Promise<void>; onManualEntry?: (value: string) => void | Promise<void>; manualValue?: string; error?: string }
export function ApiKeyPanel(props: ApiKeyPanelProps): unknown {
  return el('section', { className: 'qiniu-api-keys' }, el('h2', null, 'API keys'), ...(props.error ? [el('p', { className: 'qiniu-api-key-error', 'aria-live': 'polite' }, props.error)] : []), ...props.keys.map(key => {
    const masked = !canUseApiKey(key.maskedValue)
    const initialDraft = props.manualValue ?? manualDrafts.get(key.name) ?? ''
    if (props.manualValue !== undefined) manualDrafts.set(key.name, props.manualValue)
    return el('article', { key: key.name },
      el('strong', null, key.name), el('code', null, key.maskedValue), el('span', null, key.enabled ? 'Enabled' : 'Disabled'),
      el('button', { type: 'button', disabled: masked || !key.enabled, title: maskedKeyRefusal(key.maskedValue), onClick: () => { if (!masked) props.onUse?.(key) } }, 'Use'),
      masked ? el('input', { type: 'password', defaultValue: initialDraft, placeholder: 'Enter API key', autoComplete: 'off', onChange: (event: { target: { value: string } }) => { manualDrafts.set(key.name, event.target.value) } }) : null,
      masked ? el('button', { type: 'button', onClick: async () => { const value = manualDrafts.get(key.name) ?? initialDraft; if (!canUseApiKey(value)) return; try { await props.onManualEntry?.(value); manualDrafts.delete(key.name) } catch { /* Parent renders the write error and draft remains for retry. */ } } }, 'Use manually') : null,
    )
  }))
}
