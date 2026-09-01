import type { Task } from '@/lib/types';

import { TaskCard } from './task-card';
import { COLUMNS, type Staff } from './types';

export function TaskColumn({
  column,
  tasks,
  staff,
  activeTaskId,
  onTaskClick,
}: {
  column: (typeof COLUMNS)[number];
  tasks: Task[];
  staff: Staff[];
  activeTaskId: string | null;
  onTaskClick: (task: Task) => void;
}) {
  return (
    <div className="flex h-full w-[340px] shrink-0 flex-col">
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {column.label}
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${column.countCls}`}>{tasks.length}</span>
        </h3>
      </div>

      <div className={`flex-1 space-y-3 overflow-y-auto pb-4 pr-1 ${column.id === 'completed' ? 'opacity-75' : ''}`}>
        {tasks.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-xs font-medium text-gray-400">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} staff={staff} isActive={activeTaskId === task.id} onClick={() => onTaskClick(task)} />)
        )}
      </div>
    </div>
  );
}
