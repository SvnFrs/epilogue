'use client';

/**
 * Ledger editor (T033) — edit the standfirst/byline/title + an ordered list of blocks
 * (heading/paragraph/quote/callout/embed), with the named-anchor presets (The Sandbox /
 * The Campfire / The Post-Credits Blur) as one-tap section starters. Saves via PUT
 * /ledger (Zod-validated server-side → 422 surfaced) then router.refresh().
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Ledger, LedgerBlock } from '@epilogue/contracts';
import { usePutLedger } from '@/lib/api/hooks';
import { ArrowLeft } from '../icons';

type Row = { key: number; block: LedgerBlock };
let counter = 0;
const nextKey = () => ++counter;

const PRESETS = ['The Sandbox', 'The Campfire', 'The Post-Credits Blur'] as const;
const CALLOUT_ICONS = ['compass', 'link', 'book', 'star', 'quote'] as const;

const input =
  'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[14px] text-stone-800 outline-none focus:ring-2 focus:ring-amber-300';

function emptyBlock(type: LedgerBlock['type']): LedgerBlock {
  switch (type) {
    case 'heading':
      return { type: 'heading', text: '' };
    case 'paragraph':
      return { type: 'paragraph', text: '' };
    case 'quote':
      return { type: 'quote', text: '', reference: '' };
    case 'callout':
      return { type: 'callout', icon: 'compass', title: '', text: '' };
    case 'embed':
      return { type: 'embed', url: '', label: '' };
  }
}

export function LedgerEditor({
  entryId,
  ledger,
  seedHeading,
  onSaved,
  onCancel,
}: {
  entryId: string;
  ledger: Ledger | null;
  seedHeading?: string;
  onSaved: (ledger: Ledger) => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const put = usePutLedger(entryId);
  const [title, setTitle] = useState(ledger?.title ?? '');
  const [standfirst, setStandfirst] = useState(ledger?.standfirst ?? '');
  const [byline, setByline] = useState(ledger?.byline ?? '');
  const [rows, setRows] = useState<Row[]>(() => {
    const base = (ledger?.blocks ?? []).map((block) => ({ key: nextKey(), block }));
    if (seedHeading) base.push({ key: nextKey(), block: { type: 'heading', text: seedHeading } });
    return base;
  });

  const patch = (key: number, block: LedgerBlock) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { key, block } : r)));
  const add = (type: LedgerBlock['type']) =>
    setRows((rs) => [...rs, { key: nextKey(), block: emptyBlock(type) }]);
  const addHeading = (text: string) =>
    setRows((rs) => [...rs, { key: nextKey(), block: { type: 'heading', text } }]);
  const remove = (key: number) => setRows((rs) => rs.filter((r) => r.key !== key));
  const move = (key: number, dir: -1 | 1) =>
    setRows((rs) => {
      const i = rs.findIndex((r) => r.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rs.length) return rs;
      const copy = [...rs];
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
      return copy;
    });

  async function save() {
    const payload: Ledger = {
      title: title.trim() || undefined,
      standfirst: standfirst.trim() || undefined,
      byline: byline.trim() || undefined,
      blocks: rows.map((r) => r.block),
    };
    try {
      await put.mutateAsync(payload);
      onSaved(payload);
      router.refresh();
    } catch {
      /* error surfaced via put.isError below */
    }
  }

  return (
    <div className="mx-auto max-w-[680px]">
      <button
        onClick={onCancel}
        className="mb-5 flex items-center gap-1 text-[13px] text-stone-500 hover:text-stone-700"
      >
        <ArrowLeft size={14} /> Back to the ledger
      </button>

      <div className="space-y-3">
        <input className={`${input} font-serif text-xl`} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={`${input} font-serif italic`} placeholder="Standfirst — the one-line essence" value={standfirst} onChange={(e) => setStandfirst(e.target.value)} />
        <input className={`${input} font-mono text-[12px]`} placeholder="Byline" value={byline} onChange={(e) => setByline(e.target.value)} />
      </div>

      <ul className="mt-6 space-y-4">
        {rows.map(({ key, block }, i) => (
          <li key={key} className="rounded-2xl border border-stone-200 bg-white/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-400">
                {block.type}
              </span>
              <div className="flex items-center gap-1 text-stone-400">
                <button aria-label="Move up" disabled={i === 0} onClick={() => move(key, -1)} className="rounded px-1.5 py-0.5 hover:bg-stone-100 disabled:opacity-30">↑</button>
                <button aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(key, 1)} className="rounded px-1.5 py-0.5 hover:bg-stone-100 disabled:opacity-30">↓</button>
                <button aria-label="Delete block" onClick={() => remove(key)} className="rounded px-1.5 py-0.5 text-red-600/80 hover:bg-red-50">✕</button>
              </div>
            </div>
            <BlockFields block={block} onChange={(b) => patch(key, b)} />
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-400">Add</span>
        {(['heading', 'paragraph', 'quote', 'callout', 'embed'] as const).map((t) => (
          <button key={t} onClick={() => add(t)} className="rounded-full border border-stone-200 px-3 py-1 text-[12.5px] text-stone-600 hover:bg-stone-100">
            {t}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-400">Sections</span>
        {PRESETS.map((p) => (
          <button key={p} onClick={() => addHeading(p)} className="rounded-full border border-amber-200 bg-amber-50/60 px-3 py-1 text-[12.5px] text-amber-ink hover:bg-amber-100">
            {p}
          </button>
        ))}
      </div>

      {put.isError && (
        <p className="mt-4 text-sm text-red-700">Couldn’t save — check the blocks (an embed needs a valid URL).</p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          disabled={put.isPending}
          className="rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-900 disabled:opacity-60"
        >
          {put.isPending ? 'Saving…' : 'Save ledger'}
        </button>
        <button onClick={onCancel} className="text-sm text-stone-500 hover:text-stone-700">
          Cancel
        </button>
      </div>
    </div>
  );
}

function BlockFields({ block, onChange }: { block: LedgerBlock; onChange: (b: LedgerBlock) => void }) {
  switch (block.type) {
    case 'heading':
      return (
        <div className="space-y-2">
          <input className={`${input} font-serif`} placeholder="Heading" value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
          <input className={`${input} font-mono text-[12px]`} placeholder="Note (optional)" value={block.note ?? ''} onChange={(e) => onChange({ ...block, note: e.target.value || undefined })} />
        </div>
      );
    case 'paragraph':
      return (
        <textarea className={`${input} min-h-[90px] resize-y`} placeholder="Write…" value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
      );
    case 'quote':
      return (
        <div className="space-y-2">
          <textarea className={`${input} min-h-[70px] resize-y font-serif italic`} placeholder="The quote" value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
          <input className={`${input} font-mono text-[12px]`} placeholder="Reference" value={block.reference} onChange={(e) => onChange({ ...block, reference: e.target.value })} />
        </div>
      );
    case 'callout':
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <select className={`${input} w-32`} value={block.icon} onChange={(e) => onChange({ ...block, icon: e.target.value })}>
              {CALLOUT_ICONS.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
            <input className={input} placeholder="Title" value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
          </div>
          <textarea className={`${input} min-h-[60px] resize-y`} placeholder="Callout text" value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
        </div>
      );
    case 'embed':
      return (
        <div className="space-y-2">
          <input className={`${input} font-mono text-[12px]`} placeholder="https://youtube.com/watch?v=…" value={block.url} onChange={(e) => onChange({ ...block, url: e.target.value })} />
          <input className={input} placeholder="Label" value={block.label} onChange={(e) => onChange({ ...block, label: e.target.value })} />
        </div>
      );
  }
}
