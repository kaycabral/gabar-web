import { expect, test } from '@playwright/test'

test.describe('Nav — landing page', () => {
  test('clicar no logo faz scroll para o topo da página', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 800))
    await page.waitForFunction(() => window.scrollY > 100)

    await page.getByRole('link', { name: /gabar/i }).click()

    await page.waitForFunction(() => window.scrollY === 0, { timeout: 3000 })
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('menu mobile: botão hambúrguer abre o menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toBeVisible()
  })

  test('menu mobile: botão hambúrguer fecha o menu aberto', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toBeVisible()

    await page.getByRole('button', { name: 'Fechar menu' }).click()
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible()
  })
})
