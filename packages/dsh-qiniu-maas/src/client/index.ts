import { SettingsPage } from './SettingsPage.js'
import { qiniuStyles } from './styles.js'

export const injectClient = ['slots', 'locale', 'connection', 'remote', 'settingsScope', 'settingsSchema'] as const
export const inject = injectClient

type ClientContextLike = {
  slots: { inject: (name: string, callback: () => unknown) => unknown; register: (entry: Record<string, unknown>, component?: unknown) => unknown }
  locale: { register: (namespace: string, dictionaries: unknown) => unknown; bind: (namespace: string) => (key: string) => string }
  effect: (callback: () => unknown, name?: string) => unknown
}

export function applyClient(ctx: ClientContextLike): void {
  ctx.effect(() => {
    const doc = (globalThis as { document?: { createElement?: (tag: string) => { textContent: string; remove: () => void }; head?: { appendChild: (node: unknown) => void } } }).document
    const style = doc?.createElement?.('style')
    if (!doc || !style) return
    style.textContent = qiniuStyles
    const head = doc.head
    if (head) head.appendChild(style)
    return () => style.remove()
  }, 'qiniu-maas: styles')
  const t = ctx.locale.bind('settings.qiniu-maas')
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'qiniu-maas',
    order: 20,
    label: () => t('nav') || 'Qiniu MaaS',
    inject: () => ({}),
  }, SettingsPage))
  void SettingsPage
}

export { SettingsPage }
