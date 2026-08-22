'use client';

import { Boxes, CalendarDays, ListChecks, Loader2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/juststudio/page-header';
import { useStudio } from '@/context/studio-context';
import { bookingsApi, clientsApi, stockApi, tasksApi } from '@/lib/api';
import type { Booking, StockItem, StudioClient, Task } from '@/lib/types';

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { studio } = useStudio();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<StudioClient[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    Promise.all([clientsApi.list(), bookingsApi.list(), stockApi.list(), tasksApi.list()])
      .then(([c, b, s, t]) => {
        setClients(c);
        setBookings(b);
        setStock(s);
        setTasks(t);
      })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((b) => b.date.slice(0, 10) === today);
  const lowStock = stock.filter((s) => s.isLowStock);
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  return (
    <div>
      <PageHeader title={`Welcome back${studio ? `, ${studio.name}` : ''}`} description="Here's what's happening in your studio today." />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard icon={Users} label="Total clients" value={clients.length} />
              <StatCard icon={CalendarDays} label="Bookings today" value={todaysBookings.length} />
              <StatCard icon={Boxes} label="Low stock items" value={lowStock.length} />
              <StatCard icon={ListChecks} label="Open tasks" value={pendingTasks.length} />
            </div>

            {lowStock.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-sm font-semibold text-gray-900">Low stock</h2>
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {lowStock.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-xs font-medium text-amber-600">
                        {item.currentStock} {item.unit} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
