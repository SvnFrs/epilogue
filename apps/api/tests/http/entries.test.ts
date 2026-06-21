/**
 * T020t — HTTP tests via Elysia `.handle()` (testing.md tier 2b). Exercises the
 * owner-scope middleware + Zod validation at the ROUTE boundary, not just the repo:
 * owner header accepted/rejected, context write + cold read, cross-owner → 404.
 */
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { createTestDb, seedUser } from '../setup/db';
import { makeRepos } from '../../src/db/repositories';
import { createApp } from '../../src/app';
import { env } from '../../src/env';

const { db, client } = createTestDb();
const app = createApp(makeRepos(db));

let alice: string;
let bob: string;

function req(path: string, init: RequestInit & { owner?: string; secret?: string } = {}) {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('content-type', 'application/json');
  if (init.owner) headers.set('x-epilogue-owner', init.owner);
  if (init.secret !== undefined) headers.set('x-epilogue-owner-secret', init.secret);
  return app.handle(new Request(`http://localhost${path}`, { ...init, headers }));
}

beforeEach(async () => {
  alice = await seedUser(db, 'alice');
  bob = await seedUser(db, 'bob');
});

afterAll(async () => {
  await client.end();
});

describe('owner-scope middleware', () => {
  it('rejects a request with no owner credentials → 401', async () => {
    const res = await req('/entries', { method: 'GET' });
    expect(res.status).toBe(401);
  });

  it('rejects the owner header WITHOUT the secret → 401 (forgeable otherwise)', async () => {
    const res = await req('/entries', { method: 'GET', owner: alice });
    expect(res.status).toBe(401);
  });

  it('rejects a wrong secret → 401', async () => {
    const res = await req('/entries', { method: 'GET', owner: alice, secret: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('accepts owner + correct secret → 200', async () => {
    const res = await req('/entries', { method: 'GET', owner: alice, secret: env.OWNER_SECRET });
    expect(res.status).toBe(200);
  });
});

describe('health is public', () => {
  it('responds without credentials', async () => {
    const res = await req('/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'ok' });
  });
});

describe('US1 — create, save-state, cold read over HTTP', () => {
  async function createGame(owner: string) {
    const res = await req('/entries', {
      method: 'POST',
      owner,
      secret: env.OWNER_SECRET,
      body: JSON.stringify({ title: 'RDR2', mediaType: 'GAME', status: 'PAUSED' }),
    });
    expect(res.status).toBe(201);
    return (await res.json()) as { id: string };
  }

  it('writes context then reads it back cold', async () => {
    const entry = await createGame(alice);
    const put = await req(`/entries/${entry.id}/context`, {
      method: 'PUT',
      owner: alice,
      secret: env.OWNER_SECRET,
      body: JSON.stringify({
        payload: {
          checkpoint: 'Chapter 6 — the cabin',
          threads: [{ id: 't1', text: 'pay the debt', done: false }],
          keymap: [{ action: 'Dead Eye', key: 'R' }],
        },
      }),
    });
    expect(put.status).toBe(200);

    const get = await req(`/entries/${entry.id}`, { owner: alice, secret: env.OWNER_SECRET });
    expect(get.status).toBe(200);
    const detail = (await get.json()) as { context: { family: string; payload: { checkpoint: string } } };
    expect(detail.context.family).toBe('game');
    expect(detail.context.payload.checkpoint).toContain('Chapter 6');
  });

  it('rejects an invalid context payload → 422', async () => {
    const entry = await createGame(alice);
    const put = await req(`/entries/${entry.id}/context`, {
      method: 'PUT',
      owner: alice,
      secret: env.OWNER_SECRET,
      body: JSON.stringify({ payload: { checkpoint: 'x' } }), // missing threads/keymap
    });
    expect(put.status).toBe(422);
  });

  it("a cross-owner entry id returns 404, not 403", async () => {
    const entry = await createGame(alice);
    const res = await req(`/entries/${entry.id}`, { owner: bob, secret: env.OWNER_SECRET });
    expect(res.status).toBe(404);
  });
});

describe('US2 — catalog filter over HTTP', () => {
  async function create(owner: string, body: object) {
    const res = await req('/entries', {
      method: 'POST',
      owner,
      secret: env.OWNER_SECRET,
      body: JSON.stringify(body),
    });
    expect(res.status).toBe(201);
  }

  it('filters by a comma-separated status list', async () => {
    await create(alice, { title: 'P', mediaType: 'GAME', status: 'PLAYING' });
    await create(alice, { title: 'Q', mediaType: 'GAME', status: 'PAUSED' });
    await create(alice, { title: 'R', mediaType: 'BOOK', status: 'READING' });
    const res = await req('/entries?status=PLAYING,PAUSED', { owner: alice, secret: env.OWNER_SECRET });
    expect(res.status).toBe(200);
    expect((await res.json()) as unknown[]).toHaveLength(2);
  });

  it('filters by space', async () => {
    await create(alice, { title: 'G', mediaType: 'GAME', status: 'PLAYING' });
    await create(alice, { title: 'B', mediaType: 'BOOK', status: 'READING' });
    const res = await req('/entries?space=reading', { owner: alice, secret: env.OWNER_SECRET });
    expect((await res.json()) as unknown[]).toHaveLength(1);
  });
});
