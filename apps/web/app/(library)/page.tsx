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
  return (
    <CatalogView kicker="The Library" title="Everything I’ve lived through" entries={entries} />
  );
}
