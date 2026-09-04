'use client';

import { Calendar, Clock, MapPin, Plus, Trash2, X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';

import type { CreateShiftDayInput, ShiftSlotInput } from '@/lib/api';
import type { Employee, ShiftDay } from '@/lib/types';

import { toDateStr } from './types';

const emptySlot = (defaultEmployeeId: string): ShiftSlotInput => ({ employeeId: defaultEmployeeId, startTime: '', endTime: '', shiftType: 'morning' });

export function ShiftFormModal({
  open,
  onClose,
  selectedDate,
  onSave,
  initialValues,
  isLoading,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | undefined;
  onSave: (data: CreateShiftDayInput & { status?: ShiftDay['status'] }) => void;
  initialValues: ShiftDay | null;
  isLoading: boolean;
  employees: Employee[];
}) {
  const [form, setForm] = useState<CreateShiftDayInput & { status: ShiftDay['status'] }>({
    date: selectedDate ? toDateStr(selectedDate) : '',
    location: '',
    notes: '',
    status: 'scheduled',
    slots: [emptySlot(employees[0]?.id ?? '')],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    // Reset the form each time the modal opens for a new/different shift.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initialValues) {
      setForm({
        date: initialValues.date,
        location: initialValues.location,
        notes: initialValues.notes,
        status: initialValues.status,
        slots: initialValues.slots.length ? initialValues.slots.map((s) => ({ employeeId: s.employeeId, startTime: s.startTime, endTime: s.endTime, shiftType: s.shiftType })) : [emptySlot(employees[0]?.id ?? '')],
      });
    } else {
      setForm({ date: selectedDate ? toDateStr(selectedDate) : '', location: '', notes: '', status: 'scheduled', slots: [emptySlot(employees[0]?.id ?? '')] });
    }
    setErrors({});
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues, selectedDate]);

  const updateSlot = (index: number, patch: Partial<ShiftSlotInput>) => {
    setForm((prev) => ({ ...prev, slots: prev.slots.map((s, i) => (i === index ? { ...s, ...patch } : s)) }));
  };

  const addSlot = () => setForm((prev) => ({ ...prev, slots: [...prev.slots, emptySlot(employees[0]?.id ?? '')] }));
  const removeSlot = (index: number) => setForm((prev) => ({ ...prev, slots: prev.slots.filter((_, i) => i !== index) }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.date) errs.date = 'Date is required';
    form.slots.forEach((s, i) => {
      if (!s.employeeId) errs[`employee_${i}`] = 'Required';
      if (!s.startTime) errs[`start_${i}`] = 'Required';
      if (!s.endTime) errs[`end_${i}`] = 'Required';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  if (!open) return null;

  const isEditing = !!initialValues;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Shift' : 'Add Shift'}</h2>
              <p className="text-sm text-gray-500">Schedule staff for a work day</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-accent-500 ${errors.date ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Studio A, Main hall"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={2}
                placeholder="Any additional notes for this day…"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-accent-500"
              />
            </div>

            {isEditing && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ShiftDay['status'] }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-accent-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Staff shifts *</label>
                <button type="button" onClick={addSlot} className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700">
                  <Plus className="h-3.5 w-3.5" />
                  Add slot
                </button>
              </div>

              <div className="space-y-3">
                {form.slots.map((slot, i) => (
                  <div key={i} className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Staff member *</label>
                      <select
                        value={slot.employeeId}
                        onChange={(e) => updateSlot(i, { employeeId: e.target.value })}
                        className={`mt-0.5 w-full rounded-md border px-2 py-1.5 text-sm focus:border-transparent focus:ring-1 focus:ring-accent-500 ${errors[`employee_${i}`] ? 'border-red-400' : 'border-gray-300'}`}
                      >
                        <option value="">Select…</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Start *</label>
                        <div className="relative mt-0.5">
                          <Clock className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(i, { startTime: e.target.value })}
                            className={`w-full rounded-md border py-1.5 pl-7 pr-2 text-sm focus:border-transparent focus:ring-1 focus:ring-accent-500 ${errors[`start_${i}`] ? 'border-red-400' : 'border-gray-300'}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">End *</label>
                        <div className="relative mt-0.5">
                          <Clock className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(i, { endTime: e.target.value })}
                            className={`w-full rounded-md border py-1.5 pl-7 pr-2 text-sm focus:border-transparent focus:ring-1 focus:ring-accent-500 ${errors[`end_${i}`] ? 'border-red-400' : 'border-gray-300'}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Shift type</label>
                      <select
                        value={slot.shiftType}
                        onChange={(e) => updateSlot(i, { shiftType: e.target.value as ShiftSlotInput['shiftType'] })}
                        className="mt-0.5 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-transparent focus:ring-1 focus:ring-accent-500"
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>
                    {form.slots.length > 1 && (
                      <button type="button" onClick={() => removeSlot(i)} className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                        Remove slot
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4 md:p-6">
            <button type="button" onClick={onClose} disabled={isLoading} className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
            >
              {isLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {isEditing ? 'Update Shift' : 'Create Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
