'use client';

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { employeesApi, shiftsApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { CreateShiftDayInput } from '@/lib/api';
import type { Employee, ShiftDay } from '@/lib/types';

import { ShiftFormModal } from './shift-form-modal';
import { SHIFT_CHIP, SHIFT_DOT, STATUS_BADGE, toDateStr } from './types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(date: Date): (Date | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
  return days;
}

export function WorkScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [shiftDays, setShiftDays] = useState<ShiftDay[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftDay | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => Promise.all([shiftsApi.list(), employeesApi.list()]).then(([days, emps]) => {
    setShiftDays(days);
    setEmployees(emps);
  });

  useEffect(() => {
    load()
      .catch((err) => toast.error(err instanceof ApiError ? err.message : 'Failed to load work schedule'))
      .finally(() => setLoading(false));
  }, []);

  const getShiftForDate = (date: Date | null): ShiftDay | undefined => (date ? shiftDays.find((s) => s.date === toDateStr(date)) : undefined);

  const navigateMonth = (dir: 'prev' | 'next') =>
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1));
      return d;
    });

  const isToday = (date: Date | null) => !!date && date.toDateString() === new Date().toDateString();
  const isSelected = (date: Date | null) => !!selectedDate && !!date && date.toDateString() === selectedDate.toDateString();

  const handleAddShift = () => {
    setEditingShift(null);
    setShowModal(true);
  };
  const handleEditShift = (shift: ShiftDay) => {
    setEditingShift(shift);
    setShowModal(true);
  };

  const handleSaveShift = async (data: CreateShiftDayInput & { status?: ShiftDay['status'] }) => {
    setIsSaving(true);
    try {
      if (editingShift) {
        const updated = await shiftsApi.update(editingShift.id, data);
        setShiftDays((prev) => prev.map((s) => (s.id === editingShift.id ? updated : s)));
        toast.success('Shift updated');
      } else {
        const created = await shiftsApi.create(data);
        setShiftDays((prev) => [...prev, created]);
        toast.success('Shift created');
      }
      setShowModal(false);
      setEditingShift(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save shift');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteShift = async (id: string) => {
    if (!confirm('Delete this shift roster? All assigned slots will be removed.')) return;
    try {
      await shiftsApi.remove(id);
      setShiftDays((prev) => prev.filter((s) => s.id !== id));
      toast.success('Shift deleted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete shift');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-500 border-b-transparent" />
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const selectedShift = getShiftForDate(selectedDate ?? null);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Work Schedule</h1>
        <p className="mt-1 text-gray-600">Plan and manage your team&apos;s shifts</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="border-b bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <CalendarIcon className="h-6 w-6 text-accent-600" />
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => navigateMonth('prev')} className="rounded p-2 transition-colors hover:bg-gray-100" title="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => navigateMonth('next')} className="rounded p-2 transition-colors hover:bg-gray-100" title="Next month">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {DAY_LABELS.map((day) => (
            <div key={day} className="bg-white p-4 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const shift = getShiftForDate(day);
            return (
              <div
                key={index}
                className={`min-h-[110px] cursor-pointer bg-white p-2 transition-all hover:bg-accent-50 ${isToday(day) ? 'ring-2 ring-inset ring-accent-500' : ''} ${isSelected(day) ? 'bg-accent-50' : ''}`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                    <div className={`mb-1 text-sm font-medium ${isToday(day) ? 'font-bold text-accent-600' : isSelected(day) ? 'text-accent-600' : 'text-gray-900'}`}>{day.getDate()}</div>
                    <div className="space-y-0.5">
                      {shift?.slots.slice(0, 2).map((slot) => (
                        <span key={slot.id} className={`block truncate rounded border px-1.5 py-0.5 text-[11px] ${SHIFT_CHIP[slot.shiftType] ?? 'border-gray-200 bg-gray-100 text-gray-700'}`}>
                          {slot.employee.name}
                        </span>
                      ))}
                      {(shift?.slots.length ?? 0) > 2 && <span className="text-[11px] text-gray-400">+{shift!.slots.length - 2} more</span>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-md">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <button onClick={handleAddShift} className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm text-white transition-colors hover:bg-accent-600">
                <Plus className="h-4 w-4" />
                {selectedShift ? 'Edit Shift' : 'Add Shift'}
              </button>
            </div>
          </div>

          <div className="space-y-4 p-6">
            {selectedShift ? (
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-1">
                    {selectedShift.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {selectedShift.location}
                      </div>
                    )}
                    {selectedShift.notes && <p className="text-sm text-gray-400">{selectedShift.notes}</p>}
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[selectedShift.status]}`}>{selectedShift.status}</span>
                  </div>
                  <div className="ml-4 flex shrink-0 gap-1">
                    <button onClick={() => handleEditShift(selectedShift)} className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50" title="Edit shift">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => void handleDeleteShift(selectedShift.id)} className="rounded p-2 text-red-500 transition-colors hover:bg-red-50" title="Delete shift">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedShift.slots.map((slot) => (
                    <div key={slot.id} className={`flex items-center justify-between rounded-lg border p-3 ${SHIFT_CHIP[slot.shiftType] ?? 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${SHIFT_DOT[slot.shiftType] ?? 'bg-gray-400'}`} />
                        <div>
                          <p className="text-sm font-medium">{slot.employee.name}</p>
                          <div className="mt-0.5 flex items-center gap-1 text-xs opacity-70">
                            <Clock className="h-3 w-3" />
                            {slot.startTime} – {slot.endTime}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium capitalize opacity-60">{slot.shiftType}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="text-sm">No shifts scheduled for this day</p>
                <button onClick={handleAddShift} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm text-white transition-colors hover:bg-accent-600">
                  <Plus className="h-4 w-4" />
                  Add Shift
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ShiftFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingShift(null);
        }}
        selectedDate={selectedDate}
        onSave={(data) => void handleSaveShift(data)}
        initialValues={editingShift}
        isLoading={isSaving}
        employees={employees}
      />
    </div>
  );
}
