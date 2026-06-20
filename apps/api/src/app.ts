/**
 * Elysia app composition. `typeof app` is what Eden consumes on the web tier (no codegen).
 * createApp(repos) is parameterized so HTTP tests can inject a Testcontainers-backed repo
 * set (testing.md 2b). Global onError maps AppError/ZodError to the `{ error: { code,
 * message } }` envelope (contracts/api.md) — never leaking another owner's data.
 */
import { Elysia } from 'elysia';
import { ZodError } from 'zod';
import { makeRepos, type Repos } from './db/repositories';
import { db } from './db/client';
import { entriesRoutes } from './routes/entries';
import { healthRoutes } from './routes/health';
import { stubRoutes } from './routes/stubs';
import { corsPlugin, securityHeaders, writeRateLimit } from './middleware/security';
import { AppError } from './errors';
import { ContextResolutionError } from './context/resolver';

const MAX_BODY_BYTES = 1_048_576; // 1 MiB cap on any request body (eng-review T5/T039)

export function createApp(repos: Repos) {
  return new Elysia()
    .use(corsPlugin)
    .use(securityHeaders)
    .use(writeRateLimit)
    // body-size guard — reject oversized bodies before parsing (413)
    .onRequest(({ request, set }) => {
      const len = Number(request.headers.get('content-length') ?? 0);
      if (len > MAX_BODY_BYTES) {
        set.status = 413;
        throw new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body exceeds the 1 MiB limit');
      }
    })
    .onError(({ error, set }) => {
      if (error instanceof AppError) {
        set.status = error.status;
        return { error: { code: error.code, message: error.message } };
      }
      if (error instanceof ZodError) {
        set.status = 422;
        return { error: { code: 'VALIDATION', message: 'Invalid request', detail: error.format() } };
      }
      if (error instanceof ContextResolutionError) {
        set.status = 422;
        return { error: { code: 'VALIDATION', message: error.message, detail: error.detail } };
      }
      set.status = 500;
      return { error: { code: 'INTERNAL', message: 'Internal error' } };
    })
    .use(healthRoutes)
    .use(stubRoutes)
    .use(entriesRoutes(repos));
}

export const app = createApp(makeRepos(db));
export type App = typeof app;
