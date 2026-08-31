'use client';

import { Boxes, CalendarDays, ListChecks, Loader2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '@/components/juststudio/page-header';
import { ActivityFeed } from '@/components/juststudio/dashboard/activity-feed';
import { ClientInsights } from '@/components/juststudio/dashboard/client-insights';
import { InventoryAlerts } from '@/components/juststudio/dashboard/inventory-alerts';
import { KpiCard } from '@/components/juststudio/dashboard/kpi-card';
import { RevenueChart } from '@/components/juststudio/dashboard/revenue-chart';
import { TopPerformers } from '@/components/juststudio/dashboard/top-performers';
import { useStudio } from '@/context/studio-context';
import { activityApi, bookingsApi, clientsApi, stockApi, tasksApi } from '@/lib/api';
import type { ActivityLogEntry, Booking, StockItem, StudioClient, Task } from '@/lib/types';

const REVENUE_STATUSES: Booking['status'][] = ['confirmed', 'completed'];
const DAY_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function DashboardPage() {
  const { studio } = useStudio();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<StudioClient[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    Promise.all([clientsApi.list(), bookingsApi.list(), stockApi.list(), tasksApi.list(), activityApi.list()])
      .then(([c, b, s, t, a]) => {
        setClients(c);
        setBookings(b);
        setStock(s);
        setTasks(t);
        setActivity(a);
      })
      .finally(() => setLoading(false));
  }, []);

  // Stable for the component's lifetime so it can safely sit in the
  // useMemo dep arrays below instead of forcing them to recompute (or
  // silently going stale) on every render.
  const today = useMemo(() => startOfDay(new Date()), []);
  const todaysBookings = bookings.filter((b) => startOfDay(new Date(b.date)).getTime() === today.getTime());
  const lowStock = stock.filter((s) => s.isLowStock);
  const openTasks = tasks.filter((t) => t.status !== 'completed');

  const revenueOf = (b: Booking) => (REVENUE_STATUSES.includes(b.status) ? b.totalPrice : 0);
  const currency = bookings[0]?.currency ?? studio?.currency ?? '$';

  const revenueData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    return days.map((d) => ({
      label: DAY_LABEL[d.getDay()],
      value: bookings.filter((b) => startOfDay(new Date(b.date)).getTime() === d.getTime()).reduce((sum, b) => sum + revenueOf(b), 0),
    }));
  }, [bookings, today]);

  const weekRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);

  const topPerformers = useMemo(() => {
    const byEmployee = new Map<string, { id: string; name: string; count: number; revenue: number }>();
    for (const b of bookings) {
      if (!b.employeeId || !b.employee) continue;
      const entry = byEmployee.get(b.employeeId) ?? { id: b.employeeId, name: b.employee.name, count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += revenueOf(b);
      byEmployee.set(b.employeeId, entry);
    }
    return Array.from(byEmployee.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [bookings]);

  const clientInsights = useMemo(() => {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      newThisMonth: clients.filter((c) => new Date(c.createdAt) >= monthStart).length,
      returning: clients.filter((c) => c.visitedTimes >= 2).length,
      vip: clients.filter((c) => c.status === 'vip').length,
    };
  }, [clients, today]);

  return (
    <div>
      <PageHeader title={`Welcome back${studio ? `, ${studio.name}` : ''}`} description="Here's what's happening in your studio today." />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              <KpiCard icon={CalendarDays} label="Bookings today" value={todaysBookings.length} />
              <KpiCard icon={Users} label="Total clients" value={clients.length} />
              <KpiCard icon={Boxes} label="Low stock items" value={lowStock.length} />
              <KpiCard icon={ListChecks} label="Open tasks" value={openTasks.length} />
              <KpiCard
                icon={Users}
                label="Revenue (7 days)"
                value={`${currency} ${weekRevenue.toLocaleString()}`}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-gray-900">Revenue trend</h2>
                    <p className="text-sm text-gray-500">Last 7 days</p>
                  </div>
                  <RevenueChart data={revenueData} />
                </section>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ClientInsights {...clientInsights} />
                  <InventoryAlerts items={lowStock} />
                </div>
              </div>

              <div className="space-y-6">
                <TopPerformers performers={topPerformers} currency={currency} />
                <ActivityFeed items={activity} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
