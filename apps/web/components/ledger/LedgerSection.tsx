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

  // empty state (T034) — a warm ruled journal page waiting to be written, not a void
  return (
    <div
      className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-stone-300/60 px-6 py-16 text-center shadow-sheen ring-1 ring-stone-900/5"
      style={{
        backgroundColor: '#2a2420',
        backgroundImage:
          'linear-gradient(to bottom, transparent 31px, rgba(255,240,210,0.05) 31px, rgba(255,240,210,0.05) 32px), radial-gradient(60% 55% at 50% 0%, rgba(245,158,11,0.10), transparent 70%)',
        backgroundSize: '100% 32px, 100% 100%',
      }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-ink/80">A blank page</p>
      <p className="mt-3 font-serif text-[26px] italic text-stone-600">Start the Ledger</p>
      <p className="mt-2 max-w-[44ch] text-[13.5px] leading-relaxed text-stone-500">
        The long-form companion to your save-state — notes, quotes, callouts, embeds. Open with a
        named section, or a blank page.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setSeed(p);
              setEditing(true);
            }}
            className="rounded-full border border-amber-300/70 bg-amber-50/70 px-4 py-2 text-[13px] text-amber-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-100"
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setEditing(true)}
          className="rounded-full bg-stone-800 px-4 py-2 text-[13px] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-900"
        >
          Blank page
        </button>
      </div>
    </div>
  );
}
