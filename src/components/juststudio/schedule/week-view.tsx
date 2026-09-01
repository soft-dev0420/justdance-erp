'use client';

import { HOUR_HEIGHT, STATUS_STYLE, type ScheduleAppt, isPastDay, isSameDay, p2, timeToMinutes } from './types';

const GRID_START = 9;
const GRID_END = 18;
const HOURS = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i);
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function calcTop(start: string) {
  return Math.max(0, ((timeToMinutes(start) - GRID_START * 60) / 60) * HOUR_HEIGHT);
}
function calcHeight(start: string, end: string) {
  return Math.max(24, ((timeToMinutes(end) - timeToMinutes(start)) / 60) * HOUR_HEIGHT);
}
function fmtShort(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function WeekView({
  weekStart,
  now,
  apptsByDay,
  onDayClick,
  onApptClick,
}: {
  weekStart: Date;
  now: Date;
  apptsByDay: Map<string, ScheduleAppt[]>;
  onDayClick: (date: Date) => void;
  onApptClick: (appt: ScheduleAppt) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const nowMins = now.getHours() * 60 + now.getMinutes() - GRID_START * 60;
  const nowTop = (nowMins / 60) * HOUR_HEIGHT;
  const showNow = nowMins >= 0 && now.getHours() < GRID_END;

  const dayKey = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;

  return (
    <div className="mx-3 mb-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:mx-6 md:mb-6">
      <div className="flex-1 overflow-auto" style={{ minWidth: `${64 + 7 * 100}px` }}>
        <div className="sticky top-0 z-20 flex border-b border-gray-100 bg-gray-50/80">
          <div className="w-16 shrink-0 border-r border-gray-100 bg-gray-50" />
          {days.map((d, i) => {
            const isToday = isSameDay(d, now);
            const isPast = isPastDay(d);
            return (
              <button
                key={i}
                onClick={() => onDayClick(d)}
                className="flex min-w-[100px] flex-1 flex-col items-center gap-0.5 border-r border-gray-100 py-3 transition-colors hover:bg-gray-100"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{DAY_SHORT[i]}</span>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-accent-500 text-white' : isPast ? 'text-gray-300' : 'text-gray-700'}`}>
                  {d.getDate()}
                </span>
                <span className="text-[10px] text-gray-400">{fmtShort(d)}</span>
              </button>
            );
          })}
        </div>

        <div className="relative flex" style={{ minHeight: HOURS.length * HOUR_HEIGHT }}>
          <div className="sticky left-0 z-10 flex w-16 shrink-0 flex-col border-r border-gray-100 bg-gray-50">
            {HOURS.map((h) => (
              <div key={h} className="flex h-16 items-start justify-center border-b border-dashed border-gray-100 pt-2">
                <span className="text-[10px] font-medium text-gray-400">{p2(h)}:00</span>
              </div>
            ))}
          </div>

          <div className="relative flex flex-1">
            <div className="pointer-events-none absolute inset-0 z-0 flex flex-col">
              {HOURS.map((h) => (
                <div key={h} className="h-16 border-b border-dashed border-gray-100" />
              ))}
            </div>

            {days.map((d, di) => {
              const isToday = isSameDay(d, now);
              const isPast = isPastDay(d);
              const appts = apptsByDay.get(dayKey(d)) ?? [];
              return (
                <div key={di} className="relative min-w-[100px] flex-1 border-r border-gray-100">
                  {(isPast || (isToday && nowTop > 0)) && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] bg-gray-100/40" style={{ height: isPast ? '100%' : nowTop }} />
                  )}
                  {isToday && showNow && (
                    <div className="pointer-events-none absolute left-0 right-0 z-20 h-0.5 bg-accent-500" style={{ top: nowTop }}>
                      <div className="absolute h-2 w-2 rounded-full bg-accent-500" style={{ left: -1, top: -3 }} />
                    </div>
                  )}
                  {appts.map((appt) => {
                    const top = calcTop(appt.startTime);
                    const height = calcHeight(appt.startTime, appt.endTime);
                    return (
                      <div
                        key={appt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApptClick(appt);
                        }}
                        className={`absolute left-0.5 right-0.5 z-10 cursor-pointer overflow-hidden rounded-md border px-1.5 py-1 shadow-sm transition-all hover:z-30 hover:shadow-md ${STATUS_STYLE[appt.status]}`}
                        style={{ top, height: Math.max(height, 24) }}
                      >
                        <p className="truncate text-[10px] font-semibold leading-tight">{appt.serviceLabel}</p>
                        {height >= 36 && <p className="truncate text-[9px] opacity-70">{appt.startTime}</p>}
                        {height >= 52 && <p className="truncate text-[9px] opacity-70">{appt.clientName}</p>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
