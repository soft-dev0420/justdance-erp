'use client';

import type { Employee } from '@/lib/types';

import { getDayAvailability, initials } from './types';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AVATAR_COLORS = [
  'bg-blue-200 text-blue-800',
  'bg-purple-200 text-purple-800',
  'bg-emerald-200 text-emerald-800',
  'bg-orange-200 text-orange-800',
  'bg-pink-200 text-pink-800',
  'bg-cyan-200 text-cyan-800',
];

export function StaffView({ employees, weekStart }: { employees: Employee[]; weekStart: Date }) {
  const now = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  if (employees.length === 0) {
    return (
      <div className="mx-3 mb-3 flex flex-1 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm md:mx-6 md:mb-6">
        <p className="text-sm text-gray-400">No staff found</p>
      </div>
    );
  }

  return (
    <div className="mx-3 mb-3 overflow-auto rounded-2xl border border-gray-100 bg-white shadow-sm md:mx-6 md:mb-6">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 z-10">
          <tr>
            <th className="sticky left-0 z-20 min-w-[190px] border-b border-r border-gray-100 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-500">Employee</th>
            {weekDays.map((d, i) => {
              const isToday = d.toDateString() === now.toDateString();
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const cls = isToday ? 'bg-accent-500 text-white' : isWeekend ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-700';
              return (
                <th key={i} colSpan={2} className={`min-w-[112px] border-b border-r border-gray-100 px-3 py-2.5 text-center font-semibold ${cls}`}>
                  <div className="text-[11px] font-medium uppercase tracking-wide">{DAY_LABELS[i]}</div>
                  <div className="text-sm font-bold">
                    {d.getDate()} {d.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </th>
              );
            })}
          </tr>
          <tr>
            <th className="sticky left-0 z-20 border-b border-r border-gray-100 bg-gray-50 px-4 py-1.5 text-left text-[11px] font-medium text-gray-400">{weekStart.getFullYear()}</th>
            {weekDays.map((d, i) => {
              const isToday = d.toDateString() === now.toDateString();
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const cls = isToday ? 'bg-accent-400 text-accent-50' : isWeekend ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 text-gray-400';
              return [
                <th key={`${i}-from`} className={`border-b border-r border-gray-100 px-3 py-1.5 text-center text-[11px] font-medium ${cls}`}>
                  From
                </th>,
                <th key={`${i}-to`} className={`border-b border-r border-gray-100 px-3 py-1.5 text-center text-[11px] font-medium ${cls}`}>
                  To
                </th>,
              ];
            })}
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, empIdx) => (
            <tr key={emp.id} className="group transition-colors hover:bg-gray-50/60">
              <td className="sticky left-0 z-10 border-b border-r border-gray-100 bg-white px-3 py-2.5 transition-colors group-hover:bg-gray-50/60">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${AVATAR_COLORS[empIdx % AVATAR_COLORS.length]}`}>{initials(emp.name)}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{emp.name}</p>
                    <p className="truncate text-[10px] text-gray-400">{emp.speciality || emp.role?.name || '—'}</p>
                  </div>
                </div>
              </td>

              {weekDays.map((d, i) => {
                const avail = getDayAvailability(emp, d);
                const isToday = d.toDateString() === now.toDateString();
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                if (!avail || avail.open === false) {
                  const offCls = isToday ? 'bg-accent-50' : isWeekend ? 'bg-gray-50' : 'bg-white';
                  return (
                    <td key={i} colSpan={2} className={`border-b border-r border-gray-100 px-3 py-2.5 text-center text-[11px] font-medium text-gray-300 ${offCls}`}>
                      Day off
                    </td>
                  );
                }

                const fromCls = isToday ? 'bg-accent-50 text-accent-700' : isWeekend ? 'bg-gray-50 text-gray-600' : 'bg-white text-gray-700';
                return [
                  <td key={`${i}-from`} className={`border-b border-r border-gray-100 px-3 py-2.5 text-center text-xs font-semibold tabular-nums ${fromCls}`}>
                    {avail.from ?? '—'}
                  </td>,
                  <td key={`${i}-to`} className={`border-b border-r border-gray-100 px-3 py-2.5 text-center text-xs font-semibold tabular-nums ${fromCls}`}>
                    {avail.to ?? '—'}
                  </td>,
                ];
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
