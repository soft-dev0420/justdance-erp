'use client';

import { ClipboardList, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useLanguage } from '@/lib/i18n';
import type { Task } from '@/lib/types';

import { CATEGORIES, getInitials, taskPriorityLabel, taskStatusLabel, type Staff } from './types';

interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  category: string;
  assignees: string[];
  dueDate: string;
  dueTime: string;
  notes: string;
}

const inputCls =
  'mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors';
const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider';

const DEFAULT: TaskFormData = { title: '', description: '', status: 'pending', priority: 'medium', category: 'general', assignees: [], dueDate: '', dueTime: '', notes: '' };

const PRIORITIES: Task['priority'][] = ['low', 'medium', 'high'];
const STATUSES: Task['status'][] = ['pending', 'in-progress', 'completed'];

export function TaskFormModal({
  isOpen,
  onClose,
  task,
  staff,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  staff: Staff[];
  onSave: (data: TaskFormData) => void;
  isSaving: boolean;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState<TaskFormData>(DEFAULT);

  useEffect(() => {
    // Reset the form each time the modal opens for a new/different task.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(
      task
        ? {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            category: task.category,
            assignees: task.assignees ?? [],
            dueDate: task.dueDate,
            dueTime: task.dueTime,
            notes: task.notes,
          }
        : DEFAULT,
    );
  }, [task, isOpen]);

  const set = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => setForm((prev) => ({ ...prev, [field]: value }));

  const addAssignee = (id: string) => {
    if (!id || form.assignees.includes(id)) return;
    setForm((prev) => ({ ...prev, assignees: [...prev.assignees, id] }));
  };

  const removeAssignee = (id: string) => setForm((prev) => ({ ...prev, assignees: prev.assignees.filter((a) => a !== id) }));

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error(t.titleRequired);
      return;
    }
    if (!form.dueDate) {
      toast.error(t.dueDateRequired);
      return;
    }
    onSave(form);
  };

  if (!isOpen) return null;

  const unassigned = staff.filter((s) => !form.assignees.includes(s.id));

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50">
                <ClipboardList size={16} className="text-accent-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{task ? t.editTask : t.newTask}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
            <div>
              <label className={labelCls}>{t.titleStar}</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder={t.orderNewCostumesPlaceholder} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>{t.descriptionLabel}</label>
              <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder={t.whatNeedsToBeDonePlaceholder} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>{t.assignedTo}</label>
              <select
                value=""
                onChange={(e) => {
                  addAssignee(e.target.value);
                  e.target.value = '';
                }}
                className={inputCls}
                disabled={unassigned.length === 0}
              >
                <option value="">{unassigned.length === 0 ? t.allStaffAssigned : t.addAssigneeEllipsis}</option>
                {unassigned.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {form.assignees.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.assignees.map((id) => {
                    const member = staff.find((s) => s.id === id);
                    if (!member) return null;
                    return (
                      <span key={id} className="flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 py-1 pl-1 pr-2 text-xs font-medium text-accent-800">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-[9px] font-bold text-white">{getInitials(member.name)}</span>
                        {member.name}
                        <button type="button" onClick={() => removeAssignee(id)} className="ml-0.5 leading-none text-accent-500 transition-colors hover:text-red-500" title={t.removeAssignee.replace('{value}', member.name)}>
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>{t.categoryLabel}</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t.dueDateStar}</label>
                <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{t.dueTimeLabel}</label>
                <input type="time" value={form.dueTime} onChange={(e) => set('dueTime', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t.priorityLabel}</label>
                <select value={form.priority} onChange={(e) => set('priority', e.target.value as Task['priority'])} className={inputCls}>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {taskPriorityLabel(p, t)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t.statusFieldLabel}</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as Task['status'])} className={inputCls}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {taskStatusLabel(s, t)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>{t.notesLabel}</label>
              <textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder={t.optionalPlaceholder} className={inputCls} />
            </div>
          </div>

          <div className="flex justify-end gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white">
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-600 ${isSaving ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {isSaving ? t.saving : task ? t.updateTask : t.createTask}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
