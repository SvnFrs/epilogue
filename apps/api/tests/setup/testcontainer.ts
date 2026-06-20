/**
 * Integration globalSetup (testing.md tier 2b): start ONE real Postgres via
 * Testcontainers for the run, apply the generated migrations, expose DATABASE_URL.
 * Catches schema drift + isolation bugs that mocked DBs hide. Requires Docker +
 * generated migrations (`bun run db:generate`).
 */
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

let container: StartedPostgreSqlContainer;

export async function setup() {
  container = await new PostgreSqlContainer('postgres:17-alpine')
    .withDatabase('epilogue')
    .start();
  const url = container.getConnectionUri();
  process.env.DATABASE_URL = url;

  const client = postgres(url, { max: 1 });
  await migrate(drizzle(client), {
    migrationsFolder: fileURL('../../../../drizzle'),
  });
  await client.end();
}

export async function teardown() {
  await container?.stop();
}

function fileURL(rel: string): string {
  return new URL(rel, import.meta.url).pathname;
}
