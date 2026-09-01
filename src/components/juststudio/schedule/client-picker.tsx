'use client';

import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { StudioClient } from '@/lib/types';

import { initials } from './types';

export function ClientPicker({
  clients,
  selectedId,
  onSelect,
}: {
  clients: StudioClient[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState('');

  const selected = clients.find((c) => c.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter((c) => c.client.user.name.toLowerCase().includes(q) || c.client.user.email.toLowerCase().includes(q));
  }, [clients, search]);

  if (selected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 shadow-sm">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-200 text-xs font-bold text-accent-800">
          {initials(selected.client.user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-accent-900">{selected.client.user.name}</p>
          <p className="truncate text-xs text-accent-700">{selected.client.user.email}</p>
        </div>
        <button type="button" onClick={() => onSelect('')} className="shrink-0 text-accent-600 hover:text-accent-800">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search clients by name or email…"
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-all focus:border-accent-500 focus:bg-white focus:ring-1 focus:ring-accent-500"
      />
      {clients.length === 0 ? (
        <p className="mt-2 text-xs text-gray-400">No clients yet — add one from the Clients page first.</p>
      ) : (
        <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm italic text-gray-400">No matching clients</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelect(c.id);
                  setSearch('');
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent-50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                  {initials(c.client.user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{c.client.user.name}</p>
                  <p className="truncate text-xs text-gray-400">{c.client.user.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
