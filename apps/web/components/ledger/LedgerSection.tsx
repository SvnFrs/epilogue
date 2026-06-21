'use client';

/**
 * Ledger section (US3) — switches between read (LedgerView), edit (LedgerEditor), and the
 * empty state (T034: "Start the Ledger" with the named-anchor presets as one-tap starters).
 */
import { useState } from 'react';
import type { Ledger } from '@epilogue/contracts';
import { LedgerView } from './LedgerView';
import { LedgerEditor } from './LedgerEditor';
import { Pencil } from '../icons';

const PRESETS = ['The Sandbox', 'The Campfire', 'The Post-Credits Blur'] as const;

export function LedgerSection({ entryId, ledger }: { entryId: string; ledger: Ledger | null }) {
  // Local copy for immediate post-save render (the RSC prop can't update from a client
  // mutation); router.refresh() reconciles the server for the next full load.
  const [current, setCurrent] = useState<Ledger | null>(ledger);
  const [editing, setEditing] = useState(false);
  const [seed, setSeed] = useState<string | undefined>(undefined);
  const hasContent = !!current && current.blocks.length > 0;

  function close() {
    setEditing(false);
    setSeed(undefined);
  }

  if (editing) {
    return (
      <LedgerEditor
        entryId={entryId}
        ledger={current}
        seedHeading={seed}
        onSaved={(saved) => {
          setCurrent(saved);
          close();
        }}
        onCancel={close}
      />
    );
  }

  if (hasContent) {
    return (
      <div>
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <Pencil size={12} /> edit ledger
          </button>
        </div>
        <LedgerView ledger={current!} />
      </div>
    );
  }

  // empty state (T034)
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 px-6 text-center">
      <p className="font-serif text-[22px] italic text-stone-500">Start the Ledger</p>
      <p className="mt-1 max-w-[42ch] text-[13px] text-stone-400">
        Begin with a section, or write freely. Long-form notes, quotes, callouts and embeds.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setSeed(p);
              setEditing(true);
            }}
            className="rounded-full border border-amber-200 bg-amber-50/60 px-3.5 py-1.5 text-[13px] text-amber-ink transition hover:bg-amber-100"
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setEditing(true)}
          className="rounded-full bg-stone-800 px-3.5 py-1.5 text-[13px] text-white transition hover:bg-stone-900"
        >
          Blank
        </button>
      </div>
    </div>
  );
}
