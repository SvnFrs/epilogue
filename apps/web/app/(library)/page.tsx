import { listEntries } from '@/lib/api/server';
import { CatalogView } from '@/components/catalog/CatalogView';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const entries = await listEntries({ status });
  const empty = status
    ? {
        title: 'Nothing matches',
        sub: 'No entries with that status yet. Clear the filter or add one.',
        ctaHref: '/entry/new',
        ctaLabel: 'Add an entry',
      }
    : {
        title: 'Your shelf is empty',
        sub: 'Start the archive with your first save-state.',
        ctaHref: '/entry/new',
        ctaLabel: 'Add your first entry',
      };
  return (
    <CatalogView
      kicker="The Library"
      title="Everything I’ve lived through"
      entries={entries}
      empty={empty}
      featured={!status}
    />
  );
}
