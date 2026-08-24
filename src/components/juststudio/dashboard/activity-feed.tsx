'use client';

import type { CSSProperties } from 'react';

import type { ActivityItem } from './dashboard-types';

function ActivityIcon({ type }: { type: string }) {
  if (type === 'booking')
    return (
      <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-accent-100 shadow-sm">
        <svg className="h-2.5 w-2.5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  if (type === 'cancel')
    return (
      <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-rose-100 shadow-sm">
        <svg className="h-2.5 w-2.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  if (type === 'stock' || type === 'inventory')
    return (
      <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-blue-100 shadow-sm">
        <svg className="h-2.5 w-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
    );
  return (
    <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow-sm">
      <svg className="h-2.5 w-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    </div>
  );
}

interface Props {
  items: ActivityItem[];
  style?: CSSProperties;
}

export function ActivityFeed({ items, style }: Props) {
  return (
    <section className="flex flex-col rounded-2xl p-6 shadow-sm" style={{ ...style, height: 450 }}>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Activity feed</h2>
      <div className="relative flex-1 overflow-y-auto pr-1">
        <div className="absolute top-2 bottom-2 left-3 w-px bg-slate-200" />
        <div className="relative z-10 space-y-6">
          {items.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400 italic">Nothing yet today.</p>
          ) : (
            items.map((item, i) => (
              <div key={i} className="relative flex gap-4">
                <ActivityIcon type={item.icon} />
                <div>
                  <p className="text-sm text-slate-800">{item.text}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
