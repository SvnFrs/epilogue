/* Loading skeleton primitives (ux-ui.md §3 — no spinners; reuse the paper shimmer). */

export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`epi-skeleton h-4 ${className}`} />;
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`epi-skeleton ${className}`} />;
}

/** Split-view detail skeleton (T021 loading state). */
export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-8 p-6">
      <aside className="col-span-12 space-y-5 lg:col-span-4">
        <SkeletonBlock className="aspect-[3/4] w-full rounded-2xl" />
        <SkeletonBlock className="h-40 w-full rounded-2xl" />
      </aside>
      <main className="col-span-12 space-y-4 lg:col-span-8">
        <SkeletonLine className="w-1/3" />
        <SkeletonLine className="h-8 w-2/3" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-4/5" />
      </main>
    </div>
  );
}
