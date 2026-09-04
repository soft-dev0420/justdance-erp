'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ActivityFeed } from '@/components/juststudio/dashboard/activity-feed';
import { ClientInsights } from '@/components/juststudio/dashboard/client-insights';
import { DashboardHeader } from '@/components/juststudio/dashboard/dashboard-header';
import { type DashboardKSI, glass } from '@/components/juststudio/dashboard/dashboard-types';
import { InventoryAlerts } from '@/components/juststudio/dashboard/inventory-alerts';
import { KpiCards } from '@/components/juststudio/dashboard/kpi-cards';
import { RevenueChart } from '@/components/juststudio/dashboard/revenue-chart';
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
  const [metrics, setMetrics] = useState<DashboardKSI>(EMPTY_METRICS);

  /* Fetch data */
  useEffect(() => {
    dashboardApi
      .ksi()
      .then(setMetrics)
      .catch((e) => toast.error(e instanceof Error ? e.message : 'Failed to load dashboard.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
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

              {/* Schedule/Booking is hidden per the client's "remove booking
                  for now" — ScheduleSnapshot component kept intact for a
                  one-line re-enable, just not rendered here. */}

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
