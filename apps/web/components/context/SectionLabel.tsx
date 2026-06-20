import type { ComponentType } from 'react';

type IconType = ComponentType<{ size?: number; className?: string }>;

export function SectionLabel({
  icon: Icon,
  accent,
  children,
}: {
  icon: IconType;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <Icon size={14} className={accent ? 'text-amber-ink' : 'text-stone-400'} />
      <span
        className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] ${
          accent ? 'text-amber-ink' : 'text-stone-400'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
