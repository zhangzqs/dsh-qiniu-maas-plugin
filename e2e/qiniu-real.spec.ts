import { existsSync } from 'node:fs'
import { test, expect } from '@playwright/test'

const secretFile = '/home/zzq/.config/dsh/qiniu-maas-e2e.json'
const GUI_URL = process.env.DSH_BASE_URL ?? 'http://127.0.0.1:3080'

async function openMountedQiniuSettings(page: import('@playwright/test').Page): Promise<void> {
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 5000 })
  } catch {
    test.skip(true, `DSH GUI unavailable at ${GUI_URL}`)
    return
  }
  const pluginNav = page.getByText('Qiniu MaaS', { exact: true }).first()
  if (await pluginNav.count() === 0) {
    test.skip(true, 'Qiniu MaaS plugin is not mounted in the DSH GUI')
    return
  }
  await pluginNav.click()
  await expect(page.getByRole('heading', { name: 'Public marketplace' })).toBeVisible()
}

test('real Qiniu MaaS selects deepseek-v4-flash', async ({ page }) => {
  // Credentials are injected by the external DSH runtime at test time; this suite never reads the file.
  test.skip(!existsSync(secretFile), `real E2E runtime credential marker is absent: ${secretFile}`)
  test.skip(!process.env.QINIU_MAAS_REAL_E2E, 'set QINIU_MAAS_REAL_E2E=1 to enable real network acceptance')
  await openMountedQiniuSettings(page)
  await expect(page.getByPlaceholder('Search models')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'API keys' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Management credentials' })).toBeVisible()
  const managementInputs = page.locator('.qiniu-management-credentials input[type="password"]')
  await expect(managementInputs).toHaveCount(2)
  await expect(managementInputs.nth(0)).toHaveAttribute('autocomplete', 'off')
  await expect(managementInputs.nth(1)).toHaveAttribute('autocomplete', 'off')

  const model = page.getByText('deepseek-v4-flash', { exact: true })
  await expect(model).toBeVisible()
  await model.locator('xpath=ancestor::article').getByRole('button', { name: 'Add', exact: true }).click()
  await expect(page.locator('.qiniu-enabled-model').filter({ hasText: 'deepseek-v4-flash' })).toBeVisible()
})
