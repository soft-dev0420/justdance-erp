import type React from 'react';

/* ── Local, dashboard-scoped shapes ──────────────────────────
   Deliberately narrower than the domain types in @/lib/types — the KSI
   endpoint returns these lightweight projections, not full Booking/Employee
   records. */
export interface Booking {
  id: string;
  employeeId: string;
  clientName: string;
  service: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  createdAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface ActivityItem {
  icon: string;
  text: string;
  sub: string;
  type: string;
}

export interface SnapAppointment extends Booking {
  left: number;
  width: number;
}

export interface SnapStaffRow {
  emp: Employee;
  appts: SnapAppointment[];
}

export interface DashboardKSI {
  bookings: number;
  revenue: number;
  activeClients: number;
  clientInsights: { newClients: number; returning: number; highValue: number };
  utilization: number;
  slots: number;
  revenueData: { day: string; value: number }[];
  topPerformers: { emp: Employee; count: number; value: number }[];
  scheduleSnapshots: { emp: Employee; appts: Booking[] }[];
  activityFeed: ActivityItem[];
  inventoryAlerts: { name: string; type: string; amount: number }[];
}

/* ── Helpers ──────────────────────────────────────────────── */
export function p2(n: number) {
  return String(n).padStart(2, '0');
}

export function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

/* ── Glass panel style ────────────────────────────────────── */
export const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.5)',
};

/* ── Schedule snapshot constants ──────────────────────────── */
export const SNAP_START = 9 * 60; // 09:00
export const SNAP_END = 13 * 60; // 13:00

export const SNAP_COLORS = [
  { bg: 'bg-accent-100 border-accent-200', text: 'text-accent-800', sub: 'text-accent-600' },
  { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-800', sub: 'text-blue-600' },
  { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-800', sub: 'text-purple-600' },
  { bg: 'bg-orange-50 border-orange-100', text: 'text-orange-800', sub: 'text-orange-600' },
];

/* ── Misc constants ───────────────────────────────────────── */
export const RANK_COLORS = ['bg-amber-400 text-white', 'bg-slate-300 text-slate-700', 'bg-amber-700 text-white'];
