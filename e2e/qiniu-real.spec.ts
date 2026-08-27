import { existsSync } from 'node:fs'
import { test, expect } from '@playwright/test'

const secretFile = '/home/zzq/.config/dsh/qiniu-maas-e2e.json'

test('real Qiniu MaaS selects deepseek-v4-flash', async ({ page }) => {
  test.skip(!existsSync(secretFile), `real E2E secret file is absent: ${secretFile}`)
  test.skip(!process.env.QINIU_MAAS_REAL_E2E, 'set QINIU_MAAS_REAL_E2E=1 to enable real network acceptance')
  await page.goto('/')
  await expect(page.getByText('Public marketplace')).toBeVisible()
  const model = page.getByText('deepseek-v4-flash', { exact: true })
  await expect(model).toBeVisible()
  await model.locator('xpath=ancestor::article').getByRole('button', { name: 'Add', exact: true }).click()
  await expect(page.locator('.qiniu-enabled-model').filter({ hasText: 'deepseek-v4-flash' })).toBeVisible()
})
