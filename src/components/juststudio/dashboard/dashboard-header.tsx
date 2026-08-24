'use client';

import Link from 'next/link';

import { glass } from './dashboard-types';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8 md:py-5" style={glass}>
      <div>
        <h1 className="text-xl font-bold text-slate-800 md:text-2xl">Overview</h1>
        <p className="mt-0.5 text-xs text-slate-500 md:text-sm">Here&apos;s what&apos;s happening in your studio today.</p>
      </div>

      <Link
        href="/juststudio/schedule"
        className="flex items-center gap-2 rounded-lg bg-accent-600 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-accent-700 md:px-4"
        style={{ boxShadow: '0 4px 12px rgba(110,59,255,0.25)' }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden sm:inline">Quick booking</span>
        <span className="sm:hidden">Book</span>
      </Link>
    </header>
  );
}
