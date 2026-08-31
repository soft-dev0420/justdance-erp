export const STATUS_LABELS: Record<string, string> = {
  'regular-customer': 'Regular',
  'new-customer': 'New',
  vip: 'VIP',
  'be-careful': 'Be careful',
  'do-not-accept': 'Do not accept',
};

export const STATUS_BADGE_CLASS: Record<string, string> = {
  'regular-customer': 'bg-emerald-50 text-emerald-700',
  'new-customer': 'bg-cyan-50 text-cyan-700',
  vip: 'bg-accent-50 text-accent-700',
  'be-careful': 'bg-amber-50 text-amber-700',
  'do-not-accept': 'bg-red-50 text-red-700',
};

export function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  );
}

export function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
