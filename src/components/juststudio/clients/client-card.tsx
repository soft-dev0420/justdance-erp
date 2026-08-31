'use client';

import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';

import type { StudioClient } from '@/lib/types';

import { getInitials, STATUS_BADGE_CLASS, STATUS_LABELS } from './types';

export function ClientCard({
  client,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  client: StudioClient;
  isSelected: boolean;
  onSelect: (client: StudioClient) => void;
  onEdit: (client: StudioClient) => void;
  onDelete: (client: StudioClient) => void;
}) {
  const name = client.client.user.name;
  const badgeClass = STATUS_BADGE_CLASS[client.status];

  return (
    <div
      onClick={() => onSelect(client)}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all ${
        isSelected ? 'border-accent-400 shadow-md ring-1 ring-accent-500' : 'border-gray-200 shadow-sm hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {isSelected && <div className="absolute top-0 left-0 h-full w-1 rounded-l-xl bg-accent-500" />}

      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3 pl-1">
          <div className="flex h-11 w-11 flex-shrink-0 select-none items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-600">
            {getInitials(name)}
          </div>
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">
              {name}
              {client.client.hasInjury && <AlertTriangle size={13} className="flex-shrink-0 text-amber-500" />}
              {badgeClass && (
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${badgeClass}`}>
                  {STATUS_LABELS[client.status] ?? client.status}
                </span>
              )}
            </h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="max-w-[200px] truncate">{client.client.user.email}</span>
              {client.instructor && (
                <>
                  <span className="inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-300" />
                  <span>{client.instructor.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-3 flex flex-shrink-0 -translate-y-1/2 items-center gap-1.5 bg-white/95 py-1.5 pl-3 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(client);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-accent-50 hover:text-accent-600"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(client);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
