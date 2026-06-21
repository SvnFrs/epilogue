'use client';

/**
 * Reading save-state (T035; US4) — BOOK/MANGA. Current chapter + pinned quotes. Ported
 * from src/sidebar.jsx BookContext, wired to PUT /context. Edit toggle reveals the form;
 * local state mirrors the RSC prop so a save shows immediately.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReadingPayload } from '@epilogue/contracts';
import { Bookmark, Quote, Pencil, Plus } from '../icons';
import { SectionLabel } from './SectionLabel';
import { usePutContext } from '@/lib/api/hooks';

let seq = 0;
const newId = () => `q_${++seq}_${Math.floor(performance.now())}`;

const field =
  'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[14px] text-stone-800 outline-none focus:ring-2 focus:ring-amber-300';

export function ReadingContext({ entryId, payload }: { entryId: string; payload: ReadingPayload }) {
  const router = useRouter();
  const put = usePutContext(entryId);
  const [current, setCurrent] = useState(payload);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(payload);

  async function save() {
    const clean: ReadingPayload = {
      position: draft.position,
      quotes: draft.quotes.filter((q) => q.text.trim()),
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
          <SectionLabel icon={Bookmark} accent>
            Current Chapter
          </SectionLabel>
          <input
            className={field}
            placeholder="e.g. Book 3, Ch. 5 — The Grand Inquisitor"
            value={draft.position}
            onChange={(e) => setDraft({ ...draft, position: e.target.value })}
          />
        </div>
        <div>
          <SectionLabel icon={Quote}>Bookmarked Verses</SectionLabel>
          <ul className="space-y-2">
            {draft.quotes.map((q, i) => (
              <li key={q.id} className="rounded-lg border border-stone-200 bg-white/70 p-2">
                <textarea
                  className={`${field} min-h-[60px] resize-y font-serif italic`}
                  placeholder="The passage"
                  value={q.text}
                  onChange={(e) => {
                    const quotes = [...draft.quotes];
                    quotes[i] = { ...q, text: e.target.value };
                    setDraft({ ...draft, quotes });
                  }}
                />
                <div className="mt-1.5 flex gap-2">
                  <input
                    className={`${field} font-mono text-[12px]`}
                    placeholder="Reference"
                    value={q.reference}
                    onChange={(e) => {
                      const quotes = [...draft.quotes];
                      quotes[i] = { ...q, reference: e.target.value };
                      setDraft({ ...draft, quotes });
                    }}
                  />
                  <button
                    aria-label="Remove quote"
                    onClick={() => setDraft({ ...draft, quotes: draft.quotes.filter((_, j) => j !== i) })}
                    className="rounded px-2 text-red-600/80 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setDraft({ ...draft, quotes: [...draft.quotes, { id: newId(), text: '', reference: '' }] })}
            className="mt-2 flex items-center gap-1 rounded-full border border-stone-200 px-3 py-1 text-[12.5px] text-stone-600 hover:bg-stone-100"
          >
            <Plus size={12} /> add verse
          </button>
        </div>
        <SaveBar pending={put.isPending} onSave={save} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-4 shadow-sheen">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={Bookmark} accent>
            Current Chapter
          </SectionLabel>
          <EditButton onClick={() => { setDraft(current); setEditing(true); }} />
        </div>
        {current.position ? (
          <p className="font-serif text-[14.5px] italic leading-relaxed text-stone-700">{current.position}</p>
        ) : (
          <p className="text-[13.5px] text-stone-500">Where are you in the book?</p>
        )}
      </div>
      {current.quotes.length > 0 && (
        <div>
          <SectionLabel icon={Quote}>Bookmarked Verses</SectionLabel>
          <div className="space-y-3">
            {current.quotes.map((q) => (
              <figure key={q.id} className="border-l-2 border-amber-accent/70 pl-3">
                <blockquote className="font-serif text-[13.5px] italic leading-relaxed text-stone-600">
                  “{q.text}”
                </blockquote>
                {q.reference && (
                  <figcaption className="mt-1 text-right font-mono text-[10.5px] uppercase tracking-wide text-stone-400">
                    {q.reference}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-amber-ink/80 transition hover:bg-amber-100 hover:text-amber-900"
    >
      <Pencil size={12} /> edit
    </button>
  );
}

export function SaveBar({
  pending,
  onSave,
  onCancel,
}: {
  pending: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onSave}
        disabled={pending}
        className="rounded-lg bg-amber-ink px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save state'}
      </button>
      <button onClick={onCancel} className="text-[12px] text-stone-500 hover:text-stone-700">
        cancel
      </button>
    </div>
  );
}
