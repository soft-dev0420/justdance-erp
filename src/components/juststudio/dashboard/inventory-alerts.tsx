'use client';

import Link from 'next/link';

import { glass } from './dashboard-types';

interface InventoryAlert {
  name: string;
  type: string;
  amount: number;
}

interface Props {
  items: InventoryAlert[];
}

export function InventoryAlerts({ items }: Props) {
  const actionCount = items.length;

  return (
    <section className="rounded-2xl p-6 shadow-sm" style={glass}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Inventory alerts</h2>
        {actionCount > 0 && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">
            {actionCount} {actionCount !== 1 ? 'actions' : 'action'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">All stock levels are healthy.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOut = item.type === 'no-stock';
            return (
              <div key={i} className={`rounded-xl border p-3 ${isOut ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {isOut ? (
                      <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    )}
                    <span className="text-sm font-medium text-slate-800">{item.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${isOut ? 'text-rose-600' : 'text-amber-600'}`}>
                    {isOut ? 'Out of stock' : `Low stock (${Math.round(item.amount)}%)`}
                  </span>
                </div>
                <Link
                  href="/juststudio/inventory"
                  className={`mt-1 block w-full rounded-lg py-1.5 text-center text-xs font-medium transition-colors ${
                    isOut ? 'bg-accent-600 text-white shadow-sm hover:bg-accent-700' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isOut ? 'Restock now' : 'Restock'}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
