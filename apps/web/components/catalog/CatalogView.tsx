import Link from 'next/link';
import type { Entry } from '@epilogue/contracts';
import { CoverCard } from './CoverCard';

/**
 * Minimal catalog (walking skeleton). The full masonry/bento grid + loading/empty
 * states + a11y are US2 (T027/T029/T030) — this is just enough to navigate to detail.
 */
export function CatalogView({
  title,
  kicker,
  entries,
}: {
  title: string;
  kicker: string;
  entries: Entry[];
}) {
  const now = new Date();
  return (
    <main className="mx-auto w-full max-w-[2400px] px-5 pb-20 pt-10 sm:px-8 2xl:px-12">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-amber-ink">{kicker}</p>
          <h1 className="mt-2 font-serif text-[clamp(30px,4vw,46px)] leading-tight text-stone-800">
            {title}
          </h1>
          <p className="mt-3 text-[15px] text-stone-500">{entries.length} entries</p>
        </div>
        <Link
          href="/entry/new"
          className="flex items-center gap-2 rounded-full bg-stone-800 px-4 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-900"
        >
          + Add entry
        </Link>
      </div>

      {entries.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-7 3xl:grid-cols-5 4xl:grid-cols-6">
          {entries.map((e) => (
            <CoverCard key={e.id} entry={e} now={now} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 py-24 text-center">
          <p className="font-serif text-[22px] italic text-stone-500">Your shelf is empty</p>
          <p className="mt-1 text-[13px] text-stone-400">
            Start the archive with your first save-state.
          </p>
          <Link
            href="/entry/new"
            className="mt-5 rounded-full bg-amber-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800"
          >
            Add your first entry
          </Link>
        </div>
      )}
    </main>
  );
}
