/**
 * Owner-scope middleware (eng-review Issue 1 + outside-voice #1; contracts/api.md).
 * The web tier sends `X-Epilogue-Owner` PLUS `X-Epilogue-Owner-Secret` (a per-deploy
 * secret only the web tier holds). A trusted header alone is forgeable by anything on
 * the Docker bridge, so the secret is REQUIRED — reject the header without it (401).
 * On success it derives `ownerId`, which every repository call must scope by.
 *
 * `/share` (token) and `/ingest` (API key/HMAC) have their OWN auth and MUST NOT use
 * this plugin (they never read the owner header).
 */
import { Elysia } from 'elysia';
import { env } from '../env';
import { Errors } from '../errors';

// timing-safe-ish compare (constant length not guaranteed, but avoids early-exit on prefix)
function secretMatches(provided: string | undefined): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(env.OWNER_SECRET);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export const ownerScope = new Elysia({ name: 'owner-scope' }).derive(
  { as: 'scoped' },
  ({ headers }) => {
    const owner = headers['x-epilogue-owner'];
    const secret = headers['x-epilogue-owner-secret'];
    if (!owner || !secretMatches(secret)) {
      throw Errors.unauthorized();
    }
    return { ownerId: owner };
  },
);
