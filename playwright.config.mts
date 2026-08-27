import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  timeout: 20_000,
  reporter: [['list']],
  use: {
    baseURL: process.env.DSH_BASE_URL ?? 'http://127.0.0.1:3080',
    ...devices['Desktop Chrome'],
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },
})
