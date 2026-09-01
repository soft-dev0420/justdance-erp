export interface User {
  id: string;
  email: string;
  name: string;
  accountType: 'CLIENT' | 'PROVIDER';
  language: 'en' | 'pl' | 'es';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  studioId: string;
  userCount: number;
  permissions: Record<string, boolean>;
}

export interface OpeningDay {
  id: string;
  day: string;
  open: boolean;
  from: string | null;
  to: string | null;
}

export interface Employee {
  id: string;
  studioId: string;
  userId: string | null;
  name: string;
  email: string | null;
  roleId: string | null;
  role: Role | null;
  speciality: string;
  status: 'available' | 'vacation' | 'sick' | 'unavailable' | 'off-duty';
  isOwner: boolean;
  available: OpeningDay[];
  createdAt: string;
}

export interface OpeningHours {
  open: boolean;
  from: string | null;
  to: string | null;
}

export interface DayOpeningHours {
  day: string;
  open: boolean;
  from: string | null;
  to: string | null;
}

export interface Studio {
  id: string;
  userId: string;
  name: string;
  city: string;
  currency: string;
  status: string;
  employees: Employee[];
}

export interface Price {
  id: number;
  priceType: string;
  hours: string;
  minutes: string;
  price: number;
}

export interface Service {
  id: string;
  type: string;
  name: string;
  description: string;
  categoryId: number;
  price: Price | null;
}

export interface Category {
  id: number;
  category: string;
  services: Service[];
}

export interface Client {
  id: string;
  userId: string;
  hasInjury: boolean;
  injuryNotes: string;
  user: { name: string; email: string };
}

export interface StudioClient {
  id: string;
  studioId: string;
  clientId: string;
  client: Client;
  instructorId: string | null;
  instructor: Employee | null;
  visitedTimes: number;
  notes: string;
  status: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  studioId: string;
  studioClientId: string;
  studioClient: StudioClient;
  employeeId: string | null;
  employee: Employee | null;
  date: string;
  timeSlot: string;
  totalPrice: number;
  totalDuration: string;
  currency: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'checked-in'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'no-show';
  services: Service[];
}

export interface BookingSummary {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
  staff: number;
}

export interface StockHistoryEntry {
  id: string;
  type: 'replenish' | 'use' | 'initial';
  quantity: number;
  notes: string;
  updatedBy: string;
  createdAt: string;
}

export interface StockItem {
  id: string;
  studioId: string;
  name: string;
  category: string;
  currentStock: number;
  parLevel: number | null;
  minStock: number;
  unit: string;
  description: string;
  sku: string | null;
  isLowStock: boolean;
  history: StockHistoryEntry[];
}

export interface Task {
  id: string;
  studioId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  assignees: string[];
  dueDate: string;
  dueTime: string;
  notes: string;
  createdBy: string;
  updatedBy: string | null;
}

export interface ActivityLogEntry {
  id: string;
  message: string;
  sub: string;
  type: string;
  icon: string;
  createdAt: string;
}
