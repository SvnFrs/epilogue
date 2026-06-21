import Link from 'next/link';
import { type Entry, type Status, relativeDays } from '@epilogue/contracts';
import { GenerativeCover } from '../covers/GenerativeCover';
import { History } from '../icons';

/**
 * "Continue" band (P2) — the in-progress entries (not completed), most-recently-opened first,
 * as a horizontal strip atop the library. Gives the catalog a warm anchor + a fast path back
 * into what you were doing, so even a sparse shelf never opens cold.
 */
const IN_PROGRESS: Status[] = ['PLAYING', 'PAUSED', 'READING', 'AIRING'];

export function ContinueBand({ entries }: { entries: Entry[] }) {
  const now = new Date();
  const key = (e: Entry) => String(e.lastOpenedAt ?? e.createdAt ?? '');
  const items = entries
    .filter((e) => IN_PROGRESS.includes(e.status))
    .sort((a, b) => key(b).localeCompare(key(a)))
    .slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline gap-2">
        <History size={14} className="translate-y-0.5 text-amber-ink" />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-ink">Continue</span>
        <span className="font-mono text-[11px] text-stone-400">· pick up where you left off</span>
      </div>
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
        {items.map((e) => (
          <Link
            key={e.id}
            href={`/entry/${e.id}`}
            className="group flex w-[300px] shrink-0 items-center gap-3.5 rounded-2xl border border-stone-300/60 bg-card p-3 ring-1 ring-stone-900/5 transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-card-hover"
            aria-label={`Continue ${e.title}`}
          >
            <div className="relative h-[72px] w-[54px] shrink-0 overflow-hidden rounded-lg shadow-cover">
              <GenerativeCover mediaType={e.mediaType} space={e.space} seed={e.id} className="h-full w-full" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-[15.5px] leading-tight text-stone-800 group-hover:text-amber-ink">
                {e.title}
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400">
                {e.status}
                {e.lastOpenedAt && ` · ${relativeDays(e.lastOpenedAt, now)}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
