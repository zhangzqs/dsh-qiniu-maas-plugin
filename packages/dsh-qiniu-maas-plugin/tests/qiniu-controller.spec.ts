import { describe, expect, it, vi } from 'vitest';
import { createQiniuController } from '../src/client/controller/qiniu-controller.ts';
import { QINIU_API_KEY_REF } from '../src/client/controller/provider-sync.ts';

describe('qiniu controller', () => {
  it('checks API Key configuration on demand', async () => {
    const describeCredentials = vi.fn().mockResolvedValue({
      result: {
        ok: true,
        value: {
          credentials: {
            [QINIU_API_KEY_REF]: { configured: true },
          },
        },
      },
    });
    const controller = createQiniuController(
      { api: { credentials: { describe: describeCredentials } } } as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(controller.checkApiKeyConfigured()).resolves.toBe(true);
    expect(describeCredentials).toHaveBeenCalledWith({
      refs: [QINIU_API_KEY_REF],
    });
  });

  it('preserves enabled model IDs unavailable in the current region', async () => {
    const setEnabledModelIds = vi.fn().mockResolvedValue(undefined);
    const setProviders = vi.fn().mockResolvedValue(undefined);
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

    await controller.setEnabledModels([{ id: 'model-a', name: 'Model A' }]);

    expect(setEnabledModelIds).toHaveBeenCalledWith([
      'unavailable-model',
      'model-a',
    ]);
  });
});
