'use client';

/**
 * Client-side typed fetchers — hit the same-origin BFF proxy (/api), which injects the
 * owner secret server-side. Types come from `@epilogue/contracts` (single source). The
 * browser never holds credentials.
 */
import type {
  CreateEntry,
  UpdateEntry,
  Entry,
  EntryDetail,
  VolatileContext,
  Ledger,
} from '@epilogue/contracts';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return (await res.json()) as T;
}

export const clientApi = {
  getEntry: (id: string) => call<EntryDetail>(`/entries/${id}`),
  createEntry: (body: CreateEntry) =>
    call<Entry>('/entries', { method: 'POST', body: JSON.stringify(body) }),
  updateEntry: (id: string, body: UpdateEntry) =>
    call<Entry>(`/entries/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  touch: (id: string) => call<Entry>(`/entries/${id}/touch`, { method: 'POST' }),
  putContext: (id: string, payload: VolatileContext['payload']) =>
    call<VolatileContext>(`/entries/${id}/context`, {
      method: 'PUT',
      body: JSON.stringify({ payload }),
    }),
  toggleThread: (id: string, threadId: string, done: boolean) =>
    call<VolatileContext>(`/entries/${id}/context/threads/${threadId}`, {
      method: 'PATCH',
      body: JSON.stringify({ done }),
    }),
  getLedger: (id: string) => call<Ledger>(`/entries/${id}/ledger`),
  putLedger: (id: string, ledger: Ledger) =>
    call<Ledger>(`/entries/${id}/ledger`, { method: 'PUT', body: JSON.stringify(ledger) }),
};

export const queryKeys = {
  entries: ['entries'] as const,
  entry: (id: string) => ['entries', id] as const,
};
