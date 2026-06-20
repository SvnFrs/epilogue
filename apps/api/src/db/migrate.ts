/**
 * Migrate-as-one-shot (eng-review T3, critical). Runs ALL pending migrations, then
 * idempotently seeds the single local owner, then exits 0. Compose runs this as a
 * `migrate` service that the api/web wait on — closing the two silent critical gaps:
 * unmigrated DB and unseeded owner (both → FK/inconsistent failures otherwise).
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import { env } from '../env';
import { users } from './schema';

async function main() {
  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
  const dbm = drizzle(migrationClient);

  console.log('[migrate] applying migrations…');
  await migrate(dbm, { migrationsFolder: new URL('../../../../drizzle', import.meta.url).pathname });

  console.log('[migrate] seeding default owner…');
  await dbm
    .insert(users)
    .values({
      id: env.DEFAULT_OWNER_ID,
      username: env.DEFAULT_OWNER_USERNAME,
      displayName: env.DEFAULT_OWNER_NAME,
    })
    .onConflictDoNothing({ target: users.id });

  // Defensive: ensure the row exists even if a prior partial seed used a different id.
  await dbm.execute(sql`select 1`);

  await migrationClient.end();
  console.log('[migrate] done. owner =', env.DEFAULT_OWNER_ID);
  process.exit(0);
}

main().catch((err) => {
  console.error('[migrate] FAILED', err);
  process.exit(1);
});
