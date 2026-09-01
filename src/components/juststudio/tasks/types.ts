import type { Task } from '@/lib/types';

export interface Staff {
  id: string;
  name: string;
  speciality: string;
}

export const COLUMNS = [
  { id: 'pending', label: 'Pending', countCls: 'bg-gray-200 text-gray-600' },
  { id: 'in-progress', label: 'In progress', countCls: 'bg-accent-100 text-accent-700' },
  { id: 'completed', label: 'Completed', countCls: 'bg-gray-200 text-gray-600' },
] as const;

export const TASK_STATUS_LABEL: Record<Task['status'], string> = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export const TASK_PRIORITY_LABEL: Record<Task['priority'], string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

export const CATEGORIES = ['general', 'costumes', 'choreography', 'maintenance', 'inventory', 'event', 'internal'];

export const CATEGORY_TAG: Record<string, string> = {
  costumes: 'bg-purple-50 text-purple-600',
  choreography: 'bg-pink-50 text-pink-600',
  maintenance: 'bg-blue-50 text-blue-600',
  inventory: 'bg-orange-50 text-orange-600',
  event: 'bg-accent-50 text-accent-700',
  internal: 'bg-gray-100 text-gray-600',
  general: 'bg-gray-100 text-gray-600',
};

export const STATUS_BADGE: Record<Task['status'], string> = {
  pending: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-accent-100 text-accent-700',
  completed: 'bg-green-100 text-green-700',
};

export const PRIORITY_BADGE: Record<Task['priority'], string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-orange-50 text-orange-600',
  low: 'bg-green-50 text-green-700',
};

export const CARD_BORDER: Record<Task['status'], string> = {
  pending: 'border-l-gray-300',
  'in-progress': 'border-l-accent-500',
  completed: 'border-l-green-500',
};

export function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  );
}

export function isOverdue(task: Task): boolean {
  if (task.status === 'completed' || !task.dueDate) return false;
  const [y, m, d] = task.dueDate.split('-').map(Number);
  const due = new Date(y!, m! - 1, d!);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function formatDue(date: string, time: string, todayLabel = 'Today'): string {
  if (!date) return '—';
  const [y, m, d] = date.split('-').map(Number);
  const parsed = new Date(y!, m! - 1, d!);
  const today = new Date();
  const isToday = parsed.toDateString() === today.toDateString();
  const label = isToday ? todayLabel : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return time ? `${label}, ${time}` : label;
}
