import { describe, expect, test, vi } from 'vitest'
import { ModelMarketplace, createModelSelection, filterMarketplaceModels, updateModelSelection } from '../src/client/ModelMarketplace.js'
import { canUseApiKey, maskedKeyRefusal, ApiKeyPanel } from '../src/client/ApiKeyPanel.js'
import { UsagePanel, usageState } from '../src/client/UsagePanel.js'
import { apply as applyClient, injectClient, createSettingsInject, mapRpcError } from '../src/client/index.js'
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

  test('exposes named model inputs and routes all control callbacks', () => {
    const onChange = vi.fn()
    const tree = SettingsPage({ selections: [{ id: 'm', enabled: false }], onSelectionChange: onChange }) as { children: unknown[] }
    const row = ((tree.children[1] as { children: unknown[] }).children[1]) as { children: unknown[] }
    const enable = row.children.find((child) => (child as { children?: unknown[] }).children?.includes('Enable')) as { props: { onClick: () => void } }
    enable.props.onClick()
    const context = row.children.find((child) => (child as { props?: { name?: string } }).props?.name === 'contextWindow') as { props: { 'aria-label': string; onChange: (event: { target: { value: string } }) => void } }
    const output = row.children.find((child) => (child as { props?: { name?: string } }).props?.name === 'maxOutputTokens') as { props: { 'aria-label': string; onChange: (event: { target: { value: string } }) => void } }
    expect(context.props['aria-label']).toBe('contextWindow')
    expect(output.props['aria-label']).toBe('maxOutputTokens')
    context.props.onChange({ target: { value: '16384' } })
    output.props.onChange({ target: { value: '2048' } })
    expect(onChange).toHaveBeenNthCalledWith(1, 'm', { enabled: true })
    expect(onChange).toHaveBeenNthCalledWith(2, 'm', { contextWindow: 16384 })
    expect(onChange).toHaveBeenNthCalledWith(3, 'm', { maxOutputTokens: 2048 })
  })

  test('invokes marketplace Add and details callbacks', () => {
    const onAdd = vi.fn()
    const onDetails = vi.fn()
    const tree = ModelMarketplace({
      models: [{ id: 'm', name: 'Model', capabilities: ['text-input'] }], onAdd, onDetails,
    }) as { children: unknown[] }
    const grid = tree.children.find((child) => (child as { props?: { className?: string } }).props?.className === 'qiniu-model-grid') as { children: unknown[] }
    const card = grid.children[0] as { children: unknown[] }
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
    const face = entry.inject?.()
    expect(face).toEqual(expect.objectContaining({ settings: expect.anything(), actions: expect.anything() }))
    expect(entry.inject?.()).toBe(face)
  })
})

describe('Qiniu MaaS client runtime', () => {
  test('uses injected settings and actions to load and mutate the section', async () => {
    const set = vi.fn(async () => undefined)
    const rpc = vi.fn(async (_channel: string, endpoint: string) => endpoint === 'qiniu-maas/list-models' ? { ok: true, value: [{ id: 'm', name: 'M', capabilities: [] }] } : { ok: true, value: [] })
    const ctx = {
      get: (name: string) => name === 'connection' ? { rpc: { call: rpc } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set }) } : undefined,
    }
    const injected = createSettingsInject(ctx as never) as { actions: Record<string, (...args: any[]) => Promise<unknown>> }
    await injected.actions.listModels()
    await injected.actions.addModel({ id: 'm', name: 'M', capabilities: [] })
    expect(rpc).toHaveBeenCalledWith('/api', 'qiniu-maas/list-models', { args: {} })
    expect(set).toHaveBeenCalledWith('models', [{ id: 'm', enabled: true }])
  })

  test.each([
    [{ code: 'AK_SK_REQUIRED' }, 'ak-sk-required'],
    [{ code: 'NETWORK', message: 'offline' }, 'error'],
    [new Error('boom'), 'error'],
  ])('maps RPC result to usage state', (value, kind) => {
    expect(mapRpcError(value).kind).toBe(kind)
  })

  test('registered SettingsPage receives injected settings and actions at runtime', async () => {
    const set = vi.fn(async () => undefined)
    const ctx = {
      locale: { register: vi.fn(), bind: vi.fn(() => (key: string) => key) },
      slots: { inject: vi.fn((_: string, callback: () => unknown) => callback()), register: vi.fn(() => vi.fn()) },
      get: vi.fn((name: string) => name === 'connection' ? { rpc: { call: vi.fn(async () => ({ ok: true, value: [] })) } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [{ id: 'm', enabled: true }] } }), set }) } : undefined),
      effect: vi.fn((callback: () => unknown) => callback()),
    }
    applyClient(ctx as never)
    const component = (ctx.slots.register as ReturnType<typeof vi.fn>).mock.calls[0]?.[1] as (props: Record<string, unknown>) => { children?: unknown[] }
    const tree = component({ close: vi.fn() })
    const enabled = tree.children?.[1] as { children?: unknown[] }
    const model = enabled.children?.[1] as { children?: unknown[] }
    const disable = model.children?.[2] as { props?: { onClick?: () => void } }
    disable.props?.onClick?.()
    await Promise.resolve()
    expect(set).toHaveBeenCalledWith('models', [{ id: 'm', enabled: false }])
  })
  test('writes manual API keys through the DSH credentials API and rejects masked values', async () => {
    const set = vi.fn(async () => ({ ok: true }))
    const ctx = { get: (name: string) => name === 'connection' ? { api: { credentials: { set } } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set: vi.fn() }) } : undefined }
    const injected = createSettingsInject(ctx as never) as { actions: { setManualApiKey: (value: string) => Promise<unknown>; useApiKey: (key: ApiKeySummary) => Promise<unknown> } }
    await injected.actions.setManualApiKey('sk-live')
    await expect(injected.actions.useApiKey({ name: 'masked', maskedValue: 'sk-...1234', enabled: true })).rejects.toThrow('complete API key')
    expect(set).toHaveBeenCalledWith({ ref: 'QINIU_MAAS_API_KEY', value: 'sk-live' })
    expect(set).toHaveBeenCalledTimes(1)
  })
  test('loaded marketplace data reaches the registered SettingsPage component', async () => {
    const model = { id: 'loaded-model', name: 'Loaded model', capabilities: [] }
    const rpc = vi.fn(async (_channel: string, endpoint: string) => endpoint === 'qiniu-maas/list-models' ? { ok: true, value: [model] } : { ok: true, value: [] })
    const register = vi.fn(() => vi.fn())
    const ctx = {
      locale: { register: vi.fn(), bind: vi.fn(() => (key: string) => key) },
      slots: { inject: vi.fn((_: string, callback: () => unknown) => callback()), register },
      get: vi.fn((name: string) => name === 'connection' ? { rpc: { call: rpc } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set: vi.fn() }) } : undefined),
      effect: vi.fn((callback: () => unknown) => callback()),
    }
    applyClient(ctx as never)
    const face = (register.mock.calls[0]?.[0] as { inject: () => { actions: { load: () => Promise<unknown> } } }).inject()
    await face.actions.load()
    const component = register.mock.calls[0]?.[1] as (props: Record<string, unknown>) => unknown
    expect(JSON.stringify(component({}))).toContain('loaded-model')
  })
  test('exports a loader-compatible client apply entrypoint', () => {
    expect(typeof applyClient).toBe('function')
    expect(injectClient).toContain('slots')
  })
})
