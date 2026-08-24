'use client';

import Image from 'next/image';
import Link from 'next/link';

import { glass, initials, RANK_COLORS } from './dashboard-types';
import type { Employee } from './dashboard-types';

interface Props {
  topPerformers: { emp: Employee; count: number; value: number }[];
  currency: string;
}

export function TopPerformers({ topPerformers, currency }: Props) {
  return (
    <section className="rounded-2xl p-6 shadow-sm" style={glass}>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Top performers</h2>
      <div className="space-y-4">
        {topPerformers.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400 italic">No data yet.</p>
        ) : (
          topPerformers.map(({ emp, count, value }, i) => (
            <div key={emp.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                    {!emp.avatar && initials(emp.name)}
                    {emp.avatar && <Image src={emp.avatar} alt={`${emp.name}-profile`} fill className="object-cover" />}
                  </div>
                  <div
                    className={`absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold ${
                      RANK_COLORS[i] ?? 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                  <p className="text-xs text-slate-500">
                    {count} {count !== 1 ? 'appts' : 'appt'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">
                  {currency} {value.toLocaleString()}
                </p>
                <p className="text-[10px] text-accent-600">revenue</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Link
        href="/juststudio/team"
        className="mt-5 block w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        View all staff
      </Link>
    </section>
  );
}
