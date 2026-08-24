'use client';

import { glass } from './dashboard-types';

function DotsMenu() {
  return (
    <button className="text-slate-400 hover:text-slate-600">
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    </button>
  );
}

function UpArrow() {
  return (
    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

interface Props {
  isLoading: boolean;
  bookingCount: number;
  activeClients: number;
  revenue: number;
  utilPct: number;
  totalSlots: number;
  currency: string;
}

export function KpiCards({ isLoading, bookingCount, activeClients, revenue, utilPct, totalSlots, currency }: Props) {
  const dash = isLoading ? '—' : null;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Today's bookings */}
      <div className="rounded-2xl p-5 transition-all hover:shadow-lg" style={glass}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-sm font-medium text-slate-500">Today&apos;s bookings</h3>
          <DotsMenu />
        </div>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-800">{dash ?? bookingCount}</span>
          <span className="flex items-center gap-1 rounded-md border border-accent-100 bg-accent-50 px-2 py-1 text-xs font-medium text-accent-700">
            <UpArrow /> +12%
          </span>
        </div>
      </div>

      {/* Revenue */}
      <div className="rounded-2xl p-5 transition-all hover:shadow-lg" style={glass}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-sm font-medium text-slate-500">Revenue today</h3>
          <DotsMenu />
        </div>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-800">
            {currency} {revenue}
          </span>
          <span className="flex items-center gap-1 rounded-md border border-accent-100 bg-accent-50 px-2 py-1 text-xs font-medium text-accent-700">
            <UpArrow /> +8.4%
          </span>
        </div>
      </div>

      {/* Active clients */}
      <div className="rounded-2xl p-5 transition-all hover:shadow-lg" style={glass}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-sm font-medium text-slate-500">Active clients</h3>
          <DotsMenu />
        </div>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-800">{dash ?? activeClients}</span>
          <span className="flex items-center gap-1 rounded-md border border-accent-100 bg-accent-50 px-2 py-1 text-xs font-medium text-accent-700">
            <UpArrow /> +3%
          </span>
        </div>
      </div>

      {/* Utilization */}
      <div className="rounded-2xl p-5 transition-all hover:shadow-lg" style={glass}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-sm font-medium text-slate-500">Utilization</h3>
          <DotsMenu />
        </div>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-800">{dash ?? `${utilPct.toFixed(2)}%`}</span>
          <span className="flex items-center gap-1 rounded-md border border-rose-100 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-500">
            <DownArrow /> -2%
          </span>
        </div>
      </div>

      {/* Available slots */}
      <div className="relative overflow-hidden rounded-2xl p-5 transition-all hover:shadow-lg" style={glass}>
        <div className="pointer-events-none absolute -right-4 -bottom-4 h-24 w-24 rounded-tl-full bg-accent-100 opacity-50" />
        <div className="relative z-10 mb-4 flex items-start justify-between">
          <h3 className="text-sm font-medium text-slate-500">Available slots</h3>
          <DotsMenu />
        </div>
        <div className="relative z-10 flex items-end justify-between">
          <span className="text-3xl font-bold text-slate-800">{dash ?? totalSlots}</span>
          <span className="text-xs font-medium text-slate-500">Today</span>
        </div>
      </div>
    </section>
  );
}
