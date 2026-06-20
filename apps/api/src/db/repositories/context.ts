/** Owner-scoped volatile-context repository. The route validates payloads via the resolver. */
import { and, eq } from 'drizzle-orm';
import type { Family, VolatileContext } from '@epilogue/contracts';
import { GamePayload } from '@epilogue/contracts';
import type { Db } from '../client';
import { entries, volatileContexts } from '../schema';
import { toContext } from './mappers';

export function makeContextRepo(db: Db) {
  return {
    async get(ownerId: string, entryId: string): Promise<VolatileContext | undefined> {
      const [row] = await db
        .select()
        .from(volatileContexts)
        .where(and(eq(volatileContexts.entryId, entryId), eq(volatileContexts.ownerId, ownerId)))
        .limit(1);
      return row ? toContext(row) : undefined;
    },

    /** Replace the save-state. Returns undefined if the entry doesn't belong to the owner. */
    async put(
      ownerId: string,
      entryId: string,
      ctx: VolatileContext,
    ): Promise<VolatileContext | undefined> {
      const [entry] = await db
        .select({ id: entries.id })
        .from(entries)
        .where(and(eq(entries.id, entryId), eq(entries.ownerId, ownerId)))
        .limit(1);
      if (!entry) return undefined;

      const [row] = await db
        .insert(volatileContexts)
        .values({ entryId, ownerId, family: ctx.family, payload: ctx.payload })
        .onConflictDoUpdate({
          target: volatileContexts.entryId,
          set: { family: ctx.family, payload: ctx.payload },
        })
        .returning();
      return row ? toContext(row) : undefined;
    },

    /** Toggle a single game thread's done flag (contracts/api.md PATCH .../threads/:id). */
    async toggleThread(
      ownerId: string,
      entryId: string,
      threadId: string,
      done: boolean,
    ): Promise<VolatileContext | undefined> {
      const current = await this.get(ownerId, entryId);
      if (!current || current.family !== 'game') return undefined;
      const payload = GamePayload.parse(current.payload);
      const threads = payload.threads.map((t) => (t.id === threadId ? { ...t, done } : t));
      return this.put(ownerId, entryId, { family: 'game', payload: { ...payload, threads } });
    },
  };
}

export type ContextRepo = ReturnType<typeof makeContextRepo>;
export type { Family };
