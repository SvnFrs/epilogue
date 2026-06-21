import Link from 'next/link';
import { notFound } from 'next/navigation';
import { relativeDays, type Status } from '@epilogue/contracts';
import { getEntryDetail } from '@/lib/api/server';
import { GenerativeCover } from '@/components/covers/GenerativeCover';
import { ContextColumn } from '@/components/context/ContextColumn';
import { TouchOnOpen } from '@/components/context/TouchOnOpen';
import { LedgerSection } from '@/components/ledger/LedgerSection';
import { iconForType, ArrowLeft, History, Link as LinkIcon } from '@/components/icons';

export const dynamic = 'force-dynamic';

const SPACE_LABEL: Record<string, string> = {
  gaming: 'Gaming',
  reading: 'Reading',
  cinema: 'Cinema',
  tech: 'Tech',
};

const STATUS_DOT: Record<Status, string> = {
  PLAYING: '#22c55e',
  READING: '#22c55e',
  PAUSED: '#fbbf24',
  COMPLETED: '#4ade80',
  AIRING: '#22d3ee',
};

export default async function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEntryDetail(id);
  if (!entry) notFound();

  const TypeIcon = iconForType(entry.mediaType);
  const now = new Date();

  const meta: { label: string; value: React.ReactNode }[] = [
    { label: 'Type', value: entry.mediaType.replace('_', ' ') },
    {
      label: 'Status',
      value: (
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: STATUS_DOT[entry.status] }} />
          {entry.status}
        </span>
      ),
    },
    { label: 'Shelf', value: SPACE_LABEL[entry.space] ?? entry.space },
    ...(entry.year ? [{ label: 'Year', value: String(entry.year) }] : []),
    { label: 'Added', value: relativeDays(entry.createdAt, now) },
    ...(entry.lastOpenedAt ? [{ label: 'Last opened', value: relativeDays(entry.lastOpenedAt, now) }] : []),
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 pb-24 pt-6 sm:px-8 xl:max-w-[1760px] 2xl:px-12 3xl:max-w-[2040px]">
      <TouchOnOpen entryId={entry.id} />

      {/* Space › Title breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] text-stone-500">
        <Link href="/" className="flex items-center gap-1 hover:text-stone-700">
          <ArrowLeft size={14} /> Library
        </Link>
        <span className="text-stone-300">›</span>
        <Link href={`/${entry.space}`} className="hover:text-stone-700">
          {SPACE_LABEL[entry.space] ?? entry.space}
        </Link>
        <span className="text-stone-300">›</span>
        <span className="font-medium text-stone-700">{entry.title}</span>
      </nav>

      {/* 3-zone composition: A save-state · B ledger · C "around this" (xl+) */}
      <div className="grid grid-cols-12 gap-8 xl:gap-10">
        {/* Zone A — save-state (sticky, full-height) */}
        <aside
          aria-label="Save-state"
          className="col-span-12 lg:col-span-4 xl:col-span-3"
        >
          <div className="space-y-5 lg:sticky lg:top-6">
            <div className="relative overflow-hidden rounded-2xl shadow-cover ring-1 ring-amber-500/10">
              <GenerativeCover mediaType={entry.mediaType} space={entry.space} seed={entry.id} className="aspect-[3/4] w-full" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
              <div className="absolute left-3 right-3 top-3 flex items-center gap-1.5">
                <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                  <TypeIcon size={12} />
                  {entry.mediaType.replace('_', ' ')}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h1 className="font-serif text-[26px] leading-tight text-white">{entry.title}</h1>
                {entry.subtitle && (
                  <p className="mt-1 font-serif text-[14px] italic text-amber-100/85">{entry.subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <History size={14} className="text-amber-ink" />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber-ink">
                Previously On
              </span>
              {entry.lastOpenedAt && (
                <span className="ml-auto font-mono text-[11px] text-stone-400">
                  opened {relativeDays(entry.lastOpenedAt, now)}
                </span>
              )}
            </div>

            <ContextColumn entryId={entry.id} context={entry.context} backlinks={entry.backlinks} />
          </div>
        </aside>

        {/* Zone B — the Ledger (long-form) */}
        <main className="col-span-12 lg:col-span-8 xl:col-span-6">
          <LedgerSection entryId={entry.id} ledger={entry.ledger} />
        </main>

        {/* Zone C — "around this" (meta + links + ambient); earns the width on xl+ */}
        <aside aria-label="About this entry" className="col-span-12 hidden xl:col-span-3 xl:block">
          <div className="space-y-6 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-stone-200 bg-card/60 p-4">
              <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400">
                Around this
              </p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-3.5">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400">
                      {m.label}
                    </dt>
                    <dd className="mt-0.5 text-[13px] font-medium text-stone-700">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {entry.backlinks.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-ink">
                  <LinkIcon size={12} /> Linked
                </p>
                <ul className="space-y-1.5">
                  {entry.backlinks.map((b) => (
                    <li key={b.id}>
                      <Link
                        href={`/entry/${b.id}`}
                        className="block rounded-lg border border-stone-200 bg-card/50 px-3 py-2 text-[13px] text-stone-700 transition hover:border-amber-200 hover:text-amber-ink"
                      >
                        {b.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ambient echo of the cover — atmosphere that fills the canvas with intent */}
            <div className="relative overflow-hidden rounded-2xl border border-stone-200 opacity-70">
              <GenerativeCover mediaType={entry.mediaType} space={entry.space} seed={`${entry.id}-echo`} className="aspect-[4/3] w-full" />
              <div className="absolute inset-0 bg-ground/40" />
              <p className="absolute bottom-3 left-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/80">
                {SPACE_LABEL[entry.space] ?? entry.space}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
