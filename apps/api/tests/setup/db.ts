/** Per-file test Db + helpers. Reads DATABASE_URL set by the globalSetup container. */
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from '../../src/db/schema';

export function createTestDb() {
  const url = process.env.DATABASE_URL!;
  const client = postgres(url, { max: 5 });
  const db = drizzle(client, { schema });
  return { db, client };
}

/**
 * Seed a fresh, UNIQUE owner and return its id. Every test gets its own owners (uuid-
 * suffixed usernames) so files stay isolated WITHOUT a global TRUNCATE — parallel-safe,
 * and everything is owner-scoped so accumulated rows never affect per-owner assertions.
 */
export async function seedUser(db: ReturnType<typeof createTestDb>['db'], label: string) {
  const username = `${label}-${crypto.randomUUID()}`;
  const [row] = await db
    .insert(schema.users)
    .values({ username, displayName: label })
    .returning({ id: schema.users.id });
  return row!.id;
}

export { schema, sql };
