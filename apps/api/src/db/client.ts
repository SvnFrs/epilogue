/** Drizzle client over postgres.js. The api is the ONLY tier that touches Postgres. */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import * as schema from './schema';

// Single shared connection pool. Keep it modest — Postgres saturates the pool
// before CPU on the i3 target (testing.md tier 4).
export const sqlClient = postgres(env.DATABASE_URL, { max: 10 });
export const db = drizzle(sqlClient, { schema });
export type Db = typeof db;
export { schema };
