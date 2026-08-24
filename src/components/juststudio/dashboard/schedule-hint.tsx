'use client';

import { ArrowRight, CalendarDays, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/context/auth-context';

const storageKey = (userId: string) => `juststudio_schedule_hint_dismissed_${userId}`;

export function ScheduleHint() {
  const { user } = useAuth();
  const [sessionClosed, setSessionClosed] = useState(false);

  const foreverDismissed = user?.id ? !!localStorage.getItem(storageKey(user.id)) : true;
  if (sessionClosed || foreverDismissed) return null;

  const close = () => setSessionClosed(true);
  const dismissForever = () => {
    if (user?.id) localStorage.setItem(storageKey(user.id), '1');
    setSessionClosed(true);
  };

  const body = (
    <>
      {/* Header stripe */}
      <div className="flex items-center justify-between gap-2.5 rounded-t-xl bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="shrink-0 text-white" />
          <p className="text-sm font-semibold tracking-tight text-white">Appointment management</p>
        </div>
        <button onClick={close} className="shrink-0 cursor-pointer text-accent-200 transition-colors hover:text-white" aria-label="Close">
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed text-slate-600">
          Before you get started, check out the <span className="font-semibold text-slate-800">Schedule</span> tab to manage bookings and
          staff availability.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4">
        <button onClick={dismissForever} className="cursor-pointer text-xs text-slate-400 transition-colors hover:text-slate-600">
          Don&apos;t show again
        </button>
        <Link
          href="/juststudio/schedule"
          onClick={close}
          className="flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-500"
        >
          Open schedule
          <ArrowRight size={12} />
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: arrow pointing to sidebar Schedule item */}
      <div className="fixed z-50 hidden animate-in fade-in slide-in-from-left-2 duration-300 md:block" style={{ top: 262, left: 296 }}>
        <div
          className="absolute top-[22px] -left-[11px]"
          style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderRight: '11px solid #e2e8f0' }}
        />
        <div
          className="absolute top-[23px] -left-[10px]"
          style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid #ffffff' }}
        />
        <div className="w-[300px] rounded-xl border border-slate-200 bg-white shadow-2xl">{body}</div>
      </div>

      {/* Mobile: card floating above the bottom nav */}
      <div className="fixed inset-x-3 bottom-16 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-xl border border-slate-200 bg-white shadow-2xl md:hidden">
        {body}
      </div>
    </>
  );
}
