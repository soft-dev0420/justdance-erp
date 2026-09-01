'use client';

import { Check, Clock, Tag } from 'lucide-react';

import type { Category } from '@/lib/types';

export function ServicePicker({
  categories,
  selectedIds,
  onToggle,
  currency,
}: {
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  currency: string;
}) {
  const services = categories.flatMap((cat) => cat.services.map((s) => ({ ...s, categoryName: cat.category })));

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-sm text-gray-400">
        No services set up yet.
      </div>
    );
  }

  const grouped = services.reduce<Record<string, typeof services>>((acc, s) => {
    (acc[s.categoryName] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex max-h-64 flex-col gap-4 overflow-y-auto pr-1">
      {Object.entries(grouped).map(([cat, svcs]) => (
        <div key={cat} className="flex flex-col gap-1.5">
          <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{cat}</p>
          <div className="flex flex-col gap-1">
            {svcs.map((s) => {
              const selected = selectedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onToggle(s.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                    selected ? 'border-accent-300 bg-accent-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      selected ? 'border-accent-600 bg-accent-600' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                  <span className={`flex-1 truncate text-sm font-medium ${selected ? 'text-accent-900' : 'text-gray-700'}`}>{s.name}</span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      <Clock className="h-2.5 w-2.5" />
                      {s.price?.hours ?? '0'}h {s.price?.minutes ?? '0'}m
                    </span>
                    <span className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      <Tag className="h-2.5 w-2.5" />
                      {currency} {Number(s.price?.price ?? 0).toFixed(0)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
