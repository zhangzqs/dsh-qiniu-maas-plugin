import { describe, expect, it, vi } from 'vitest';
const listModelsMock = vi.hoisted(() => vi.fn());
vi.mock('qiniu-maas-market-sdk', async () => ({
  ...(await vi.importActual('qiniu-maas-market-sdk')),
  listModels: listModelsMock,
}));
import { createQiniuController } from '../src/client/controller/qiniu-controller.ts';
import { QINIU_API_KEY_REF } from '../src/client/controller/provider-sync.ts';

describe('qiniu controller', () => {
  it('caches market models by region and supports force refresh', async () => {
    listModelsMock
      .mockResolvedValueOnce([
        {
          id: 'model-a',
          name: 'Model A',
          rank: 1,
          support_api_protocols: ['openai'],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'model-b',
          name: 'Model B',
          rank: 2,
          support_api_protocols: ['anthropic'],
        },
      ]);
    const controller = createQiniuController(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(controller.fetchMarketModels('cn')).resolves.toEqual([
      {
        id: 'model-a',
        name: 'Model A',
        rank: 1,
        support_api_protocols: ['openai'],
      },
    ]);
    await expect(controller.fetchMarketModels('cn')).resolves.toEqual([
      {
        id: 'model-a',
        name: 'Model A',
        rank: 1,
        support_api_protocols: ['openai'],
      },
    ]);
    await expect(controller.fetchMarketModels('cn', true)).resolves.toEqual([
      {
        id: 'model-b',
        name: 'Model B',
        rank: 2,
        support_api_protocols: ['anthropic'],
      },
    ]);
    expect(listModelsMock).toHaveBeenCalledTimes(2);
  });

  it('filters out models without an OpenAI or Anthropic API protocol', async () => {
    listModelsMock.mockResolvedValueOnce([
      {
        id: 'text-model',
        name: 'Text Model',
        rank: 1,
        support_api_protocols: ['openai'],
      },
      {
        id: 'video-model',
        name: 'Video Model',
        rank: 2,
        support_api_protocols: ['wan-video'],
      },
    ]);
    const controller = createQiniuController(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(controller.fetchMarketModels('cn')).resolves.toEqual([
      {
        id: 'text-model',
        name: 'Text Model',
        rank: 1,
        support_api_protocols: ['openai'],
      },
    ]);
  });

  it('checks API Key configuration on demand', async () => {
    const describeCredentials = vi.fn().mockResolvedValue({
      ok: true,
      value: {
        [QINIU_API_KEY_REF]: { configured: true, writable: true },
      },
    });
    const controller = createQiniuController(
      {
        remote: { credentials: { describe: describeCredentials } },
      } as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(controller.checkApiKeyConfigured()).resolves.toBe(true);
    expect(describeCredentials).toHaveBeenCalledWith([QINIU_API_KEY_REF]);
  });

  it('stores the API Key through the credentials remote', async () => {
    const setCredential = vi.fn().mockResolvedValue({
      ok: true,
      value: undefined,
    });
    const controller = createQiniuController(
      { remote: { credentials: { set: setCredential } } } as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await controller.setApiKey('  test-key  ');

    expect(setCredential).toHaveBeenCalledWith(QINIU_API_KEY_REF, 'test-key');
  });

  it('sets enabled model IDs directly', async () => {
    listModelsMock.mockResolvedValueOnce([
      {
        id: 'model-a',
        name: 'Model A',
        rank: 1,
        support_api_protocols: ['openai'],
      },
    ]);
    const setEnabledModelIds = vi.fn().mockResolvedValue(true);
    const setProviders = vi.fn().mockResolvedValue(true);
    const settings = {
      enabledModelIds: ['unavailable-model', 'model-a'],
      region: 'global',
      inferenceProtocol: 'openai-completions',
    } as const;
    const controller = createQiniuController(
      {} as never,
      { read: () => settings, setEnabledModelIds } as never,
      { read: () => ({ providers: {} }), setProviders } as never,
      {
        update: vi.fn(),
        getSnapshot: () => ({ enabledModelIds: [] }),
      } as never,
    );

    await controller.setEnabledModelIds(['model-a']);

    expect(setEnabledModelIds).toHaveBeenCalledWith([
      'unavailable-model',
      'model-a',
    ]);
  });

  it('removes a model from settings when it is disabled', async () => {
    listModelsMock.mockResolvedValueOnce([
      {
        id: 'model-a',
        name: 'Model A',
        rank: 1,
        support_api_protocols: ['openai'],
      },
    ]);
    const setEnabledModelIds = vi.fn().mockResolvedValue(true);
    const setProviders = vi.fn().mockResolvedValue(true);
    const settings = {
      enabledModelIds: ['model-a'],
      region: 'cn',
      inferenceProtocol: 'openai-completions',
    } as const;
    const controller = createQiniuController(
      {} as never,
      { read: () => settings, setEnabledModelIds } as never,
      { read: () => ({ providers: {} }), setProviders } as never,
      { update: vi.fn() } as never,
    );

    await controller.setEnabledModelIds([]);

    expect(setEnabledModelIds).toHaveBeenCalledWith([]);
  });

  it('automatically enables the top five non-retired models once', async () => {
    listModelsMock.mockResolvedValueOnce(
      Array.from({ length: 6 }, (_, index) => ({
        id: `model-${index + 1}`,
        name: `Model ${index + 1}`,
        rank: 6 - index,
        release_at: `2026-0${index + 1}-01T00:00:00Z`,
        suggested_model: index === 2 ? 'model-1' : '',
        support_api_protocols: ['openai'],
      })),
    );
    const setEnabledModelIds = vi.fn().mockResolvedValue(true);
    const setHasAutoEnabledDefaultModels = vi.fn().mockResolvedValue(true);
    const setProviders = vi.fn().mockResolvedValue(true);
    const settings = {
      enabledModelIds: [],
      hasAutoEnabledDefaultModels: false,
      region: 'cn',
      inferenceProtocol: 'openai-completions',
    } as const;
    const controller = createQiniuController(
      {} as never,
      {
        read: () => settings,
        setEnabledModelIds,
        setHasAutoEnabledDefaultModels,
      } as never,
      { read: () => ({ providers: {} }), setProviders } as never,
      { update: vi.fn() } as never,
    );

    await controller.initializeDefaultModels();

    expect(setEnabledModelIds).toHaveBeenCalledWith([
      'model-6',
      'model-5',
      'model-4',
      'model-2',
      'model-1',
    ]);
    expect(setHasAutoEnabledDefaultModels).toHaveBeenCalledWith(true);
  });

  it('does not replace existing models during initialization', async () => {
    listModelsMock.mockResolvedValueOnce([]);
    const setHasAutoEnabledDefaultModels = vi.fn().mockResolvedValue(true);
    const settings = {
      enabledModelIds: ['existing-model'],
      hasAutoEnabledDefaultModels: false,
      region: 'cn',
      inferenceProtocol: 'openai-completions',
    } as const;
    const controller = createQiniuController(
      {} as never,
      {
        read: () => settings,
        setHasAutoEnabledDefaultModels,
      } as never,
      {
        read: () => ({ providers: {} }),
        setProviders: vi.fn().mockResolvedValue(true),
      } as never,
      { update: vi.fn() } as never,
    );

    await controller.initializeDefaultModels();

    expect(setHasAutoEnabledDefaultModels).toHaveBeenCalledWith(true);
    expect(listModelsMock).toHaveBeenCalledWith({ region: 'cn' });
  });

  it('does not mark initialization complete when no models are available', async () => {
    listModelsMock.mockResolvedValueOnce([]);
    const setHasAutoEnabledDefaultModels = vi.fn().mockResolvedValue(true);
    const controller = createQiniuController(
      {} as never,
      {
        read: () => ({
          enabledModelIds: [],
          hasAutoEnabledDefaultModels: false,
          region: 'cn',
          inferenceProtocol: 'openai-completions',
        }),
        setHasAutoEnabledDefaultModels,
      } as never,
      {} as never,
      {} as never,
    );

    await controller.initializeDefaultModels();

    expect(setHasAutoEnabledDefaultModels).not.toHaveBeenCalled();
  });

  it('stops initialization after disposal while models are loading', async () => {
    const models = Promise.withResolvers<
      Array<{
        id: string;
        name: string;
        rank: number;
        support_api_protocols: string[];
      }>
    >();
    listModelsMock.mockReturnValueOnce(models.promise);
    const setEnabledModelIds = vi.fn().mockResolvedValue(true);
    const setHasAutoEnabledDefaultModels = vi.fn().mockResolvedValue(true);
    const controller = createQiniuController(
      {} as never,
      {
        read: () => ({
          enabledModelIds: [],
          hasAutoEnabledDefaultModels: false,
          region: 'cn',
          inferenceProtocol: 'openai-completions',
        }),
        setEnabledModelIds,
        setHasAutoEnabledDefaultModels,
      } as never,
      {} as never,
      {} as never,
    );
    const abortController = new AbortController();

    const initializing = controller.initializeDefaultModels(
      abortController.signal,
    );
    abortController.abort();
    models.resolve([
      {
        id: 'model-a',
        name: 'Model A',
        rank: 1,
        support_api_protocols: ['openai'],
      },
    ]);
    await initializing;

    expect(setEnabledModelIds).not.toHaveBeenCalled();
    expect(setHasAutoEnabledDefaultModels).not.toHaveBeenCalled();
  });

  it('does not update local model state when the Host refuses the write', async () => {
    listModelsMock.mockResolvedValueOnce([
      {
        id: 'model-a',
        name: 'Model A',
        rank: 1,
        support_api_protocols: ['openai'],
      },
    ]);
    const update = vi.fn();
    const controller = createQiniuController(
      {} as never,
      {
        read: () => ({
          enabledModelIds: [],
          region: 'cn',
          inferenceProtocol: 'openai-completions',
        }),
        setEnabledModelIds: vi.fn().mockResolvedValue(false),
      } as never,
      {} as never,
      { update } as never,
    );

    await expect(controller.setEnabledModelIds(['model-a'])).rejects.toThrow(
      'settings write was refused',
    );
    expect(update).not.toHaveBeenCalled();
  });
});
