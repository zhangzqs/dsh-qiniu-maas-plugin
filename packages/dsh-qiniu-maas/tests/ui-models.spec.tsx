import { describe, expect, test, vi } from 'vitest'
import { ModelMarketplace, createModelSelection, filterMarketplaceModels, updateModelSelection } from '../src/client/ModelMarketplace.js'
import { canUseApiKey, maskedKeyRefusal, ApiKeyPanel } from '../src/client/ApiKeyPanel.js'
import { UsagePanel, usageState } from '../src/client/UsagePanel.js'
import { apply as applyClient, injectClient, createSettingsInject, mapRpcError } from '../src/client/index.js'
import { SettingsPage } from '../src/client/SettingsPage.js'

type ElementLike = { type?: string; props?: Record<string, unknown> }
function childrenOf(node: unknown): unknown[] {
  if (typeof node === 'string' || typeof node === 'number') return [node]
  const children = (node as ElementLike)?.props?.children
  const list = children === undefined ? [] : Array.isArray(children) ? children : [children]
  return list.flatMap(child => Array.isArray(child) ? child : [child]).filter(child => child !== null && child !== undefined && child !== false)
}
function propsOf(node: unknown): Record<string, unknown> { return (node as ElementLike)?.props ?? {} }
function typeOf(node: unknown): string | undefined { return (node as ElementLike)?.type }
function findElement(node: unknown, predicate: (value: unknown) => boolean): unknown {
  if (!node || typeof node !== 'object' || !('type' in node)) return undefined
  if (predicate(node)) return node
  for (const child of childrenOf(node)) {
    const found = findElement(child, predicate)
    if (found) return found
  }
  return undefined
}

describe('Qiniu MaaS model settings UI', () => {
  test('renders five settings tabs and uses the provided Chinese translator', () => {
    const tree = SettingsPage({
      selections: [],
      translate: (key: string) => ({
        'tab.marketplace': '模型广场',
        'tab.enabled': '已启用模型',
        'tab.credentials': 'AK/SK',
        'tab.apiKeys': 'API Key',
        'tab.usage': '用量统计',
      }[key] ?? key),
    } as never) as { children: unknown[] }
    const tablist = findElement(tree, child => propsOf(child).role === 'tablist') as { props: { children: unknown[] } }
    expect(childrenOf(tablist)).toHaveLength(5)
    expect(JSON.stringify(tablist)).toContain('模型广场')
    expect(JSON.stringify(tablist)).toContain('已启用模型')
    expect(JSON.stringify(tablist)).toContain('用量统计')
  })

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

  test('clears model overrides instead of persisting undefined fields', () => {
    expect(updateModelSelection([{ id: 'm', enabled: true, contextWindow: 32000, maxOutputTokens: 4096 }], 'm', {
      contextWindow: undefined,
      maxOutputTokens: undefined,
    })).toEqual([{ id: 'm', enabled: true }])
  })

  test('exposes AK_SK_REQUIRED as an explicit usage state', () => {
    expect(usageState({ code: 'AK_SK_REQUIRED' })).toEqual({ kind: 'ak-sk-required' })
  })

  test('renders marketplace loading, error, and empty-result states', () => {
    expect(JSON.stringify(ModelMarketplace({ models: [], loading: true }))).toContain('Loading marketplace')
    expect(JSON.stringify(ModelMarketplace({ models: [], error: 'offline' }))).toContain('offline')
    expect(JSON.stringify(ModelMarketplace({ models: [] }))).toContain('No models found')
  })

  test('allows using a complete API key but refuses masked values', () => {
    expect(canUseApiKey('qiniu-live-key')).toBe(true)
    expect(canUseApiKey('qiniu***key')).toBe(false)
    expect(maskedKeyRefusal('qiniu***key')).toMatch(/manual/i)
  })

  test('renders API key list metadata with masked Use refusal', () => {
    const tree = ApiKeyPanel({ keys: [{ name: 'production', maskedValue: 'qiniu***key', enabled: true }] }) as { children: unknown[] }
    const row = childrenOf(tree)[1] as { children: unknown[] }
    const button = childrenOf(row)[3] as { props: { disabled: boolean } }
    expect(button.props.disabled).toBe(true)
  })

  test('keeps manual key draft when explicit submission fails', async () => {
    const onManualEntry = vi.fn(async () => { throw new Error('write failed') })
    const tree = ApiKeyPanel({ keys: [{ name: 'production', maskedValue: 'qiniu***key', enabled: true }], onManualEntry }) as { children: unknown[] }
    const row = childrenOf(tree)[1] as { children: unknown[] }
    const input = childrenOf(row).find((child) => (child as { type?: string })?.type === 'input') as { props: { onChange: (event: { target: { value: string } }) => void; defaultValue: string } }
    input.props.onChange({ target: { value: 'qiniu-live-key' } })
    const manual = childrenOf(row).find((child) => childrenOf(child).includes('Use manually')) as { props: { onClick: () => Promise<void> } }
    await manual.props.onClick()
    expect(onManualEntry).toHaveBeenCalledWith('qiniu-live-key')
    const next = ApiKeyPanel({ keys: [{ name: 'production', maskedValue: 'qiniu***key', enabled: true }] }) as { children: unknown[] }
    const nextRow = childrenOf(next)[1] as { children: unknown[] }
    const nextInput = childrenOf(nextRow).find((child) => (child as { type?: string })?.type === 'input') as { props: { defaultValue: string } }
    expect(nextInput.props.defaultValue).toBe('qiniu-live-key')
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
    const section = findElement(tree, child => propsOf(child).className === 'qiniu-enabled-models') as { children: unknown[] }
    const row = childrenOf(section)[1] as { children: unknown[] }
    const disable = childrenOf(row).find((child) => childrenOf(child).includes('Disable')) as { props: { onClick: () => void } }
    disable.props.onClick()
    expect(onUpdate).toHaveBeenCalledWith('qwen-turbo', { enabled: false })
    const inputs = childrenOf(row).filter((child) => (child as { type?: string })?.type === 'input') as { props: { onChange: (event: { target: { value: string } }) => void } }[]
    inputs[0]?.props.onChange({ target: { value: '32768' } })
    inputs[1]?.props.onChange({ target: { value: '8192' } })
    expect(onUpdate).toHaveBeenCalledWith('qwen-turbo', { contextWindow: 32768 })
    expect(onUpdate).toHaveBeenCalledWith('qwen-turbo', { maxOutputTokens: 8192 })
    const remove = childrenOf(row).find((child) => childrenOf(child).includes('Remove')) as { props: { onClick: () => void } }
    remove.props.onClick()
    expect(onRemove).toHaveBeenCalledWith('qwen-turbo')
  })

  test('exposes named model inputs and routes all control callbacks', () => {
    const onChange = vi.fn()
    const tree = SettingsPage({ selections: [{ id: 'm', enabled: false }], onSelectionChange: onChange }) as { children: unknown[] }
    const enable = findElement(tree, child => typeOf(child) === 'button' && childrenOf(child).includes('Enable')) as { props: { onClick: () => void } }
    enable.props.onClick()
    const context = findElement(tree, child => (child as { props?: { name?: string } }).props?.name === 'contextWindow') as { props: { 'aria-label': string; onChange: (event: { target: { value: string } }) => void } }
    const output = findElement(tree, child => (child as { props?: { name?: string } }).props?.name === 'maxOutputTokens') as { props: { 'aria-label': string; onChange: (event: { target: { value: string } }) => void } }
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
    const grid = childrenOf(tree).find((child) => (child as { props?: { className?: string } }).props?.className === 'qiniu-model-grid') as { children: unknown[] }
    const card = childrenOf(grid)[0] as { children: unknown[] }
    const buttons = childrenOf(card).filter((child) => (child as { type?: string })?.type === 'button') as { props: { onClick: () => void }; children: unknown[] }[]
    buttons[0]?.props.onClick()
    buttons[1]?.props.onClick()
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 'm' }))
    expect(onDetails).toHaveBeenCalledWith(expect.objectContaining({ id: 'm' }))
  })

  test('offers manual API key entry without using a masked value', () => {
    const onUse = vi.fn()
    const onManualEntry = vi.fn()
    const tree = ApiKeyPanel({ keys: [{ name: 'production', maskedValue: 'qiniu***key', enabled: true }], onUse, onManualEntry }) as { children: unknown[] }
    const row = childrenOf(tree)[1] as { children: unknown[] }
    const input = childrenOf(row).find((child) => (child as { type?: string })?.type === 'input') as { props: { onChange: (event: { target: { value: string } }) => void } }
    input.props.onChange({ target: { value: 'qiniu-live-key' } })
    const manual = childrenOf(row).find((child) => childrenOf(child).includes('Use manually')) as { props: { onClick: () => void } }
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
  test('registers complete Chinese and English dictionaries', () => {
    const locale = { register: vi.fn(), bind: vi.fn(() => (key: string) => key) }
    const ctx = {
      locale,
      slots: { inject: vi.fn(), register: vi.fn() },
      get: vi.fn(),
      effect: vi.fn((callback: () => unknown) => callback()),
    }
    applyClient(ctx as never)
    expect(locale.register).toHaveBeenCalledWith('qiniu-maas', expect.objectContaining({ zh: expect.objectContaining({ 'tab.marketplace': '模型广场' }), en: expect.objectContaining({ 'tab.marketplace': 'Marketplace' }) }))
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

  test('subscribes to settings updates and detaches listeners on dispose', () => {
    const listeners = new Set<() => void>()
    const unsubscribe = vi.fn(() => { listeners.clear() })
    const runtime = { models: [], apiKeys: [], usage: { kind: 'loading' as const }, query: '' }
    const set = vi.fn(async () => undefined)
    const injected = createSettingsInject({ get: (name: string) => name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set, subscribe: (listener: () => void) => { listeners.add(listener); return unsubscribe } }) } : undefined } as never, runtime as never) as { dispose: () => void; hooks: { snapshot: { subscribe: (listener: () => void) => () => void } } }
    const listener = vi.fn()
    const remove = injected.hooks.snapshot.subscribe(listener)
    listeners.forEach(callback => callback())
    expect(listener).toHaveBeenCalledTimes(1)
    remove()
    injected.dispose()
    expect(unsubscribe).toHaveBeenCalled()
    expect(listeners).toHaveLength(0)
  })
  test('uses settings updates to mutate enabled model state', async () => {
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
    const model = findElement(tree, child => propsOf(child).className === 'qiniu-enabled-model') as { children?: unknown[] }
    const disable = childrenOf(model).find(child => typeOf(child) === 'button' && childrenOf(child).includes('Disable')) as { props?: { onClick?: () => void } }
    disable.props?.onClick?.()
    await Promise.resolve()
    expect(set).toHaveBeenCalledWith('models', [{ id: 'm', enabled: false }])
  })
  test('sets management credentials through private RPC only when Save is pressed', async () => {
    const rpc = vi.fn(async () => ({ ok: true, value: { ok: true } }))
    const injected = createSettingsInject({ get: (name: string) => name === 'connection' ? { rpc: { call: rpc } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set: vi.fn() }) } : undefined } as never) as { actions: { setManagementCredentials: (accessKey: string, secretKey: string) => Promise<unknown> } }
    const tree = SettingsPage({ actions: injected.actions, selections: [] }) as { children: unknown[] }
    const section = findElement(tree, child => propsOf(child).className === 'qiniu-management-credentials') as { children: unknown[] }
    const inputs = childrenOf(section).flatMap(child => childrenOf(child)).filter(child => (child as { type?: string })?.type === 'input') as { props: { onChange: (event: { target: { value: string } }) => void } }[]
    inputs[0]?.props.onChange({ target: { value: 'ak-live' } })
    inputs[1]?.props.onChange({ target: { value: 'sk-live' } })
    expect(rpc).not.toHaveBeenCalledWith('/api', 'qiniu-maas/set-management-credentials', expect.anything())
    const save = findElement(tree, child => typeOf(child) === 'button' && childrenOf(child).some(value => typeof value === 'string' && value.includes('Save'))) as { props: { onClick: () => Promise<void> } }
    await save.props.onClick()
    expect(rpc).toHaveBeenCalledWith('/api', 'qiniu-maas/set-management-credentials', { args: { accessKey: 'ak-live', secretKey: 'sk-live' } })
  })
  test('renders management credential save errors', () => {
    expect(JSON.stringify(SettingsPage({ selections: [], runtime: { models: [], apiKeys: [], usage: { kind: 'unavailable' }, query: '', managementCredentialsError: 'write failed' } }))).toContain('write failed')
  })
  test('writes manual API keys through the private Host RPC and rejects masked values', async () => {
    const rpc = vi.fn(async (_channel: string, endpoint: string) => endpoint === 'qiniu-maas/set-inference-api-key' ? { ok: true, value: { ok: true } } : { ok: true, value: [] })
    const ctx = { get: (name: string) => name === 'connection' ? { rpc: { call: rpc } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set: vi.fn() }) } : undefined }
    const injected = createSettingsInject(ctx as never) as { actions: { setManualApiKey: (value: string) => Promise<unknown>; useApiKey: (key: ApiKeySummary) => Promise<unknown> } }
    await injected.actions.setManualApiKey('sk-live')
    await expect(injected.actions.useApiKey({ name: 'masked', maskedValue: 'sk-...1234', enabled: true })).rejects.toThrow('complete API key')
    expect(rpc).toHaveBeenCalledWith('/api', 'qiniu-maas/set-inference-api-key', { args: { value: 'sk-live' } })
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
    const face = (register.mock.calls[0]?.[0] as { inject: () => { actions: { load: () => Promise<unknown> }; runtime: { models: readonly unknown[] } } }).inject()
    const loaded = await face.actions.load()
    expect(face.runtime.models).toEqual([model])
    expect(loaded).toMatchObject({ models: [model] })
    const component = register.mock.calls[0]?.[1] as (props: Record<string, unknown>) => unknown
    expect(JSON.stringify(component({}))).toContain('loaded-model')
  })
  test('registered SettingsPage subscribes to runtime snapshots and rerenders loaded models', async () => {
    const listeners = new Set<() => void>()
    const runtime = { models: [] as { id: string; name: string; capabilities: string[] }[], apiKeys: [], usage: { kind: 'loading' as const }, query: '' }
    const snapshot = { getSnapshot: () => ({ models: runtime.models, apiKeys: runtime.apiKeys, usage: runtime.usage }), subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) } }
    const entry = (await import('../src/client/index.js')).createSettingsPageEntry({ runtime, hooks: { snapshot }, settings: { getSnapshot: () => ({ value: { models: [] } }) }, actions: {} })
    const useSnapshot = vi.fn(() => snapshot.getSnapshot())
    const tree = entry({ useSnapshot }) as { children: unknown[] }
    expect(useSnapshot).toHaveBeenCalled()
    runtime.models.push({ id: 'live', name: 'Live', capabilities: [] })
    listeners.forEach(listener => listener())
    const refreshed = entry({ useSnapshot }) as { children: unknown[] }
    expect(JSON.stringify(refreshed)).toContain('live')
    expect(snapshot.subscribe).toBeTypeOf('function')
  })

  test('passes a selector to renderer snapshot hooks', () => {
    const useSnapshot = vi.fn((selector: (snapshot: { models: unknown[] }) => unknown) => selector({ models: [] }))
    SettingsPage({ selections: [], useSnapshot } as never)
    expect(useSnapshot).toHaveBeenCalledWith(expect.any(Function))
  })

  test('keeps injected snapshots stable until runtime state changes', () => {
    const runtime = { models: [], apiKeys: [], usage: { kind: 'loading' as const }, query: '' }
    const injected = createSettingsInject({ get: () => undefined } as never, runtime as never) as { hooks: { snapshot: { getSnapshot: () => unknown } } }
    expect(injected.hooks.snapshot.getSnapshot()).toBe(injected.hooks.snapshot.getSnapshot())
  })

  test('marketplace query changes update runtime and refresh uses load', async () => {
    const load = vi.fn(async () => undefined)
    const runtime = { models: [{ id: 'm', name: 'Model', capabilities: [] }], apiKeys: [], usage: { kind: 'loading' as const }, query: '' }
    const injected = { runtime, actions: { load, setQuery: (query: string) => { runtime.query = query } }, settings: { getSnapshot: () => ({ value: { models: [] } }) } }
    const tree = SettingsPage(injected as never) as { children: unknown[] }
    const input = findElement(tree, child => typeOf(child) === 'input' && (child as { props?: { placeholder?: string } }).props?.placeholder === 'Search models') as { props: { onChange: (event: { target: { value: string } }) => void } }
    input.props.onChange({ target: { value: 'model' } })
    const refresh = findElement(tree, child => typeOf(child) === 'button' && childrenOf(child).includes('Refresh')) as { props: { onClick: () => void } }
    refresh.props.onClick()
    expect(runtime.query).toBe('model')
    expect(load).toHaveBeenCalled()
  })

  test('details action is wired and renders detail state', async () => {
    const model = { id: 'm', name: 'Model', capabilities: [] }
    const modelDetails = vi.fn(async () => ({ id: 'm', name: 'Detailed model', capabilities: ['text-input'] }))
    const tree = SettingsPage({ models: [model], selections: [], actions: { modelDetails } } as never) as { children: unknown[] }
    const details = findElement(tree, child => typeOf(child) === 'button' && childrenOf(child).includes('Details')) as { props: { onClick: () => void } }
    details.props.onClick()
    await Promise.resolve()
    expect(modelDetails).toHaveBeenCalledWith('m')
  })

  test('credential status is loaded and rendered without exposing values', async () => {
    const status = { accessKey: { configured: false, writable: true }, secretKey: { configured: false, writable: true }, inferenceApiKey: { configured: true, writable: true } }
    const rpc = vi.fn(async (_channel: string, endpoint: string) => endpoint === 'qiniu-maas/credential-status' ? { ok: true, value: status } : { ok: true, value: [] })
    const ctx = { get: (name: string) => name === 'connection' ? { rpc: { call: rpc } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set: vi.fn() }) } : undefined }
    const injected = createSettingsInject(ctx as never) as { actions: { load: () => Promise<unknown> }; runtime: { credentialStatus?: unknown } }
    await injected.actions.load()
    expect(injected.runtime.credentialStatus).toEqual(status)
    expect(JSON.stringify(injected.runtime.credentialStatus)).not.toContain('qiniu-live-secret')
  })

  test('manual and saved API-key actions use the private RPC and never write on typing', async () => {
    const rpc = vi.fn(async () => ({ ok: true, value: { ok: true } }))
    const injected = createSettingsInject({ get: (name: string) => name === 'connection' ? { rpc: { call: rpc }, api: { credentials: { set: vi.fn() } } } : name === 'settingsScope' ? { bind: () => ({ getSnapshot: () => ({ value: { models: [] } }), set: vi.fn() }) } : undefined } as never) as { actions: { setManualApiKey: (value: string) => Promise<unknown>; useApiKey: (key: ApiKeySummary) => Promise<unknown> } }
    await injected.actions.setManualApiKey('sk-live')
    await injected.actions.useApiKey({ name: 'saved', maskedValue: 'sk-live', enabled: true })
    expect(rpc).toHaveBeenCalledWith('/api', 'qiniu-maas/set-inference-api-key', { args: { value: 'sk-live' } })
  })
})
