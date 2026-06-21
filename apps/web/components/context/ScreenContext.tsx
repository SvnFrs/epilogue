'use client';

/**
 * Screen save-state (T036; US4) — FILM/SERIES/ANIME. NEW family (no POC variant existed):
 * position (S/E · timestamp), a 0–10 rating, and a note. Wired to PUT /context.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ScreenPayload } from '@epilogue/contracts';
import { Film, Star } from '../icons';
import { SectionLabel } from './SectionLabel';
import { EditButton, SaveBar } from './ReadingContext';
import { usePutContext } from '@/lib/api/hooks';

const field =
  'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[14px] text-stone-800 outline-none focus:ring-2 focus:ring-amber-300';

export function ScreenContext({ entryId, payload }: { entryId: string; payload: ScreenPayload }) {
  const router = useRouter();
  const put = usePutContext(entryId);
  const [current, setCurrent] = useState(payload);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(payload);

  async function save() {
    const clean: ScreenPayload = {
      position: draft.position,
      rating: Math.max(0, Math.min(10, Number(draft.rating) || 0)),
      note: draft.note,
    };
    await put.mutateAsync(clean);
    setCurrent(clean);
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="space-y-4">
        <div>
          <SectionLabel icon={Film} accent>
            Where I Stopped
          </SectionLabel>
          <input
            className={field}
            placeholder="e.g. S2E07 · 00:42:15"
            value={draft.position}
            onChange={(e) => setDraft({ ...draft, position: e.target.value })}
          />
        </div>
        <div>
          <SectionLabel icon={Star}>Rating (0–10)</SectionLabel>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            className={`${field} w-28`}
            value={draft.rating}
            onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
          />
        </div>
        <div>
          <SectionLabel icon={Film}>Note</SectionLabel>
          <textarea
            className={`${field} min-h-[80px] resize-y`}
            placeholder="The turn, the feeling, the thing to remember…"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          />
        </div>
        <SaveBar pending={put.isPending} onSave={save} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-4 shadow-sheen">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={Film} accent>
            Where I Stopped
          </SectionLabel>
          <EditButton onClick={() => { setDraft(current); setEditing(true); }} />
        </div>
        {current.position ? (
          <p className="font-serif text-[14.5px] italic leading-relaxed text-stone-700">{current.position}</p>
        ) : (
          <p className="text-[13.5px] text-stone-500">Where did you pause?</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <SectionLabel icon={Star}>Rating</SectionLabel>
        <span className="ml-auto font-mono text-[13px] text-stone-600">
          {current.rating > 0 ? `${current.rating} / 10` : '—'}
        </span>
      </div>

      {current.note && (
        <div>
          <SectionLabel icon={Film}>Note</SectionLabel>
          <p className="text-[13.5px] leading-relaxed text-stone-600">{current.note}</p>
        </div>
      )}
    </div>
  );
}
