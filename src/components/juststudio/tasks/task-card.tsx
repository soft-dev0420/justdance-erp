import { Calendar } from 'lucide-react';

import type { Task } from '@/lib/types';

import { CARD_BORDER, CATEGORY_TAG, TASK_PRIORITY_LABEL, formatDue, getInitials, isOverdue, type Staff } from './types';

export function TaskCard({ task, staff, isActive, onClick }: { task: Task; staff: Staff[]; isActive: boolean; onClick: () => void }) {
  const assignees = staff.filter((s) => (task.assignees ?? []).includes(s.id));
  const overdue = isOverdue(task);
  const border = CARD_BORDER[task.status] ?? 'border-l-gray-300';
  const catCls = CATEGORY_TAG[task.category] ?? 'bg-gray-100 text-gray-600';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-xl p-4 transition-all ${
        isActive ? 'border-2 border-accent-500 bg-white shadow-lg' : `border border-l-4 border-gray-100 bg-white shadow-sm hover:shadow-md ${border}`
      }`}
    >
      {isActive && <div className="absolute -right-0 top-0 h-16 w-16 rounded-bl-full bg-accent-50 -z-10" />}

      <div className="mb-3 flex flex-wrap gap-1.5">
        <span className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${catCls}`}>{task.category}</span>
        <span className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-50 text-red-500' : task.priority === 'medium' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
          {TASK_PRIORITY_LABEL[task.priority]}
        </span>
        {overdue && <span className="rounded bg-red-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-600">Overdue</span>}
      </div>

      <h4 className={`mb-1 text-sm font-semibold leading-snug ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h4>
      {task.description && <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">{task.description}</p>}

      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-[11px] font-medium ${overdue ? 'text-red-500' : task.status === 'in-progress' ? 'text-accent-600' : task.status === 'completed' ? 'text-green-600' : 'text-gray-500'}`}>
          <Calendar size={12} className="shrink-0" />
          {formatDue(task.dueDate, task.dueTime)}
        </span>

        {assignees.length > 0 ? (
          <div className="flex -space-x-1.5">
            {assignees.slice(0, 3).map((a, i) => (
              <div key={a.id} title={a.name} style={{ zIndex: 3 - i }} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-accent-500 text-[9px] font-bold text-white shadow-sm">
                {getInitials(a.name)}
              </div>
            ))}
            {assignees.length > 3 && <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-[9px] font-bold text-gray-700 shadow-sm">+{assignees.length - 3}</div>}
          </div>
        ) : (
          <div className="h-6 w-6 shrink-0 rounded-full border-2 border-white bg-gray-200" />
        )}
      </div>
    </div>
  );
}
