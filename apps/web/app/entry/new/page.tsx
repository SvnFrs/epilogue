'use client';

/**
 * Create entry (T024; US1) — creates the Story via TanStack Query useMutation → BFF →
 * Elysia, then routes to its detail page where the save-state is captured (GameContext
 * edit). New entries are seeded with an empty context of the media_type's family.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MEDIA_TYPES, STATUSES, type MediaType, type Status } from '@epilogue/contracts';
import { useCreateEntry } from '@/lib/api/hooks';
import { ArrowLeft } from '@/components/icons';

export default function NewEntryPage() {
  const router = useRouter();
  const create = useCreateEntry();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('GAME');
  const [status, setStatus] = useState<Status>('PAUSED');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const entry = await create.mutateAsync({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      mediaType,
      status,
    });
    router.push(`/entry/${entry.id}`);
  }

  return (
    <div className="mx-auto max-w-xl px-5 pb-24 pt-8 sm:px-8">
      <Link href="/" className="mb-6 flex items-center gap-1 text-[13px] text-stone-500 hover:text-stone-700">
        <ArrowLeft size={14} /> Library
      </Link>
      <h1 className="font-serif text-3xl text-stone-800">Add to the shelf</h1>
      <p className="mt-2 text-stone-500">A new Story. Capture its save-state on the next screen.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="mt-1.5 w-full rounded-xl border border-stone-200 bg-card2 px-3.5 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-faint"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400">Subtitle</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-stone-200 bg-card2 px-3.5 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-faint"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400">Type</span>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaType)}
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-card2 px-3.5 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-faint"
            >
              {MEDIA_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-card2 px-3.5 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-faint"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        {create.isError && (
          <p className="text-sm text-red-700">Couldn’t create the entry. Try again.</p>
        )}

        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-full bg-stone-800 px-6 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-900 disabled:opacity-60"
        >
          {create.isPending ? 'Creating…' : 'Create entry'}
        </button>
      </form>
    </div>
  );
}
