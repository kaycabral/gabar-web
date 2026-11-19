import { expect, test } from '@playwright/test'

test.describe('WaitlistModal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('clicar no CTA abre o modal de lista de espera', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar na lista de espera' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByText('Lista de espera')).toBeVisible()
  })

  test('modal tem campo de email e botão de submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar na lista de espera' }).first().click()
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Entrar na lista' })).toBeVisible()
  })

  test('modal exibe link clicável pra política de privacidade (LGPD)', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar na lista de espera' }).first().click()
    const link = page.getByRole('dialog').getByRole('link', { name: 'política de privacidade' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/privacidade')
  })

  test('pressionar Escape fecha o modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar na lista de espera' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.getByRole('dialog')).toBeHidden()
  })
})
