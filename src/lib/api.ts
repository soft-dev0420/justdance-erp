import type { DashboardKSI } from '@/components/juststudio/dashboard/dashboard-types';

import { ApiError, apiFetch } from './api-fetch';
import type {
  ActivityLogEntry,
  Booking,
  BookingSummary,
  Category,
  DayOpeningHours,
  Employee,
  OpeningHours,
  Role,
  Service,
  ShiftDay,
  StockItem,
  Studio,
  StudioClient,
  Task,
  User,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await apiFetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : (data?.message ?? res.statusText);
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export const authApi = {
  login: (body: { email: string; password: string }) => request<{ accessToken: string; user: User }>('/auth/login', { method: 'POST', body }),
  session: () => request<{ userId: string; email: string }>('/auth/session'),
  me: () => request<User>('/auth/me'),
  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) => request<void>('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (body: { token: string; password: string }) => request<void>('/auth/reset-password', { method: 'POST', body }),
  verifyEmail: (token: string) => request<void>(`/auth/verify-email?token=${encodeURIComponent(token)}`),
};

export const dashboardApi = {
  ksi: (date?: string) => request<DashboardKSI>(`/dashboard/ksi${date ? `?date=${encodeURIComponent(date)}` : ''}`),
};

export const studioApi = {
  me: () => request<Studio>('/studio/me'),
  update: (body: { name?: string; city?: string; currency?: string }) => request<Studio>('/studio/me', { method: 'PATCH', body }),
  openingHours: (date: string) => request<OpeningHours>(`/studio/opening-hours?date=${encodeURIComponent(date)}`),
  openingHoursWeek: () => request<DayOpeningHours[]>('/studio/opening-hours/week'),
  setOpeningHoursWeek: (days: DayOpeningHours[]) => request<DayOpeningHours[]>('/studio/opening-hours', { method: 'PUT', body: { days } }),
};

export const rolesApi = {
  list: () => request<Role[]>('/roles'),
  create: (body: { name: string; description?: string }) => request<Role>('/roles', { method: 'POST', body }),
  get: (id: string) => request<Role>(`/roles/${id}`),
  update: (id: string, body: { name?: string; description?: string; permissions?: Record<string, boolean> }) =>
    request<Role>(`/roles/${id}`, { method: 'PATCH', body }),
  remove: (id: string) => request<void>(`/roles/${id}`, { method: 'DELETE' }),
};

export interface CreateEmployeeInput {
  name: string;
  email: string;
  roleId?: string;
  speciality?: string;
}

export const employeesApi = {
  list: () => request<Employee[]>('/employees'),
  checkEmail: (email: string) =>
    request<{ available: boolean; reason?: string }>(`/employees/check-email?email=${encodeURIComponent(email)}`),
  create: (body: CreateEmployeeInput) => request<Employee>('/employees', { method: 'POST', body }),
  update: (id: string, body: Partial<CreateEmployeeInput>) => request<Employee>(`/employees/${id}`, { method: 'PATCH', body }),
  updateStatus: (id: string, status: Employee['status']) =>
    request<Employee>(`/employees/${id}/status`, { method: 'PATCH', body: { status } }),
};

export interface CreateStudioClientInput {
  email: string;
  instructorId?: string;
  notes?: string;
}

export const clientsApi = {
  list: () => request<StudioClient[]>('/clients'),
  create: (body: CreateStudioClientInput) => request<StudioClient>('/clients', { method: 'POST', body }),
  update: (
    id: string,
    body: Partial<CreateStudioClientInput> & { status?: string; hasInjury?: boolean; injuryNotes?: string },
  ) => request<StudioClient>(`/clients/${id}`, { method: 'PATCH', body }),
  remove: (id: string) => request<void>(`/clients/${id}`, { method: 'DELETE' }),
};

export const catalogApi = {
  listCategories: () => request<Category[]>('/categories'),
  createCategory: (category: string) => request<Category>('/categories', { method: 'POST', body: { category } }),
  removeCategory: (id: number) => request<void>(`/categories/${id}`, { method: 'DELETE' }),
  createService: (body: {
    categoryId: number;
    name: string;
    type?: string;
    description?: string;
    hours: string;
    minutes: string;
    price: number;
    priceType?: string;
  }) => request<Service>('/services', { method: 'POST', body }),
  updateService: (id: string, body: Record<string, unknown>) => request<Service>(`/services/${id}`, { method: 'PATCH', body }),
  removeService: (id: string) => request<void>(`/services/${id}`, { method: 'DELETE' }),
};

export interface CreateBookingInput {
  studioClientId: string;
  employeeId?: string;
  date: string;
  timeSlot: string;
  totalPrice: number;
  totalDuration: string;
  currency?: string;
  serviceIds?: string[];
}

export const bookingsApi = {
  list: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    return request<Booking[]>(`/bookings${qs ? `?${qs}` : ''}`);
  },
  create: (body: CreateBookingInput) => request<Booking>('/bookings', { method: 'POST', body }),
  updateStatus: (id: string, status: Booking['status']) =>
    request<Booking>(`/bookings/${id}/status`, { method: 'PATCH', body: { status } }),
  reschedule: (id: string, body: { date: string; timeSlot: string }) =>
    request<Booking>(`/bookings/${id}/reschedule`, { method: 'PATCH', body }),
  reassign: (id: string, employeeId: string) =>
    request<Booking>(`/bookings/${id}/reassign`, { method: 'PATCH', body: { employeeId } }),
  summary: (from: string, to: string) =>
    request<BookingSummary>(`/bookings/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
};

export const stockApi = {
  list: () => request<StockItem[]>('/stock'),
  create: (body: {
    name: string;
    category: string;
    unit: string;
    currentStock?: number;
    parLevel?: number;
    minStock?: number;
    description?: string;
    sku?: string;
  }) => request<StockItem>('/stock', { method: 'POST', body }),
  update: (id: string, body: Record<string, unknown>) => request<StockItem>(`/stock/${id}`, { method: 'PATCH', body }),
  adjust: (id: string, body: { type: 'replenish' | 'use' | 'initial'; quantity: number; notes?: string }) =>
    request<StockItem>(`/stock/${id}/adjust`, { method: 'POST', body }),
  remove: (id: string) => request<void>(`/stock/${id}`, { method: 'DELETE' }),
};

export interface ShiftSlotInput {
  employeeId: string;
  startTime: string;
  endTime: string;
  shiftType: 'morning' | 'afternoon' | 'evening';
}

export interface CreateShiftDayInput {
  date: string;
  location?: string;
  notes?: string;
  slots: ShiftSlotInput[];
}

export const shiftsApi = {
  list: () => request<ShiftDay[]>('/shifts'),
  create: (body: CreateShiftDayInput) => request<ShiftDay>('/shifts', { method: 'POST', body }),
  update: (id: string, body: Partial<CreateShiftDayInput> & { status?: ShiftDay['status'] }) =>
    request<ShiftDay>(`/shifts/${id}`, { method: 'PATCH', body }),
  remove: (id: string) => request<void>(`/shifts/${id}`, { method: 'DELETE' }),
};

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Task['priority'];
  category?: string;
  assignees?: string[];
  dueDate: string;
  dueTime?: string;
  notes?: string;
}

export const tasksApi = {
  list: () => request<Task[]>('/tasks'),
  create: (body: CreateTaskInput) => request<Task>('/tasks', { method: 'POST', body }),
  update: (id: string, body: Partial<CreateTaskInput> & { status?: Task['status'] }) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body }),
  remove: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};

export const activityApi = {
  list: () => request<ActivityLogEntry[]>('/activity'),
};
