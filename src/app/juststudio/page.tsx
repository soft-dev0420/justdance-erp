'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { ActivityFeed } from '@/components/juststudio/dashboard/activity-feed';
import { ClientInsights } from '@/components/juststudio/dashboard/client-insights';
import { DashboardHeader } from '@/components/juststudio/dashboard/dashboard-header';
import { type DashboardKSI, glass, SNAP_END, SNAP_START, timeToMinutes } from '@/components/juststudio/dashboard/dashboard-types';
import { InventoryAlerts } from '@/components/juststudio/dashboard/inventory-alerts';
import { KpiCards } from '@/components/juststudio/dashboard/kpi-cards';
import { RevenueChart } from '@/components/juststudio/dashboard/revenue-chart';
import { ScheduleHint } from '@/components/juststudio/dashboard/schedule-hint';
import { ScheduleSnapshot } from '@/components/juststudio/dashboard/schedule-snapshot';
import { TopPerformers } from '@/components/juststudio/dashboard/top-performers';
import { useStudio } from '@/context/studio-context';
import { dashboardApi } from '@/lib/api';

const EMPTY_METRICS: DashboardKSI = {
  bookings: 0,
  revenue: 0,
  activeClients: 0,
  clientInsights: { newClients: 0, returning: 0, highValue: 0 },
  utilization: 0,
  slots: 0,
  revenueData: [],
  topPerformers: [],
  scheduleSnapshots: [],
  activityFeed: [],
  inventoryAlerts: [],
};

export default function DashboardPage() {
  const { studio } = useStudio();
  const currency = studio?.currency ?? 'USD';

  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [metrics, setMetrics] = useState<DashboardKSI>(EMPTY_METRICS);

  /* Tick for now-line */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* Fetch data */
  useEffect(() => {
    dashboardApi
      .ksi()
      .then(setMetrics)
      .catch((e) => toast.error(e instanceof Error ? e.message : 'Failed to load dashboard.'))
      .finally(() => setIsLoading(false));
  }, []);

  /* Schedule snapshot: compute left/width % on the client */
  const snapStaff = useMemo(() => {
    return metrics.scheduleSnapshots.map(({ emp, appts }) => ({
      emp,
      appts: appts
        .filter((b) => timeToMinutes(b.startTime) >= SNAP_START && timeToMinutes(b.startTime) < SNAP_END)
        .map((b) => {
          const s = timeToMinutes(b.startTime);
          const e = timeToMinutes(b.endTime);
          const left = ((s - SNAP_START) / (SNAP_END - SNAP_START)) * 100;
          const width = ((e - s) / (SNAP_END - SNAP_START)) * 100;
          return { ...b, left, width: Math.max(width, 8) };
        }),
    }));
  }, [metrics.scheduleSnapshots]);

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowPct = Math.max(0, Math.min(100, ((nowMins - SNAP_START) / (SNAP_END - SNAP_START)) * 100));
  const showNow = nowMins >= SNAP_START && nowMins < SNAP_END;

  return (
    <div className="min-h-full bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
      <ScheduleHint />

      <DashboardHeader />

      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <KpiCards
            isLoading={isLoading}
            bookingCount={metrics.bookings}
            activeClients={metrics.activeClients}
            revenue={metrics.revenue}
            utilPct={metrics.utilization}
            totalSlots={metrics.slots}
            currency={currency}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column (span 2) */}
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl p-6 shadow-sm" style={glass}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Revenue trend</h2>
                    <p className="text-sm text-slate-500">Daily revenue performance</p>
                  </div>
                </div>
                <RevenueChart revenueData={metrics.revenueData} loading={isLoading} />
              </section>

              <ScheduleSnapshot snapStaff={snapStaff} showNow={showNow} nowPct={nowPct} now={now} />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ClientInsights isLoading={isLoading} data={metrics.clientInsights} />
                <InventoryAlerts items={metrics.inventoryAlerts} />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <TopPerformers topPerformers={metrics.topPerformers} currency={currency} />
              <ActivityFeed items={metrics.activityFeed} style={glass} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
