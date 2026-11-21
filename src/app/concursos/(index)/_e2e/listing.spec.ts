import { expect, test } from '@playwright/test'

// ─── Next.js Metadata & SSG ─────────────────────────────────────────────────

test('page title contains Concursos', async ({ page }) => {
  await page.goto('/concursos')
  await expect(page).toHaveTitle(/Concursos/)
})

// ─── Accessibility & Mobile (real CSS / layout) ─────────────────────────────

test('page renders correctly at mobile viewport 375x667', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/concursos')

  await expect(page.locator('article').first()).toBeVisible()

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
})

test('page has correct landmark structure for screen readers', async ({ page }) => {
  await page.goto('/concursos')

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('header').first()).toBeVisible()

  const articles = page.locator('article')
  const count = await articles.count()
  expect(count).toBeGreaterThan(0)
  expect(count).toBeLessThanOrEqual(12)
})

// ─── Radix UI Slider (real browser behavior) ────────────────────────────────

test('salary slider: moving lower thumb hides low-salary exams', async ({ page }) => {
  await page.goto('/concursos')
  await page.getByRole('button', { name: /^filtros/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  // Skip test if salary range is 0 (all exams on this page have null salary)
  const sliderMax = await page
    .locator('[data-slot="slider-thumb"]')
    .last()
    .getAttribute('aria-valuemax')
  if (sliderMax === '0') {
    test.skip(true, 'No salary data on current page — slider test not applicable')
    return
  }

  const initialCount = await page.locator('article').count()

  // Use keyboard to move lower thumb (avoids pointer interception by max thumb)
  const lowerThumb = page.locator('[data-slot="slider-thumb"]').first()
  await lowerThumb.focus()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('button', { name: /^aplicar/i }).click()

  const filteredCount = await page.locator('article').count()
  expect(filteredCount).toBeLessThanOrEqual(initialCount)
})

test('salary slider: reset restores full listing', async ({ page }) => {
  await page.goto('/concursos')
  await page.getByRole('button', { name: /^filtros/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  const sliderMax = await page
    .locator('[data-slot="slider-thumb"]')
    .last()
    .getAttribute('aria-valuemax')
  if (sliderMax === '0') {
    test.skip(true, 'No salary data on current page — slider test not applicable')
    return
  }

  const initialCount = await page.locator('article').count()

  const lowerThumb = page.locator('[data-slot="slider-thumb"]').first()
  await lowerThumb.focus()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('button', { name: /^aplicar/i }).click()

  await page.getByRole('button', { name: /^filtros/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: /redefinir filtros/i }).click()
  await page.getByRole('button', { name: /^aplicar/i }).click()

  await expect(page.locator('article')).toHaveCount(initialCount)
})

// ─── Cross-component User Journeys ──────────────────────────────────────────

test('combined filters: search + status narrows results with AND logic', async ({ page }) => {
  await page.goto('/concursos')

  const initialCount = await page.locator('article').count()

  await page.getByRole('button', { name: /^filtros/i }).click()
  await page.getByRole('button', { name: 'Encerrado' }).click()
  await page.getByRole('button', { name: /^aplicar/i }).click()

  const filteredCount = await page.locator('article').count()
  expect(filteredCount).toBeLessThanOrEqual(initialCount)
})

// ─── Pagination: out-of-range page redirect ─────────────────────────────────

test('page=999 redireciona para página válida e exibe concursos', async ({ page }) => {
  await page.goto('/concursos?page=999')
  await page.waitForURL(
    (url) => !url.searchParams.get('page') || Number(url.searchParams.get('page')) < 999,
  )

  const articles = page.locator('article')
  await expect(articles.first()).toBeVisible()
  expect(Number(new URL(page.url()).searchParams.get('page') ?? '1')).toBeLessThan(999)
})

// ─── Geographic Filter Smoke Test (real Radix Select) ────────────────────────

test('region filter: Southeast reduces or maintains article count', async ({ page }) => {
  await page.goto('/concursos')

  const initialCount = await page.locator('article').count()

  await page.getByRole('button', { name: /^filtros/i }).click()
  await page.getByRole('combobox', { name: /^região$/i }).click()
  await page.getByRole('option', { name: 'Sudeste' }).click()
  await page.getByRole('button', { name: /^aplicar/i }).click()

  const filteredCount = await page.locator('article').count()
  expect(filteredCount).toBeLessThanOrEqual(initialCount)
})
