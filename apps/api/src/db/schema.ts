/**
 * Drizzle schema — the single Postgres model (data-model.md). EVERY table carries
 * `owner_id` (constitution IV; row-level multi-tenancy). All ids are uuid, all
 * timestamps timestamptz. Indexes power the catalog filters + "recently opened".
 */
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { Cover, LedgerBlock } from '@epilogue/contracts';

export const mediaTypeEnum = pgEnum('media_type', [
  'GAME',
  'BOOK',
  'MANGA',
  'FILM',
  'SERIES',
  'ANIME',
  'TECH_LOG',
]);
export const spaceEnum = pgEnum('space', ['gaming', 'reading', 'cinema', 'tech']);
export const statusEnum = pgEnum('status', [
  'PLAYING',
  'PAUSED',
  'READING',
  'COMPLETED',
  'AIRING',
]);
export const familyEnum = pgEnum('family', ['game', 'reading', 'screen', 'tech']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const entries = pgTable(
  'entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    mediaType: mediaTypeEnum('media_type').notNull(),
    space: spaceEnum('space').notNull(),
    status: statusEnum('status').notNull(),
    year: integer('year'),
    month: integer('month'),
    cover: jsonb('cover').$type<Cover>().notNull(),
    // context preserved when media_type changes family, so nothing is silently lost (T7)
    archivedContext: jsonb('archived_context')
      .$type<unknown[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    lastOpenedAt: timestamp('last_opened_at', { withTimezone: true }),
  },
  (t) => [
    index('entries_owner_space_idx').on(t.ownerId, t.space),
    index('entries_owner_media_type_idx').on(t.ownerId, t.mediaType),
    index('entries_owner_status_idx').on(t.ownerId, t.status),
    index('entries_owner_last_opened_idx').on(t.ownerId, t.lastOpenedAt.desc()),
  ],
);

export const volatileContexts = pgTable('volatile_contexts', {
  entryId: uuid('entry_id')
    .primaryKey()
    .references(() => entries.id, { onDelete: 'cascade' }),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  family: familyEnum('family').notNull(),
  payload: jsonb('payload').$type<unknown>().notNull(),
});

export const ledgers = pgTable(
  'ledgers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entryId: uuid('entry_id')
      .notNull()
      .references(() => entries.id, { onDelete: 'cascade' }),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title'),
    standfirst: text('standfirst'),
    byline: text('byline'),
    blocks: jsonb('blocks').$type<LedgerBlock[]>().notNull().default(sql`'[]'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('ledgers_entry_idx').on(t.entryId)],
);

export const backlinks = pgTable(
  'backlinks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    fromEntryId: uuid('from_entry_id')
      .notNull()
      .references(() => entries.id, { onDelete: 'cascade' }),
    toEntryId: uuid('to_entry_id')
      .notNull()
      .references(() => entries.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('backlinks_owner_from_idx').on(t.ownerId, t.fromEntryId),
    uniqueIndex('backlinks_unique_edge_idx').on(t.ownerId, t.fromEntryId, t.toEntryId),
  ],
);

export type EntryRow = typeof entries.$inferSelect;
export type NewEntryRow = typeof entries.$inferInsert;
export type VolatileContextRow = typeof volatileContexts.$inferSelect;
export type LedgerRow = typeof ledgers.$inferSelect;
export type BacklinkRow = typeof backlinks.$inferSelect;
export type UserRow = typeof users.$inferSelect;
