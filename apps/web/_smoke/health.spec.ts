// Smoke tests run against the deployed site. They check that it is alive and
// serving — full features are covered by the E2E suite in CI before merge.

import { smokeSuite } from '@cbrl/testing/playwright'
import { expect, test } from '@playwright/test'

// GET /api/health -> 200 { status: 'ok' }, and `/` renders with a title.
smokeSuite()

test('concursos listing renders', async ({ page }) => {
  const res = await page.goto('/concursos')
  expect(res?.status()).toBeLessThan(400)
})
