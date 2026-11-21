import { expect, test } from '@playwright/test'

test.describe('Header', () => {
  test('hero header renders as a landmark', async ({ page }) => {
    await page.goto('/concursos')
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
  })

  test('search input and filter button are visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/concursos')
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
    await expect(page.getByPlaceholder(/buscar por nome ou cargo/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /^filtros/i })).toBeVisible()
  })
})
