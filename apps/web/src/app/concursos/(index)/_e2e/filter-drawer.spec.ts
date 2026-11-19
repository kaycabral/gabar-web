import { expect, test } from '@playwright/test'

test.describe('Filter Drawer', () => {
  test('drawer opens from the right side', async ({ page }) => {
    await page.goto('/concursos')
    await page.getByRole('button', { name: /^filtros/i }).click()
    const drawer = page.getByRole('dialog')
    await expect(drawer).toBeVisible()
    const box = await drawer.boundingBox()
    const viewportSize = page.viewportSize()
    expect(box).not.toBeNull()
    expect(viewportSize).not.toBeNull()
    if (box && viewportSize) {
      expect(box.x + box.width).toBeGreaterThan(viewportSize.width - 10)
    }
  })

  test('applying a status filter commits to URL and closes drawer', async ({ page }) => {
    await page.goto('/concursos')
    await page.getByRole('button', { name: /^filtros/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.getByRole('button', { name: 'Encerrado' }).click()
    await page.getByRole('button', { name: /^aplicar/i }).click()

    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL(/status=closed/)
  })

  test('reopening drawer shows previously applied filter as pressed', async ({ page }) => {
    await page.goto('/concursos?status=closed')
    await page.getByRole('button', { name: /^filtros/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    const encerradoBtn = page.getByRole('button', { name: 'Encerrado' })
    await expect(encerradoBtn).toHaveAttribute('aria-pressed', 'true')
  })
})
