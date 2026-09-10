import { BookUser, Boxes, Calendar, CreditCard, DollarSign, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { T } from '@/lib/i18n';

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
export function getModules(t: T): PermModule[] {
  return [
    {
      id: 'dashboard',
      group: 'core',
      name: t.permModDashboardName,
      description: t.permModDashboardDesc,
      icon: BookUser,
    },
    {
      id: 'appointments',
      group: 'core',
      name: t.permModAppointmentsName,
      description: t.permModAppointmentsDesc,
      icon: Calendar,
      granular: [
        { id: 'view_own', label: t.permApptViewOwn },
        { id: 'create', label: t.permApptCreate },
        { id: 'edit', label: t.permApptEdit },
        { id: 'delete', label: t.permApptDelete },
      ],
    },
    {
      id: 'clients',
      group: 'core',
      name: t.permModClientsName,
      description: t.permModClientsDesc,
      icon: Users,
      granular: [
        { id: 'view', label: t.permClientsViewProfiles },
        { id: 'create', label: t.permClientsCreate },
        { id: 'edit', label: t.permClientsEditNotes },
      ],
    },
    {
      id: 'team',
      group: 'core',
      name: t.permModTeamName,
      description: t.permModTeamDesc,
      icon: Users,
    },
    {
      id: 'inventory',
      group: 'management',
      name: t.permModInventoryName,
      description: t.permModInventoryDesc,
      icon: Boxes,
    },
    {
      id: 'payments',
      group: 'management',
      name: t.permModPaymentsName,
      description: t.permModPaymentsDesc,
      icon: CreditCard,
    },
    {
      id: 'revenue',
      group: 'sensitive',
      name: t.permModRevenueName,
      description: t.permModRevenueDesc,
      icon: DollarSign,
    },
    {
      id: 'settings',
      group: 'sensitive',
      name: t.permModSettingsName,
      description: t.permModSettingsDesc,
      icon: Settings,
    },
  ];
}
