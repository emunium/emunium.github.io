import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import crypto from 'node:crypto'
import pages from '../scripts/content-map.json' with { type: 'json' }

test('home, primary navigation, and browser links', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Browser automation.')
  await expect(page.getByRole('link', { name: 'Camoufox profile', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Get started', exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/quick-start\//)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Quick start')
})

test('light and dark mode persist across navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.goto('/docs/installation/')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('copy install command', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  await page.getByRole('button', { name: 'Copy installation command', exact: true }).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('pip install emunium')
})

test('dual-engine switcher updates code and browser preview', async ({ page }) => {
  await page.goto('/')
  const chromiumTab = page.getByRole('tab', { name: 'Chromium (Chrome / Brave)', exact: true })
  const geckoTab = page.getByRole('tab', { name: 'Gecko (Camoufox / Firefox)', exact: true })
  await expect(chromiumTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.address-bar')).toHaveText('app.example.com/login')
  await expect(page.locator('.login-card')).toContainText('Sign in')
  await geckoTab.click()
  await expect(geckoTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.address-bar')).toHaveText('bot.sannysoft.com')
  await expect(page.locator('.login-card')).toContainText('Gecko (Camoufox Stealth Engine)')
  await expect(page.locator('.check-passed')).toHaveText(['Missing / Passed', 'Verified (Win32/X11)'])
  await chromiumTab.click()
  await expect(page.locator('.address-bar')).toHaveText('app.example.com/login')
  await expect(page.locator('.login-card')).toContainText('Sign in')
})

test('Pagefind search and keyboard shortcut', async ({ page }) => {
  await page.goto('/docs/')
  // Wait for a hydrated control before sending the global keyboard shortcut.
  await expect(page.getByRole('button', { name: 'Switch to light mode', exact: true })).toBeVisible()
  await page.keyboard.press('Control+k')
  const search = page.locator('.nextra-navbar').getByRole('combobox')
  await expect(search).toBeFocused()
  await search.fill('SendInput')
  await expect(page.getByRole('option').first()).toBeVisible()
  await page.getByRole('option').first().click()
  await expect(page).toHaveURL(/\/docs\//)
})

test('deep links reveal collapsed reference sections', async ({ page }) => {
  await page.goto('/docs/human-like-input/#typing-rhythm')
  // Nextra appends a permalink anchor to headings, so match the heading by its id.
  const heading = page.locator('h2#typing-rhythm')
  const section = page.locator('details').filter({ has: heading })
  await expect(section).toHaveAttribute('open', '')
  await expect(heading).toBeVisible()
})

test('original documentation download is byte-for-byte intact', async ({ request }) => {
  const response = await request.get('/source/README.md')
  expect(response.ok()).toBeTruthy()
  const actual = crypto.createHash('sha256').update(await response.body()).digest('hex')
  const original = crypto.createHash('sha256').update(fs.readFileSync('sources/README.original.md')).digest('hex')
  expect(actual).toBe(original)
})

test('all imported pages render with their original headings', async ({ page }) => {
  test.setTimeout(120000)
  for (const document of pages) {
    const response = await page.goto(`/docs/${document.slug}/`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(document.title)
  }
})

test('phone layout does not overflow and navigation is available', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const url of ['/', '/docs/', '/docs/installation/', '/docs/connect/', '/docs/human-like-input/']) {
    await page.goto(url)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
    expect(overflow, `Horizontal page overflow: ${url}`).toBe(false)
  }
  await expect(page.locator('.nextra-hamburger')).toBeVisible()
  await page.locator('.nextra-hamburger').click()
  await expect(page.locator('.nextra-mobile-nav').getByRole('link', { name: 'Quick start', exact: true })).toBeVisible()
})

test('static 404 uses a real 404 status', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('This page moved.')
})
