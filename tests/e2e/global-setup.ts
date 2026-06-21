/**
 * E2E global setup (testing.md tier 3): use a DEDICATED `epilogue_e2e` database, reset to
 * a deterministic seed before every run — so specs never collide with each other or with
 * the dev DB (`epilogue`), which is left untouched. Applies the generated SQL migrations
 * directly (no drizzle import → robust under Playwright's loader) on first creation.
 */
import postgres from 'postgres';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'postgres://epilogue:epilogue@localhost:5432';
const E2E_DB = 'epilogue_e2e';
const OWNER = '00000000-0000-4000-8000-000000000001';

export default async function globalSetup() {
  // ensure the dedicated e2e database exists
  const admin = postgres(`${HOST}/epilogue`, { max: 1 });
  const exists = await admin`SELECT 1 FROM pg_database WHERE datname = ${E2E_DB}`;
  if (exists.length === 0) await admin.unsafe(`CREATE DATABASE ${E2E_DB}`);
  await admin.end();

  const db = postgres(`${HOST}/${E2E_DB}`, { max: 1 });
  // migrate once (raw SQL) if the schema isn't there yet
  const hasSchema = await db`SELECT 1 FROM information_schema.tables WHERE table_name = 'entries'`;
  if (hasSchema.length === 0) {
    const dir = join(process.cwd(), 'drizzle');
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
      const sql = readFileSync(join(dir, file), 'utf8');
      for (const stmt of sql.split('--> statement-breakpoint')) {
        const s = stmt.trim();
        if (s) await db.unsafe(s);
      }
    }
  }
  // deterministic reset + seed the single owner
  await db`TRUNCATE TABLE backlinks, ledgers, volatile_contexts, entries, users RESTART IDENTITY CASCADE`;
  await db`INSERT INTO users (id, username, display_name) VALUES (${OWNER}, 'owner', 'The Archivist')`;
  await db.end();
}
