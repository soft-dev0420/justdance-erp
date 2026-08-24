'use client';

import { glass } from './dashboard-types';

interface Props {
  isLoading: boolean;
  data: { newClients: number; returning: number; highValue: number };
}

export function ClientInsights({ isLoading, data }: Props) {
  const items = [
    { label: 'New clients', sub: 'Today', value: data.newClients, iconBg: 'bg-blue-100', iconClr: 'text-blue-600', icon: 'plus' as const },
    { label: 'Returning', sub: 'Today', value: data.returning, iconBg: 'bg-accent-100', iconClr: 'text-accent-600', icon: 'return' as const },
    { label: 'High value', sub: 'Today', value: data.highValue, iconBg: 'bg-amber-100', iconClr: 'text-amber-600', icon: 'star' as const },
  ];

  return (
    <section className="rounded-2xl p-6 shadow-sm" style={glass}>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Client insights</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg} ${item.iconClr}`}>
                {item.icon === 'plus' && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                )}
                {item.icon === 'return' && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                {item.icon === 'star' && (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500">{item.sub}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-slate-800">{isLoading ? '—' : item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
