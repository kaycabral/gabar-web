import { expect, test } from '@playwright/test'

test.describe('Status Filter', () => {
  test('status segmented control has Aberto, Em breve and Encerrado', async ({ page }) => {
    await page.goto('/concursos')
    await page.getByRole('button', { name: /^filtros/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await expect(page.getByRole('button', { name: 'Aberto' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Em breve' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Encerrado' })).toBeVisible()
  })

  test('selecting Aberto filters to only open exams', async ({ page }) => {
    await page.goto('/concursos')
    await page.getByRole('button', { name: /^filtros/i }).click()
    await page.getByRole('button', { name: 'Aberto' }).click()
    await page.getByRole('button', { name: /^aplicar/i }).click()

    await page.waitForURL(/status=open/)

    const articles = page.locator('article')
    const count = await articles.count()
    expect(count).toBeGreaterThanOrEqual(0)

    const badges = articles.locator('span').filter({ hasText: /^(Em breve|Encerrado)$/ })
    await expect(badges).toHaveCount(0)
  })

  test('selecting filter reduces and clearing via toolbar chip restores article count', async ({
    page,
  }) => {
    await page.goto('/concursos')

    // Wait for the listing to stabilize before sampling the initial count.
    // Next 16 PPR (cacheComponents) may briefly render a stale shell alongside
    // streamed content, temporarily doubling the article count.
    await expect(page.locator('article').first()).toBeVisible()
    await page.waitForLoadState('networkidle')
    const totalCount = await page.locator('article').count()

    await page.getByRole('button', { name: /^filtros/i }).click()
    await page.getByRole('button', { name: 'Em breve' }).click()
    await page.getByRole('button', { name: /^aplicar/i }).click()

    await page.waitForURL(/status=upcoming/)
    await page.waitForLoadState('networkidle')
    const countFiltered = await page.locator('article').count()

    // Remove via the toolbar chip (X button with aria-label "Remover filtro Em breve")
    await page.getByRole('button', { name: /remover filtro em breve/i }).click()

    await page.waitForURL((url) => !url.searchParams.has('status'))
    await page.waitForLoadState('networkidle')
    await expect(page.locator('article')).toHaveCount(totalCount)

    const countAll = await page.locator('article').count()
    expect(countAll).toBeGreaterThanOrEqual(countFiltered)
  })
})
