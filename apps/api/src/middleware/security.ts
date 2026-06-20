/**
 * DIY security middleware (eng-review T8 / plan §Complexity). Elysia ships no built-ins,
 * so CORS, security headers, and a write rate-limit are EXPLICIT (plan.md). HTTP tests
 * exercise these at the route boundary.
 */
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { env } from '../env';
import { AppError } from '../errors';

/** CORS — allow only the web origin / tailnet (contracts/api.md). */
export const corsPlugin = cors({
  origin: [env.WEB_ORIGIN],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Epilogue-Owner', 'X-Epilogue-Owner-Secret'],
});

/** Helmet-equivalent baseline security headers. */
export const securityHeaders = new Elysia({ name: 'security-headers' }).onAfterHandle(
  ({ set }) => {
    set.headers['X-Content-Type-Options'] = 'nosniff';
    set.headers['X-Frame-Options'] = 'DENY';
    set.headers['Referrer-Policy'] = 'no-referrer';
    set.headers['X-DNS-Prefetch-Control'] = 'off';
  },
);

/**
 * Minimal in-memory token-bucket rate-limit on writes (eng-review T8). Keyed by owner +
 * method; suitable for the single-host self-hosted target. A distributed store is a
 * later concern (no horizontal scale on the i3).
 */
const WRITE_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
const buckets = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 120; // writes
const WINDOW_MS = 60_000;

export const writeRateLimit = new Elysia({ name: 'write-rate-limit' }).onBeforeHandle(
  ({ request, headers, set }) => {
    if (!WRITE_METHODS.has(request.method)) return;
    const key = `${headers['x-epilogue-owner'] ?? 'anon'}:w`;
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return;
    }
    bucket.count += 1;
    if (bucket.count > LIMIT) {
      set.headers['Retry-After'] = String(Math.ceil((bucket.resetAt - now) / 1000));
      throw new AppError(429, 'RATE_LIMITED', 'Too many writes; slow down');
    }
  },
);
