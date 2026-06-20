'use client';

/* Sets last_opened_at on open (FR-015) — fires once when the detail page mounts. */
import { useEffect, useRef } from 'react';
import { useTouchEntry } from '@/lib/api/hooks';

export function TouchOnOpen({ entryId }: { entryId: string }) {
  const touch = useTouchEntry(entryId);
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    touch.mutate();
  }, [touch]);
  return null;
}
