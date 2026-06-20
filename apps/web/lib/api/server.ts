import 'server-only';
import { treaty } from '@elysiajs/eden';
import type { App } from '@epilogue/api';
import type { EntryDetail, Entry } from '@epilogue/contracts';
import { serverConfig, ownerHeaders } from './config';

/**
 * The RSC↔Eden seam (walking-skeleton risk, plan §Eng-review Issue 2). Server
 * Components fetch the Elysia API server-side through Eden — typed end-to-end from the
 * Elysia app, no codegen. If this seam proves painful, the documented bail-out is a
 * Vite SPA (nothing wide is built on it yet).
 */
export const apiServer = treaty<App>(serverConfig.apiUrl, {
  headers: ownerHeaders(),
});

/** Detail read for the split-view (T021). Returns null on 404 so the page can not-found. */
export async function getEntryDetail(id: string): Promise<EntryDetail | null> {
  const { data, error } = await apiServer.entries({ id }).get();
  if (error) return null;
  return data as EntryDetail;
}

/** Catalog read (minimal; full masonry is US2/T027). */
export async function listEntries(query: {
  space?: string;
  status?: string;
} = {}): Promise<Entry[]> {
  const { data, error } = await apiServer.entries.get({ query });
  if (error || !data) return [];
  return data as Entry[];
}
