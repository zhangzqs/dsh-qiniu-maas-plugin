import { describe, expect, it } from 'vitest';
import { syncQiniuProvider } from '../src/client/controller/provider-config.ts';

describe('provider controller', () => {
  it('merges the Qiniu provider while preserving other providers', () => {
    expect(
      syncQiniuProvider(
        { openai: { apiKeyEnv: 'OPENAI_API_KEY' } },
        {
          enabledModelIds: ['model-a'],
          region: 'cn',
          inferenceProtocol: 'openai-completions',
        },
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
      syncQiniuProvider(
        {},
        {
          enabledModelIds: ['model-a'],
          region: 'global',
          inferenceProtocol: 'anthropic-messages',
        },
        [{ id: 'model-a', name: 'Model A' }],
      ),
    ).toMatchObject({
      'qiniu-maas': {
        api: 'anthropic-messages',
        baseURL: 'https://api.modelink.ai',
      },
    });
  });

  it('removes the provider when no enabled model remains', () => {
    const providers = {
      'qiniu-maas': {
        displayName: 'Qiniu MaaS',
        models: [{ id: 'model-a', name: 'Model A', contextWindow: 128000 }],
      },
    };

    expect(
      syncQiniuProvider(
        providers,
        {
          enabledModelIds: ['model-a'],
          region: 'global',
          inferenceProtocol: 'anthropic-messages',
        },
        [],
      ),
    ).toEqual({});
  });
});
