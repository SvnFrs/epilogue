import { defineConfig, devices } from '@playwright/test';

/**
 * E2E (testing.md tier 3) — Chromium only, semantic locators, zero waitForTimeout. The
 * webServer starts the FULL BUILT stack (Elysia api on Bun + the Next production build),
 * never `next dev`. Requires Postgres reachable via DATABASE_URL and the migrate one-shot
 * to have run (seeded owner). See tests/e2e/README.md.
 *
 * Arch Linux: Playwright's bundled browser wants Ubuntu libs (libflite1, …) that don't
 * exist here. Instead we drive the SYSTEM Chromium (pacman-managed deps) and skip the
 * Ubuntu-oriented host-requirement validation. Override the path with PLAYWRIGHT_CHROMIUM_PATH.
 */
const OWNER_SECRET = process.env.OWNER_SECRET ?? 'dev-owner-secret-change-me';
const SYSTEM_CHROMIUM =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ?? process.env.GSTACK_CHROMIUM_PATH ?? '/usr/bin/chromium';

// Skip the apt-based host validation (no apt on Arch); system Chromium has its own deps.
process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS ||= '1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1, // one shared web/db; run specs serially to avoid cold-server contention
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  // Dedicated, reset-each-run e2e database (leaves the dev DB untouched).
  globalSetup: './tests/e2e/global-setup.ts',
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath: SYSTEM_CHROMIUM },
      },
    },
  ],
  // Dedicated e2e ports (4001/3001) — never clash with the dev servers (4000/3000).
  webServer: [
    {
      command: 'bun src/index.ts',
      cwd: 'apps/api',
      url: 'http://localhost:4001/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        OWNER_SECRET,
        PORT: '4001',
        DATABASE_URL: 'postgres://epilogue:epilogue@localhost:5432/epilogue_e2e',
      },
    },
    {
      // assumes `next build` already ran; bun --bun for the no-Node host
      command: 'bun --bun next start -p 3001',
      cwd: 'apps/web',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { OWNER_SECRET, API_URL: 'http://localhost:4001' },
    },
  ],
});
