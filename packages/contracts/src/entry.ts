import { z } from 'zod';
import { MediaType, Space, Status } from './enums';
import { VolatileContext } from './volatile-context';
import { Ledger } from './ledger';

/** Cover art — generative motif (default, no image) or an uploaded image (FR-018). */
export const Cover = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('generative'), motif: z.string().max(64) }),
  z.object({ kind: z.literal('image'), url: z.string().url().max(2_048) }),
]);
export type Cover = z.infer<typeof Cover>;

/** Create payload — space + context family are derived server-side from media_type. */
export const CreateEntry = z.object({
  title: z.string().min(1).max(500),
  subtitle: z.string().max(500).optional(),
  mediaType: MediaType,
  status: Status,
  year: z.number().int().min(0).max(9999).optional(),
  month: z.number().int().min(1).max(12).optional(),
  cover: Cover.optional(),
});
export type CreateEntry = z.infer<typeof CreateEntry>;

/** Partial update. Changing media_type warns + archives stale context (handled in the route). */
export const UpdateEntry = CreateEntry.partial();
export type UpdateEntry = z.infer<typeof UpdateEntry>;

/** Full entry as returned by the API. */
export const Entry = z.object({
  id: z.string().uuid(),
  title: z.string(),
  subtitle: z.string().nullable(),
  mediaType: MediaType,
  space: Space,
  status: Status,
  year: z.number().int().nullable(),
  month: z.number().int().nullable(),
  cover: Cover,
  createdAt: z.string(),
  updatedAt: z.string(),
  lastOpenedAt: z.string().nullable(),
});
export type Entry = z.infer<typeof Entry>;

/** Detail view = entry + its save-state + (lazily-created) ledger. */
export const EntryDetail = Entry.extend({
  context: VolatileContext.nullable(),
  ledger: Ledger.nullable(),
});
export type EntryDetail = z.infer<typeof EntryDetail>;
