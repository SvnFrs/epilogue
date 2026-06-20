# E2E (Playwright)

Runs against the **full built stack** (testing.md tier 3).

```sh
# 1. Postgres up + migrated + owner seeded (the migrate one-shot)
docker compose -f docker/docker-compose.yml up -d postgres
DATABASE_URL=postgres://epilogue:epilogue@localhost:5432/epilogue bun run db:migrate

# 2. build the web prod server (needs Node or `bun --bun next build`)
bun run build:web

# 3. install the browser once (Chromium) — NOTE: on Arch, set the system Chromium
#    PLAYWRIGHT_BROWSERS_PATH / channel if the bundled download hangs.
bunx playwright install chromium

# 4. run
OWNER_SECRET=dev-owner-secret-change-me bun run test:e2e
```

`playwright.config.ts` starts the api (Bun) + web (prod) automatically via `webServer`.
