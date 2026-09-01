'use client';

import { Check, Loader2, Search, UserPen, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Employee } from '@/lib/types';

import { initials } from './types';

export function ReassignModal({
  employees,
  currentEmployeeId,
  service,
  onClose,
  onConfirm,
}: {
  employees: Employee[];
  currentEmployeeId: string | null;
  service: string;
  onClose: () => void;
  onConfirm: (newEmployeeId: string) => Promise<void>;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');
  const [confirming, setConfirming] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return employees;
    return employees.filter((e) => e.name.toLowerCase().includes(q) || (e.speciality ?? '').toLowerCase().includes(q));
  }, [employees, search]);

  const handleConfirm = async () => {
    if (!selected) return;
    setConfirming(true);
    try {
      await onConfirm(selected);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
              <UserPen size={16} className="text-violet-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Reassign</h2>
              <p className="mt-0.5 text-xs text-gray-500">{service}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-200">
            <XIcon size={15} />
          </button>
        </div>

        <div className="shrink-0 px-5 pb-3 pt-4">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-900 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-400/40"
            />
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-5 pb-4">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">{search ? 'No matching staff' : 'No staff found'}</div>
          ) : (
            filtered.map((emp) => {
              const isCurrent = emp.id === currentEmployeeId;
              const isSelected = selected === emp.id;
              return (
                <button
                  key={emp.id}
                  disabled={isCurrent}
                  onClick={() => !isCurrent && setSelected(emp.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    isCurrent
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60'
                      : isSelected
                        ? 'border-violet-300 bg-violet-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/40'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-violet-100 text-xs font-bold text-violet-700 shadow-sm">
                    {initials(emp.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{emp.name}</p>
                    <p className="truncate text-xs text-gray-500">{emp.role?.name ?? (emp.speciality || '—')}</p>
                  </div>
                  {isCurrent && <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Current</span>}
                  {isSelected && !isCurrent && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => void handleConfirm()}
            disabled={!selected || confirming}
            className="flex max-w-[220px] flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            {confirming && <Loader2 size={14} className="animate-spin" />}
            {confirming ? 'Reassigning…' : 'Confirm reassign'}
          </button>
        </div>
      </div>
    </div>
  );
}
