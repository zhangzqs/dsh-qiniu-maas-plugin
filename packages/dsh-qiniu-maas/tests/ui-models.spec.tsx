import { describe, expect, test, vi } from 'vitest'
import { ModelMarketplace, createModelSelection, filterMarketplaceModels, updateModelSelection } from '../src/client/ModelMarketplace.js'
import { canUseApiKey, maskedKeyRefusal, ApiKeyPanel } from '../src/client/ApiKeyPanel.js'
import { UsagePanel, usageState } from '../src/client/UsagePanel.js'
import { applyClient, injectClient } from '../src/client/index.js'
import { SettingsPage } from '../src/client/SettingsPage.js'

describe('Qiniu MaaS model settings UI', () => {
  test('renders public marketplace data without management credentials', () => {
    const models = [{ id: 'qwen-turbo', name: 'Qwen Turbo', capabilities: ['text-input'] }]
    expect(filterMarketplaceModels(models, '')).toEqual(models)
  })

  test('supports exact add, enable, disable, and remove model flow', () => {
    const added = createModelSelection('qwen-turbo')
    expect(added).toEqual({ id: 'qwen-turbo', enabled: true })
    const disabled = updateModelSelection([added], 'qwen-turbo', { enabled: false })
    expect(disabled).toEqual([{ id: 'qwen-turbo', enabled: false }])
    const enabled = updateModelSelection(disabled, 'qwen-turbo', { enabled: true })
    expect(enabled).toEqual([{ id: 'qwen-turbo', enabled: true }])
    expect(updateModelSelection(enabled, 'qwen-turbo', { remove: true })).toEqual([])
  })

  test('preserves user context and output overrides while editing a selection', () => {
    expect(updateModelSelection([{ id: 'm', enabled: true }], 'm', {
      contextWindow: 32768,
      maxOutputTokens: 4096,
    })).toEqual([{ id: 'm', enabled: true, contextWindow: 32768, maxOutputTokens: 4096 }])
  })

  test('exposes AK_SK_REQUIRED as an explicit usage state', () => {
    expect(usageState({ code: 'AK_SK_REQUIRED' })).toEqual({ kind: 'ak-sk-required' })
  })

  test('allows using a complete API key but refuses masked values', () => {
    expect(canUseApiKey('qiniu-live-key')).toBe(true)
    expect(canUseApiKey('qiniu***key')).toBe(false)
    expect(maskedKeyRefusal('qiniu***key')).toMatch(/manual/i)
  })

  test('renders API key list metadata with masked Use refusal', () => {
    const tree = ApiKeyPanel({ keys: [{ name: 'production', maskedValue: 'qiniu***key', enabled: true }] }) as { children: unknown[] }
    const row = tree.children[1] as { children: unknown[] }
    const button = row.children[3] as { props: { disabled: boolean } }
    expect(button.props.disabled).toBe(true)
  })

  test('renders controls for enabled model state and overrides', () => {
    const tree = SettingsPage({ selections: [{ id: 'qwen-turbo', enabled: true, contextWindow: 32000 }] }) as { children: unknown[] }
    const text = JSON.stringify(tree)
    expect(text).toMatch(/Disable/)
    expect(text).toMatch(/contextWindow/)
  })

  test('invokes disable, override, and remove callbacks from enabled model controls', () => {
    const onUpdate = vi.fn()
    const onRemove = vi.fn()
    const tree = SettingsPage({
      selections: [{ id: 'qwen-turbo', enabled: true, contextWindow: 32000, maxOutputTokens: 4096 }],
      onUpdateSelection: onUpdate,
      onRemoveSelection: onRemove,
    }) as { children: unknown[] }
    const section = tree.children[1] as { children: unknown[] }
    const row = section.children[1] as { children: unknown[] }
    const disable = row.children.find((child) => (child as { children?: unknown[] })?.children?.includes('Disable')) as { props: { onClick: () => void } }
    disable.props.onClick()
    expect(onUpdate).toHaveBeenCalledWith('qwen-turbo', { enabled: false })
    const inputs = row.children.filter((child) => (child as { type?: string })?.type === 'input') as { props: { onChange: (event: { target: { value: string } }) => void } }[]
    inputs[0]?.props.onChange({ target: { value: '32768' } })
    inputs[1]?.props.onChange({ target: { value: '8192' } })
    expect(onUpdate).toHaveBeenCalledWith('qwen-turbo', { contextWindow: 32768 })
    expect(onUpdate).toHaveBeenCalledWith('qwen-turbo', { maxOutputTokens: 8192 })
    const remove = row.children.find((child) => (child as { children?: unknown[] })?.children?.includes('Remove')) as { props: { onClick: () => void } }
    remove.props.onClick()
    expect(onRemove).toHaveBeenCalledWith('qwen-turbo')
  })

  test('invokes marketplace Add and details callbacks', () => {
    const onAdd = vi.fn()
    const onDetails = vi.fn()
    const tree = ModelMarketplace({
      models: [{ id: 'm', name: 'Model', capabilities: ['text-input'] }], onAdd, onDetails,
    }) as { children: unknown[] }
    const card = ((tree.children[1] as { children: unknown[] }).children[0]) as { children: unknown[] }
    const buttons = card.children.filter((child) => (child as { type?: string })?.type === 'button') as { props: { onClick: () => void }; children: unknown[] }[]
    buttons[0]?.props.onClick()
    buttons[1]?.props.onClick()
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 'm' }))
    expect(onDetails).toHaveBeenCalledWith(expect.objectContaining({ id: 'm' }))
  })

  test('offers manual API key entry without using a masked value', () => {
    const onUse = vi.fn()
    const onManualEntry = vi.fn()
    const tree = ApiKeyPanel({ keys: [{ name: 'production', maskedValue: 'qiniu***key', enabled: true }], onUse, onManualEntry }) as { children: unknown[] }
    const row = tree.children[1] as { children: unknown[] }
    const input = row.children.find((child) => (child as { type?: string })?.type === 'input') as { props: { onChange: (event: { target: { value: string } }) => void } }
    input.props.onChange({ target: { value: 'qiniu-live-key' } })
    const manual = row.children.find((child) => (child as { children?: unknown[] })?.children?.includes('Use manually')) as { props: { onClick: () => void } }
    manual.props.onClick()
    expect(onUse).not.toHaveBeenCalled()
    expect(onManualEntry).toHaveBeenCalledWith('qiniu-live-key')
  })

  test('renders all usage result states including successful report data', () => {
    const tree = UsagePanel({ state: { kind: 'success', report: { items: [{ name: 'input_tokens', total: 42 }] } } }) as { children: unknown[] }
    expect(JSON.stringify(tree)).toContain('input_tokens')
    expect(JSON.stringify(UsagePanel({ state: { kind: 'loading' } }))).toContain('Loading')
    expect(JSON.stringify(UsagePanel({ state: { kind: 'error', message: 'network' } }))).toContain('network')
  })
  test('registers one additive settings.section contribution with required client services', () => {
    expect(injectClient).toEqual(['slots', 'locale', 'connection', 'remote', 'settingsScope', 'settingsSchema'])
    const register = vi.fn(() => vi.fn())
    const ctx = {
      locale: { register: vi.fn(), bind: vi.fn(() => (key: string) => key) },
      slots: { inject: vi.fn((_: string, callback: () => unknown) => callback()), register },
      get: vi.fn((name: string) => name === 'connection' ? { api: {} } : undefined),
      effect: vi.fn((callback: () => unknown) => callback()),
    }
    applyClient(ctx as never)
    expect(register).toHaveBeenCalledWith(expect.objectContaining({ name: 'settings.section', id: 'qiniu-maas' }), expect.anything())
    const entry = register.mock.calls[0]?.[0] as { inject?: () => Record<string, unknown> }
    expect(entry.inject).toEqual(expect.any(Function))
    expect(entry.inject?.()).toEqual(expect.objectContaining({ settings: expect.anything(), actions: expect.anything() }))
  })
})
