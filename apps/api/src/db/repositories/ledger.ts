/** Owner-scoped ledger repository. The ledger row is created lazily on first write. */
import { and, eq } from 'drizzle-orm';
import type { Ledger } from '@epilogue/contracts';
import type { Db } from '../client';
import { entries, ledgers } from '../schema';
import { toLedger } from './mappers';

export function makeLedgerRepo(db: Db) {
  return {
    async get(ownerId: string, entryId: string): Promise<Ledger | undefined> {
      const [row] = await db
        .select()
        .from(ledgers)
        .where(and(eq(ledgers.entryId, entryId), eq(ledgers.ownerId, ownerId)))
        .limit(1);
      return row ? toLedger(row) : undefined;
    },

    /** Upsert the ledger. Returns undefined if the entry isn't the owner's. */
    async put(ownerId: string, entryId: string, ledger: Ledger): Promise<Ledger | undefined> {
      const [entry] = await db
        .select({ id: entries.id })
        .from(entries)
        .where(and(eq(entries.id, entryId), eq(entries.ownerId, ownerId)))
        .limit(1);
      if (!entry) return undefined;

      const [row] = await db
        .insert(ledgers)
        .values({
          entryId,
          ownerId,
          title: ledger.title ?? null,
          standfirst: ledger.standfirst ?? null,
          byline: ledger.byline ?? null,
          blocks: ledger.blocks,
        })
        .onConflictDoUpdate({
          target: ledgers.entryId,
          set: {
            title: ledger.title ?? null,
            standfirst: ledger.standfirst ?? null,
            byline: ledger.byline ?? null,
            blocks: ledger.blocks,
            updatedAt: new Date(),
          },
        })
        .returning();
      return row ? toLedger(row) : undefined;
    },
  };
}

export type LedgerRepo = ReturnType<typeof makeLedgerRepo>;
