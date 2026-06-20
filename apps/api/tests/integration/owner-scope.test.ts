/**
 * T016t — owner-scoping / tenant isolation (testing.md tier 2b, HIGHEST priority).
 * A deliberate cross-owner leak test per table, plus CRUD + polymorphic persistence +
 * the US1 cold read, against REAL Postgres (Testcontainers).
 */
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { createTestDb, seedUser } from '../setup/db';
import { makeRepos } from '../../src/db/repositories';

const { db, client } = createTestDb();
const repos = makeRepos(db);

let alice: string;
let bob: string;

beforeEach(async () => {
  alice = await seedUser(db, 'alice');
  bob = await seedUser(db, 'bob');
});

afterAll(async () => {
  await client.end();
});

describe('entries — owner isolation', () => {
  it('a cross-owner id returns nothing (→ 404 at the route, never a leak)', async () => {
    const e = await repos.entries.create(alice, {
      title: 'RDR2',
      mediaType: 'GAME',
      status: 'PAUSED',
    });
    expect(await repos.entries.get(alice, e.id)).toBeDefined();
    expect(await repos.entries.get(bob, e.id)).toBeUndefined();
    expect(await repos.entries.getDetail(bob, e.id)).toBeUndefined();
  });

  it('list is scoped per owner', async () => {
    await repos.entries.create(alice, { title: 'A1', mediaType: 'GAME', status: 'PLAYING' });
    await repos.entries.create(alice, { title: 'A2', mediaType: 'BOOK', status: 'READING' });
    await repos.entries.create(bob, { title: 'B1', mediaType: 'GAME', status: 'PLAYING' });
    expect(await repos.entries.list(alice, {})).toHaveLength(2);
    expect(await repos.entries.list(bob, {})).toHaveLength(1);
  });

  it('filters by space and status', async () => {
    await repos.entries.create(alice, { title: 'G', mediaType: 'GAME', status: 'PLAYING' });
    await repos.entries.create(alice, { title: 'B', mediaType: 'BOOK', status: 'READING' });
    expect(await repos.entries.list(alice, { space: 'gaming' })).toHaveLength(1);
    expect(await repos.entries.list(alice, { status: 'READING' })).toHaveLength(1);
  });

  it('cannot update or delete another owner’s entry', async () => {
    const e = await repos.entries.create(alice, { title: 'X', mediaType: 'GAME', status: 'PAUSED' });
    expect(await repos.entries.update(bob, e.id, { title: 'hacked' })).toBeUndefined();
    expect(await repos.entries.remove(bob, e.id)).toBe(false);
    expect(await repos.entries.get(alice, e.id)).toBeDefined();
  });
});

describe('volatile context — polymorphic persistence + US1 cold read', () => {
  it('a new entry always has exactly one (empty) context of its family', async () => {
    const e = await repos.entries.create(alice, { title: 'G', mediaType: 'GAME', status: 'PAUSED' });
    const ctx = await repos.context.get(alice, e.id);
    expect(ctx?.family).toBe('game');
  });

  it('persists a game save-state and reads it back cold (US1)', async () => {
    const e = await repos.entries.create(alice, { title: 'RDR2', mediaType: 'GAME', status: 'PAUSED' });
    await repos.context.put(alice, e.id, {
      family: 'game',
      payload: {
        checkpoint: 'Chapter 6 — the cabin in the snow',
        threads: [{ id: 't1', text: 'pay off the debt', done: false }],
        keymap: [{ action: 'Dead Eye', key: 'R' }],
      },
    });
    const detail = await repos.entries.getDetail(alice, e.id);
    expect(detail?.context?.family).toBe('game');
    expect((detail?.context?.payload as { checkpoint: string }).checkpoint).toContain('Chapter 6');
    // and isolation holds for the detail read
    expect(await repos.entries.getDetail(bob, e.id)).toBeUndefined();
  });

  it('each family persists its own shape', async () => {
    const book = await repos.entries.create(alice, { title: 'Karamazov', mediaType: 'BOOK', status: 'READING' });
    await repos.context.put(alice, book.id, {
      family: 'reading',
      payload: { position: 'Book 5', quotes: [{ id: 'q', text: 'rebellion', reference: 'p.1' }] },
    });
    const screen = await repos.entries.create(alice, { title: 'Eva', mediaType: 'ANIME', status: 'AIRING' });
    await repos.context.put(alice, screen.id, {
      family: 'screen',
      payload: { position: 'Ep 24', rating: 9.5, note: 'congratulations' },
    });
    expect((await repos.context.get(alice, book.id))?.family).toBe('reading');
    expect((await repos.context.get(alice, screen.id))?.family).toBe('screen');
  });

  it('cannot write context to another owner’s entry', async () => {
    const e = await repos.entries.create(alice, { title: 'X', mediaType: 'GAME', status: 'PAUSED' });
    const res = await repos.context.put(bob, e.id, {
      family: 'game',
      payload: { checkpoint: 'pwned', threads: [], keymap: [] },
    });
    expect(res).toBeUndefined();
  });
});

describe('ledger — round-trip + isolation', () => {
  it('lazily creates, persists blocks, and reads back', async () => {
    const e = await repos.entries.create(alice, { title: 'X', mediaType: 'GAME', status: 'PAUSED' });
    expect(await repos.ledger.get(alice, e.id)).toBeUndefined();
    await repos.ledger.put(alice, e.id, {
      title: 'On X',
      blocks: [{ type: 'paragraph', text: 'hello' }],
    });
    const ledger = await repos.ledger.get(alice, e.id);
    expect(ledger?.blocks).toHaveLength(1);
    expect(await repos.ledger.get(bob, e.id)).toBeUndefined();
  });
});

describe('backlinks — cross-owner target is refused (eng T6)', () => {
  it('refuses a toEntryId owned by someone else (→ 404)', async () => {
    const a = await repos.entries.create(alice, { title: 'A tech', mediaType: 'TECH_LOG', status: 'COMPLETED' });
    const bEntry = await repos.entries.create(bob, { title: 'B tech', mediaType: 'TECH_LOG', status: 'COMPLETED' });
    const res = await repos.backlinks.add(alice, a.id, bEntry.id);
    expect(res.ok).toBe(false);
  });

  it('allows a backlink between the owner’s own entries', async () => {
    const a1 = await repos.entries.create(alice, { title: 'A1', mediaType: 'TECH_LOG', status: 'COMPLETED' });
    const a2 = await repos.entries.create(alice, { title: 'A2', mediaType: 'TECH_LOG', status: 'COMPLETED' });
    const res = await repos.backlinks.add(alice, a1.id, a2.id);
    expect(res.ok).toBe(true);
    expect(await repos.backlinks.list(alice, a1.id)).toContain(a2.id);
  });
});

describe('delete cascade', () => {
  it('removes the entry’s context + ledger', async () => {
    const e = await repos.entries.create(alice, { title: 'X', mediaType: 'GAME', status: 'PAUSED' });
    await repos.ledger.put(alice, e.id, { blocks: [{ type: 'paragraph', text: 'x' }] });
    await repos.entries.remove(alice, e.id);
    expect(await repos.context.get(alice, e.id)).toBeUndefined();
    expect(await repos.ledger.get(alice, e.id)).toBeUndefined();
  });
});
