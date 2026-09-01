'use client';

import { CalendarDays, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { bookingsApi, employeesApi, studioApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Booking, Employee, OpeningHours } from '@/lib/types';

import { AppointmentDetailPanel } from './appointment-detail-panel';
import { DayView } from './day-view';
import { MonthView } from './month-view';
import { type BookingSlot, QuickBookingModal } from './quick-booking-modal';
import { ScheduleHeader } from './schedule-header';
import { StaffView } from './staff-view';
import {
  DEFAULT_END_HOUR,
  DEFAULT_START_HOUR,
  type ScheduleAppt,
  type ScheduleView,
  bookingToAppt,
  toDateInput,
} from './types';
import { WeekView } from './week-view';

function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function ScheduleWorkspace() {
  const [view, setView] = useState<ScheduleView>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHours | null>(null);
  const [currency, setCurrency] = useState('$');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingSlot, setBookingSlot] = useState<BookingSlot | undefined>(undefined);
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const range = useMemo(() => {
    if (view === 'week' || view === 'staff') {
      const end = new Date(weekStart);
      end.setDate(weekStart.getDate() + 6);
      return { from: toDateInput(weekStart), to: toDateInput(end) };
    }
    if (view === 'month') {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return { from: toDateInput(start), to: toDateInput(end) };
    }
    return { from: toDateInput(currentDate), to: toDateInput(currentDate) };
  }, [view, currentDate, weekStart]);

  const load = useCallback(() => {
    setIsLoading(true);
    return Promise.all([employeesApi.list(), bookingsApi.list(range.from, range.to), studioApi.me(), studioApi.openingHours(toDateInput(currentDate))])
      .then(([emps, bks, studio, hours]) => {
        setEmployees(emps);
        setBookings(bks);
        setCurrency(bks[0]?.currency ?? studio.currency ?? '$');
        setOpeningHours(hours);
      })
      .catch((err) => toast.error(err instanceof ApiError ? err.message : 'Failed to load schedule'))
      .finally(() => setIsLoading(false));
  }, [range.from, range.to, currentDate]);

  useEffect(() => {
    // Must re-run whenever the visible date range changes, not just on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const gridStartHour = openingHours?.open && openingHours.from ? parseInt(openingHours.from.split(':')[0]!, 10) : DEFAULT_START_HOUR;
  const gridEndHour =
    openingHours?.open && openingHours.to
      ? parseInt(openingHours.to.split(':')[0]!, 10) + (parseInt(openingHours.to.split(':')[1] ?? '0', 10) > 0 ? 1 : 0)
      : DEFAULT_END_HOUR;

  const appts = useMemo(() => bookings.map(bookingToAppt), [bookings]);

  const specialities = useMemo(() => Array.from(new Set(employees.map((e) => e.speciality || e.role?.name).filter((v): v is string => !!v))), [employees]);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((emp) => {
        const label = (emp.speciality || emp.role?.name || '').toLowerCase();
        if (activeFilter !== 'All' && label !== activeFilter.toLowerCase()) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return emp.name.toLowerCase().includes(q) || label.includes(q);
        }
        return true;
      }),
    [employees, activeFilter, search],
  );

  const appointmentsByEmployee = useMemo(() => {
    const map = new Map<string, ScheduleAppt[]>();
    for (const appt of appts) {
      if (!appt.employeeId) continue;
      if (!map.has(appt.employeeId)) map.set(appt.employeeId, []);
      map.get(appt.employeeId)!.push(appt);
    }
    return map;
  }, [appts]);

  const apptsByDay = useMemo(() => {
    const map = new Map<string, ScheduleAppt[]>();
    for (const appt of appts) {
      const key = appt.booking.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(appt);
    }
    return map;
  }, [appts]);

  const activeStaff = employees.filter((e) => e.status !== 'off-duty').length;
  const kpiLabel = view === 'month' ? 'This month' : view === 'week' || view === 'staff' ? 'This week' : 'Today';
  const kpis = {
    label: kpiLabel,
    total: appts.length,
    confirmed: appts.filter((a) => ['confirmed', 'checked-in', 'in-progress', 'completed'].includes(a.status)).length,
    staff: activeStaff,
    pending: appts.filter((a) => a.status === 'pending').length,
    cancelled: appts.filter((a) => a.status === 'cancelled').length,
  };

  const selectedAppt = selectedApptId ? (appts.find((a) => a.id === selectedApptId) ?? null) : null;
  const selectedEmployee = selectedAppt ? (employees.find((e) => e.id === selectedAppt.employeeId) ?? null) : null;
  const selectedEmployeeAppts = selectedAppt ? (appointmentsByEmployee.get(selectedAppt.employeeId ?? '') ?? []) : [];

  const navigateDate = (dir: 'prev' | 'next') =>
    setCurrentDate((prev) => {
      const d = new Date(prev);
      const delta = dir === 'next' ? 1 : -1;
      if (view === 'week' || view === 'staff') d.setDate(d.getDate() + delta * 7);
      else if (view === 'month') d.setMonth(d.getMonth() + delta);
      else d.setDate(d.getDate() + delta);
      return d;
    });

  const openNewBooking = () => {
    setBookingSlot(undefined);
    setShowBooking(true);
  };

  const handleSlotClick = (employeeId: string, time: string) => {
    setBookingSlot({ employeeId, time });
    setShowBooking(true);
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const openApptDetail = (appt: ScheduleAppt, colorIdx: number) => {
    setSelectedApptId(appt.id);
    setSelectedColorIdx(colorIdx);
  };

  const colorIdxFor = (employeeId: string | null) => {
    const idx = filteredEmployees.findIndex((e) => e.id === employeeId);
    return idx >= 0 ? idx : 0;
  };

  const handleStatusChange = async (apptId: string, status: Booking['status']) => {
    try {
      await bookingsApi.updateStatus(apptId, status);
      setBookings((prev) => prev.map((b) => (b.id === apptId ? { ...b, status } : b)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update status');
    }
  };

  const handleReschedule = async (apptId: string, date: string, timeSlot: string) => {
    try {
      const updated = await bookingsApi.reschedule(apptId, { date, timeSlot });
      setBookings((prev) => prev.map((b) => (b.id === apptId ? updated : b)));
      toast.success('Appointment rescheduled');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to reschedule');
    }
  };

  const handleReassign = async (apptId: string, newEmployeeId: string) => {
    try {
      const updated = await bookingsApi.reassign(apptId, newEmployeeId);
      setBookings((prev) => prev.map((b) => (b.id === apptId ? updated : b)));
      toast.success('Appointment reassigned');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to reassign');
    }
  };

  if (isLoading && bookings.length === 0 && employees.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-accent-500" size={24} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <ScheduleHeader
        view={view}
        onViewChange={setView}
        currentDate={currentDate}
        weekStart={weekStart}
        onNavigate={navigateDate}
        onToday={() => setCurrentDate(new Date())}
        search={search}
        onSearchChange={setSearch}
        onNewBooking={openNewBooking}
        kpis={kpis}
        specialities={specialities}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        employeeCount={employees.length}
      />

      {employees.length === 0 ? (
        <div className="px-6 pb-6">
          <EmptyState icon={CalendarDays} title="No staff yet" description="Add a team member first, then create a booking." />
        </div>
      ) : (
        <>
          {view === 'day' && (
            <DayView
              employees={filteredEmployees}
              appointmentsByEmployee={appointmentsByEmployee}
              currentDate={currentDate}
              now={now}
              gridStartHour={gridStartHour}
              gridEndHour={gridEndHour}
              onSlotClick={handleSlotClick}
              onApptClick={(appt) => openApptDetail(appt, colorIdxFor(appt.employeeId))}
            />
          )}
          {view === 'week' && <WeekView weekStart={weekStart} now={now} apptsByDay={apptsByDay} onDayClick={handleDayClick} onApptClick={(appt) => openApptDetail(appt, colorIdxFor(appt.employeeId))} />}
          {view === 'month' && <MonthView year={currentDate.getFullYear()} month={currentDate.getMonth() + 1} selectedDate={currentDate} apptsByDay={apptsByDay} onDayClick={handleDayClick} />}
          {view === 'staff' && <StaffView employees={filteredEmployees} weekStart={weekStart} />}
        </>
      )}

      <AppointmentDetailPanel
        appointment={selectedAppt}
        employee={selectedEmployee}
        employeeAppts={selectedEmployeeAppts}
        employees={employees}
        colorIdx={selectedColorIdx}
        onClose={() => setSelectedApptId(null)}
        onStatusChange={handleStatusChange}
        onReschedule={handleReschedule}
        onReassign={handleReassign}
      />

      <QuickBookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        employees={employees}
        appointments={appts}
        currency={currency}
        slot={bookingSlot}
        currentDate={currentDate}
        closingHour={gridEndHour}
        onBooked={() => void load()}
      />
    </div>
  );
}
