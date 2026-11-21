import { expect, test } from '@playwright/test'

test('clicking an exam card navigates to the detail page', async ({ page }) => {
  await page.goto('/concursos')

  await Promise.all([
    page.waitForURL(/\/concursos\/[a-z0-9-]+/),
    page.locator("a[href^='/concursos/']").first().click(),
  ])

  expect(page.url()).toMatch(/\/concursos\/[a-z0-9-]+/)
})

test('invalid exam ID shows not-found page', async ({ page }) => {
  await page.goto('/concursos/invalid-exam-id-that-does-not-exist')

  // With Next.js PPR the HTTP status may be 200, so verify content instead
  await expect(page.getByRole('heading', { name: /não encontrado/i })).toBeVisible()
})
