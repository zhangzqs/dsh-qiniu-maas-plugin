import { describe, expect, it } from 'vitest';
import {
  settingsWithEnabledModels,
  settingsWithInferenceEndpoint,
} from '../src/client/controller/provider-config.ts';

describe('provider controller', () => {
  it('merges the Qiniu provider while preserving other providers', () => {
    expect(
      settingsWithEnabledModels({ openai: { apiKeyEnv: 'OPENAI_API_KEY' } }, [
        {
          id: 'model-a',
          name: 'Model A',
          architecture: {
            input_modalities: ['text'],
            output_modalities: ['text'],
          },
          model_constraints: { context_length: 128000, max_tokens: 8192 },
        },
      ]),
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
        {},
        [{ id: 'model-a', name: 'Model A' }],
        'global',
        'anthropic-messages',
      ),
    ).toMatchObject({
      'qiniu-maas': {
        api: 'anthropic-messages',
        baseURL: 'https://api.modelink.ai',
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
      settingsWithInferenceEndpoint(providers, 'global', 'anthropic-messages'),
    ).toEqual({
      'qiniu-maas': {
        displayName: 'Qiniu MaaS',
        models: [{ id: 'model-a', name: 'Model A', contextWindow: 128000 }],
        api: 'anthropic-messages',
        baseURL: 'https://api.modelink.ai',
      },
    });
  });
});
