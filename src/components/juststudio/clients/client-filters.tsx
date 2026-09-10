'use client';

import { ArrowUpDown, Check, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useLanguage } from '@/lib/i18n';

import { clientStatusLabel, CLIENT_STATUSES } from './types';

export function ClientFilters({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}) {
  const { t } = useLanguage();
  const FILTERS = [{ label: t.statusAllClients, value: 'all' }, ...CLIENT_STATUSES.map((value) => ({ label: clientStatusLabel(value, t), value }))];
  const SORT_OPTIONS = [
    { label: t.sortNewestFirst, value: 'newest' },
    { label: t.sortOldestFirst, value: 'oldest' },
    { label: t.sortNameAZ, value: 'name-asc' },
    { label: t.sortNameZA, value: 'name-desc' },
    { label: t.sortMostVisits, value: 'visits' },
  ];
  const [sortOpen, setSortOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const hasClear = statusFilter !== 'all' || searchQuery !== '';
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? t.sortDefaultLabel;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchByNameOrEmail}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm shadow-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-0.5">
          {FILTERS.map((f) => {
            const isActive = statusFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {hasClear && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
            >
              {t.clear}
            </button>
          )}

          <div ref={dropRef} className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors ${
                sortBy !== 'newest' ? 'border-accent-200 bg-accent-50 text-accent-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ArrowUpDown size={13} />
              {sortLabel}
            </button>

            {sortOpen && (
              <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      setSortBy(o.value);
                      setSortOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                      sortBy === o.value ? 'bg-accent-50 font-medium text-accent-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {o.label}
                    {sortBy === o.value && <Check size={14} className="text-accent-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
