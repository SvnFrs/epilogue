import Link from 'next/link';
import { notFound } from 'next/navigation';
import { relativeDays } from '@epilogue/contracts';
import { getEntryDetail } from '@/lib/api/server';
import { GenerativeCover } from '@/components/covers/GenerativeCover';
import { ContextColumn } from '@/components/context/ContextColumn';
import { TouchOnOpen } from '@/components/context/TouchOnOpen';
import { LedgerSection } from '@/components/ledger/LedgerSection';
import { iconForType, ArrowLeft, History } from '@/components/icons';

export const dynamic = 'force-dynamic';

const SPACE_LABEL: Record<string, string> = {
  gaming: 'Gaming',
  reading: 'Reading',
  cinema: 'Cinema',
  tech: 'Tech',
};

export default async function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEntryDetail(id);
  if (!entry) notFound();

  const TypeIcon = iconForType(entry.mediaType);
  const now = new Date();

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 pb-24 pt-6 sm:px-8 2xl:px-12">
      <TouchOnOpen entryId={entry.id} />

      {/* Space › Title breadcrumb (repurposed from POC space/year/month) */}
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

      <div className="grid grid-cols-12 gap-8">
        {/* save-state column (sticky) — the "Previously On" recall (T023) */}
        <aside aria-label="Save-state" className="col-span-12 lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-6">
            <div className="relative overflow-hidden rounded-2xl shadow-cover ring-1 ring-stone-900/10">
              <GenerativeCover mediaType={entry.mediaType} space={entry.space} className="aspect-[3/4] w-full" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/30" />
              <div className="absolute left-3 right-3 top-3 flex items-center gap-1.5">
                <span className="flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
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

        {/* the Ledger (long-form) — read/edit/empty via LedgerSection (US3) */}
        <main className="col-span-12 lg:col-span-8">
          <LedgerSection entryId={entry.id} ledger={entry.ledger} />
        </main>
      </div>
    </div>
  );
}
