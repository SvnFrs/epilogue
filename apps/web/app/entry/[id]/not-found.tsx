import Link from 'next/link';

/* Real entry 404 (ux-ui.md §3) — fixes the POC silently falling back to STORIES[0]. */
export default function EntryNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-ink">Not found</p>
      <h1 className="mt-3 font-serif text-3xl text-stone-800">This entry isn’t here</h1>
      <p className="mt-2 max-w-md text-stone-500">
        It may have been removed, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-900"
      >
        Back to the Library
      </Link>
    </div>
  );
}
