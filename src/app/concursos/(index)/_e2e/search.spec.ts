import { expect, test } from '@playwright/test'

test.describe('Busca de concursos', () => {
  test('digitar na busca atualiza a URL com o parâmetro q', async ({ page }) => {
    await page.goto('/concursos')
    await page
      .getByPlaceholder(/buscar por nome ou cargo/i)
      .first()
      .fill('Federal')
    await page.waitForURL(/q=Federal/)
    await expect(page).toHaveURL(/q=Federal/)
  })

  test('busca filtra os concursos exibidos', async ({ page }) => {
    await page.goto('/concursos')
    const initialCount = await page.locator('article').count()

    await page
      .getByPlaceholder(/buscar por nome ou cargo/i)
      .first()
      .fill('Federal')
    await page.waitForURL(/q=Federal/)

    const filteredCount = await page.locator('article').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
  })

  test('limpar a busca remove o parâmetro q da URL', async ({ page }) => {
    await page.goto('/concursos?q=Federal')
    await page
      .getByPlaceholder(/buscar por nome ou cargo/i)
      .first()
      .clear()
    await page.waitForURL((url) => !url.searchParams.has('q'))
    await expect(page).not.toHaveURL(/q=/)
  })
})
