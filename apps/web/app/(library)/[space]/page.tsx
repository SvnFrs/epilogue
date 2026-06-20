import { notFound } from 'next/navigation';
import { SPACES, type Space } from '@epilogue/contracts';
import { listEntries } from '@/lib/api/server';
import { CatalogView } from '@/components/catalog/CatalogView';

export const dynamic = 'force-dynamic';

const TITLES: Record<Space, string> = {
  gaming: 'The Gaming shelf',
  reading: 'The Reading shelf',
  cinema: 'The Cinema shelf',
  tech: 'The Tech log',
};

export default async function SpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ space: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { space } = await params;
  if (!(SPACES as readonly string[]).includes(space)) notFound();
  const { status } = await searchParams;
  const entries = await listEntries({ space, status });
  return (
    <CatalogView
      kicker={space}
      title={TITLES[space as Space]}
      entries={entries}
    />
  );
}
