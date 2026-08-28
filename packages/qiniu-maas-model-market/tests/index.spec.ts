import { describe, expect, it, vi } from 'vitest';
import { QINIU_LLM_BASE_URLS, listModels } from '../src/index.ts';

describe('qiniu-maas-model-market', () => {
  it('exports inference service URLs for the shared Qiniu region type', () => {
    expect(QINIU_LLM_BASE_URLS).toEqual({
      cn: 'https://api.qnaigc.com/v1',
      global: 'https://openai.sufy.com/v1',
    });
  });

  it('requests the public domestic marketplace without credentials', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: true,
          data: [
            {
              id: 'deepseek-v4-flash',
              name: 'DeepSeek V4 Flash',
              description: 'Fast model',
              avatar: 'https://cdn.example/model.png',
              hot_tags: ['fast'],
              features: ['text generation'],
              issuer: {
                name: 'DeepSeek',
                avatar: 'https://cdn.example/issuer.png',
              },
              model_constraints: { context_length: 128000, max_tokens: 8192 },
              architecture: {
                input_modalities: ['text'],
                output_modalities: ['text'],
                reasoning: { supported: true },
              },
              pricing_rules_v2: [],
              support_api_protocols: ['openai'],
            },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    const models = await listModels({
      fetch: fetcher,
    });

    expect(fetcher).toHaveBeenCalledWith(
      'https://api.qnaigc.com/v1/market/models',
      { method: 'GET', headers: { accept: 'application/json' } },
    );
    expect(models[0]).toMatchObject({
      id: 'deepseek-v4-flash',
      name: 'DeepSeek V4 Flash',
      avatar: 'https://cdn.example/model.png',
      hot_tags: ['fast'],
      model_constraints: { context_length: 128000, max_tokens: 8192 },
      architecture: {
        input_modalities: ['text'],
        reasoning: { supported: true },
      },
    });
  });

  it('supports the global marketplace region and rejects failed responses', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('{"status":false}', { status: 503 }));

    await expect(
      listModels({ fetch: fetcher, region: 'global' }),
    ).rejects.toThrow('model marketplace request failed (503)');
    expect(fetcher.mock.calls[0]?.[0]).toBe(
      'https://openai.sufy.com/v1/market/models',
    );
  });

  it('normalizes invalid JSON responses as marketplace errors', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('not-json', { status: 200 }));

    await expect(listModels({ fetch: fetcher })).rejects.toThrow(
      'model marketplace response is malformed',
    );
  });

  it('rejects a response envelope without a successful status', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), { status: 200 }),
      );

    await expect(listModels({ fetch: fetcher })).rejects.toThrow(
      'model marketplace response is malformed',
    );
  });
});
