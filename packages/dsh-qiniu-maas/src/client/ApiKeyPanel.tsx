export function canUseApiKey(value: string): boolean {
  return Boolean(value.trim()) && !value.includes('*')
}

export function maskedKeyRefusal(value: string): string {
  return canUseApiKey(value) ? '' : 'This masked API key cannot be used. Enter the complete key manually.'
}

function el(type: string, props: Record<string, unknown> | null, ...children: unknown[]): unknown {
  const react = (globalThis as { React?: { createElement: (...args: unknown[]) => unknown } }).React
  return react?.createElement(type, props, ...children) ?? { type, props, children }
}

export interface ApiKeySummary { name: string; maskedValue: string; enabled: boolean; createdAt?: string; lastUsed?: string }
export function ApiKeyPanel(props: { keys: readonly ApiKeySummary[]; onUse?: (key: ApiKeySummary) => void }): unknown {
  return el('section', { className: 'qiniu-api-keys' }, el('h2', null, 'API keys'), ...props.keys.map(key => el('article', { key: key.name },
    el('strong', null, key.name), el('code', null, key.maskedValue), el('span', null, key.enabled ? 'Enabled' : 'Disabled'),
    el('button', { type: 'button', disabled: !canUseApiKey(key.maskedValue), title: maskedKeyRefusal(key.maskedValue), onClick: () => props.onUse?.(key) }, 'Use'),
  )))
}
