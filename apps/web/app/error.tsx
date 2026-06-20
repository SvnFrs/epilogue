'use client';

/* API-unreachable / runtime error boundary (ux-ui.md §3). Never a blank page. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-ink">Something broke</p>
      <h1 className="mt-3 font-serif text-3xl text-stone-800">Couldn’t reach your library</h1>
      <p className="mt-2 max-w-md text-stone-500">
        The archive didn’t answer. It may be starting up, or the connection dropped.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-900"
      >
        Try again
      </button>
    </div>
  );
}
