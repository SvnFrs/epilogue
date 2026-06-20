import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-ink">404</p>
      <h1 className="mt-3 font-serif text-3xl text-stone-800">This page isn’t on the shelf</h1>
      <Link
        href="/"
        className="mt-6 rounded-full bg-stone-800 px-5 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-900"
      >
        Back to the Library
      </Link>
    </div>
  );
}
