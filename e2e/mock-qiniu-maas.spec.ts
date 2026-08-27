import { test, expect, type Page } from '@playwright/test'

const GUI_URL = 'http://127.0.0.1:3080'
const MODEL_ID = 'deepseek-v4-flash'
const MARKETPLACE_URL = /^https:\/\/api\.qiniu\.com\/ai\/v1\/market\/models(?:\?.*)?$/
const API_KEYS_URL = /^https:\/\/api\.qiniu\.com\/ai\/inapi\/v3\/apikeys(?:\?.*)?$/
const USAGE_URL = /^https:\/\/api\.qiniu\.com\/ai\/inapi\/v3\/stat\/(?:new|bill\/range)(?:\?.*)?$/
const QINIU_API_ORIGIN = 'api.qiniu.com'
const CREDENTIAL_QUERY = /(?:^|[?&])(?:access[_-]?key|secret[_-]?key|ak|sk|api[_-]?key|apikey|token|authorization)=[^&#]*/i
const CREDENTIAL_HEADER = /^(?:authorization|proxy-authorization|x-api-key|api-key|x-qiniu-(?:ak|sk)|x-qiniu-(?:access|secret)-key)$/i
const CREDENTIAL_LOG_VALUE = /(?:access[_-]?key|secret[_-]?key|api[_-]?key|apikey|authorization|bearer)\s*[:=]\s*(?!\*{2,}|masked|undefined|null)[^\s,;]+/i

type ObservedRequest = { url: string; headers: Record<string, string> }

const marketplacePayload = {
  data: [
    {
      id: MODEL_ID,
      name: 'DeepSeek V4 Flash',
      description: 'Fast DeepSeek model for interactive workloads.',
      model_constraints: { context_length: 128000, max_tokens: 8192 },
      architecture: {
        input_modalities: ['text'],
        output_modalities: ['text'],
        reasoning: { supported: true },
      },
    },
  ],
}

const marketplaceModels = [
  {
    id: MODEL_ID,
    name: 'DeepSeek V4 Flash',
    description: 'Fast DeepSeek model for interactive workloads.',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    capabilities: ['text-input', 'text-output', 'reasoning'],
  },
]

async function installQiniuRoutes(page: Page): Promise<void> {
  await page.route(/\/api\/qiniu-maas\//, async route => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop()
    const requestBody = route.request().postDataJSON() as { rpcId?: string }
    const value = endpoint === 'list-models'
      ? marketplaceModels
      : endpoint === 'list-api-keys'
        ? [{ name: 'acceptance-key', maskedValue: '********', enabled: true, createdAt: '2026-01-01', lastUsed: 'never', totalTokens: 0, quota: { daily: { enabled: false, used: 0, limit: 0 }, monthly: { enabled: false, used: 0, limit: 0 }, total: { enabled: false, used: 0, limit: 0 } } }]
        : endpoint === 'credential-status'
          ? { accessKey: { configured: false, writable: true }, secretKey: { configured: false, writable: true }, inferenceApiKey: { configured: false, writable: true } }
          : endpoint === 'usage' || endpoint === 'get-bill'
            ? { code: 'AK_SK_REQUIRED' }
            : { ok: true }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: requestBody.rpcId, result: { ok: true, value } }) })
  })
  // Browser interception is deliberately limited to Qiniu API origins.
  await page.route(MARKETPLACE_URL, route => {
    expect(route.request().method()).toBe('GET')
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(marketplacePayload) })
  })
  await page.route(API_KEYS_URL, route => {
    expect(route.request().method()).toBe('GET')
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ name: 'acceptance-key', key: '********', enabled: true, createdAt: '2026-01-01', lastUsed: 'never', totalTokens: 0, quota: { daily: {}, monthly: {}, total: {} } }] }) })
  })
  await page.route(USAGE_URL, route => {
    expect(route.request().method()).toBe('GET')
    return route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ status: false, code: 'AK_SK_REQUIRED' }) })
  })
}

async function openQiniuSettings(page: Page, testInfo: { skip: (condition: boolean, description: string) => void }): Promise<void> {
  try {
    await page.goto(GUI_URL, { waitUntil: 'domcontentloaded', timeout: 5000 })
  } catch {
    testInfo.skip(true, `DSH GUI unavailable at ${GUI_URL}`)
    return
  }
  const body = page.locator('body')
  await expect(body).toBeVisible()
  const reset = await page.request.post(`${GUI_URL}/api/settings.replace`, {
    data: {
      type: 'client-request',
      rpcId: `e2e-reset-${Date.now()}`,
      method: 'settings.replace',
      payload: { ns: 'qiniu-maas', section: { models: [] } },
    },
  })
  expect(reset.ok()).toBe(true)
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  const nav = page.getByRole('button', { name: 'Qiniu MaaS', exact: true })
  if (await nav.count() === 0) {
    testInfo.skip(true, 'Qiniu MaaS plugin is not mounted in the DSH GUI')
    return
  }
  await nav.click()
  await expect(page.getByRole('heading', { name: 'Public marketplace' })).toBeVisible()
}

test.describe('Qiniu MaaS browser acceptance (mock API)', () => {
  let observedRequests: ObservedRequest[]
  let consoleMessages: string[]

  test.beforeEach(async ({ page }, testInfo) => {
    observedRequests = []
    consoleMessages = []
    page.on('request', request => {
      observedRequests.push({ url: request.url(), headers: request.headers() })
    })
    page.on('console', message => {
      consoleMessages.push(message.text())
    })
    await installQiniuRoutes(page)
    await openQiniuSettings(page, testInfo)
  })

  test.afterEach(() => {
    const qiniuRequests = observedRequests.filter(request => new URL(request.url).hostname === QINIU_API_ORIGIN)
    const leakedQuery = qiniuRequests.filter(request => CREDENTIAL_QUERY.test(request.url))
    const leakedHeaders = qiniuRequests.filter(request => Object.keys(request.headers).some(name => CREDENTIAL_HEADER.test(name)))
    const leakedConsole = consoleMessages.filter(message => CREDENTIAL_LOG_VALUE.test(message))
    // Keep credential values out of assertion messages and test artifacts.
    expect(leakedQuery.length, 'Qiniu request URLs must not contain credential query parameters').toBe(0)
    expect(leakedHeaders.length, 'Qiniu request headers must not contain credential-bearing headers').toBe(0)
    expect(leakedConsole.length, 'console messages must not contain credential assignments').toBe(0)
  })

  test('shows marketplace without credentials and handles exact model selection', async ({ page }) => {
    await expect(page.getByText(MODEL_ID, { exact: true })).toBeVisible()
    const card = page.locator('article').filter({ hasText: MODEL_ID }).first()
    await card.getByRole('button', { name: 'Add', exact: true }).click()
    const enabled = page.locator('.qiniu-enabled-model').filter({ hasText: MODEL_ID }).first()
    await expect(enabled).toBeVisible()
    await expect(enabled.getByRole('button', { name: 'Disable', exact: true })).toBeVisible()
    await enabled.getByRole('button', { name: 'Disable', exact: true }).click()
    await expect(enabled.getByText('Disabled', { exact: true })).toBeVisible()
    await enabled.getByRole('button', { name: 'Remove', exact: true }).click()
    await expect(enabled).toHaveCount(0)
  })

  test('supports marketplace filtering, details, and editable model overrides', async ({ page }) => {
    await page.getByPlaceholder('Search models').fill(MODEL_ID)
    await expect(page.getByText(MODEL_ID, { exact: true })).toBeVisible()
    const card = page.locator('article').filter({ hasText: MODEL_ID }).first()
    await card.getByRole('button', { name: 'Details', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Model details' })).toBeVisible()
    await card.getByRole('button', { name: 'Add', exact: true }).click()
    const enabled = page.locator('.qiniu-enabled-model').filter({ hasText: MODEL_ID }).first()
    await enabled.getByLabel('contextWindow').fill('64000')
    await enabled.getByLabel('maxOutputTokens').fill('4096')
  })

  test('refuses using a masked API key and offers manual entry', async ({ page }) => {
    const row = page.locator('article').filter({ hasText: 'acceptance-key' }).first()
    const useButton = row.getByRole('button', { name: 'Use', exact: true })
    await expect(useButton).toBeDisabled()
    await expect(useButton).toHaveAttribute('title', /masked API key cannot be used/i)
    await expect(row.getByPlaceholder('Enter API key')).toHaveAttribute('type', 'password')
    await expect(row.getByRole('button', { name: 'Use manually', exact: true })).toBeVisible()
  })

  test('renders API-key and management states without exposing credentials', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API keys' })).toBeVisible()
    await expect(page.getByText('acceptance-key', { exact: true })).toBeVisible()
    await expect(page.getByText('AK/SK credentials required for management data.')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('access-key-secret')
    await expect(page.locator('body')).not.toContainText('inference-api-key')
  })
})
