'use client';

import {
  Boxes,
  CalendarClock,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  ShieldCheck,
  Tags,
  UserSquare2,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { useStudio } from '@/context/studio-context';
import { cn } from '@/lib/cn';

const MAIN_NAV = [
  { href: '/juststudio', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/juststudio/clients', label: 'Clients', icon: Users },
  { href: '/juststudio/team', label: 'Team', icon: UserSquare2 },
  // Booking/Schedule is built and working but hidden from nav per the client's
  // "remove booking for now" — the page, components, and API routes are all
  // still intact, so re-enabling this is a one-line change.
  // { href: '/juststudio/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/juststudio/services', label: 'Services', icon: Tags },
  { href: '/juststudio/inventory', label: 'Inventory', icon: Boxes },
  { href: '/juststudio/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/juststudio/work-schedule', label: 'Work Schedule', icon: CalendarClock },
];

const SETTINGS_NAV = [
  { href: '/juststudio/settings', label: 'Settings', icon: Settings },
  { href: '/juststudio/permissions', label: 'Roles & Permissions', icon: ShieldCheck },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { studio } = useStudio();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <aside
      className={cn(
        'flex h-screen flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 transition-[width] duration-300',
        collapsed ? 'w-16' : 'w-[280px]',
      )}
    >
      <div className="flex h-[88px] flex-shrink-0 items-center justify-between border-b border-zinc-800 px-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black">
            <Image src="/logo-alt.png" alt="Just Dance" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Just Dance</p>
              <p className="truncate text-xs text-zinc-500">Studio</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex-shrink-0 text-zinc-500 transition hover:text-white"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-6">
        <div>
          {!collapsed && <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-zinc-600">Main</p>}
          <ul className="space-y-1">
            {MAIN_NAV.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                      collapsed && 'justify-center px-2',
                      active
                        ? 'border border-zinc-700 bg-zinc-800 text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
                    )}
                  >
                    <Icon size={16} className={cn('flex-shrink-0', active ? 'text-accent-400' : 'text-zinc-500')} />
                    {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          {!collapsed && <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-zinc-600">Settings</p>}
          <ul className="space-y-1">
            {SETTINGS_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                      collapsed && 'justify-center px-2',
                      active
                        ? 'border border-zinc-700 bg-zinc-800 text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
                    )}
                  >
                    <Icon size={16} className={cn('flex-shrink-0', active ? 'text-accent-400' : 'text-zinc-500')} />
                    {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="flex-shrink-0 border-t border-zinc-800 p-3">
        <div className={cn('flex items-center rounded-lg p-2', collapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-800 text-xs font-bold text-white">
              {user ? initials(user.name) : '?'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{user?.name ?? studio?.name ?? '…'}</p>
                <p className="truncate text-xs text-zinc-500">Owner</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => logout()} title="Sign out" className="flex-shrink-0 text-zinc-500 hover:text-white">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
