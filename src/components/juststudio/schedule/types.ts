import type { Booking, Employee, OpeningDay } from '@/lib/types';

export const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DEFAULT_START_HOUR = 9;
export const DEFAULT_END_HOUR = 18;
export const HOUR_HEIGHT = 64;

export type ScheduleView = 'day' | 'week' | 'month' | 'staff';

export interface ScheduleAppt {
  id: string;
  employeeId: string | null;
  clientName: string;
  serviceLabel: string;
  startTime: string;
  endTime: string;
  status: Booking['status'];
  booking: Booking;
}

/* Per-employee color themes for the day/week grids */
export const APPT_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', sub: 'text-blue-700', avatar: 'bg-blue-200 text-blue-800' },
  { bg: 'bg-accent-50', border: 'border-accent-200', text: 'text-accent-900', sub: 'text-accent-700', avatar: 'bg-accent-200 text-accent-800' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', sub: 'text-emerald-700', avatar: 'bg-emerald-200 text-emerald-800' },
  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', sub: 'text-orange-700', avatar: 'bg-orange-200 text-orange-800' },
  { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900', sub: 'text-pink-700', avatar: 'bg-pink-200 text-pink-800' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', sub: 'text-cyan-700', avatar: 'bg-cyan-200 text-cyan-800' },
];

export const STATUS_STYLE: Record<Booking['status'], string> = {
  pending: 'bg-amber-50 border-amber-300 text-amber-900',
  confirmed: 'bg-accent-50 border-accent-300 text-accent-900',
  'checked-in': 'bg-sky-50 border-sky-300 text-sky-900',
  'in-progress': 'bg-violet-50 border-violet-300 text-violet-900',
  completed: 'bg-gray-100 border-gray-300 text-gray-500',
  cancelled: 'bg-red-50 border-red-200 text-red-400',
  'no-show': 'bg-gray-100 border-gray-300 text-gray-400',
};

export const STATUS_LABEL: Record<Booking['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'checked-in': 'Checked in',
  'in-progress': 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'No-show',
};

export function initials(name: string): string {
  return (
    name
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  );
}

export function p2(n: number): string {
  return String(n).padStart(2, '0');
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function addMinutes(time: string, mins: number): string {
  const total = timeToMinutes(time) + mins;
  return `${p2(Math.floor(total / 60))}:${p2(total % 60)}`;
}

export function fmtTime12h(t: string): string {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${p2(m)} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function parseDurationMinutes(totalDuration: string): number {
  const match = totalDuration.match(/\d+/);
  return match ? Number(match[0]) : 60;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function isPastDay(d: Date): boolean {
  const a = new Date(d);
  a.setHours(0, 0, 0, 0);
  const b = new Date();
  b.setHours(0, 0, 0, 0);
  return a < b;
}

export function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}

export function bookingToAppt(booking: Booking): ScheduleAppt {
  const startTime = booking.timeSlot;
  const endTime = addMinutes(startTime, parseDurationMinutes(booking.totalDuration));
  const clientName = booking.studioClient?.client?.user?.name ?? 'Client';
  const serviceLabel = booking.services.length > 0 ? booking.services.map((s) => s.name).join(', ') : 'Booking';
  return {
    id: booking.id,
    employeeId: booking.employeeId,
    clientName,
    serviceLabel,
    startTime,
    endTime,
    status: booking.status,
    booking,
  };
}

export function getDayAvailability(employee: Employee, date: Date): OpeningDay | undefined {
  const dayName = DAY_NAMES[date.getDay()];
  return employee.available.find((o) => o.day === dayName);
}

export function isOffOnDay(employee: Employee, date: Date): boolean {
  const avail = getDayAvailability(employee, date);
  return !!avail && avail.open === false;
}

export const STATUS_LABEL_FOR_EMPLOYEE: Record<Employee['status'], string> = {
  available: 'Available',
  vacation: 'Vacation',
  sick: 'Sick',
  unavailable: 'Unavailable',
  'off-duty': 'Off duty',
};
