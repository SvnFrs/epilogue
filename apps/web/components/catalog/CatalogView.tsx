import Link from 'next/link';
import type { Entry } from '@epilogue/contracts';
import { CoverCard } from './CoverCard';

/**
 * The catalog (US2; T027) — Letterboxd-style bento masonry ported from src/home.jsx
 * (the binding visual reference). CSS columns give true masonry with varied card
 * heights; column count scales to ultrawide. Empty states are typed by the caller.
 */
export interface EmptyState {
  title: string;
  sub: string;
  ctaHref: string;
  ctaLabel: string;
}

/** Stable per-entry height variation for the bento rhythm. */
function isTall(id: string): boolean {
  return (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % 3 === 0;
}

export function CatalogView({
  title,
  kicker,
  entries,
  empty,
}: {
  title: string;
  kicker: string;
  entries: Entry[];
  empty: EmptyState;
}) {
  const now = new Date();
  const paused = entries.filter((e) => e.status === 'PAUSED').length;

  return (
    <main className="mx-auto w-full max-w-[2400px] px-5 pb-20 pt-10 sm:px-8 2xl:px-12">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-amber-ink">{kicker}</p>
          <h1 className="mt-2 font-serif text-[clamp(30px,4vw,52px)] leading-tight text-stone-800">
            {title}
          </h1>
          <p className="mt-3 text-[15px] text-stone-500">
            <span className="text-stone-600">{entries.length} entries</span>
            {paused > 0 && <> · {paused} paused</>}
          </p>
        </div>
        <Link
          href="/entry/new"
          className="flex items-center gap-2 rounded-full bg-stone-800 px-4 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-900"
        >
          + Add entry
        </Link>
      </div>

      {entries.length ? (
        <div className="[column-gap:1.5rem] columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 4xl:columns-6">
          {entries.map((e) => (
            <div key={e.id} className="mb-6 break-inside-avoid">
              <CoverCard entry={e} now={now} tall={isTall(e.id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 py-24 text-center">
          <p className="font-serif text-[22px] italic text-stone-500">{empty.title}</p>
          <p className="mt-1 max-w-[40ch] text-[13px] text-stone-400">{empty.sub}</p>
          <Link
            href={empty.ctaHref}
            className="mt-5 rounded-full bg-amber-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800"
          >
            {empty.ctaLabel}
          </Link>
        </div>
      )}
    </main>
  );
}
