import type { T } from '@/lib/i18n';
import type { Employee } from '@/lib/types';

// A plain module-level object can't call useLanguage() itself — callers
// (all components, which do have access to `t`) resolve the label through
// this function instead of a static lookup table.
export function statusLabel(status: Employee['status'], t: T): string {
  const labels: Record<Employee['status'], string> = {
    available: t.statusAvailable,
    vacation: t.statusVacation,
    sick: t.statusSick,
    unavailable: t.statusUnavailable,
    'off-duty': t.statusOffDuty,
  };
  return labels[status];
}

export const STATUS_BADGE_CLASS: Record<Employee['status'], string> = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  vacation: 'bg-accent-50 text-accent-700 border-accent-100',
  sick: 'bg-red-50 text-red-600 border-red-100',
  unavailable: 'bg-gray-50 text-gray-600 border-gray-200',
  'off-duty': 'bg-gray-50 text-gray-500 border-gray-100',
};

export const STATUS_DOT_CLASS: Record<Employee['status'], string> = {
  available: 'bg-emerald-500',
  vacation: 'bg-accent-400',
  sick: 'bg-red-400',
  unavailable: 'bg-gray-400',
  'off-duty': 'bg-gray-300',
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
