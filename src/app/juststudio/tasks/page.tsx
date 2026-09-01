'use client';

import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { TaskColumn } from '@/components/juststudio/tasks/task-column';
import { TaskDetailPanel } from '@/components/juststudio/tasks/task-detail-panel';
import { TaskFormModal } from '@/components/juststudio/tasks/task-form-modal';
import { COLUMNS, isOverdue, type Staff } from '@/components/juststudio/tasks/types';
import { employeesApi, tasksApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Task } from '@/lib/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([tasksApi.list(), employeesApi.list()])
      .then(([t, emps]) => {
        setTasks(t);
        setStaff(emps.map((e) => ({ id: e.id, name: e.name, speciality: e.speciality })));
      })
      .catch((err) => toast.error(err instanceof ApiError ? err.message : 'Failed to load tasks'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    const q = search.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [tasks, search]);

  const stats = useMemo(
    () => ({
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      overdue: tasks.filter((t) => isOverdue(t)).length,
    }),
    [tasks],
  );

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const updated = await tasksApi.update(taskId, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setActiveTask((prev) => (prev?.id === taskId ? updated : prev));
      toast.success(`Moved to ${status.replace('-', ' ')}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update task');
    }
  };

  const handleSave = async (formData: Omit<Task, 'id' | 'studioId' | 'createdBy' | 'updatedBy'>) => {
    setIsSaving(true);
    try {
      if (editingTask) {
        const updated = await tasksApi.update(editingTask.id, formData);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        if (activeTask?.id === updated.id) setActiveTask(updated);
        toast.success('Task updated');
      } else {
        const created = await tasksApi.create(formData);
        setTasks((prev) => [created, ...prev]);
        toast.success('Task created');
      }
      setShowFormModal(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await tasksApi.remove(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (activeTask?.id === taskId) setActiveTask(null);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete task');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-gray-50/50">
        <div className="h-16 shrink-0 animate-pulse border-b border-gray-200 bg-white" />
        <div className="flex flex-1 gap-6 overflow-hidden p-4 md:p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[340px] shrink-0 space-y-3">
              <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-28 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gray-50/50">
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
          <div className="hidden items-center gap-2 md:flex">
            <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              Pending: {stats.pending}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 text-xs font-medium text-accent-600">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              In progress: {stats.inProgress}
            </span>
            {stats.overdue > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Overdue: {stats.overdue}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-56 rounded-lg border-none bg-gray-100 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-600"
          >
            <Plus size={16} />
            New task
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6">
        <div className="flex h-full min-w-max gap-6">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.id}
              column={col}
              tasks={filteredTasks.filter((t) => t.status === col.id)}
              staff={staff}
              activeTaskId={activeTask?.id ?? null}
              onTaskClick={(task) => setActiveTask((prev) => (prev?.id === task.id ? null : task))}
            />
          ))}
        </div>
      </div>

      {activeTask && (
        <TaskDetailPanel
          task={activeTask}
          staff={staff}
          onClose={() => setActiveTask(null)}
          onStatusChange={(id, status) => void handleStatusChange(id, status)}
          onEdit={(task) => {
            setEditingTask(task);
            setShowFormModal(true);
          }}
          onDelete={(id) => void handleDelete(id)}
        />
      )}

      <TaskFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingTask(null);
        }}
        task={editingTask}
        staff={staff}
        onSave={(data) => void handleSave(data)}
        isSaving={isSaving}
      />
    </div>
  );
}
