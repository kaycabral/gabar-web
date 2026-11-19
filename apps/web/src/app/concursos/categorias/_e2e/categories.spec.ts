import { expect, test } from '@playwright/test'

// ─── Page structure ─────────────────────────────────────────────────────────

test('page title contains Categorias', async ({ page }) => {
  await page.goto('/concursos/categorias')
  await expect(page).toHaveTitle(/Categorias/)
})

test('page renders region and board sections', async ({ page }) => {
  await page.goto('/concursos/categorias')

  await expect(page.getByRole('heading', { name: /concursos por região/i })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.getByRole('heading', { name: /concursos por banca/i })).toBeVisible()
})

// ─── Region tabs ────────────────────────────────────────────────────────────

test('region tabs display all five regions', async ({ page }) => {
  await page.goto('/concursos/categorias')

  await expect(page.getByRole('heading', { name: /concursos por região/i })).toBeVisible({
    timeout: 15000,
  })

  for (const label of ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte']) {
    await expect(page.getByRole('tab', { name: label })).toBeAttached()
  }
})

test('clicking a region tab shows its content', async ({ page }) => {
  await page.goto('/concursos/categorias')

  const regionSection = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: /concursos por região/i }) })

  await expect(regionSection).toBeVisible({ timeout: 15000 })

  await regionSection.getByRole('tab', { name: 'Nordeste' }).click()

  await expect(regionSection.getByRole('tabpanel')).toBeVisible()
})

// ─── Board tabs ─────────────────────────────────────────────────────────────

test('board section has at least one tab', async ({ page }) => {
  await page.goto('/concursos/categorias')

  await expect(page.getByRole('heading', { name: /concursos por banca/i })).toBeVisible({
    timeout: 15000,
  })

  const boardTabs = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: /concursos por banca/i }) })
    .getByRole('tab')

  const count = await boardTabs.count()
  expect(count).toBeGreaterThan(0)
})

// ─── "Ver todos" links ─────────────────────────────────────────────────────

test('"Ver todos" link navigates to listing with region filter', async ({ page }) => {
  await page.goto('/concursos/categorias')

  await expect(page.getByRole('heading', { name: /concursos por região/i })).toBeVisible({
    timeout: 15000,
  })

  const verTodos = page.getByRole('link', { name: /ver todos/i }).first()
  await expect(verTodos).toBeVisible()

  const href = await verTodos.getAttribute('href')
  expect(href).toContain('/concursos?region=')
})

// ─── Mobile: no horizontal overflow ─────────────────────────────────────────

test('page renders without horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/concursos/categorias')

  await expect(page.getByRole('heading', { name: /concursos por região/i })).toBeVisible({
    timeout: 15000,
  })

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
})
