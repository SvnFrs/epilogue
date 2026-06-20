/**
 * Entry routes (T020 + US2/US3/US4 surface). The Elysia app's type powers Eden, so the
 * web tier is type-checked against these handlers with no codegen. Bodies are validated
 * by the Zod schemas from `@epilogue/contracts` (single source of truth); ZodError →
 * 422 via the global onError. Every handler is owner-scoped via `ownerScope`.
 */
import { Elysia, t } from 'elysia';
import {
  CreateEntry,
  UpdateEntry,
  Ledger,
  Space,
  Status,
} from '@epilogue/contracts';
import type { Repos } from '../db/repositories';
import { ownerScope } from '../middleware/owner';
import { resolveForMediaType } from '../context/resolver';
import { Errors } from '../errors';

export function entriesRoutes(repos: Repos) {
  return new Elysia({ prefix: '/entries' })
    .use(ownerScope)

    // catalog list (US2) — filter by space + status
    .get('/', async ({ ownerId, query }) => {
      const space = Space.safeParse(query.space);
      const status = Status.safeParse(query.status);
      return repos.entries.list(ownerId, {
        space: space.success ? space.data : undefined,
        status: status.success ? status.data : undefined,
      });
    })

    // entry + volatile context + ledger (US1 cold read)
    .get('/:id', async ({ ownerId, params }) => {
      const detail = await repos.entries.getDetail(ownerId, params.id);
      if (!detail) throw Errors.notFound('Entry');
      return detail;
    })

    .post('/', async ({ ownerId, body, set }) => {
      const input = CreateEntry.parse(body);
      const entry = await repos.entries.create(ownerId, input);
      set.status = 201;
      return entry;
    })

    .patch('/:id', async ({ ownerId, params, body }) => {
      const patch = UpdateEntry.parse(body);
      const entry = await repos.entries.update(ownerId, params.id, patch);
      if (!entry) throw Errors.notFound('Entry');
      return entry;
    })

    .delete('/:id', async ({ ownerId, params }) => {
      const ok = await repos.entries.remove(ownerId, params.id);
      if (!ok) throw Errors.notFound('Entry');
      return { ok: true };
    })

    // set last_opened_at on open (FR-015 "N days ago")
    .post('/:id/touch', async ({ ownerId, params }) => {
      const entry = await repos.entries.touch(ownerId, params.id);
      if (!entry) throw Errors.notFound('Entry');
      return entry;
    })

    // replace the save-state — family is derived from the entry (server-authoritative)
    .put('/:id/context', async ({ ownerId, params, body }) => {
      const entry = await repos.entries.get(ownerId, params.id);
      if (!entry) throw Errors.notFound('Entry');
      const payload = (body as { payload?: unknown })?.payload ?? body;
      const ctx = resolveForMediaType(entry.mediaType, payload); // throws → 422
      const saved = await repos.context.put(ownerId, params.id, ctx);
      if (!saved) throw Errors.notFound('Entry');
      return saved;
    })

    // toggle a game thread done flag
    .patch(
      '/:id/context/threads/:threadId',
      async ({ ownerId, params, body }) => {
        const saved = await repos.context.toggleThread(
          ownerId,
          params.id,
          params.threadId,
          body.done,
        );
        if (!saved) throw Errors.notFound('Thread');
        return saved;
      },
      { body: t.Object({ done: t.Boolean() }) },
    )

    // ledger (US3)
    .get('/:id/ledger', async ({ ownerId, params }) => {
      const entry = await repos.entries.get(ownerId, params.id);
      if (!entry) throw Errors.notFound('Entry');
      const ledger = await repos.ledger.get(ownerId, params.id);
      return ledger ?? { blocks: [] };
    })

    .put('/:id/ledger', async ({ ownerId, params, body }) => {
      const ledger = Ledger.parse(body);
      const saved = await repos.ledger.put(ownerId, params.id, ledger);
      if (!saved) throw Errors.notFound('Entry');
      return saved;
    })

    // backlinks (US4 / tech) — toEntryId other-owner → 404 (eng T6)
    .post(
      '/:id/backlinks',
      async ({ ownerId, params, body }) => {
        const { ok } = await repos.backlinks.add(ownerId, params.id, body.toEntryId);
        if (!ok) throw Errors.notFound('Target entry');
        return { ok: true };
      },
      { body: t.Object({ toEntryId: t.String() }) },
    )

    .delete(
      '/:id/backlinks',
      async ({ ownerId, params, body }) => {
        const ok = await repos.backlinks.remove(ownerId, params.id, body.toEntryId);
        if (!ok) throw Errors.notFound('Backlink');
        return { ok: true };
      },
      { body: t.Object({ toEntryId: t.String() }) },
    );
}
