/**
 * The polymorphic resolver (data-model.md; research.md D-context): mediaType → family
 * → shape. This is the highest-value pure module — every family + the unknown fallback
 * is table-unit-tested (T013t). No I/O: it only maps + validates with the Zod schemas
 * from `@epilogue/contracts` (single source of truth).
 */
import {
  type Family,
  type MediaType,
  type VolatileContext,
  familyForMediaType,
  PAYLOAD_SCHEMA,
} from '@epilogue/contracts';

export class ContextResolutionError extends Error {
  constructor(
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'ContextResolutionError';
  }
}

/** The empty save-state per family — drives the per-family empty-state UI (ux-ui.md). */
export function emptyPayload(family: Family): VolatileContext['payload'] {
  switch (family) {
    case 'game':
      return { checkpoint: '', threads: [], keymap: [] };
    case 'reading':
      return { position: '', quotes: [] };
    case 'screen':
      return { position: '', rating: 0, note: '' };
    case 'tech':
      return { sources: [], backlinks: [] };
    default: {
      // exhaustiveness guard — a new family must extend this switch
      const _never: never = family;
      throw new ContextResolutionError(`unknown family: ${String(_never)}`);
    }
  }
}

/**
 * Validate a raw payload against its family schema and return a typed VolatileContext.
 * Throws ContextResolutionError on an unknown family or a shape mismatch.
 */
export function resolveContext(family: Family, payload: unknown): VolatileContext {
  const schema = PAYLOAD_SCHEMA[family];
  if (!schema) throw new ContextResolutionError(`unknown family: ${String(family)}`);
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ContextResolutionError(`payload does not match family "${family}"`, parsed.error.format());
  }
  return { family, payload: parsed.data } as VolatileContext;
}

/** Resolve straight from media_type (the common path for a new entry). */
export function resolveForMediaType(mediaType: MediaType, payload: unknown): VolatileContext {
  return resolveContext(familyForMediaType(mediaType), payload);
}

/** A fresh empty context for a media_type — used when an entry is first created. */
export function emptyContextForMediaType(mediaType: MediaType): VolatileContext {
  const family = familyForMediaType(mediaType);
  return { family, payload: emptyPayload(family) } as VolatileContext;
}
