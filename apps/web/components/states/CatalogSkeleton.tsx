/* Catalog loading skeleton (ux-ui.md §3) — cover-shimmer masonry, no spinner. */
import { SkeletonBlock, SkeletonLine } from './Skeleton';

const HEIGHTS = ['h-56', 'h-72', 'h-60', 'h-80', 'h-56', 'h-72', 'h-64', 'h-60', 'h-72', 'h-56'];

export function CatalogSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[2400px] px-5 pb-20 pt-10 sm:px-8 2xl:px-12">
      <div className="mb-9">
        <SkeletonLine className="w-24" />
        <SkeletonLine className="mt-3 h-9 w-[28rem] max-w-full" />
        <SkeletonLine className="mt-3 w-40" />
      </div>
      <div className="[column-gap:1.5rem] columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 4xl:columns-6">
        {HEIGHTS.map((h, i) => (
          <div key={i} className="mb-6 break-inside-avoid">
            <SkeletonBlock className={`${h} w-full rounded-3xl`} />
            <SkeletonLine className="mt-3 w-3/4" />
          </div>
        ))}
      </div>
    </main>
  );
}
