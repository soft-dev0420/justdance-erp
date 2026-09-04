export const SHIFT_CHIP: Record<string, string> = {
  morning: 'bg-amber-100 text-amber-800 border-amber-200',
  afternoon: 'bg-blue-100 text-blue-800 border-blue-200',
  evening: 'bg-accent-100 text-accent-800 border-accent-200',
};

export const SHIFT_DOT: Record<string, string> = {
  morning: 'bg-amber-500',
  afternoon: 'bg-blue-500',
  evening: 'bg-accent-500',
};

export const STATUS_BADGE: Record<string, string> = {
  scheduled: 'bg-accent-100 text-accent-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

export function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
