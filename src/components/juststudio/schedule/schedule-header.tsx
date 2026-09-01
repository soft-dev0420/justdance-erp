'use client';

import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';

import type { ScheduleView } from './types';

function fmtFull(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function fmtWeekRange(ws: Date) {
  const we = new Date(ws);
  we.setDate(ws.getDate() + 6);
  return `${ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${we.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}
function fmtMonth(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const VIEWS: { key: ScheduleView; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'staff', label: 'Staff' },
];

export function ScheduleHeader({
  view,
  onViewChange,
  currentDate,
  weekStart,
  onNavigate,
  onToday,
  search,
  onSearchChange,
  onNewBooking,
  kpis,
  specialities,
  activeFilter,
  onFilterChange,
  employeeCount,
}: {
  view: ScheduleView;
  onViewChange: (v: ScheduleView) => void;
  currentDate: Date;
  weekStart: Date;
  onNavigate: (dir: 'prev' | 'next') => void;
  onToday: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  onNewBooking: () => void;
  kpis: { label: string; total: number; confirmed: number; staff: number; pending: number; cancelled: number };
  specialities: string[];
  activeFilter: string;
  onFilterChange: (v: string) => void;
  employeeCount: number;
}) {
  const isToday = currentDate.toDateString() === new Date().toDateString();
  const title = view === 'week' || view === 'staff' ? fmtWeekRange(weekStart) : view === 'month' ? fmtMonth(currentDate) : isToday ? "Today's schedule" : fmtFull(currentDate);

  return (
    <div className="px-4 pt-4 md:px-6 md:pt-6">
      <div className="mb-3 flex flex-col gap-2 lg:mb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex items-center justify-between gap-2 lg:block">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-3xl">{title}</h1>
            {view === 'day' && isToday && <p className="mt-0.5 hidden text-xs text-gray-500 md:block md:text-sm">{fmtFull(currentDate)}</p>}
          </div>
          <button onClick={onNewBooking} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white shadow-md shadow-accent-500/30 transition-all hover:bg-accent-600 lg:hidden">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <button onClick={() => onNavigate('prev')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onToday}
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium shadow-sm transition-all ${
              isToday ? 'border-accent-500 bg-accent-500 text-white shadow-md shadow-accent-500/25' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button onClick={() => onNavigate('next')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50">
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-1">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => onViewChange(v.key)}
                className={`rounded-md px-2 py-1.5 text-xs transition-colors md:px-3 md:text-sm ${
                  view === v.key ? 'border border-gray-200 bg-white font-medium text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search staff…"
              className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
            />
          </div>

          <button onClick={onNewBooking} className="hidden h-9 items-center gap-2 rounded-lg bg-accent-500 px-5 text-sm font-medium text-white shadow-md shadow-accent-500/30 transition-all hover:bg-accent-600 lg:flex">
            <Plus className="h-4 w-4" />
            New booking
          </button>
        </div>
      </div>

      <div className="mb-4 hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="mb-2 text-sm font-medium text-gray-500">Total appointments</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">{kpis.total}</h3>
            <span className="rounded-md bg-accent-100 px-2 py-1 text-xs font-medium text-accent-700">{kpis.label}</span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="mb-2 text-sm font-medium text-gray-500">Confirmed</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">{kpis.confirmed}</h3>
            <span className="rounded-md bg-accent-100 px-2 py-1 text-xs font-medium text-accent-700">On track</span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="mb-2 text-sm font-medium text-gray-500">Active staff</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">{kpis.staff}</h3>
            <span className="rounded-md bg-accent-100 px-2 py-1 text-xs font-medium text-accent-700">Working</span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="mb-2 text-sm font-medium text-gray-500">Pending</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">{kpis.pending}</h3>
            <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">{kpis.label}</span>
          </div>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50/50 p-5 shadow-sm backdrop-blur-sm">
          <p className="mb-2 text-sm font-medium text-gray-500">Cancellations</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">{kpis.cancelled}</h3>
            <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">{kpis.label}</span>
          </div>
        </div>
      </div>

      <div className="hidden flex-wrap items-center gap-3 pb-4 md:flex">
        {['All', ...specialities].map((role) => {
          const count = role === 'All' ? employeeCount : undefined;
          const active = activeFilter === role;
          return (
            <button
              key={role}
              onClick={() => onFilterChange(role)}
              className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors ${
                active ? 'border-gray-300 font-semibold text-gray-700' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${active ? 'bg-accent-500' : 'bg-gray-300'}`} />
              {role}
              {count !== undefined && ` (${count})`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
