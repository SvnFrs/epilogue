import { test, expect } from '@playwright/test';

/**
 * T029t (US2) — browse the catalog and filter by space via the rail, then open a detail.
 * Seeds its own entry through the UI so it doesn't depend on prior state.
 */
test('browse the catalog, filter by space via the rail, open a detail', async ({ page }) => {
  // seed a Reading entry through the UI
  await page.goto('/entry/new');
  await page.getByLabel('Title', { exact: true }).fill('The Brothers Karamazov');
  await page.getByLabel('Type').selectOption('BOOK');
  await page.getByLabel('Status').selectOption('READING');
  await page.getByRole('button', { name: 'Create entry' }).click();
  await expect(page.getByRole('heading', { name: 'The Brothers Karamazov' })).toBeVisible();

  // back to the library, then filter to the Reading space via the rail
  await page.getByRole('link', { name: 'Library' }).click();
  await page.getByRole('link', { name: 'Reading', exact: true }).click();
  await expect(page).toHaveURL(/\/reading/);
  await expect(page.getByText('The Brothers Karamazov')).toBeVisible();

  // open the detail from the catalog card
  await page.getByRole('link', { name: 'The Brothers Karamazov' }).click();
  await expect(page.getByRole('heading', { name: 'The Brothers Karamazov' })).toBeVisible();
  await expect(page.getByText('Previously On')).toBeVisible();
});
