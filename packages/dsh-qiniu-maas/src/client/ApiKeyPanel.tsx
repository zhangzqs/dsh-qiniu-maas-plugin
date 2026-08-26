export function canUseApiKey(value: string): boolean { return Boolean(value.trim()) && !value.includes('*') }
export function maskedKeyRefusal(value: string): string { return canUseApiKey(value) ? '' : 'This masked API key cannot be used. Enter the complete key manually.' }

function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}

export interface ApiKeySummary { name: string; maskedValue: string; enabled: boolean; createdAt?: string; lastUsed?: string }
export interface ApiKeyPanelProps { keys: readonly ApiKeySummary[]; onUse?: (key: ApiKeySummary) => void; onManualEntry?: (value: string) => void; manualValue?: string }
export function ApiKeyPanel(props: ApiKeyPanelProps): unknown {
  return el('section', { className: 'qiniu-api-keys' }, el('h2', null, 'API keys'), ...props.keys.map(key => {
    const masked = !canUseApiKey(key.maskedValue)
    return el('article', { key: key.name },
      el('strong', null, key.name), el('code', null, key.maskedValue), el('span', null, key.enabled ? 'Enabled' : 'Disabled'),
      el('button', { type: 'button', disabled: masked || !key.enabled, title: maskedKeyRefusal(key.maskedValue), onClick: () => { if (!masked) props.onUse?.(key) } }, 'Use'),
      masked ? el('input', { type: 'password', value: props.manualValue ?? '', placeholder: 'Enter API key', autoComplete: 'off', onChange: (event: { target: { value: string } }) => props.onManualEntry?.(event.target.value) }) : null,
      masked ? el('button', { type: 'button', disabled: !canUseApiKey(props.manualValue ?? ''), onClick: () => { const value = props.manualValue ?? ''; if (canUseApiKey(value)) props.onManualEntry?.(value) } }, 'Use manually') : null,
    )
  }))
}
