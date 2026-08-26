import { expect, test } from 'vitest';
import { MaaSClient, MAAS_SERVER_ROOT } from '../src/client';

const marketplaceResponse = {
  data: [
    {
      id: 'deepseek-v4-flash',
      name: 'DeepSeek V4 Flash',
      description: 'Fast reasoning model',
      context_length: 128000,
      capabilities: ['chat', 'reasoning']
    }
  ]
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

test('ignores supplied AK/SK credentials for public marketplace requests', async () => {
  let authorization: string | null = 'unset';
  const fetcher: typeof fetch = async (input, init) => {
    const request = new Request(input, init);
    authorization = request.headers.get('authorization');
    return new Response(JSON.stringify(marketplaceResponse), { status: 200 });
  };

  await new MaaSClient({ fetch: fetcher, accessKey: 'public-ak', secretKey: 'public-sk' }).listModels();

  expect(authorization).toBeNull();
});

test('normalizes malformed and obsolete marketplace responses into MaaSError', async () => {
  const fetcher: typeof fetch = async () => new Response(JSON.stringify({ data: [{ name: 'missing-id' }] }), { status: 200 });

  await expect(new MaaSClient({ fetch: fetcher }).listModels()).rejects.toMatchObject({
    name: 'MaaSError',
    operation: 'listModels'
  });

  const obsoleteFetcher: typeof fetch = async () => new Response(JSON.stringify({ data: { items: [marketplaceResponse.data[0]] } }), { status: 200 });
  await expect(new MaaSClient({ fetch: obsoleteFetcher }).listModels()).rejects.toMatchObject({
    name: 'MaaSError',
    operation: 'listModels'
  });
});

test('redacts credentials and sensitive response text from HTTP errors and serialization', async () => {
  const sensitive = 'AK=test-ak SK=test-sk Authorization=Bearer-secret response-secret';
  const fetcher: typeof fetch = async () => new Response(sensitive, {
    status: 500,
    headers: { 'x-reqid': 'req-123' }
  });

  try {
    await new MaaSClient({ fetch: fetcher, accessKey: 'test-ak', secretKey: 'test-sk' }).requestManagement('/inapi/v3/apikeys');
    throw new Error('expected request to fail');
  } catch (error) {
    expect(error).toMatchObject({ name: 'MaaSError', status: 500, requestId: 'req-123' });
    expect((error as Error).message).not.toContain('test-ak');
    expect((error as Error).message).not.toContain('test-sk');
    expect((error as Error).message).not.toContain('Authorization');
    expect((error as Error).message).not.toContain('response-secret');
    expect(JSON.stringify(error)).not.toContain('test-ak');
    expect(JSON.stringify(error)).not.toContain('test-sk');
    expect(JSON.stringify(error)).not.toContain('Authorization');
    expect(JSON.stringify(error)).not.toContain('Bearer-secret');
    expect(JSON.stringify(error)).not.toContain('response-secret');
  }
});

test('normalizes injected transport exceptions into a redacted MaaSError', async () => {
  const fetcher: typeof fetch = async () => {
    throw new Error('AK=test-ak SK=test-sk Authorization: Qiniu test-ak:signature transport-secret');
  };

  try {
    await new MaaSClient({ fetch: fetcher, accessKey: 'test-ak', secretKey: 'test-sk' }).listModels();
    throw new Error('expected transport to fail');
  } catch (error) {
    expect(error).toMatchObject({ name: 'MaaSError', operation: 'listModels' });
    expect((error as Error).message).not.toContain('test-ak');
    expect((error as Error).message).not.toContain('test-sk');
    expect((error as Error).message).not.toContain('Authorization');
    expect((error as Error).message).not.toContain('transport-secret');
    expect(JSON.stringify(error)).not.toContain('test-ak');
    expect(JSON.stringify(error)).not.toContain('test-sk');
    expect(JSON.stringify(error)).not.toContain('Authorization');
    expect(JSON.stringify(error)).not.toContain('signature');
    expect(JSON.stringify(error)).not.toContain('transport-secret');
  }
});

test('rejects privileged requests before fetch when AK/SK are missing', async () => {
  let called = false;
  const fetcher: typeof fetch = async () => {
    called = true;
    return new Response('{}');
  };

  await expect(new MaaSClient({ fetch: fetcher }).requestManagement('/inapi/v3/apikeys')).rejects.toMatchObject({
    name: 'MaaSError',
    operation: 'requestManagement'
  });
  expect(called).toBe(false);
});

test('keeps the documented MaaS server root invariant', () => {
  expect(MAAS_SERVER_ROOT).toBe('https://api.qiniu.com/ai');
});

test('sends a generated AK/SK Authorization value for privileged requests', async () => {
  let request: Request | undefined;
  const fetcher: typeof fetch = async (input, init) => {
    request = new Request(input, init);
    return new Response(JSON.stringify({ data: {} }), { status: 200 });
  };

  const client = new MaaSClient({ fetch: fetcher, accessKey: 'test-ak', secretKey: 'test-sk' });
  await client.requestManagement('/inapi/v3/apikeys');

  const authorization = request?.headers.get('authorization');
  expect(request?.url).toBe('https://api.qiniu.com/ai/inapi/v3/apikeys');
  expect(authorization).toBe('Qiniu test-ak:QrQkHgZL0GgjW87NBEhWLLn1D4Q');
});
