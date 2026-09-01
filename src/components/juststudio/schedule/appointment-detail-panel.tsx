'use client';

import { EllipsisVertical, XIcon } from 'lucide-react';
import { useState } from 'react';

import type { Booking, Employee } from '@/lib/types';

import { ReassignModal } from './reassign-modal';
import { RescheduleModal } from './reschedule-modal';
import {
  APPT_COLORS,
  STATUS_LABEL,
  STATUS_STYLE,
  type ScheduleAppt,
  fmtTime12h,
  initials,
  timeToMinutes,
} from './types';

const STEPS = ['Booked', 'Confirmed', 'Checked in', 'In service', 'Completed'];

function stepProgress(status: Booking['status']): number {
  if (status === 'pending') return 0;
  if (status === 'confirmed') return 1;
  if (status === 'checked-in') return 2;
  if (status === 'in-progress') return 3;
  if (status === 'completed') return 4;
  return -1;
}

export function AppointmentDetailPanel({
  appointment,
  employee,
  employeeAppts,
  employees,
  colorIdx,
  onClose,
  onStatusChange,
  onReschedule,
  onReassign,
}: {
  appointment: ScheduleAppt | null;
  employee: Employee | null;
  employeeAppts: ScheduleAppt[];
  employees: Employee[];
  colorIdx: number;
  onClose: () => void;
  onStatusChange: (apptId: string, status: Booking['status']) => Promise<void>;
  onReschedule: (apptId: string, date: string, timeSlot: string) => Promise<void>;
  onReassign: (apptId: string, newEmployeeId: string) => Promise<void>;
}) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [showReassign, setShowReassign] = useState(false);

  const isOpen = !!appointment;
  const color = APPT_COLORS[colorIdx % APPT_COLORS.length]!;
  const progress = appointment ? stepProgress(appointment.status) : -1;
  const isCancelled = appointment?.status === 'cancelled';
  const dur = appointment ? timeToMinutes(appointment.endTime) - timeToMinutes(appointment.startTime) : 0;
  const shortId = appointment ? `#BK-${appointment.id.slice(-4).toUpperCase()}` : '';
  const clientNotes = appointment?.booking.studioClient?.notes;

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-gray-900/15 backdrop-blur-[1px]" />}

      <aside
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-[440px] flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {appointment && (
          <>
            <div className="shrink-0 border-b border-gray-200 bg-gray-50/80 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLE[appointment.status]}`}>
                    {STATUS_LABEL[appointment.status]}
                  </span>
                  <span className="text-xs font-medium text-gray-400">{shortId}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900">
                    <EllipsisVertical size={15} />
                  </button>
                  <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900">
                    <XIcon size={16} />
                  </button>
                </div>
              </div>

              {!isCancelled && (
                <div className="relative mt-2 flex items-center justify-between">
                  <div className="absolute left-3 right-3 top-3 z-0 h-0.5 bg-gray-200" />
                  <div
                    className="absolute left-3 top-3 z-0 h-0.5 bg-accent-500 transition-all duration-500"
                    style={{ width: `calc(${(progress / (STEPS.length - 1)) * 100}% - ${progress === STEPS.length - 1 ? '0px' : '12px'})` }}
                  />
                  {STEPS.map((step, i) => {
                    const done = i < progress;
                    const current = i === progress;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-1">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${
                            done ? 'border-white bg-accent-500' : current ? 'border-accent-500 bg-white' : 'border-gray-300 bg-gray-100'
                          }`}
                        >
                          {current && <div className="h-2 w-2 rounded-full bg-accent-500" />}
                        </div>
                        <span className={`text-[10px] font-medium ${done || current ? 'text-accent-600' : 'text-gray-400'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {isCancelled && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600">This appointment was cancelled.</div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white text-base font-bold shadow-sm ${color.avatar}`}>
                    {initials(appointment.clientName)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{appointment.clientName}</h2>
                    <p className="mt-1 text-xs font-medium text-accent-600">{dur} min session</p>
                  </div>
                </div>
                {clientNotes && (
                  <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs italic text-gray-600">{clientNotes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-b border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900">Service details</h3>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900">{appointment.serviceLabel}</h4>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {fmtTime12h(appointment.startTime)} – {fmtTime12h(appointment.endTime)} ({dur} min)
                  </p>
                  {employee && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white text-xs font-bold shadow-sm ${color.avatar}`}>{initials(employee.name)}</div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Staff</p>
                        <p className="truncate text-xs font-medium text-gray-900">{employee.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-white p-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
              {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowReschedule(true)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => setShowReassign(true)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                    >
                      Reassign
                    </button>
                  </div>
                  <button
                    onClick={() => void onStatusChange(appointment.id, 'checked-in')}
                    className="w-full rounded-lg bg-sky-600 py-3 text-sm font-semibold text-white shadow-md shadow-sky-600/30 transition-all hover:bg-sky-500"
                  >
                    Check in
                  </button>
                  <button
                    onClick={() => void onStatusChange(appointment.id, 'cancelled')}
                    className="w-full rounded-lg border border-red-200 bg-white py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                  >
                    Cancel appointment
                  </button>
                </>
              )}

              {appointment.status === 'checked-in' && (
                <>
                  <button
                    onClick={() => void onStatusChange(appointment.id, 'in-progress')}
                    className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-600/30 transition-all hover:bg-violet-500"
                  >
                    Start session
                  </button>
                  <button
                    onClick={() => void onStatusChange(appointment.id, 'cancelled')}
                    className="w-full rounded-lg border border-red-200 bg-white py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                  >
                    Cancel appointment
                  </button>
                </>
              )}

              {appointment.status === 'in-progress' && (
                <>
                  <button
                    onClick={() => void onStatusChange(appointment.id, 'completed')}
                    className="w-full rounded-lg bg-accent-500 py-3 text-sm font-semibold text-white shadow-md shadow-accent-500/30 transition-all hover:bg-accent-600"
                  >
                    Complete &amp; check out
                  </button>
                  <button
                    onClick={() => void onStatusChange(appointment.id, 'cancelled')}
                    className="w-full rounded-lg border border-red-200 bg-white py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
                  >
                    Cancel appointment
                  </button>
                </>
              )}

              {appointment.status === 'completed' && <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">Session completed</div>}

              {(appointment.status === 'cancelled' || appointment.status === 'no-show') && (
                <button
                  onClick={() => void onStatusChange(appointment.id, 'confirmed')}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Restore appointment
                </button>
              )}
            </div>
          </>
        )}
      </aside>

      {showReschedule && appointment && (
        <RescheduleModal
          appointment={appointment}
          employeeAppts={employeeAppts}
          onClose={() => setShowReschedule(false)}
          onConfirm={async (date, timeSlot) => {
            await onReschedule(appointment.id, date, timeSlot);
            setShowReschedule(false);
          }}
        />
      )}

      {showReassign && appointment && (
        <ReassignModal
          employees={employees}
          currentEmployeeId={appointment.employeeId}
          service={appointment.serviceLabel}
          onClose={() => setShowReassign(false)}
          onConfirm={async (newEmployeeId) => {
            await onReassign(appointment.id, newEmployeeId);
            setShowReassign(false);
          }}
        />
      )}
    </>
  );
}
