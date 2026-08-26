import { expect, test } from 'vitest';
import { MaaSClient } from '../src/client';
import { apiKeysResponse, billResponse, marketplaceResponse, usageResponse } from './fixtures';

const fetchJson = (payload: unknown, seen: Request[]) => async (input: RequestInfo | URL, init?: RequestInit) => {
  const request = new Request(input, init);
  seen.push(request);
  return new Response(JSON.stringify(payload), { status: 200 });
};

test('serializes marketplace sort, order, and overseas options and normalizes data-array models', async () => {
  const requests: Request[] = [];
  const models = await new MaaSClient({ fetch: fetchJson(marketplaceResponse, requests) }).listModels({
    sort: 'id', order: 'asc', overseas: 'true'
  });

  expect(new URL(requests[0].url).search).toBe('?sort=id&order=asc&overseas=true');
  expect(requests[0].headers.has('authorization')).toBe(false);
  expect(models).toEqual([{
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    description: 'Fast reasoning model',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    capabilities: ['text-input', 'text-output', 'function-calling', 'reasoning']
  }]);
});

test('gets model details by filtering the public marketplace list', async () => {
  const requests: Request[] = [];
  const client = new MaaSClient({ fetch: fetchJson(marketplaceResponse, requests) });

  await expect(client.getModelDetails('deepseek-v4-flash')).resolves.toMatchObject({ id: 'deepseek-v4-flash' });
  await expect(client.getModelDetails('missing-model')).resolves.toBeUndefined();
  expect(requests).toHaveLength(2);
});

test('lists API keys from the documented management endpoint with normalized metadata', async () => {
  const requests: Request[] = [];
  const keys = await new MaaSClient({
    fetch: fetchJson(apiKeysResponse, requests), accessKey: 'ak', secretKey: 'sk'
  }).listApiKeys();

  expect(new URL(requests[0].url).pathname).toBe('/ai/inapi/v3/apikeys');
  expect(keys).toEqual([{
    maskedValue: 'sk-live***abcd', name: 'Production', createdAt: '2026-01-01T00:00:00+08:00',
    lastUsed: '', enabled: true, totalTokens: 1234,
    quota: { daily: { enabled: true, used: 12, limit: 100 }, monthly: { enabled: false, used: 12, limit: -1 }, total: { enabled: true, used: 1234, limit: 10000 } }
  }]);
});

test('serializes usage parameters and normalizes usage items', async () => {
  const requests: Request[] = [];
  const report = await new MaaSClient({
    fetch: fetchJson(usageResponse, requests), accessKey: 'ak', secretKey: 'sk'
  }).getUsage({ start: '2026-08-01T00:00:00+08:00', end: '2026-08-02T00:00:00+08:00', g: 'day', api_key: 'sk-key' });

  expect(new URL(requests[0].url).search).toBe('?start=2026-08-01T00%3A00%3A00%2B08%3A00&end=2026-08-02T00%3A00%3A00%2B08%3A00&g=day&api_key=sk-key');
  expect(report).toEqual({ start: '2026-08-01T00:00:00+08:00', end: '2026-08-02T00:00:00+08:00', items: [{ model: 'deepseek-v4-flash', name: 'input_tokens', unit: 'k/tokens', total: 4.5, values: [{ time: '2026-08-01T00:00:00+08:00', value: 4.5 }] }] });
});

test('serializes bill range parameters and normalizes billing series', async () => {
  const requests: Request[] = [];
  const bill = await new MaaSClient({
    fetch: fetchJson(billResponse, requests), accessKey: 'ak', secretKey: 'sk'
  }).getBill({ start: '2026-08-01T00:00:00+08:00', end: '2026-08-02T00:00:00+08:00', grain: 'day', api_key: 'sk-key' });

  expect(new URL(requests[0].url).pathname).toBe('/ai/inapi/v3/stat/bill/range');
  expect(new URL(requests[0].url).searchParams.get('api_key')).toBe('sk-key');
  expect(bill).toEqual({ models: [{ modelId: 'deepseek-v4-flash', timeSeries: [{ time: '2026-08-01T00:00:00+08:00', items: [{ name: 'input_tokens', usage: { count: 4.5, unit: 'k/tokens' }, fee: 0.12, key: 'input' }], totalFee: 0.12, totalRequests: 2 }], totalFee: 0.12, totalRequests: 2 }] });
});

test('normalizes provider code from a structured error without exposing credentials', async () => {
  const fetcher: typeof fetch = async () => new Response(JSON.stringify({ status: false, code: 'AUTH_FAILED', error: 'secret details' }), { status: 200, headers: { 'x-reqid': 'req-1' } });
  await expect(new MaaSClient({ fetch: fetcher, accessKey: 'ak', secretKey: 'sk' }).listApiKeys()).rejects.toMatchObject({ name: 'MaaSError', status: 200, providerCode: 'AUTH_FAILED', requestId: 'req-1' });
});
