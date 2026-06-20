import { z } from 'zod';
import { Family } from './enums';

/**
 * The polymorphic save-state ("Volatile Context Block"), discriminated by `family`.
 * One Zod schema per family — the single source for the API resolver, the routes,
 * and the tests (data-model.md §VolatileContext). Length caps double as JSONB body
 * guards (eng-review T5).
 */

const shortText = z.string().max(2_000);
const longText = z.string().max(20_000);
const id = z.string().min(1).max(128);

// ── game ──────────────────────────────────────────────────────────────────────
export const GameThread = z.object({
  id,
  text: shortText,
  done: z.boolean(),
});
export const GameKey = z.object({
  action: shortText,
  key: z.string().max(64),
});
export const GamePayload = z.object({
  checkpoint: longText,
  threads: z.array(GameThread).max(200),
  keymap: z.array(GameKey).max(200),
});

// ── reading (BOOK / MANGA) ──────────────────────────────────────────────────────
export const ReadingQuote = z.object({
  id,
  text: longText,
  reference: z.string().max(512), // may be empty; UI flags it (data-model.md)
});
export const ReadingPayload = z.object({
  position: shortText, // e.g. "Book 3, Ch. 5 — The Grand Inquisitor"
  quotes: z.array(ReadingQuote).max(500),
});

// ── screen (FILM / SERIES / ANIME) ──────────────────────────────────────────────
export const ScreenPayload = z.object({
  position: shortText, // e.g. "S2E07 · 00:42:15"
  rating: z.number().min(0).max(10),
  note: longText,
});

// ── tech (TECH_LOG) ─────────────────────────────────────────────────────────────
export const TechSource = z.object({
  id,
  label: shortText,
  host: z.string().max(256),
  kind: z.enum(['video', 'book', 'article', 'link']),
});
export const TechPayload = z.object({
  sources: z.array(TechSource).max(500),
  backlinks: z.array(z.string().uuid()).max(500), // entry ids
});

/** Discriminated union — the wire shape of a volatile context. */
export const VolatileContext = z.discriminatedUnion('family', [
  z.object({ family: z.literal('game'), payload: GamePayload }),
  z.object({ family: z.literal('reading'), payload: ReadingPayload }),
  z.object({ family: z.literal('screen'), payload: ScreenPayload }),
  z.object({ family: z.literal('tech'), payload: TechPayload }),
]);

/** Payload-only schema per family (used by the resolver to validate `payload`). */
export const PAYLOAD_SCHEMA = {
  game: GamePayload,
  reading: ReadingPayload,
  screen: ScreenPayload,
  tech: TechPayload,
} satisfies Record<z.infer<typeof Family>, z.ZodTypeAny>;

export type GamePayload = z.infer<typeof GamePayload>;
export type ReadingPayload = z.infer<typeof ReadingPayload>;
export type ScreenPayload = z.infer<typeof ScreenPayload>;
export type TechPayload = z.infer<typeof TechPayload>;
export type VolatileContext = z.infer<typeof VolatileContext>;
