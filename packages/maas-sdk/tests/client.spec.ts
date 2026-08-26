import { expect, test } from 'vitest';
import { MaaSClient } from '../src/client';

const marketplaceResponse = {
  data: {
    items: [
      {
        id: 'deepseek-v4-flash',
        name: 'DeepSeek V4 Flash',
        description: 'Fast reasoning model',
        context_length: 128000,
        capabilities: ['chat', 'reasoning']
      }
    ]
  }
};

test('lists marketplace models without an Authorization header and normalizes model fields', async () => {
  let request: Request | undefined;
  const fetcher: typeof fetch = async (input, init) => {
    request = new Request(input, init);
    return new Response(JSON.stringify(marketplaceResponse), { status: 200 });
  };

  const client = new MaaSClient({ fetch: fetcher });
  const models = await client.listModels();

  expect(request?.url).toBe('https://api.qiniu.com/ai/v1/market/models');
  expect(request?.headers.has('authorization')).toBe(false);
  expect(models).toEqual([
    {
      id: 'deepseek-v4-flash',
      name: 'DeepSeek V4 Flash',
      description: 'Fast reasoning model',
      contextWindow: 128000,
      capabilities: ['chat', 'reasoning']
    }
  ]);
});

test('sends a generated AK/SK Authorization value for privileged requests', async () => {
  let request: Request | undefined;
  const fetcher: typeof fetch = async (input, init) => {
    request = new Request(input, init);
    return new Response(JSON.stringify({ data: {} }), { status: 200 });
  };

  const client = new MaaSClient({ fetch: fetcher, accessKey: 'test-ak', secretKey: 'test-sk' });
  await client.getAccount();

  const authorization = request?.headers.get('authorization');
  expect(authorization).toMatch(/^Qiniu test-ak:[A-Za-z0-9_-]+$/);
});
