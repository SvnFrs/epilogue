CREATE TYPE "public"."family" AS ENUM('game', 'reading', 'screen', 'tech');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('GAME', 'BOOK', 'MANGA', 'FILM', 'SERIES', 'ANIME', 'TECH_LOG');--> statement-breakpoint
CREATE TYPE "public"."space" AS ENUM('gaming', 'reading', 'cinema', 'tech');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PLAYING', 'PAUSED', 'READING', 'COMPLETED', 'AIRING');--> statement-breakpoint
CREATE TABLE "backlinks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"from_entry_id" uuid NOT NULL,
	"to_entry_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"media_type" "media_type" NOT NULL,
	"space" "space" NOT NULL,
	"status" "status" NOT NULL,
	"year" integer,
	"month" integer,
	"cover" jsonb NOT NULL,
	"archived_context" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_opened_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ledgers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text,
	"standfirst" text,
	"byline" text,
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "volatile_contexts" (
	"entry_id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"family" "family" NOT NULL,
	"payload" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "backlinks" ADD CONSTRAINT "backlinks_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backlinks" ADD CONSTRAINT "backlinks_from_entry_id_entries_id_fk" FOREIGN KEY ("from_entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backlinks" ADD CONSTRAINT "backlinks_to_entry_id_entries_id_fk" FOREIGN KEY ("to_entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledgers" ADD CONSTRAINT "ledgers_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volatile_contexts" ADD CONSTRAINT "volatile_contexts_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volatile_contexts" ADD CONSTRAINT "volatile_contexts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "backlinks_owner_from_idx" ON "backlinks" USING btree ("owner_id","from_entry_id");--> statement-breakpoint
CREATE UNIQUE INDEX "backlinks_unique_edge_idx" ON "backlinks" USING btree ("owner_id","from_entry_id","to_entry_id");--> statement-breakpoint
CREATE INDEX "entries_owner_space_idx" ON "entries" USING btree ("owner_id","space");--> statement-breakpoint
CREATE INDEX "entries_owner_media_type_idx" ON "entries" USING btree ("owner_id","media_type");--> statement-breakpoint
CREATE INDEX "entries_owner_status_idx" ON "entries" USING btree ("owner_id","status");--> statement-breakpoint
CREATE INDEX "entries_owner_last_opened_idx" ON "entries" USING btree ("owner_id","last_opened_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "ledgers_entry_idx" ON "ledgers" USING btree ("entry_id");