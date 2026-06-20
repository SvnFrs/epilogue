/**
 * Validated runtime config. The owner secret (eng-review Issue 1) gates the
 * trusted `X-Epilogue-Owner` header; without it the header is forgeable on the
 * Docker bridge. In dev a default is used so the skeleton boots; production must
 * supply a real secret via the Docker secret / env.
 */
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(4000),
  DATABASE_URL: z
    .string()
    .default('postgres://epilogue:epilogue@localhost:5432/epilogue'),
  OWNER_SECRET: z.string().min(1).default('dev-owner-secret-change-me'),
  WEB_ORIGIN: z.string().default('http://localhost:3000'),
  // The single local owner, seeded by the migrate one-shot (eng-review T3). The web
  // tier sends this id as X-Epilogue-Owner. Deterministic so dev/test are stable.
  DEFAULT_OWNER_ID: z.string().uuid().default('00000000-0000-4000-8000-000000000001'),
  DEFAULT_OWNER_USERNAME: z.string().default('owner'),
  DEFAULT_OWNER_NAME: z.string().default('The Archivist'),
});

export const env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
