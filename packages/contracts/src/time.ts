/**
 * Relative-time formatter for "N days ago" (FR-015). Pure: the caller injects `now`
 * — NEVER read the clock inside (testing.md unit tier; deterministic across DST/today/
 * future boundaries). Compares calendar days in local time, not raw 24h spans.
 */

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function relativeDays(date: Date | string, now: Date): string {
  const then = typeof date === 'string' ? new Date(date) : date;
  const dayMs = 86_400_000;
  const diffDays = Math.round((startOfDay(now) - startOfDay(then)) / dayMs);

  if (diffDays < 0) return 'in the future';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return 'last week';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return 'last month';
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays < 730) return 'last year';
  return `${Math.floor(diffDays / 365)} years ago`;
}
