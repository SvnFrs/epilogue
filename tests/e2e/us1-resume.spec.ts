import { test, expect } from '@playwright/test';

/**
 * T024e — the walking-skeleton acceptance (US1): create a paused game, capture a
 * save-state, reload, and confirm the "Previously On" context survives a cold return.
 * Proves Next RSC → Eden → Elysia → Drizzle → Postgres end-to-end through a real browser.
 */
test('resume a paused game from a cold save-state', async ({ page }) => {
  // create a paused GAME
  await page.goto('/entry/new');
  await page.getByLabel('Title', { exact: true }).fill('Red Dead Redemption II');
  await page.getByLabel('Type').selectOption('GAME');
  await page.getByLabel('Status').selectOption('PAUSED');
  await page.getByRole('button', { name: 'Create entry' }).click();

  // lands on the detail split-view
  await expect(page.getByRole('heading', { name: 'Red Dead Redemption II' })).toBeVisible();
  await expect(page.getByText('Previously On')).toBeVisible();

  // capture the checkpoint (the cold-resume cue)
  await page.getByRole('button', { name: 'edit' }).click();
  const checkpoint = 'Chapter 6 — the cabin in the snow, before the last ride';
  await page.getByRole('textbox').fill(checkpoint);
  await page.getByRole('button', { name: 'Save state' }).click();
  await expect(page.getByText(checkpoint)).toBeVisible();

  // RELOAD — the save-state must survive (cold recall)
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(checkpoint)).toBeVisible({ timeout: 10_000 });
});
