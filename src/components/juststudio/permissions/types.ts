import { BookUser, Boxes, Calendar, CreditCard, DollarSign, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface GranularPerm {
  id: string;
  label: string;
}

export interface PermModule {
  id: string;
  group: 'core' | 'management' | 'sensitive';
  name: string;
  description: string;
  icon: LucideIcon;
  granular?: GranularPerm[];
}

// Mirrors justdance-api's MODULE_TEMPLATE (src/role/module-template.ts) exactly —
// module ids and sub-permission ids must match what the backend stores.
export const MODULES: PermModule[] = [
  {
    id: 'dashboard',
    group: 'core',
    name: 'Dashboard',
    description: 'View personal metrics and daily schedule overview.',
    icon: BookUser,
  },
  {
    id: 'appointments',
    group: 'core',
    name: 'Appointments',
    description: 'Manage scheduling and calendar blocks.',
    icon: Calendar,
    granular: [
      { id: 'view_own', label: 'View own schedule' },
      { id: 'create', label: 'Create appointments' },
      { id: 'edit', label: 'Edit / reschedule' },
      { id: 'delete', label: 'Delete appointments' },
    ],
  },
  {
    id: 'clients',
    group: 'core',
    name: 'Clients',
    description: 'Access client records and notes.',
    icon: Users,
    granular: [
      { id: 'view', label: 'View profiles' },
      { id: 'create', label: 'Create clients' },
      { id: 'edit', label: 'Edit notes' },
    ],
  },
  {
    id: 'team',
    group: 'core',
    name: 'Team',
    description: 'View team contact info and roles.',
    icon: Users,
  },
  {
    id: 'inventory',
    group: 'management',
    name: 'Inventory',
    description: 'Manage studio supplies and stock.',
    icon: Boxes,
  },
  {
    id: 'payments',
    group: 'management',
    name: 'Payments',
    description: 'Process client transactions and invoices.',
    icon: CreditCard,
  },
  {
    id: 'revenue',
    group: 'sensitive',
    name: 'Revenue',
    description: 'Access studio-wide financial data.',
    icon: DollarSign,
  },
  {
    id: 'settings',
    group: 'sensitive',
    name: 'Settings',
    description: 'Modify studio configuration.',
    icon: Settings,
  },
];
