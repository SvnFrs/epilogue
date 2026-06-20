import { LibraryRail } from '@/components/rail/LibraryRail';

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <LibraryRail />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
