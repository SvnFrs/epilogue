'use client';

/**
 * GAME volatile-context block (T022; US1) — ported from src/sidebar.jsx GameContext and
 * wired to the real data layer: checkpoint edit → PUT /context; thread toggle → PATCH
 * .../threads/:id (TanStack Query mutations over the BFF). This IS the "Previously On"
 * save-state surfaced in the sticky left column.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GamePayload } from '@epilogue/contracts';
import { Compass, Pencil, List, Keyboard, Check } from '../icons';
import { SectionLabel } from './SectionLabel';
import { usePutContext, useToggleThread } from '@/lib/api/hooks';

export function GameContext({ entryId, payload }: { entryId: string; payload: GamePayload }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(payload.checkpoint);
  // Local display state for immediate feedback — the payload prop comes from the RSC and
  // can't be updated by a client mutation, so mirror it locally and reconcile the server
  // render with router.refresh().
  const [checkpoint, setCheckpoint] = useState(payload.checkpoint);
  const putContext = usePutContext(entryId);
  const toggleThread = useToggleThread(entryId);

  async function saveCheckpoint() {
    await putContext.mutateAsync({ ...payload, checkpoint: draft });
    setCheckpoint(draft);
    setEditing(false);
    router.refresh();
  }

  async function onToggleThread(threadId: string, done: boolean) {
    await toggleThread.mutateAsync({ threadId, done });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* current checkpoint — the amber save-state note */}
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-4 shadow-sheen">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={Compass} accent>
            Current Checkpoint
          </SectionLabel>
          <button
            onClick={() => {
              setDraft(payload.checkpoint);
              setEditing((e) => !e);
            }}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-amber-ink/80 transition hover:bg-amber-100 hover:text-amber-900"
          >
            <Pencil size={12} />
            {editing ? 'cancel' : 'edit'}
          </button>
        </div>
        {editing ? (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={7}
              className="w-full resize-none rounded-lg border border-amber-300 bg-white/70 p-2.5 font-serif text-[14px] italic leading-relaxed text-stone-700 outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              onClick={saveCheckpoint}
              disabled={putContext.isPending}
              className="mt-2 rounded-lg bg-amber-ink px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
            >
              {putContext.isPending ? 'Saving…' : 'Save state'}
            </button>
          </>
        ) : checkpoint ? (
          <p className="font-serif text-[14.5px] italic leading-relaxed text-stone-700">
            {checkpoint}
          </p>
        ) : (
          <p className="text-[13.5px] text-stone-500">
            Capture where you left off — the cue you’ll need to resume cold.
          </p>
        )}
      </div>

      {/* open threads */}
      <div>
        <SectionLabel icon={List}>Open Threads</SectionLabel>
        {payload.threads.length === 0 ? (
          <p className="text-[13px] text-stone-400">No open threads.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {payload.threads.map((t) => (
              <li key={t.id} className="flex items-start gap-2.5 text-[13.5px]">
                <button
                  onClick={() => onToggleThread(t.id, !t.done)}
                  aria-pressed={t.done}
                  aria-label={`Mark "${t.text}" ${t.done ? 'not done' : 'done'}`}
                  className={`mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border ${
                    t.done ? 'border-amber-accent bg-amber-accent text-white' : 'border-stone-300 bg-white'
                  }`}
                >
                  {t.done && <Check size={11} strokeWidth={3} />}
                </button>
                <span className={t.done ? 'flex-1 text-stone-400 line-through' : 'flex-1 text-stone-600'}>
                  {t.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* keymap reference */}
      {payload.keymap.length > 0 && (
        <div>
          <SectionLabel icon={Keyboard}>Keymap Reference</SectionLabel>
          <div className="overflow-hidden rounded-xl border border-stone-200/90 bg-stone-50/60">
            {payload.keymap.map((k, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 px-3 py-2 ${
                  i ? 'border-t border-stone-200/70' : ''
                }`}
              >
                <span className="min-w-0 flex-1 text-[13px] text-stone-600">{k.action}</span>
                <kbd className="shrink-0 rounded-md border border-stone-300/80 bg-white px-2 py-0.5 font-mono text-[11.5px] font-medium text-stone-700">
                  {k.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
