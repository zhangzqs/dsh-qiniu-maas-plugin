import { describe, expect, test } from 'vitest'
import { ModelMarketplaceClient, QiniuMaaSClient } from '../src/index.js'

describe('qiniu-maas-sdk client contract', () => {
  test('calls the public marketplace without authorization and returns the raw response', async () => {
    const requests: Request[] = []
    const client = new ModelMarketplaceClient({
      fetch: async (input, init) => {
        const request = new Request(input, init)
        requests.push(request)
        return new Response(JSON.stringify({ status: true, data: [] }), { status: 200 })
      },
    })

    await expect(client.getMarketModels({ sort: 'rank', order: 'desc' })).resolves.toEqual({ status: true, data: [] })
    expect(requests[0]?.url).toBe('https://api.qnaigc.com/v1/market/models?sort=rank&order=desc')
    expect(requests[0]?.headers.has('authorization')).toBe(false)
  })

  test('signs management requests and returns the raw API-key response', async () => {
    let request: Request | undefined
    const client = new QiniuMaaSClient({
      fetch: async (input, init) => {
        request = new Request(input, init)
        return new Response(JSON.stringify({ status: true, data: [] }), { status: 200 })
      },
      accessKey: 'test-ak',
      secretKey: 'test-sk',
    })

    await expect(client.listApiKeys()).resolves.toEqual({ status: true, data: [] })
    expect(request?.url).toBe('https://api.qiniu.com/ai/inapi/v3/apikeys')
    expect(request?.headers.get('authorization')).toMatch(/^Bearer Qiniu test-ak:/)
  })

  test('validates request parameters before sending a management request', async () => {
    let called = false
    const client = new QiniuMaaSClient({
      fetch: async () => {
        called = true
        return new Response('{}')
      },
      accessKey: 'test-ak',
      secretKey: 'test-sk',
    })

    await expect(client.getBillByKey({ month: 'invalid' })).rejects.toMatchObject({ name: 'MaaSError', operation: 'getBillByKey' })
    expect(called).toBe(false)
  })
})
