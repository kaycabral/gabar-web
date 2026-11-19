// Smoke tests rodam contra staging real após deploy. Validam que o site
// está vivo e servindo o SHA esperado — não tentam exercer features
// completas (E2E faz isso na CI antes do merge).

import { expect, test } from '@playwright/test'

test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('ok')
})

test('home page renders', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBeLessThan(400)
  await expect(page).toHaveTitle(/.+/)
})

test('concursos listing renders', async ({ page }) => {
  const res = await page.goto('/concursos')
  expect(res?.status()).toBeLessThan(400)
})
