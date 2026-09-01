'use client';

import { CalendarClock, Loader2, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { TimePicker } from './time-picker';
import { type ScheduleAppt, timeToMinutes } from './types';

export function RescheduleModal({
  appointment,
  employeeAppts,
  onClose,
  onConfirm,
}: {
  appointment: ScheduleAppt;
  employeeAppts: ScheduleAppt[];
  onClose: () => void;
  onConfirm: (date: string, timeSlot: string) => Promise<void>;
}) {
  const [date, setDate] = useState(appointment.booking.date.slice(0, 10));
  const [time, setTime] = useState(appointment.startTime);
  const [confirming, setConfirming] = useState(false);

  const durationMins = timeToMinutes(appointment.endTime) - timeToMinutes(appointment.startTime);
  const proposedEnd = timeToMinutes(time) + durationMins;

  const conflict = useMemo(() => {
    if (date !== appointment.booking.date.slice(0, 10)) return false;
    return employeeAppts.some((a) => {
      if (a.id === appointment.id) return false;
      const aS = timeToMinutes(a.startTime);
      const aE = timeToMinutes(a.endTime);
      return aS < proposedEnd && aE > timeToMinutes(time);
    });
  }, [appointment, date, employeeAppts, proposedEnd, time]);

  const handleConfirm = async () => {
    if (!date || !time) return;
    setConfirming(true);
    try {
      await onConfirm(date, time);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100">
              <CalendarClock size={16} className="text-accent-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Reschedule</h2>
              <p className="mt-0.5 text-xs text-gray-500">{appointment.serviceLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-200">
            <XIcon size={15} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-accent-500 focus:bg-white focus:ring-1 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">New time</label>
            <TimePicker value={time} onChange={setTime} />
          </div>
          {conflict && <p className="text-xs font-medium text-red-600">This overlaps another booking for the same staff member.</p>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => void handleConfirm()}
            disabled={!date || !time || confirming || conflict}
            className="flex max-w-[220px] flex-1 items-center justify-center gap-2 rounded-xl bg-accent-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 disabled:opacity-50"
          >
            {confirming && <Loader2 size={14} className="animate-spin" />}
            {confirming ? 'Saving…' : 'Confirm reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
