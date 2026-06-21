'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateEntry, EntryDetail, Ledger, VolatileContext } from '@epilogue/contracts';
import { clientApi, queryKeys } from './client';

/** Detail query — hydrates from the RSC-fetched initialData, then owns it client-side. */
export function useEntryDetail(id: string, initialData?: EntryDetail) {
  return useQuery({
    queryKey: queryKeys.entry(id),
    queryFn: () => clientApi.getEntry(id),
    initialData,
  });
}

export function useCreateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEntry) => clientApi.createEntry(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.entries }),
  });
}

export function usePutContext(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: VolatileContext['payload']) => clientApi.putContext(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.entry(id) }),
  });
}

export function useTouchEntry(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clientApi.touch(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.entry(id) }),
  });
}

export function useToggleThread(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, done }: { threadId: string; done: boolean }) =>
      clientApi.toggleThread(id, threadId, done),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.entry(id) }),
  });
}

export function usePutLedger(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ledger: Ledger) => clientApi.putLedger(id, ledger),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.entry(id) }),
  });
}
