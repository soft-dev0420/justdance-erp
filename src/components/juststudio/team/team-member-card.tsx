'use client';

import { Crown } from 'lucide-react';

import type { Employee } from '@/lib/types';

import { getInitials, STATUS_BADGE_CLASS, STATUS_DOT_CLASS, STATUS_LABELS } from './types';

export function TeamMemberCard({
  member,
  isSelected,
  onSelect,
}: {
  member: Employee;
  isSelected: boolean;
  onSelect: (member: Employee) => void;
}) {
  return (
    <div
      onClick={() => onSelect(member)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        isSelected ? 'border-accent-400 shadow-accent-100/60' : 'border-gray-100 hover:border-accent-200'
      }`}
    >
      <div className="pointer-events-none absolute top-0 right-0 -z-0 h-28 w-28 rounded-bl-full bg-accent-500/5 transition-transform duration-500 group-hover:scale-125" />

      <div className="mb-4 flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">{getInitials(member.name)}</div>
          <div className={`absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white ${STATUS_DOT_CLASS[member.status]}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`truncate text-sm leading-tight font-semibold ${isSelected ? 'text-accent-700' : 'text-gray-900 group-hover:text-accent-600'}`}>
            {member.name}
            {member.isOwner && <Crown size={13} className="ml-1.5 inline-block flex-shrink-0 text-accent-500" />}
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">{member.role?.name ?? 'No role assigned'}</p>
        </div>
      </div>

      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[member.status]}`}>
          <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${STATUS_DOT_CLASS[member.status]}`} />
          {STATUS_LABELS[member.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-3">
        <div>
          <p className="mb-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">Speciality</p>
          <p className="truncate text-xs font-semibold text-gray-700">{member.speciality || '—'}</p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] font-medium tracking-wider text-gray-400 uppercase">Email</p>
          <p className="truncate text-xs font-medium text-gray-600">{member.email || '—'}</p>
        </div>
      </div>
    </div>
  );
}
