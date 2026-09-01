'use client';

import { Loader2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { bookingsApi, catalogApi, clientsApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Category, Employee, StudioClient } from '@/lib/types';

import { ClientPicker } from './client-picker';
import { ServicePicker } from './service-picker';
import { TimePicker } from './time-picker';
import {
  DAY_NAMES,
  addMinutes,
  getDayAvailability,
  initials,
  timeToMinutes,
  type ScheduleAppt,
} from './types';

export interface BookingSlot {
  employeeId?: string;
  time?: string;
}

export function QuickBookingModal({
  isOpen,
  onClose,
  employees,
  appointments,
  currency,
  slot,
  currentDate,
  closingHour,
  onBooked,
}: {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  appointments: ScheduleAppt[];
  currency: string;
  slot?: BookingSlot;
  currentDate: Date;
  closingHour: number;
  onBooked: () => void;
}) {
  const [clients, setClients] = useState<StudioClient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [studioClientId, setStudioClientId] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Reset the form each time the modal opens for a new slot.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudioClientId('');
    setSelectedServiceIds([]);
    setNotes('');
    setSelectedStaffId(slot?.employeeId ?? employees[0]?.id ?? '');
    setSelectedTime(slot?.time ?? '10:00');
    Promise.all([clientsApi.list(), catalogApi.listCategories()]).then(([c, cats]) => {
      setClients(c);
      setCategories(cats);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const services = categories.flatMap((cat) => cat.services);
  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const selectedEmployee = employees.find((e) => e.id === selectedStaffId);
  const totalDuration = selectedServices.reduce((a, s) => a + (Number(s.price?.hours ?? 0) * 60 + Number(s.price?.minutes ?? 0)), 0);
  const totalPrice = selectedServices.reduce((a, s) => a + Number(s.price?.price ?? 0), 0);
  const proposedStart = selectedTime;
  const proposedEnd = addMinutes(selectedTime, totalDuration || 60);

  const staffAppts = useMemo(
    () =>
      appointments
        .filter((a) => a.employeeId === selectedStaffId)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    [appointments, selectedStaffId],
  );

  const hasConflict = staffAppts.some((a) => {
    const aS = timeToMinutes(a.startTime);
    const aE = timeToMinutes(a.endTime);
    const pS = timeToMinutes(proposedStart);
    const pE = timeToMinutes(proposedEnd);
    return aS < pE && aE > pS;
  });

  const exceedsClosingTime = timeToMinutes(proposedEnd) > closingHour * 60;
  const empShift = selectedEmployee ? getDayAvailability(selectedEmployee, currentDate) : undefined;
  const employeeOffToday = empShift?.open === false;
  const beforeShiftStart = !!(empShift?.open && empShift.from && timeToMinutes(proposedStart) < timeToMinutes(empShift.from));

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleConfirm = async () => {
    if (!studioClientId) {
      toast.error('Select a client');
      return;
    }
    if (!selectedStaffId) {
      toast.error('Select a staff member');
      return;
    }
    if (selectedServiceIds.length === 0) {
      toast.error('Select at least one service');
      return;
    }
    if (employeeOffToday) {
      toast.error(`${selectedEmployee?.name.split(' ')[0]} isn't working on ${DAY_NAMES[currentDate.getDay()]}.`);
      return;
    }
    if (beforeShiftStart) {
      toast.error(`${selectedEmployee?.name.split(' ')[0]} doesn't start until ${empShift?.from}.`);
      return;
    }
    if (exceedsClosingTime) {
      toast.error(`Booking ends at ${proposedEnd}, past closing time.`);
      return;
    }
    setIsSaving(true);
    try {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      await bookingsApi.create({
        studioClientId,
        employeeId: selectedStaffId,
        date,
        timeSlot: proposedStart,
        totalPrice,
        totalDuration: `${totalDuration || 60}min`,
        serviceIds: selectedServiceIds,
      });
      toast.success('Booking confirmed');
      onBooked();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create booking');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl" style={{ maxHeight: 'calc(100vh - 48px)' }}>
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3.5 md:px-6">
          <div className="flex min-w-0 items-center gap-2 md:gap-4">
            <h2 className="shrink-0 text-base font-bold text-gray-900 md:text-xl">New booking</h2>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 shadow-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent-500" />
              <span className="whitespace-nowrap text-xs font-medium text-gray-600">
                {proposedStart} – {proposedEnd}
              </span>
              {hasConflict && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">Conflict</span>}
              {employeeOffToday && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">Day off</span>}
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:flex-row md:gap-6 md:p-6">
          <div className="flex flex-1 flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Client</label>
              <ClientPicker clients={clients} selectedId={studioClientId} onSelect={setStudioClientId} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Services <span className="text-red-500">*</span>
                </label>
                {selectedServiceIds.length > 0 && (
                  <span className="rounded-full border border-accent-200 bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">
                    {selectedServiceIds.length} selected · {totalDuration}min · {currency} {totalPrice.toFixed(0)}
                  </span>
                )}
              </div>
              <ServicePicker categories={categories} selectedIds={selectedServiceIds} onToggle={toggleService} currency={currency} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Booking notes (optional)"
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-accent-500 focus:bg-white focus:ring-1 focus:ring-accent-500"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5 md:border-l md:border-gray-100 md:pl-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Staff <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {employees.map((emp) => {
                  const isSelected = selectedStaffId === emp.id;
                  const isUnavailable = emp.status !== 'available';
                  const isOffToday = isSelected ? employeeOffToday : getDayAvailability(emp, currentDate)?.open === false;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => !isUnavailable && setSelectedStaffId(emp.id)}
                      disabled={isUnavailable}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left shadow-sm transition-colors ${
                        isSelected ? 'border-accent-500 bg-accent-50' : isUnavailable ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-50' : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isSelected ? 'bg-accent-200 text-accent-800' : 'bg-gray-200 text-gray-700'}`}>
                        {initials(emp.name)}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className={`truncate text-sm font-medium ${isSelected ? 'text-accent-800' : 'text-gray-600'}`}>{emp.name.split(' ')[0]}</span>
                        {isOffToday && <span className="text-[10px] font-semibold leading-none text-gray-400">Day off</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Start time</label>
              <TimePicker value={selectedTime} onChange={setSelectedTime} />
              {employeeOffToday && <p className="text-xs font-medium text-red-600">{selectedEmployee?.name.split(' ')[0]} isn&apos;t working today.</p>}
              {beforeShiftStart && (
                <p className="text-xs font-medium text-red-600">
                  {selectedEmployee?.name.split(' ')[0]} doesn&apos;t start until {empShift?.from}.
                </p>
              )}
              {exceedsClosingTime && <p className="text-xs font-medium text-orange-600">Ends at {proposedEnd}, past closing time.</p>}
            </div>

            <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold text-gray-500">{selectedEmployee?.name.split(' ')[0] ?? 'Select staff'}&apos;s day</p>
              {staffAppts.length === 0 ? (
                <p className="text-xs italic text-gray-400">{selectedEmployee ? 'No appointments yet' : 'Select a staff member'}</p>
              ) : (
                <div className="space-y-2">
                  {staffAppts.map((a) => {
                    const conflicting = timeToMinutes(a.startTime) < timeToMinutes(proposedEnd) && timeToMinutes(a.endTime) > timeToMinutes(proposedStart);
                    return (
                      <div key={a.id} className={`rounded-lg border px-2 py-1.5 text-xs ${conflicting ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                        <span className="font-semibold">
                          {a.startTime}–{a.endTime}
                        </span>{' '}
                        {a.serviceLabel}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-gray-100 bg-gray-50/80 px-4 py-3.5 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="text-sm font-medium text-gray-600">
            Total <span className="text-lg font-bold text-gray-900">{currency} {totalPrice.toFixed(0)}</span>
            {totalDuration > 0 && <span className="ml-1 text-xs text-gray-400">· {totalDuration} min</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={() => void handleConfirm()}
              disabled={isSaving || hasConflict || exceedsClosingTime || beforeShiftStart || employeeOffToday || selectedServiceIds.length === 0 || !studioClientId}
              className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-600 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? 'Confirming…' : 'Confirm booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
