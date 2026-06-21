/**
 * Owner-scoped entry repository (eng-review T2 defense-in-depth; constitution IV).
 * EVERY query filters by `owner_id`. A cross-owner id simply returns nothing → the
 * route maps that to 404 (never 403, never a leak). Integration tests assert isolation
 * per method (T016t).
 */
import { and, desc, eq, inArray } from 'drizzle-orm';
import {
  type CreateEntry,
  type Entry,
  type EntryDetail,
  type Space,
  type Status,
  type UpdateEntry,
  spaceForMediaType,
  familyForMediaType,
} from '@epilogue/contracts';
import type { Db } from '../client';
import { entries, volatileContexts, ledgers, backlinks } from '../schema';
import { emptyContextForMediaType } from '../../context/resolver';
import { toEntry, toContext, toLedger } from './mappers';

function defaultCover(motifSeed: string) {
  return { kind: 'generative' as const, motif: motifSeed };
}

export function makeEntriesRepo(db: Db) {
  return {
    async create(ownerId: string, input: CreateEntry): Promise<Entry> {
      const space = spaceForMediaType(input.mediaType);
      const emptyCtx = emptyContextForMediaType(input.mediaType);
      return db.transaction(async (tx) => {
        const [row] = await tx
          .insert(entries)
          .values({
            ownerId,
            title: input.title,
            subtitle: input.subtitle ?? null,
            mediaType: input.mediaType,
            space,
            status: input.status,
            year: input.year ?? null,
            month: input.month ?? null,
            cover: input.cover ?? defaultCover(input.mediaType.toLowerCase()),
          })
          .returning();
        // data-model rule: an entry ALWAYS has exactly one volatile context.
        await tx.insert(volatileContexts).values({
          entryId: row!.id,
          ownerId,
          family: emptyCtx.family,
          payload: emptyCtx.payload,
        });
        return toEntry(row!);
      });
    },

    async get(ownerId: string, id: string): Promise<Entry | undefined> {
      const [row] = await db
        .select()
        .from(entries)
        .where(and(eq(entries.id, id), eq(entries.ownerId, ownerId)))
        .limit(1);
      return row ? toEntry(row) : undefined;
    },

    async getDetail(ownerId: string, id: string): Promise<EntryDetail | undefined> {
      const entry = await this.get(ownerId, id);
      if (!entry) return undefined;
      const [ctxRow] = await db
        .select()
        .from(volatileContexts)
        .where(and(eq(volatileContexts.entryId, id), eq(volatileContexts.ownerId, ownerId)))
        .limit(1);
      const [ledgerRow] = await db
        .select()
        .from(ledgers)
        .where(and(eq(ledgers.entryId, id), eq(ledgers.ownerId, ownerId)))
        .limit(1);
      // outgoing backlink edges (Backlink table), titled for display (US4 / eng T6)
      const backlinkRows = await db
        .select({ id: entries.id, title: entries.title })
        .from(backlinks)
        .innerJoin(entries, eq(backlinks.toEntryId, entries.id))
        .where(and(eq(backlinks.ownerId, ownerId), eq(backlinks.fromEntryId, id)));
      return {
        ...entry,
        context: ctxRow ? toContext(ctxRow) : null,
        ledger: ledgerRow ? toLedger(ledgerRow) : null,
        backlinks: backlinkRows,
      };
    },

    async list(
      ownerId: string,
      filter: { space?: Space; status?: Status | Status[] },
    ): Promise<Entry[]> {
      const conds = [eq(entries.ownerId, ownerId)];
      if (filter.space) conds.push(eq(entries.space, filter.space));
      const statuses = filter.status
        ? Array.isArray(filter.status)
          ? filter.status
          : [filter.status]
        : [];
      if (statuses.length) conds.push(inArray(entries.status, statuses));
      const rows = await db
        .select()
        .from(entries)
        .where(and(...conds))
        .orderBy(desc(entries.lastOpenedAt), desc(entries.createdAt));
      return rows.map(toEntry);
    },

    async update(
      ownerId: string,
      id: string,
      patch: UpdateEntry,
    ): Promise<Entry | undefined> {
      return db.transaction(async (tx) => {
        const [existing] = await tx
          .select()
          .from(entries)
          .where(and(eq(entries.id, id), eq(entries.ownerId, ownerId)))
          .limit(1);
        if (!existing) return undefined;

        const nextMediaType = patch.mediaType ?? existing.mediaType;
        const familyChanged =
          familyForMediaType(nextMediaType) !== familyForMediaType(existing.mediaType);

        // T7/T040: changing media_type to a different family archives the old context
        // rather than silently dropping it (constitution: nothing silently deleted).
        let archived = existing.archivedContext;
        if (familyChanged) {
          const [oldCtx] = await tx
            .select()
            .from(volatileContexts)
            .where(and(eq(volatileContexts.entryId, id), eq(volatileContexts.ownerId, ownerId)))
            .limit(1);
          if (oldCtx) {
            archived = [...existing.archivedContext, { family: oldCtx.family, payload: oldCtx.payload }];
            const fresh = emptyContextForMediaType(nextMediaType);
            await tx
              .update(volatileContexts)
              .set({ family: fresh.family, payload: fresh.payload })
              .where(and(eq(volatileContexts.entryId, id), eq(volatileContexts.ownerId, ownerId)));
          }
        }

        const [row] = await tx
          .update(entries)
          .set({
            title: patch.title ?? existing.title,
            subtitle: patch.subtitle === undefined ? existing.subtitle : patch.subtitle,
            mediaType: nextMediaType,
            space: spaceForMediaType(nextMediaType),
            status: patch.status ?? existing.status,
            year: patch.year === undefined ? existing.year : patch.year,
            month: patch.month === undefined ? existing.month : patch.month,
            cover: patch.cover ?? existing.cover,
            archivedContext: archived,
            updatedAt: new Date(),
          })
          .where(and(eq(entries.id, id), eq(entries.ownerId, ownerId)))
          .returning();
        return row ? toEntry(row) : undefined;
      });
    },

    async touch(ownerId: string, id: string): Promise<Entry | undefined> {
      const [row] = await db
        .update(entries)
        .set({ lastOpenedAt: new Date() })
        .where(and(eq(entries.id, id), eq(entries.ownerId, ownerId)))
        .returning();
      return row ? toEntry(row) : undefined;
    },

    async remove(ownerId: string, id: string): Promise<boolean> {
      const rows = await db
        .delete(entries)
        .where(and(eq(entries.id, id), eq(entries.ownerId, ownerId)))
        .returning({ id: entries.id });
      return rows.length > 0;
    },
  };
}

export type EntriesRepo = ReturnType<typeof makeEntriesRepo>;
