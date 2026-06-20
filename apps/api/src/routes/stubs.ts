/**
 * Phase-2b/3 surface, stubbed 501 (contracts/api.md). These have their OWN auth and
 * MUST NOT read the owner header — so they deliberately do not use `ownerScope`.
 */
import { Elysia } from 'elysia';
import { Errors } from '../errors';

export const stubRoutes = new Elysia()
  // Phase 2b read-only shareable sub-space
  .get('/share/:token', () => {
    throw Errors.notImplemented('Share');
  })
  // sync-agent bulk upsert (non-browser), API key / HMAC auth
  .post('/ingest', () => {
    throw Errors.notImplemented('Ingest');
  });
