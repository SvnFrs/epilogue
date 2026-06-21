import { test, expect } from '@playwright/test';

/**
 * T034t (US3) — start a Ledger from a named-anchor preset, add a paragraph, save, and
 * confirm it survives a reload (write → read back through the full stack).
 */
test('write a ledger from a preset and read it back', async ({ page }) => {
  // create an entry
  await page.goto('/entry/new');
  await page.getByLabel('Title', { exact: true }).fill('Disco Elysium');
  await page.getByLabel('Type').selectOption('GAME');
  await page.getByLabel('Status').selectOption('COMPLETED');
  await page.getByRole('button', { name: 'Create entry' }).click();
  await expect(page.getByRole('heading', { name: 'Disco Elysium' })).toBeVisible();

  // start the ledger via the "The Sandbox" preset (seeds a heading + opens the editor)
  await page.getByRole('button', { name: 'The Sandbox' }).click();
  await page.getByPlaceholder('Title').fill('On Disco Elysium');
  await page.getByRole('button', { name: 'paragraph', exact: true }).click();
  await page.getByPlaceholder('Write…').fill('A detective story about a dying world.');
  await page.getByRole('button', { name: 'Save ledger' }).click();

  // read view shows it immediately
  await expect(page.getByText('A detective story about a dying world.')).toBeVisible();
  await expect(page.getByText('The Sandbox')).toBeVisible();

  // and it survives a cold reload
  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('A detective story about a dying world.')).toBeVisible({ timeout: 10_000 });
});
