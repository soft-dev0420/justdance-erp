import { Lock, Plus, Search } from 'lucide-react';

import type { Role } from '@/lib/types';

export function RoleList({
  roles,
  selectedId,
  search,
  isLoading,
  onSelectRole,
  onSearchChange,
  onCreateRole,
}: {
  roles: Role[];
  selectedId: string;
  search: string;
  isLoading?: boolean;
  onSelectRole: (id: string) => void;
  onSearchChange: (q: string) => void;
  onCreateRole: () => void;
}) {
  return (
    <div className="flex h-full w-full shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="border-b border-gray-100 p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles…"
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-10 text-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
          />
          <button onClick={onCreateRole} className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded bg-accent-500 text-white transition-colors hover:bg-accent-600">
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4">
              <div className="mb-2 h-3.5 w-1/2 rounded bg-gray-100" />
              <div className="h-3 w-3/4 rounded bg-gray-50" />
            </div>
          ))
        ) : roles.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">No roles found</p>
        ) : (
          roles.map((role) => {
            const locked = role.name === 'owner';
            const isSelected = role.id === selectedId;
            return (
              <div
                key={role.id}
                onClick={() => !locked && onSelectRole(role.id)}
                className={`relative flex items-center justify-between overflow-hidden rounded-xl border p-4 transition-all ${
                  locked
                    ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-80'
                    : isSelected
                      ? 'cursor-pointer border-accent-500 bg-accent-50 shadow-[0_0_15px_rgba(110,59,255,0.1)]'
                      : 'cursor-pointer border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {isSelected && !locked && <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent-500" />}
                <div className={isSelected && !locked ? 'pl-2' : ''}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold capitalize ${isSelected && !locked ? 'text-accent-700' : 'text-gray-900'}`}>
                    {role.name}
                    {locked && <Lock size={13} className="text-gray-400" />}
                  </h3>
                  <p className={`mt-1 text-xs ${isSelected && !locked ? 'text-accent-600' : 'text-gray-500'}`}>{role.description}</p>
                </div>
                <span className={`whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${isSelected && !locked ? 'bg-accent-500 text-white shadow-sm' : 'border border-gray-100 bg-gray-50 text-gray-500'}`}>
                  {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
