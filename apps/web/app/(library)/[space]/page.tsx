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

const NOUN: Record<Space, string> = {
  gaming: 'Gaming',
  reading: 'Reading',
  cinema: 'Cinema',
  tech: 'Tech',
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
  const label = NOUN[space as Space];
  return (
    <CatalogView
      kicker={space}
      title={TITLES[space as Space]}
      entries={entries}
      empty={{
        title: 'Nothing here yet',
        sub: `Add your first ${label} entry to this shelf.`,
        ctaHref: '/entry/new',
        ctaLabel: `Add to ${label}`,
      }}
    />
  );
}
