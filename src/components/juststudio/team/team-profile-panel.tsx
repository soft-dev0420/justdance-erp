'use client';

import { Crown, Pencil, UserSquare2, X } from 'lucide-react';

import type { Employee } from '@/lib/types';

import { formatDate, getInitials, STATUS_BADGE_CLASS, STATUS_LABELS } from './types';

export function TeamProfilePanel({
  member,
  onClose,
  onEdit,
}: {
  member: Employee | null;
  onClose: () => void;
  onEdit: (member: Employee) => void;
}) {
  if (!member) {
    return (
      <div className="hidden w-[400px] flex-shrink-0 flex-col items-center justify-center border-l border-gray-100 bg-white p-10 text-center lg:flex">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <UserSquare2 size={26} className="text-gray-400" />
        </div>
        <p className="mb-1 text-sm font-medium text-gray-600">No team member selected</p>
        <p className="text-xs text-gray-400">Click a card to view their details</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex flex-col bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] lg:relative lg:inset-auto lg:z-auto lg:w-[400px] lg:flex-shrink-0 lg:border-l lg:border-gray-100">
        <div className="relative overflow-hidden border-b border-gray-100 p-6">
          <div className="pointer-events-none absolute top-0 right-0 -z-0 h-28 w-28 rounded-bl-full bg-accent-50 opacity-60" />

          <div className="relative z-10 mb-5 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xl font-bold text-gray-700 shadow">
                {getInitials(member.name)}
              </div>
              <div className="pt-0.5">
                <h2 className="flex items-center gap-1.5 text-lg leading-tight font-bold text-gray-900">
                  {member.name}
                  {member.isOwner && <Crown size={16} className="text-accent-500" />}
                </h2>
                <p className="mt-0.5 mb-2 text-xs text-gray-500">{member.role?.name ?? 'No role assigned'}</p>
                <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE_CLASS[member.status]}`}>{STATUS_LABELS[member.status]}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-700" aria-label="Close panel">
              <X size={19} />
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-center">
              <div className="mb-0.5 text-[10px] text-gray-500">Speciality</div>
              <div className="truncate text-xs font-semibold text-gray-900">{member.speciality || '—'}</div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-center">
              <div className="mb-0.5 text-[10px] text-gray-500">Joined</div>
              <div className="truncate text-xs font-semibold text-gray-900">{formatDate(member.createdAt)}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase">Contact information</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="flex-shrink-0 text-gray-500">Email</span>
                <span className="truncate font-medium text-gray-900">{member.email ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex-shrink-0 text-gray-500">Role</span>
                <span className="truncate font-medium text-gray-900">{member.role?.name ?? '—'}</span>
              </div>
            </div>
          </div>

          {member.isOwner && <p className="text-center text-xs text-gray-400">The studio owner can&apos;t be edited as a regular team member.</p>}
        </div>

        {!member.isOwner && (
          <div className="flex-shrink-0 border-t border-gray-100 p-5">
            <button
              onClick={() => onEdit(member)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
            >
              <Pencil size={14} /> Edit team member
            </button>
          </div>
        )}
      </div>
    </>
  );
}
