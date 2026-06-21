/**
 * Demo seed — a curated, RICH library so the UI is judged on real content, not an empty
 * entry. Resets all rows (keeps/re-seeds the single owner), then creates entries across all
 * four families with full save-states + a few written ledgers + a backlink.
 *
 * Run: `DATABASE_URL=… OWNER_SECRET=… bun run --cwd apps/api db:seed-demo`
 * Idempotent-ish: it TRUNCATEs first, so re-running gives a clean curated library.
 */
import { db, sqlClient } from './client';
import { users } from './schema';
import { makeRepos } from './repositories';
import { env } from '../env';
import type { CreateEntry, VolatileContext, Ledger } from '@epilogue/contracts';

const repos = makeRepos(db);
const owner = env.DEFAULT_OWNER_ID;

type Demo = {
  entry: CreateEntry;
  context?: VolatileContext['payload'];
  ledger?: Ledger;
  linkTo?: string; // title of another demo entry to backlink (tech)
};

const LIB: Demo[] = [
  {
    entry: { title: 'Red Dead Redemption II', subtitle: 'Rockstar · 2018', mediaType: 'GAME', status: 'PAUSED', year: 2018 },
    context: {
      checkpoint: 'Chapter 6 — the cabin in the snow above Colter, the morning before the last ride with John. Health core low; stocked on tonics.',
      threads: [
        { id: 't1', text: 'Pay off the debt to Strauss', done: true },
        { id: 't2', text: 'Find the legendary bear in the Grizzlies', done: false },
        { id: 't3', text: 'Finish the Hamish fishing companion quests', done: false },
      ],
      keymap: [
        { action: 'Dead Eye', key: 'R' },
        { action: 'Cinematic camera', key: '.' },
        { action: 'Whistle for horse', key: 'Z' },
      ],
    },
    ledger: {
      title: 'On Red Dead Redemption II',
      standfirst: 'A slow elegy for a world that is already gone.',
      byline: 'The Archivist',
      blocks: [
        { type: 'heading', text: 'The Sandbox', note: 'where I wandered' },
        { type: 'paragraph', text: 'I spent forty hours doing almost nothing in particular — fishing, listening to camp talk, watching the light change over the Heartlands. The game is at its best when it lets you be slow.' },
        { type: 'quote', text: 'We can’t change what’s done. We can only move on.', reference: 'Arthur Morgan' },
        { type: 'callout', icon: 'compass', title: 'Where I stopped', text: 'Chapter 6, the cabin in the snow. Saving the last ride for a night I can give it.' },
      ],
    },
  },
  {
    entry: { title: 'Elden Ring', subtitle: 'FromSoftware · 2022', mediaType: 'GAME', status: 'PLAYING', year: 2022 },
    context: {
      checkpoint: 'Site of Grace: Stormveil Castle, main gate. RL42, +6 Uchigatana, ~14k runes banked.',
      threads: [
        { id: 't1', text: 'Beat Margit (again, properly)', done: false },
        { id: 't2', text: 'Find the second golden seed in Limgrave', done: false },
      ],
      keymap: [
        { action: 'Dodge roll', key: 'Space' },
        { action: 'Flask of Crimson Tears', key: 'Q' },
      ],
    },
  },
  {
    entry: { title: 'Disco Elysium', subtitle: 'ZA/UM · The Final Cut', mediaType: 'GAME', status: 'COMPLETED', year: 2019 },
    context: { checkpoint: 'Finished — the tribunal on the coast, then the morning after. Communist build, 4 days to the end.', threads: [], keymap: [] },
    ledger: {
      title: 'On Disco Elysium',
      standfirst: 'A detective story about a dying world, told entirely inside one ruined head.',
      byline: 'The Archivist',
      blocks: [
        { type: 'paragraph', text: 'The best writing in any game I have played. It is not about the murder. It is about whether a broken man can still choose what kind of person to be.' },
        { type: 'quote', text: 'Wash the blood off the deck.', reference: 'Kim Kitsuragi' },
        { type: 'callout', icon: 'star', title: 'Verdict', text: 'A masterpiece. Play it slowly, fail the rolls, read everything.' },
      ],
    },
  },
  {
    entry: { title: 'The Brothers Karamazov', subtitle: 'Fyodor Dostoevsky', mediaType: 'BOOK', status: 'READING', year: 1880 },
    context: {
      position: 'Book 5, Ch. 5 — “The Grand Inquisitor”',
      quotes: [
        { id: 'q1', text: 'But man is a fickle and disreputable creature, and perhaps, like a chess player, loves only the process of the game, not the end of it.', reference: 'p.241' },
        { id: 'q2', text: 'The mystery of human existence lies not in just staying alive, but in finding something to live for.', reference: 'p.270' },
      ],
    },
  },
  {
    entry: { title: 'Dune', subtitle: 'Frank Herbert', mediaType: 'BOOK', status: 'COMPLETED', year: 1965 },
    context: { position: 'Finished — Book III', quotes: [{ id: 'q1', text: 'Fear is the mind-killer.', reference: 'Bene Gesserit litany' }] },
  },
  {
    entry: { title: 'Berserk', subtitle: 'Kentaro Miura', mediaType: 'MANGA', status: 'READING', year: 1989 },
    context: { position: 'Vol. 22 — Conviction arc', quotes: [] },
  },
  {
    entry: { title: 'Severance', subtitle: 'Apple TV+', mediaType: 'SERIES', status: 'AIRING', year: 2022 },
    context: { position: 'S2E07 · 00:42:15', rating: 9, note: 'The cold open broke me. The outie/innie split is the best metaphor for work I have seen on TV.' },
  },
  {
    entry: { title: 'Blade Runner 2049', subtitle: 'Denis Villeneuve', mediaType: 'FILM', status: 'COMPLETED', year: 2017 },
    context: { position: 'Finished · 02:43', rating: 9.5, note: 'Every frame a painting. The Joi hologram scene lives rent-free.' },
  },
  {
    entry: { title: 'Neon Genesis Evangelion', subtitle: 'Gainax', mediaType: 'ANIME', status: 'COMPLETED', year: 1995 },
    context: { position: 'Finished — End of Evangelion', rating: 10, note: 'Congratulations.' },
  },
  {
    entry: { title: 'Building Epilogue', subtitle: 'a dev log', mediaType: 'TECH_LOG', status: 'COMPLETED' },
    context: {
      sources: [
        { id: 's1', label: 'Elysia — ergonomic Bun framework', host: 'elysiajs.com', kind: 'article' },
        { id: 's2', label: 'Drizzle ORM', host: 'orm.drizzle.team', kind: 'link' },
        { id: 's3', label: 'Eden treaty (typed client)', host: 'elysiajs.com', kind: 'article' },
      ],
      backlinks: [],
    },
    linkTo: 'Disco Elysium',
    ledger: {
      title: 'Building Epilogue',
      standfirst: 'Notes from wiring a cognitive save-state on Bun + Elysia + Next.',
      byline: 'The Archivist',
      blocks: [
        { type: 'heading', text: 'The stack' },
        { type: 'paragraph', text: 'Elysia on Bun for the API, Next on Node for the web, Drizzle + Postgres, Eden for the typed boundary. The owner-scoped repository is the spine of the multi-tenant-by-schema design.' },
        { type: 'callout', icon: 'link', title: 'Why a separate API', text: 'To retire the Next Server-Actions CVE surface and keep authz in one owner-scope middleware + repository.' },
      ],
    },
  },
];

async function main() {
  console.log('[seed-demo] resetting…');
  await sqlClient`TRUNCATE TABLE backlinks, ledgers, volatile_contexts, entries, users RESTART IDENTITY CASCADE`;
  await db.insert(users).values({
    id: owner,
    username: env.DEFAULT_OWNER_USERNAME,
    displayName: env.DEFAULT_OWNER_NAME,
  });

  const byTitle = new Map<string, string>();
  // pass 1: create entries + context + ledger; touch a few so ordering is lifelike
  for (const d of LIB) {
    const e = await repos.entries.create(owner, d.entry);
    byTitle.set(d.entry.title, e.id);
    if (d.context) {
      const ctx = await repos.context.get(owner, e.id);
      if (ctx) await repos.context.put(owner, e.id, { family: ctx.family, payload: d.context } as VolatileContext);
    }
    if (d.ledger) await repos.ledger.put(owner, e.id, d.ledger);
    // touch recently-active ones so "N days ago" + default order look real
    if (['Elden Ring', 'The Brothers Karamazov', 'Severance', 'Red Dead Redemption II'].includes(d.entry.title)) {
      await repos.entries.touch(owner, e.id);
    }
  }
  // pass 2: backlinks (need both ids)
  for (const d of LIB) {
    if (d.linkTo) {
      const from = byTitle.get(d.entry.title)!;
      const to = byTitle.get(d.linkTo);
      if (to) await repos.backlinks.add(owner, from, to);
    }
  }

  console.log(`[seed-demo] done — ${LIB.length} entries across gaming/reading/cinema/tech.`);
  await sqlClient.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed-demo] FAILED', err);
  process.exit(1);
});
