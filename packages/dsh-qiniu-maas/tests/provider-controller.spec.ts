import { describe, expect, it } from 'vitest';
import {
  selectEnabledModels,
  settingsWithEnabledModels,
  settingsWithInferenceEndpoint,
} from '../src/client/controller/provider-controller.ts';
import { enabledModelIdsOf } from '../src/client/controller/qiniu-state.ts';

const settings = (providers: Record<string, unknown>) =>
  ({ getSnapshot: () => ({ value: { providers } }) }) as never;
const qiniuSettings = (value: Record<string, unknown>) =>
  ({ getSnapshot: () => ({ value }) }) as never;

describe('provider controller', () => {
  it('keeps enabled models in marketplace order', () => {
    const models = [
      { id: 'model-a', name: 'Model A' },
      { id: 'model-b', name: 'Model B' },
    ];

    expect(selectEnabledModels(models, ['model-b'])).toEqual([models[1]]);
  });

  it('reads enabled model IDs from the Qiniu settings namespace', () => {
    expect(
      enabledModelIdsOf(
        qiniuSettings({ enabledModelIds: ['model-a', 'model-b'] }),
      ),
    ).toEqual(['model-a', 'model-b']);
  });

  it('merges the Qiniu provider while preserving other providers', () => {
    expect(
      settingsWithEnabledModels(
        settings({ openai: { apiKeyEnv: 'OPENAI_API_KEY' } }),
        [
          {
            id: 'model-a',
            name: 'Model A',
            architecture: {
              input_modalities: ['text'],
              output_modalities: ['text'],
            },
            model_constraints: { context_length: 128000, max_tokens: 8192 },
          },
        ],
      ),
    ).toMatchObject({
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
            input: ['text'],
          },
        ],
      },
    });
  });

  it('applies the selected inference region and protocol', () => {
    expect(
      settingsWithEnabledModels(
        settings({}),
        [{ id: 'model-a', name: 'Model A' }],
        'global',
        'anthropic-messages',
      ),
    ).toMatchObject({
      'qiniu-maas': {
        api: 'anthropic-messages',
        baseURL: 'https://openai.sufy.com/v1',
      },
    });
  });

  it('updates the endpoint without replacing saved model definitions', () => {
    const providers = {
      'qiniu-maas': {
        displayName: 'Qiniu MaaS',
        models: [{ id: 'model-a', name: 'Model A', contextWindow: 128000 }],
      },
    };

    expect(
      settingsWithInferenceEndpoint(
        settings(providers),
        'global',
        'anthropic-messages',
      ),
    ).toEqual({
      'qiniu-maas': {
        displayName: 'Qiniu MaaS',
        models: [{ id: 'model-a', name: 'Model A', contextWindow: 128000 }],
        api: 'anthropic-messages',
        baseURL: 'https://openai.sufy.com/v1',
      },
    });
  });
});
