'use client';

import { CalendarX2, Pencil, Trash2, Users, X } from 'lucide-react';
import { useState } from 'react';

import type { Booking, StudioClient } from '@/lib/types';

import { formatDate, getInitials, STATUS_BADGE_CLASS, STATUS_LABELS } from './types';

type Tab = 'overview' | 'bookings' | 'notes';

const BOOKING_STATUS_STYLE: Record<Booking['status'], { bar: string; badge: string }> = {
  confirmed: { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
  completed: { bar: 'bg-accent-400', badge: 'bg-accent-50 text-accent-700' },
  cancelled: { bar: 'bg-gray-300', badge: 'bg-gray-100 text-gray-500' },
  'no-show': { bar: 'bg-red-400', badge: 'bg-red-50 text-red-600' },
};

export function ClientProfilePanel({
  client,
  bookings,
  onClose,
  onEdit,
  onDelete,
}: {
  client: StudioClient | null;
  bookings: Booking[];
  onClose: () => void;
  onEdit: (client: StudioClient) => void;
  onDelete: (client: StudioClient) => void;
}) {
  const [tab, setTab] = useState<Tab>('overview');

  if (!client) {
    return (
      <div className="hidden w-[440px] flex-shrink-0 flex-col items-center justify-center border-l border-gray-100 bg-white p-10 text-center lg:flex">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Users size={26} className="text-gray-400" />
        </div>
        <p className="mb-1 text-sm font-medium text-gray-600">No client selected</p>
        <p className="text-xs text-gray-400">Click a client from the list to view their details</p>
      </div>
    );
  }

  const name = client.client.user.name;
  const badgeClass = STATUS_BADGE_CLASS[client.status];
  const clientBookings = bookings.filter((b) => b.studioClientId === client.id);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'notes', label: 'Notes' },
  ];

  const quickStats = [
    { label: 'Status', value: STATUS_LABELS[client.status] ?? client.status },
    { label: 'Instructor', value: client.instructor?.name ?? '—' },
    { label: 'Visits', value: String(client.visitedTimes) },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex flex-col bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] lg:relative lg:inset-auto lg:z-auto lg:w-[440px] lg:flex-shrink-0 lg:border-l lg:border-gray-100">
        <div className="relative overflow-hidden border-b border-gray-100 p-6">
          <div className="pointer-events-none absolute top-0 right-0 -z-0 h-28 w-28 rounded-bl-full bg-accent-50 opacity-60" />

          <div className="relative z-10 mb-5 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 select-none items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xl font-bold text-gray-700 shadow">
                {getInitials(name)}
              </div>
              <div className="pt-0.5">
                <h2 className="text-lg leading-tight font-bold text-gray-900">{name}</h2>
                <p className="mt-0.5 mb-2 text-xs text-gray-500">Joined {formatDate(client.createdAt)}</p>
                {badgeClass && (
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${badgeClass}`}>
                    {STATUS_LABELS[client.status] ?? client.status}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-700" aria-label="Close panel">
              <X size={19} />
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-2">
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-center">
                <div className="mb-0.5 text-[10px] text-gray-500">{stat.label}</div>
                <div className="truncate text-xs font-semibold text-gray-900" title={stat.value}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-5 border-b border-gray-100 px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 py-3 text-sm font-medium transition-colors ${
                tab === t.id ? 'border-accent-600 text-accent-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            {tab === 'overview' && (
              <>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase">Contact information</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex-shrink-0 text-gray-500">Email</span>
                      <span className="truncate font-medium text-gray-900">{client.client.user.email}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex-shrink-0 text-gray-500">Instructor</span>
                      <span className="truncate font-medium text-gray-900">{client.instructor?.name ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex-shrink-0 text-gray-500">Joined</span>
                      <span className="truncate font-medium text-gray-900">{formatDate(client.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {client.client.hasInjury && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <h3 className="mb-1.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">Injury notes</h3>
                    <p className="text-sm text-amber-800">{client.client.injuryNotes || 'Flagged, no details added.'}</p>
                  </div>
                )}

                {client.notes && (
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase">Notes</h3>
                    <p className="rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-600">{client.notes}</p>
                  </div>
                )}
              </>
            )}

            {tab === 'bookings' && (
              <div className="space-y-2.5">
                {clientBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <CalendarX2 size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No bookings yet</p>
                  </div>
                ) : (
                  clientBookings.map((b) => {
                    const style = BOOKING_STATUS_STYLE[b.status];
                    return (
                      <div key={b.id} className="relative flex items-start gap-4 overflow-hidden rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                        <div className={`absolute top-0 bottom-0 left-0 w-1 ${style.bar}`} />
                        <div className="min-w-[64px] pl-2 text-center">
                          <p className="text-sm font-semibold text-gray-900">{formatDate(b.date)}</p>
                          <p className="text-xs text-gray-400">{b.timeSlot}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {b.services.map((s) => s.name).join(', ') || 'Session'}
                          </p>
                          {b.employee?.name && <p className="mt-0.5 text-xs text-gray-500">{b.employee.name}</p>}
                        </div>
                        <span className={`flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${style.badge}`}>{b.status}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {tab === 'notes' && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase">Notes</h3>
                {client.notes ? (
                  <p className="text-sm leading-relaxed text-gray-600">{client.notes}</p>
                ) : (
                  <p className="text-sm text-gray-400">No notes yet.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex w-14 flex-shrink-0 flex-col items-center gap-2.5 border-l border-gray-100 bg-gray-50/50 py-4">
            <button
              onClick={() => onEdit(client)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-white shadow-md transition-colors hover:bg-accent-600"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <div className="my-1 h-px w-5 bg-gray-200" />
            <button
              onClick={() => onDelete(client)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
