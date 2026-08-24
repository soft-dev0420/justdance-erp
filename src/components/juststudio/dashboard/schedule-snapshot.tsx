'use client';

import Image from 'next/image';
import Link from 'next/link';

import { glass, initials, p2, SNAP_COLORS } from './dashboard-types';
import type { SnapStaffRow } from './dashboard-types';

interface Props {
  snapStaff: SnapStaffRow[];
  showNow: boolean;
  nowPct: number;
  now: Date;
}

export function ScheduleSnapshot({ snapStaff, showNow, nowPct, now }: Props) {
  return (
    <section className="rounded-2xl p-6 shadow-sm" style={glass}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Schedule snapshot</h2>
        <Link href="/juststudio/schedule" className="text-sm font-medium text-accent-600 hover:text-accent-700">
          View full schedule
        </Link>
      </div>

      <div className="relative overflow-x-auto pb-2">
        {/* Timeline header */}
        <div className="relative mb-4 flex min-w-[600px] border-b border-slate-200 pb-2">
          {showNow && (
            <div
              className="absolute top-0 bottom-[-200px] z-10 w-px bg-accent-500"
              style={{ left: `calc(80px + ${nowPct}% * (100% - 80px) / 100)` }}
            >
              <div className="absolute -top-1 -left-[3px] h-2 w-2 rounded-full bg-accent-500" />
              <span className="absolute -top-6 left-1 rounded bg-accent-50 px-1 text-[10px] font-bold whitespace-nowrap text-accent-600">
                {`${p2(now.getHours())}:${p2(now.getMinutes())} (now)`}
              </span>
            </div>
          )}
          <div className="w-20 shrink-0" />
          <div className="grid flex-1 grid-cols-4 text-center text-xs font-medium text-slate-400">
            <div>09:00 AM</div>
            <div>10:00 AM</div>
            <div>11:00 AM</div>
            <div>12:00 PM</div>
          </div>
        </div>

        {/* Staff rows */}
        <div className="min-w-[600px] space-y-4">
          {snapStaff.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400 italic">No staff data for today.</p>
          ) : (
            snapStaff.map(({ emp, appts }, si) => (
              <div key={emp.id} className="flex items-center gap-4">
                <div className="flex w-20 shrink-0 items-center gap-2">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {!emp.avatar && initials(emp.name)}
                    {emp.avatar && <Image src={emp.avatar} alt={`${emp.name}-profile`} fill className="object-cover" />}
                  </div>
                  <span className="truncate text-xs font-medium text-slate-700">{emp.name.split(' ')[0]}</span>
                </div>
                <div className="relative h-10 flex-1 rounded-lg border border-slate-100 bg-slate-50">
                  {appts.map((appt, ai) => {
                    const c = SNAP_COLORS[(si + ai) % SNAP_COLORS.length];
                    return (
                      <div
                        key={appt.id}
                        className={`absolute top-1 bottom-1 overflow-hidden rounded-md border p-1 ${c.bg}`}
                        style={{ left: `${appt.left}%`, width: `${appt.width}%` }}
                      >
                        <div className={`truncate text-[10px] font-semibold ${c.text}`}>{appt.service}</div>
                        <div className={`truncate text-[9px] ${c.sub}`}>Client: {appt.clientName}</div>
                      </div>
                    );
                  })}
                  {appts.length === 0 && (
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-[10px] text-slate-300 italic">No appointments in this window</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
