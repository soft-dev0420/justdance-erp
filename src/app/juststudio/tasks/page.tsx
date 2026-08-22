'use client';

import { ListChecks, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { Input, Label, Select } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { tasksApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Task } from '@/lib/types';

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-sky-50 text-sky-600',
  high: 'bg-red-50 text-red-600',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  const load = () => tasksApi.list().then(setTasks).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    if (!title || !dueDate) return;
    setSubmitting(true);
    try {
      await tasksApi.create({ title, priority, dueDate });
      toast.success('Task added');
      setModalOpen(false);
      setTitle('');
      setDueDate('');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add task');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    await tasksApi.update(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' });
    load();
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="To-dos for you and your team."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add task
          </Button>
        }
      />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState icon={ListChecks} title="No tasks yet" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3.5 last:border-b-0 hover:bg-gray-50">
                <label className="flex min-w-0 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleComplete(task)}
                    className="h-4 w-4 flex-shrink-0 rounded border-gray-300 bg-white accent-[#6E3BFF]"
                  />
                  <span className={`truncate text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                </label>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <span className="text-xs text-gray-500">{task.dueDate}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add task">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Order new costumes" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>
          </div>
          <Button onClick={onCreate} disabled={submitting || !title || !dueDate}>
            {submitting ? 'Adding…' : 'Add task'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
