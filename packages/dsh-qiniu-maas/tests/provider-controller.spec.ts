import { describe, expect, it } from 'vitest';
import {
  selectAvailableModels,
  settingsWithModels,
} from '../src/client/controller/provider-controller.ts';

const settings = (providers: Record<string, unknown>) =>
  ({ getSnapshot: () => ({ value: { providers } }) }) as never;

describe('provider controller', () => {
  it('keeps available models in marketplace order', () => {
    const market = [
      { id: 'model-a', name: 'Model A' },
      { id: 'model-b', name: 'Model B' },
    ];

    expect(selectAvailableModels(market, ['model-b'])).toEqual([market[1]]);
  });

  it('merges the Qiniu provider while preserving other providers', () => {
    expect(
      settingsWithModels(
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
      settingsWithModels(
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
});
