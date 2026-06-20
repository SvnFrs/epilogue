/**
 * Owner-scoped backlink repository (eng-review T6). BOTH endpoints of the edge must
 * belong to the owner — a `toEntryId` pointing at another owner's entry returns
 * undefined → 404 (never creates a cross-owner edge, never leaks existence).
 */
import { and, eq, inArray } from 'drizzle-orm';
import type { Db } from '../client';
import { entries, backlinks } from '../schema';

export function makeBacklinksRepo(db: Db) {
  return {
    async list(ownerId: string, fromEntryId: string): Promise<string[]> {
      const rows = await db
        .select({ to: backlinks.toEntryId })
        .from(backlinks)
        .where(and(eq(backlinks.ownerId, ownerId), eq(backlinks.fromEntryId, fromEntryId)));
      return rows.map((r) => r.to);
    },

    async add(
      ownerId: string,
      fromEntryId: string,
      toEntryId: string,
    ): Promise<{ ok: boolean }> {
      if (fromEntryId === toEntryId) return { ok: false };
      // BOTH ids must be owned — otherwise this is a cross-owner reference attempt.
      const owned = await db
        .select({ id: entries.id })
        .from(entries)
        .where(and(eq(entries.ownerId, ownerId), inArray(entries.id, [fromEntryId, toEntryId])));
      if (owned.length !== 2) return { ok: false };

      await db
        .insert(backlinks)
        .values({ ownerId, fromEntryId, toEntryId })
        .onConflictDoNothing({
          target: [backlinks.ownerId, backlinks.fromEntryId, backlinks.toEntryId],
        });
      return { ok: true };
    },

    async remove(ownerId: string, fromEntryId: string, toEntryId: string): Promise<boolean> {
      const rows = await db
        .delete(backlinks)
        .where(
          and(
            eq(backlinks.ownerId, ownerId),
            eq(backlinks.fromEntryId, fromEntryId),
            eq(backlinks.toEntryId, toEntryId),
          ),
        )
        .returning({ id: backlinks.id });
      return rows.length > 0;
    },
  };
}

export type BacklinksRepo = ReturnType<typeof makeBacklinksRepo>;
