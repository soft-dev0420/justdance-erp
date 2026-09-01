'use client';

import { type MouseEvent, useState } from 'react';

import type { Employee } from '@/lib/types';

import {
  APPT_COLORS,
  HOUR_HEIGHT,
  STATUS_LABEL_FOR_EMPLOYEE,
  type ScheduleAppt,
  initials,
  isOffOnDay,
  isSameDay,
  p2,
  timeToMinutes,
} from './types';

function calcTop(start: string, startHour: number) {
  return Math.max(0, ((timeToMinutes(start) - startHour * 60) / 60) * HOUR_HEIGHT);
}
function calcHeight(start: string, end: string) {
  return Math.max(28, ((timeToMinutes(end) - timeToMinutes(start)) / 60) * HOUR_HEIGHT);
}

export function DayView({
  employees,
  appointmentsByEmployee,
  currentDate,
  now,
  gridStartHour,
  gridEndHour,
  onSlotClick,
  onApptClick,
}: {
  employees: Employee[];
  appointmentsByEmployee: Map<string, ScheduleAppt[]>;
  currentDate: Date;
  now: Date;
  gridStartHour: number;
  gridEndHour: number;
  onSlotClick: (employeeId: string, time: string) => void;
  onApptClick: (appt: ScheduleAppt, colorIdx: number) => void;
}) {
  const [hoverInfo, setHoverInfo] = useState<{ empId: string; top: number; label: string } | null>(null);
  const isToday = isSameDay(currentDate, now);
  const isPastDate = (() => {
    const d = new Date(currentDate);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  })();

  const hours = Array.from({ length: gridEndHour - gridStartHour + 1 }, (_, i) => gridStartHour + i);
  const nowMins = now.getHours() * 60 + now.getMinutes() - gridStartHour * 60;
  const nowTop = (nowMins / 60) * HOUR_HEIGHT;
  const showNowLine = isToday && nowMins >= 0 && now.getHours() < gridEndHour;

  const handleColumnMouseMove = (e: MouseEvent<HTMLDivElement>, empId: string) => {
    if (isPastDate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const raw = (y / HOUR_HEIGHT) * 60;
    const snapped = Math.round(raw / 15) * 15;
    const total = gridStartHour * 60 + snapped;
    if (total >= gridEndHour * 60) {
      setHoverInfo(null);
      return;
    }
    if (isToday && total <= now.getHours() * 60 + now.getMinutes()) {
      setHoverInfo(null);
      return;
    }
    const top = (snapped / 60) * HOUR_HEIGHT;
    setHoverInfo({ empId, top, label: `${p2(Math.floor(total / 60))}:${p2(total % 60)}` });
  };

  const handleColumnClick = (e: MouseEvent<HTMLDivElement>, emp: Employee) => {
    if (isPastDate || emp.status !== 'available' || isOffOnDay(emp, currentDate)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const raw = (y / HOUR_HEIGHT) * 60;
    const snapped = Math.round(raw / 15) * 15;
    const total = gridStartHour * 60 + snapped;
    if (total >= gridEndHour * 60) return;
    if (isToday && total <= now.getHours() * 60 + now.getMinutes()) return;
    onSlotClick(emp.id, `${p2(Math.floor(total / 60))}:${p2(total % 60)}`);
  };

  return (
    <div className="mx-3 mb-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:mx-6 md:mb-6">
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20 flex border-b border-gray-100 bg-gray-50/80">
          <div className="flex w-20 shrink-0 items-center justify-center border-r border-gray-100 bg-gray-50">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Time</span>
          </div>
          <div className="flex">
            {employees.length === 0 ? (
              <div className="px-8 py-4 text-sm italic text-gray-400">No staff found</div>
            ) : (
              employees.map((emp, idx) => {
                const color = APPT_COLORS[idx % APPT_COLORS.length]!;
                const offToday = isOffOnDay(emp, currentDate);
                const unavailable = emp.status !== 'available';
                return (
                  <div key={emp.id} className="flex w-[180px] shrink-0 items-center gap-3 border-r border-gray-100 bg-white px-3 py-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${offToday ? 'bg-gray-200 text-gray-500' : color.avatar}`}>
                      {initials(emp.name)}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-semibold ${unavailable || offToday ? 'text-gray-400' : 'text-gray-800'}`}>{emp.name}</p>
                      {unavailable ? (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">{STATUS_LABEL_FOR_EMPLOYEE[emp.status]}</span>
                      ) : offToday ? (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">Day off</span>
                      ) : (
                        <p className={`truncate text-xs font-medium ${color.sub}`}>{emp.speciality || emp.role?.name || '—'}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="relative flex" style={{ minHeight: hours.length * HOUR_HEIGHT }}>
          <div className="sticky left-0 z-10 flex w-20 shrink-0 flex-col border-r border-gray-100 bg-gray-50">
            {hours.map((h) => (
              <div key={h} className="flex h-16 items-start justify-center border-b border-dashed border-gray-100 pt-2">
                <span className="text-xs font-medium text-gray-500">{p2(h)}:00</span>
              </div>
            ))}
          </div>

          <div className="relative flex flex-1">
            <div className="pointer-events-none absolute inset-0 z-0 flex flex-col">
              {hours.map((h) => (
                <div key={h} className="h-16 border-b border-dashed border-gray-100" />
              ))}
            </div>

            {showNowLine && (
              <div className="pointer-events-none absolute left-0 right-0 z-20 h-0.5 bg-accent-500" style={{ top: nowTop }}>
                <div className="absolute h-2.5 w-2.5 rounded-full bg-accent-500" style={{ left: -4, top: -4 }} />
                <span className="absolute rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm" style={{ left: 12, top: -10 }}>
                  {p2(now.getHours())}:{p2(now.getMinutes())}
                </span>
              </div>
            )}

            {employees.map((emp, idx) => {
              const color = APPT_COLORS[idx % APPT_COLORS.length]!;
              const appts = appointmentsByEmployee.get(emp.id) ?? [];
              const offToday = isOffOnDay(emp, currentDate);
              const unavailable = emp.status !== 'available';
              const blocked = offToday || unavailable;

              return (
                <div
                  key={emp.id}
                  className={`relative w-[180px] shrink-0 border-r border-gray-100 ${isPastDate || blocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={(e) => handleColumnClick(e, emp)}
                  onMouseMove={(e) => !blocked && handleColumnMouseMove(e, emp.id)}
                  onMouseLeave={() => setHoverInfo(null)}
                >
                  {blocked && (
                    <div
                      className="pointer-events-none absolute inset-0 z-[6]"
                      style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(148,163,184,0.08) 8px, rgba(148,163,184,0.08) 16px)' }}
                    />
                  )}
                  {offToday && !unavailable && (
                    <div className="pointer-events-none absolute inset-0 z-[7] flex items-center justify-center">
                      <span className="rounded-full border border-gray-200 bg-gray-100/90 px-2 py-1 text-[10px] font-semibold text-gray-400 shadow-sm">Day off</span>
                    </div>
                  )}
                  {(isPastDate || (isToday && nowTop > 0)) && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] bg-gray-100/50" style={{ height: isPastDate ? '100%' : nowTop }} />
                  )}
                  {hoverInfo?.empId === emp.id && (
                    <div className="pointer-events-none absolute left-0 right-0 z-[15]" style={{ top: hoverInfo.top }}>
                      <div className="absolute left-0 right-0 h-0.5 bg-accent-400" />
                      <div className="absolute h-2 w-2 rounded-full bg-accent-500" style={{ left: -1, top: -3 }} />
                      <span className="absolute rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm" style={{ left: 10, top: -10 }}>
                        {hoverInfo.label}
                      </span>
                    </div>
                  )}

                  {appts.map((appt) => {
                    const top = calcTop(appt.startTime, gridStartHour);
                    const height = calcHeight(appt.startTime, appt.endTime);
                    const faded = appt.status === 'completed' || appt.status === 'cancelled';
                    return (
                      <div
                        key={appt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApptClick(appt, idx);
                        }}
                        className={`absolute left-1 right-1 z-10 cursor-pointer overflow-hidden rounded-lg border p-2 shadow-sm transition-all hover:z-30 hover:shadow-md ${color.bg} ${color.border} ${color.text} ${faded ? 'opacity-60' : ''}`}
                        style={{ top, height: Math.max(height, 28) }}
                      >
                        <p className="truncate text-xs font-semibold leading-tight">{appt.serviceLabel}</p>
                        {height >= 44 && (
                          <p className={`mt-0.5 text-[10px] leading-tight ${color.sub}`}>
                            {appt.startTime} – {appt.endTime}
                          </p>
                        )}
                        {height >= 60 && (
                          <div className="mt-1.5 flex items-center gap-1">
                            <div className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${color.avatar}`}>{appt.clientName[0]}</div>
                            <span className={`truncate text-[10px] font-medium ${color.sub}`}>{appt.clientName}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {employees.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-gray-400">No staff to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
