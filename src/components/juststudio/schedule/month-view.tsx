'use client';

import { type ScheduleAppt, isSameDay, p2 } from './types';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MonthView({
  year,
  month,
  selectedDate,
  apptsByDay,
  onDayClick,
}: {
  year: number;
  month: number;
  selectedDate: Date;
  apptsByDay: Map<string, ScheduleAppt[]>;
  onDayClick: (date: Date) => void;
}) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;
  const today = new Date();

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    return dayNum < 1 || dayNum > lastDay.getDate() ? null : dayNum;
  });

  const dayKey = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;

  return (
    <div className="mx-3 mb-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:mx-6 md:mb-6">
      <div className="grid shrink-0 grid-cols-7 border-b border-gray-100 bg-gray-50/80">
        {DAY_LABELS.map((label) => (
          <div key={label} className="border-r border-gray-100 py-2 text-center last:border-r-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid flex-1 auto-rows-fr grid-cols-7">
        {cells.map((dayNum, i) => {
          if (!dayNum) return <div key={i} className="border-b border-r border-gray-50 bg-gray-50/50" />;

          const date = new Date(year, month - 1, dayNum);
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          const isPast = (() => {
            const a = new Date(date);
            a.setHours(0, 0, 0, 0);
            const b = new Date();
            b.setHours(0, 0, 0, 0);
            return a < b;
          })();
          const appts = apptsByDay.get(dayKey(date)) ?? [];
          const confirmed = appts.filter((a) => ['confirmed', 'checked-in', 'in-progress', 'completed'].includes(a.status)).length;
          const pending = appts.filter((a) => a.status === 'pending').length;
          const cancelled = appts.filter((a) => a.status === 'cancelled').length;

          return (
            <button
              key={i}
              onClick={() => onDayClick(date)}
              className={`group relative flex min-h-[90px] flex-col items-start border-b border-r border-gray-50 p-2 text-left transition-colors last:border-r-0 ${
                isPast ? 'bg-gray-50/60' : 'hover:bg-accent-50/40'
              } ${isSelected && !isToday ? 'bg-accent-50/60' : ''}`}
            >
              <span
                className={`mb-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isToday ? 'bg-accent-500 text-white' : isPast ? 'text-gray-300' : isSelected ? 'bg-accent-100 text-accent-800' : 'text-gray-700 group-hover:bg-accent-100 group-hover:text-accent-800'
                }`}
              >
                {dayNum}
              </span>

              {appts.length > 0 && (
                <div className="flex w-full flex-col gap-0.5">
                  {confirmed > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      <span className="truncate text-[10px] font-medium text-accent-700">{confirmed} confirmed</span>
                    </div>
                  )}
                  {pending > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      <span className="truncate text-[10px] font-medium text-amber-700">{pending} pending</span>
                    </div>
                  )}
                  {cancelled > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      <span className="truncate text-[10px] font-medium text-red-500">{cancelled} cancelled</span>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
