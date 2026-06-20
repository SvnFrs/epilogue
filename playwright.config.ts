import { defineConfig, devices } from '@playwright/test';

/**
 * E2E (testing.md tier 3) — Chromium only, semantic locators, zero waitForTimeout. The
 * webServer starts the FULL BUILT stack (Elysia api on Bun + the Next production build),
 * never `next dev`. Requires Postgres reachable via DATABASE_URL and the migrate one-shot
 * to have run (seeded owner). See tests/e2e/README.md.
 */
const OWNER_SECRET = process.env.OWNER_SECRET ?? 'dev-owner-secret-change-me';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'bun run --cwd apps/api start',
      url: 'http://localhost:4000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: { OWNER_SECRET },
    },
    {
      // assumes `next build` already ran (Node prod server); bun --bun for the no-Node host
      command: 'bun run --cwd apps/web start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { OWNER_SECRET, API_URL: 'http://localhost:4000' },
    },
  ],
});
