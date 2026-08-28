import { describe, expect, test } from 'vitest'
import { ModelMarketplaceClient, QiniuMaaSClient } from '../src/index.js'

function responseFor(path: string): unknown {
  if (path.endsWith('/apikeys')) return { status: true, data: [] }
  if (path.endsWith('/stat/new')) return { status: true, data: [] }
  if (path.endsWith('/stat/log')) return { status: true, data: { items: [] } }
  if (path.includes('/market/models')) return { status: true, data: [] }
  if (path.includes('/stat/bill')) return { models: [] }
  if (path.endsWith('/apikey')) return { status: true, data: { key: 'sk-test', name: 'test', createdAt: '2025-01-01T00:00:00Z', enabled: true } }
  return { status: true, data: {} }
}

describe('generated OpenAPI operation clients', () => {
  test('serializes every management operation and signs it', async () => {
    const requests: Request[] = []
    const client = new QiniuMaaSClient({
      accessKey: 'test-ak', secretKey: 'test-sk',
      fetch: async (input, init) => {
        const request = new Request(input, init)
        requests.push(request)
        return new Response(JSON.stringify(responseFor(request.url)), { status: 200 })
      },
    })
    await client.updateApiKeyEnabled({ key: 'sk-test', enabled: false })
    await client.deleteApiKey({ key: 'sk-test' })
    await client.createApiKey({ name: 'test' })
    await client.listApiKeys()
    await client.updateApiKeyName({ key: 'sk-test', name: 'renamed' })
    await client.updateApiKeyQuota('sk-test', { daily_quota: { enabled: true, limit: 100 } })
    await client.getBillByKey({ month: '2025-11' })
    await client.getBillAllKeys({ month: '2025-11' })
    await client.getBillByRange({ start: '2025-11-01T00:00:00+08:00', end: '2025-11-02T00:00:00+08:00', grain: 'day' })
    await client.getBillAllKeysByRange({ start: '2025-11-01T00:00:00+08:00', end: '2025-11-02T00:00:00+08:00', grain: 'day' })
    await client.getLogs({ page: 1, page_size: 1 })
    await client.getLogDetail({ request_id: 'chatcmpl-test' })
    await client.getUsage()
    await client.getPricingItems()

    expect(requests).toHaveLength(14)
    expect(new Set(requests.map(request => `${request.method} ${new URL(request.url).pathname}`))).toHaveProperty('size', 14)
    expect(requests.every(request => request.headers.get('authorization')?.startsWith('Bearer Qiniu test-ak:'))).toBe(true)
  })

  test('uses the unauthenticated public marketplace endpoint', async () => {
    let request: Request | undefined
    const client = new ModelMarketplaceClient({
      fetch: async (input, init) => {
        request = new Request(input, init)
        return new Response(JSON.stringify({ status: true, data: [] }), { status: 200 })
      },
    })
    await expect(client.getMarketModels({ sort: 'rank', order: 'desc', overseas: 'false' })).resolves.toEqual({ status: true, data: [] })
    expect(request?.url).toBe('https://api.qnaigc.com/v1/market/models?sort=rank&order=desc&overseas=false')
    expect(request?.headers.has('authorization')).toBe(false)
  })

  test('rejects invalid input and malformed success responses', async () => {
    let called = false
    const client = new QiniuMaaSClient({
      accessKey: 'test-ak', secretKey: 'test-sk',
      fetch: async () => { called = true; return new Response('{}', { status: 200 }) },
    })
    await expect(client.getBillByKey({ month: 'invalid' })).rejects.toMatchObject({ name: 'MaaSError', operation: 'getBillByKey' })
    expect(called).toBe(false)
    const malformed = new QiniuMaaSClient({ accessKey: 'test-ak', secretKey: 'test-sk', fetch: async () => new Response(JSON.stringify({ status: true }), { status: 200 }) })
    await expect(malformed.listApiKeys()).rejects.toMatchObject({ name: 'MaaSError', operation: 'listApiKeys' })
  })
})
