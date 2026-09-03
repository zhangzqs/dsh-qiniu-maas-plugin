import { describe, expect, it } from 'vitest';
import { syncProviderSettings } from '../src/client/controller/provider-sync.ts';
import type { PiAiSettingsController } from '../src/client/controller/settings/pi-ai.ts';
import type { QiniuSettingsController } from '../src/client/controller/settings/qiniu.ts';

function createSettingsController(
  providers: Parameters<PiAiSettingsController['setProviders']>[0],
): PiAiSettingsController {
  let value = { providers };
  return {
    read: () => value,
    setProviders: async (nextProviders) => {
      value = { providers: nextProviders };
    },
  };
}

function createQiniuSettingsController(
  value: ReturnType<QiniuSettingsController['read']>,
): QiniuSettingsController {
  return {
    read: () => value,
    subscribe: () => () => {},
    setEnabledModelIds: async () => {},
    setRegion: async () => {},
    setInferenceProtocol: async () => {},
  };
}

describe('provider sync', () => {
  it('merges the Qiniu provider while preserving other providers', async () => {
    const settings = createSettingsController({
      openai: { apiKeyEnv: 'OPENAI_API_KEY' },
    });
    const qiniuSettings = createQiniuSettingsController({
      enabledModelIds: ['model-a'],
      region: 'cn',
      inferenceProtocol: 'openai-completions',
    });
    await syncProviderSettings(settings, qiniuSettings, [
      {
        id: 'model-a',
        name: 'Model A',
        architecture: {
          input_modalities: ['text', 'image'],
          output_modalities: ['text'],
        },
        model_constraints: { context_length: 128000, max_tokens: 8192 },
      },
    ]);

    expect(settings.read().providers).toMatchObject({
      openai: { apiKeyEnv: 'OPENAI_API_KEY' },
      'qiniu-maas': {
        displayName: 'Qiniu MaaS',
        api: 'openai-completions',
        baseURL: 'https://api.qnaigc.com/v1',
        models: [
          {
            id: 'model-a',
            name: 'Model A',
            contextWindow: 128000,
            maxTokens: 8192,
            input: ['text', 'image'],
          },
        ],
      },
    });
  });

  it('applies the selected inference region and protocol', async () => {
    const settings = createSettingsController({});
    const qiniuSettings = createQiniuSettingsController({
      enabledModelIds: ['model-a'],
      region: 'global',
      inferenceProtocol: 'anthropic-messages',
    });
    await syncProviderSettings(settings, qiniuSettings, [
      { id: 'model-a', name: 'Model A' },
    ]);

    expect(settings.read().providers).toMatchObject({
      'qiniu-maas': {
        api: 'anthropic-messages',
        baseURL: 'https://api.modelink.ai',
      },
    });
  });

  it('keeps models with invalid marketplace constraints usable', async () => {
    const settings = createSettingsController({});
    const qiniuSettings = createQiniuSettingsController({
      enabledModelIds: ['model-a'],
      region: 'cn',
      inferenceProtocol: 'openai-completions',
    });

    await syncProviderSettings(settings, qiniuSettings, [
      {
        id: 'model-a',
        name: 'Model A',
        model_constraints: {
          context_length: 1000000,
          max_completion_tokens: 0,
          max_tokens: 128000,
        },
      } as never,
    ]);

    expect(settings.read().providers['qiniu-maas']).toMatchObject({
      models: [
        {
          id: 'model-a',
          name: 'Model A',
          contextWindow: 1000000,
          maxTokens: 128000,
        },
      ],
    });
    expect(settings.read().providers['qiniu-maas']).not.toMatchObject({
      models: [{ contextWindow: 0, maxTokens: 0 }],
    });
  });

  it('omits the output limit when all output limits are zero', async () => {
    const settings = createSettingsController({});
    const qiniuSettings = createQiniuSettingsController({
      enabledModelIds: ['model-a'],
      region: 'cn',
      inferenceProtocol: 'openai-completions',
    });

    await syncProviderSettings(settings, qiniuSettings, [
      {
        id: 'model-a',
        name: 'Model A',
        model_constraints: {
          context_length: 1000000,
          max_completion_tokens: 0,
          max_tokens: 0,
        },
      } as never,
    ]);

    expect(settings.read().providers['qiniu-maas']).toMatchObject({
      models: [{ id: 'model-a', name: 'Model A' }],
    });
    expect(settings.read().providers['qiniu-maas']).not.toMatchObject({
      models: [{ maxTokens: expect.anything() }],
    });
  });

  it('removes the provider when no enabled model remains', async () => {
    const settings = createSettingsController({
      'qiniu-maas': {
        displayName: 'Qiniu MaaS',
        models: [{ id: 'model-a', name: 'Model A', contextWindow: 128000 }],
      },
    });
    const qiniuSettings = createQiniuSettingsController({
      enabledModelIds: ['model-a'],
      region: 'global',
      inferenceProtocol: 'anthropic-messages',
    });

    await syncProviderSettings(settings, qiniuSettings, []);

    expect(settings.read().providers).toEqual({});
  });
});
