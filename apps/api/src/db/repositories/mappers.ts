import type { Entry, Ledger, VolatileContext } from '@epilogue/contracts';
import type { EntryRow, LedgerRow, VolatileContextRow } from '../schema';

const iso = (d: Date | null): string | null => (d ? d.toISOString() : null);

export function toEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    mediaType: row.mediaType,
    space: row.space,
    status: row.status,
    year: row.year,
    month: row.month,
    cover: row.cover,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastOpenedAt: iso(row.lastOpenedAt),
  };
}

export function toContext(row: VolatileContextRow): VolatileContext {
  return { family: row.family, payload: row.payload } as VolatileContext;
}

export function toLedger(row: LedgerRow): Ledger {
  return {
    title: row.title ?? undefined,
    standfirst: row.standfirst ?? undefined,
    byline: row.byline ?? undefined,
    blocks: row.blocks,
  };
}
