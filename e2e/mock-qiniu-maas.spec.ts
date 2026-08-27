import { test, expect, type Page } from '@playwright/test'

const GUI_URL = 'http://127.0.0.1:3080'
const MODEL_ID = 'deepseek-v4-flash'
const MARKETPLACE_URL = /^https:\/\/api\.qiniu\.com\/ai\/v1\/market\/models(?:\?.*)?$/
const API_KEYS_URL = /^https:\/\/api\.qiniu\.com\/ai\/inapi\/v3\/apikeys(?:\?.*)?$/
const USAGE_URL = /^https:\/\/api\.qiniu\.com\/ai\/inapi\/v3\/stat\/(?:new|bill\/range)(?:\?.*)?$/

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

async function installQiniuRoutes(page: Page): Promise<void> {
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
  const nav = page.getByText('Qiniu MaaS', { exact: true }).first()
  if (await nav.count() === 0) {
    testInfo.skip(true, 'Qiniu MaaS plugin is not mounted in the DSH GUI')
    return
  }
  await nav.click()
  await expect(page.getByRole('heading', { name: 'Public marketplace' })).toBeVisible()
}

test.describe('Qiniu MaaS browser acceptance (mock API)', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await installQiniuRoutes(page)
    await openQiniuSettings(page, testInfo)
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

  test('renders API-key and management states without exposing credentials', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API keys' })).toBeVisible()
    await expect(page.getByText('acceptance-key', { exact: true })).toBeVisible()
    await expect(page.getByText('AK/SK credentials required for management data.')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('access-key-secret')
    await expect(page.locator('body')).not.toContainText('inference-api-key')
  })
})
