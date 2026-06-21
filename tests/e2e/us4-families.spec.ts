import { test, expect } from '@playwright/test';

/**
 * T037t (US4) — polymorphic families. A BOOK shows the reading block (and persists an
 * edit), a SERIES shows the screen block; neither shows game-only fields (scenario 4).
 */
test('book and screen entries show their own polymorphic save-state', async ({ page }) => {
  // BOOK → reading family
  await page.goto('/entry/new');
  await page.getByLabel('Title', { exact: true }).fill('The Brothers Karamazov');
  await page.getByLabel('Type').selectOption('BOOK');
  await page.getByLabel('Status').selectOption('READING');
  await page.getByRole('button', { name: 'Create entry' }).click();
  await expect(page.getByRole('heading', { name: 'The Brothers Karamazov' })).toBeVisible();
  await expect(page.getByText('Current Chapter')).toBeVisible();
  await expect(page.getByText('Keymap Reference')).toHaveCount(0); // no game fields bleed

  // capture a chapter and confirm it survives reload
  await page.getByRole('button', { name: 'edit', exact: true }).click();
  await page.getByPlaceholder(/Book 3/).fill('Book 5 — The Grand Inquisitor');
  await page.getByRole('button', { name: 'Save state' }).click();
  await expect(page.getByText('Book 5 — The Grand Inquisitor')).toBeVisible();
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('Book 5 — The Grand Inquisitor')).toBeVisible({ timeout: 10_000 });

  // SERIES → screen family
  await page.goto('/entry/new');
  await page.getByLabel('Title', { exact: true }).fill('Severance');
  await page.getByLabel('Type').selectOption('SERIES');
  await page.getByLabel('Status').selectOption('AIRING');
  await page.getByRole('button', { name: 'Create entry' }).click();
  await expect(page.getByRole('heading', { name: 'Severance' })).toBeVisible();
  await expect(page.getByText('Where I Stopped')).toBeVisible();
  await expect(page.getByText('Rating')).toBeVisible();
});
