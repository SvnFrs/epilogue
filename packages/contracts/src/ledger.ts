import { z } from 'zod';

/**
 * The Ledger — long-form structured writing as an ordered array of typed blocks
 * (data-model.md §Ledger; FR-010). Block (de)serialization is round-trip unit-tested.
 * Caps bound JSONB body size (eng-review T5).
 */

const text = z.string().max(50_000);

export const HeadingBlock = z.object({
  type: z.literal('heading'),
  text: z.string().max(2_000),
  note: z.string().max(2_000).optional(),
});
export const ParagraphBlock = z.object({
  type: z.literal('paragraph'),
  text,
});
export const QuoteBlock = z.object({
  type: z.literal('quote'),
  text,
  reference: z.string().max(512),
});
export const CalloutBlock = z.object({
  type: z.literal('callout'),
  icon: z.string().max(64),
  title: z.string().max(2_000),
  text,
});
export const EmbedBlock = z.object({
  type: z.literal('embed'),
  url: z.string().url().max(2_048),
  label: z.string().max(2_000),
});

export const LedgerBlock = z.discriminatedUnion('type', [
  HeadingBlock,
  ParagraphBlock,
  QuoteBlock,
  CalloutBlock,
  EmbedBlock,
]);

export const Ledger = z.object({
  title: z.string().max(2_000).optional(),
  standfirst: z.string().max(4_000).optional(),
  byline: z.string().max(512).optional(),
  blocks: z.array(LedgerBlock).max(1_000),
});

export type LedgerBlock = z.infer<typeof LedgerBlock>;
export type Ledger = z.infer<typeof Ledger>;
