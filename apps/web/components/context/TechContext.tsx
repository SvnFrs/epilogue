'use client';

/**
 * Tech save-state (T037; US4) — TECH_LOG. Embedded sources (PUT /context) + cross-links
 * (the owner-scoped Backlink table via POST/DELETE /backlinks; cross-owner targets 404 —
 * eng T6). Ported from src/sidebar.jsx TechContext. Local state mirrors the RSC props.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import type { TechPayload, BacklinkRef } from '@epilogue/contracts';
import { Globe, Link as LinkIcon, Book, Film, Plus } from '../icons';
import { SectionLabel } from './SectionLabel';
import { EditButton, SaveBar } from './ReadingContext';
import { usePutContext, useAddBacklink, useRemoveBacklink } from '@/lib/api/hooks';
import { clientApi } from '@/lib/api/client';

type Src = TechPayload['sources'][number];

const KIND_ICON: Record<Src['kind'], typeof Globe> = {
  video: Film,
  book: Book,
  article: Globe,
  link: LinkIcon,
};
const KINDS: Src['kind'][] = ['article', 'video', 'book', 'link'];

let seq = 0;
const newId = () => `s_${++seq}_${Math.floor(performance.now())}`;
const field =
  'w-full rounded-lg border border-stone-200 bg-card2 px-3 py-2 text-[14px] text-stone-800 outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-faint';

export function TechContext({
  entryId,
  payload,
  backlinks,
}: {
  entryId: string;
  payload: TechPayload;
  backlinks: BacklinkRef[];
}) {
  const router = useRouter();
  const put = usePutContext(entryId);
  const addBacklink = useAddBacklink(entryId);
  const removeBacklink = useRemoveBacklink(entryId);

  const [current, setCurrent] = useState(payload);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(payload);
  const [links, setLinks] = useState(backlinks);

  // candidate entries to link to (lazy — only when not editing sources)
  const { data: allEntries = [] } = useQuery({ queryKey: ['entries-pick'], queryFn: clientApi.listEntries });
  const linkedIds = new Set([entryId, ...links.map((l) => l.id)]);
  const candidates = allEntries.filter((e) => !linkedIds.has(e.id));

  async function saveSources() {
    const clean: TechPayload = {
      sources: draft.sources.filter((s) => s.label.trim()),
      backlinks: current.backlinks,
    };
    await put.mutateAsync(clean);
    setCurrent(clean);
    setEditing(false);
    router.refresh();
  }

  async function onAddLink(id: string) {
    const target = allEntries.find((e) => e.id === id);
    if (!target) return;
    await addBacklink.mutateAsync(id);
    setLinks([...links, { id, title: target.title }]);
    router.refresh();
  }
  async function onRemoveLink(id: string) {
    await removeBacklink.mutateAsync(id);
    setLinks(links.filter((l) => l.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* sources */}
      <div className="rounded-2xl border border-stone-200 bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel icon={Globe}>Embedded Sources</SectionLabel>
          {!editing && <EditButton onClick={() => { setDraft(current); setEditing(true); }} />}
        </div>

        {editing ? (
          <div className="space-y-2">
            {draft.sources.map((s, i) => (
              <div key={s.id} className="rounded-lg border border-stone-200 p-2">
                <input
                  className={field}
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => {
                    const sources = [...draft.sources];
                    sources[i] = { ...s, label: e.target.value };
                    setDraft({ ...draft, sources });
                  }}
                />
                <div className="mt-1.5 flex gap-2">
                  <input
                    className={`${field} font-mono text-[12px]`}
                    placeholder="host (e.g. rfc-editor.org)"
                    value={s.host}
                    onChange={(e) => {
                      const sources = [...draft.sources];
                      sources[i] = { ...s, host: e.target.value };
                      setDraft({ ...draft, sources });
                    }}
                  />
                  <select
                    className={`${field} w-28`}
                    value={s.kind}
                    onChange={(e) => {
                      const sources = [...draft.sources];
                      sources[i] = { ...s, kind: e.target.value as Src['kind'] };
                      setDraft({ ...draft, sources });
                    }}
                  >
                    {KINDS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <button
                    aria-label="Remove source"
                    onClick={() => setDraft({ ...draft, sources: draft.sources.filter((_, j) => j !== i) })}
                    className="rounded px-2 text-red-600/80 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setDraft({ ...draft, sources: [...draft.sources, { id: newId(), label: '', host: '', kind: 'article' }] })}
              className="flex items-center gap-1 rounded-full border border-stone-200 px-3 py-1 text-[12.5px] text-stone-600 hover:bg-stone-100"
            >
              <Plus size={12} /> add source
            </button>
            <SaveBar pending={put.isPending} onSave={saveSources} onCancel={() => setEditing(false)} />
          </div>
        ) : current.sources.length > 0 ? (
          <ul className="space-y-2">
            {current.sources.map((s) => {
              const Icon = KIND_ICON[s.kind] ?? Globe;
              return (
                <li key={s.id} className="flex items-start gap-2.5">
                  <Icon size={15} className="mt-0.5 shrink-0 text-stone-400" />
                  <span>
                    <span className="block text-[13px] leading-snug text-stone-600">{s.label}</span>
                    <span className="font-mono text-[10.5px] text-stone-400">{s.host}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13px] text-stone-500">No sources yet.</p>
        )}
      </div>

      {/* backlinks (Backlink table) */}
      <div>
        <SectionLabel icon={LinkIcon} accent>
          Cross-links
        </SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {links.map((l) => (
            <span key={l.id} className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50/60 py-1 pl-2.5 pr-1.5 text-[12px] text-amber-ink">
              <Link href={`/entry/${l.id}`} className="hover:underline">
                {l.title}
              </Link>
              <button
                aria-label={`Remove link to ${l.title}`}
                onClick={() => onRemoveLink(l.id)}
                className="rounded-full px-1 text-amber-ink/60 hover:bg-amber-100 hover:text-amber-900"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        {candidates.length > 0 && (
          <select
            aria-label="Add a cross-link"
            className={`${field} mt-2`}
            value=""
            onChange={(e) => e.target.value && onAddLink(e.target.value)}
          >
            <option value="">+ link another entry…</option>
            {candidates.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
