'use client';

import { Search } from 'lucide-react';

export function TeamFilters({
  roleCounts,
  total,
  activeRole,
  setActiveRole,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: {
  roleCounts: Record<string, number>;
  total: number;
  activeRole: string;
  setActiveRole: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  const roleNames = Object.keys(roleCounts);

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm shadow-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveRole('All')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeRole === 'All' ? 'bg-gray-900 text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800'
            }`}
          >
            All roles {total > 0 && <span className="ml-1.5 text-xs opacity-60">({total})</span>}
          </button>
          {roleNames.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeRole === role ? 'bg-gray-900 text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {role} <span className="ml-1.5 text-xs opacity-60">({roleCounts[role]})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none transition-colors focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
          >
            <option value="name">Name</option>
            <option value="role">Role</option>
            <option value="status">Availability</option>
          </select>
        </div>
      </div>
    </div>
  );
}
