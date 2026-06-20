import { describe, it, expect } from 'vitest';
import {
  MEDIA_TYPES,
  familyForMediaType,
  spaceForMediaType,
  MEDIA_TYPE_TO_FAMILY,
  MEDIA_TYPE_TO_SPACE,
} from '@epilogue/contracts';
import {
  resolveContext,
  resolveForMediaType,
  emptyPayload,
  emptyContextForMediaType,
  ContextResolutionError,
} from './resolver';

describe('media_type → family / space mappings', () => {
  it.each(MEDIA_TYPES)('maps %s to a defined family and space', (mt) => {
    expect(familyForMediaType(mt)).toBe(MEDIA_TYPE_TO_FAMILY[mt]);
    expect(spaceForMediaType(mt)).toBe(MEDIA_TYPE_TO_SPACE[mt]);
  });

  it('keeps the data-model mapping exactly', () => {
    expect(MEDIA_TYPE_TO_FAMILY).toEqual({
      GAME: 'game',
      BOOK: 'reading',
      MANGA: 'reading',
      FILM: 'screen',
      SERIES: 'screen',
      ANIME: 'screen',
      TECH_LOG: 'tech',
    });
  });
});

describe('emptyPayload — per family', () => {
  it.each(['game', 'reading', 'screen', 'tech'] as const)('produces a valid empty %s payload', (fam) => {
    const empty = emptyPayload(fam);
    // an empty payload must itself satisfy the family schema
    expect(() => resolveContext(fam, empty)).not.toThrow();
  });
});

describe('resolveContext — valid shapes', () => {
  it('resolves a game payload', () => {
    const ctx = resolveContext('game', {
      checkpoint: 'Saved at the lighthouse',
      threads: [{ id: 't1', text: 'find the key', done: false }],
      keymap: [{ action: 'sprint', key: 'Shift' }],
    });
    expect(ctx.family).toBe('game');
  });

  it('resolves a reading payload', () => {
    const ctx = resolveContext('reading', {
      position: 'Book 3, Ch. 5',
      quotes: [{ id: 'q1', text: 'But man is a fickle and disreputable creature', reference: 'p.241' }],
    });
    expect(ctx.family).toBe('reading');
  });

  it('resolves a screen payload', () => {
    const ctx = resolveContext('screen', { position: 'S2E07 · 00:42', rating: 8.5, note: 'the turn' });
    expect(ctx.family).toBe('screen');
  });

  it('resolves a tech payload', () => {
    const ctx = resolveContext('tech', {
      sources: [{ id: 's1', label: 'RFC 9110', host: 'rfc-editor.org', kind: 'article' }],
      backlinks: [],
    });
    expect(ctx.family).toBe('tech');
  });
});

describe('resolveContext — rejects bad input', () => {
  it('throws on an unknown family', () => {
    // @ts-expect-error deliberately invalid family
    expect(() => resolveContext('podcast', {})).toThrow(ContextResolutionError);
  });

  it('throws when a game payload is missing fields', () => {
    expect(() => resolveContext('game', { checkpoint: 'x' })).toThrow(ContextResolutionError);
  });

  it('throws when a screen rating is out of range', () => {
    expect(() => resolveContext('screen', { position: 'a', rating: 99, note: '' })).toThrow(
      ContextResolutionError,
    );
  });

  it("does not let game-only fields bleed into a reading payload (US4 scenario 4)", () => {
    const ctx = resolveContext('reading', {
      position: 'Ch.1',
      quotes: [],
      checkpoint: 'should not appear', // extra field is stripped by the schema, not retained
    });
    expect('checkpoint' in (ctx.payload as object)).toBe(false);
  });
});

describe('resolveForMediaType / emptyContextForMediaType', () => {
  it('routes GAME to the game family', () => {
    const ctx = emptyContextForMediaType('GAME');
    expect(ctx.family).toBe('game');
  });
  it('routes ANIME to the screen family', () => {
    const ctx = emptyContextForMediaType('ANIME');
    expect(ctx.family).toBe('screen');
  });
  it('validates a payload against the media_type-derived family', () => {
    expect(() =>
      resolveForMediaType('BOOK', { position: 'Ch.1', quotes: [] }),
    ).not.toThrow();
  });
});
