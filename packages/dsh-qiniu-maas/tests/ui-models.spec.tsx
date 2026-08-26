import { describe, expect, test, vi } from 'vitest'
import { createModelSelection, filterMarketplaceModels, updateModelSelection } from '../src/client/ModelMarketplace.js'
import { canUseApiKey, maskedKeyRefusal, ApiKeyPanel } from '../src/client/ApiKeyPanel.js'
import { usageState } from '../src/client/UsagePanel.js'
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
  })
})
