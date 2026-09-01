'use client';

import { Calendar, Check, Pencil, RotateCcw, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import type { Task } from '@/lib/types';

import { CATEGORY_TAG, PRIORITY_BADGE, STATUS_BADGE, TASK_PRIORITY_LABEL, TASK_STATUS_LABEL, formatDue, getInitials, type Staff } from './types';

export function TaskDetailPanel({
  task,
  staff,
  onClose,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  task: Task;
  staff: Staff[];
  onClose: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  const [pendingDelete, setPendingDelete] = useState(false);

  const assignees = staff.filter((s) => (task.assignees ?? []).includes(s.id));

  const handleDelete = () => {
    if (!pendingDelete) {
      setPendingDelete(true);
      return;
    }
    onDelete(task.id);
  };

  const nextStatus: Task['status'] | null = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : null;

  return (
    <>
      <div className="fixed inset-0 z-[55] bg-black/20 sm:hidden" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 sm:w-[400px]">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <span className="font-mono text-xs font-medium text-gray-400">{task.id.slice(0, 8).toUpperCase()}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(task)} title="Edit task" className="flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <Pencil size={16} />
            </button>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-4 overflow-y-auto p-5">
          <div className="min-w-0 flex-1 space-y-5">
            <h2 className="text-xl font-bold leading-tight text-gray-900">{task.title}</h2>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_BADGE[task.status]}`}>{TASK_STATUS_LABEL[task.status]}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${PRIORITY_BADGE[task.priority]}`}>{TASK_PRIORITY_LABEL[task.priority]}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${CATEGORY_TAG[task.category] ?? 'bg-gray-100 text-gray-600'}`}>{task.category}</span>
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Calendar size={14} />
                  {formatDue(task.dueDate, task.dueTime)}
                </span>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-900">Description</h4>
              <p className="text-sm leading-relaxed text-gray-600">{task.description || 'No description'}</p>
            </div>

            {task.notes && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-900">Notes</h4>
                <p className="text-sm leading-relaxed text-gray-600">{task.notes}</p>
              </div>
            )}

            <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Assigned to</h4>
              {assignees.length > 0 ? (
                assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">{getInitials(assignee.name)}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{assignee.name}</p>
                      <p className="text-xs text-gray-500">{assignee.speciality}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
                  <p className="text-sm text-gray-400">Unassigned</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-11 shrink-0 flex-col items-center gap-3 border-l border-gray-100 py-1 pl-3">
            {nextStatus ? (
              <button onClick={() => onStatusChange(task.id, nextStatus)} title={nextStatus === 'in-progress' ? 'Start task' : 'Mark complete'} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-50 text-accent-600 transition-colors hover:bg-accent-100">
                <Check size={16} />
              </button>
            ) : (
              <button onClick={() => onStatusChange(task.id, 'pending')} title="Reopen task" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100">
                <RotateCcw size={16} />
              </button>
            )}

            <div className="h-px w-6 bg-gray-100" />

            <button onClick={() => onEdit(task)} title="Edit task" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100">
              <Pencil size={16} />
            </button>

            <button
              onClick={handleDelete}
              onBlur={() => setPendingDelete(false)}
              title={pendingDelete ? 'Tap again to confirm' : 'Delete task'}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${pendingDelete ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
