'use client';

import { CalendarDays, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { Input, Label, Select } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { bookingsApi, catalogApi, clientsApi, employeesApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Booking, Category, Employee, StudioClient } from '@/lib/types';

const STATUS_COLORS: Record<Booking['status'], string> = {
  confirmed: 'bg-accent-50 text-accent-600',
  completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
  'no-show': 'bg-gray-100 text-gray-500',
};

export default function SchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<StudioClient[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [studioClientId, setStudioClientId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [totalDuration, setTotalDuration] = useState('60');

  const services = categories.flatMap((cat) => cat.services.map((s) => ({ ...s, categoryName: cat.category })));

  const load = () =>
    Promise.all([bookingsApi.list(), clientsApi.list(), employeesApi.list(), catalogApi.listCategories()])
      .then(([b, c, e, cats]) => {
        setBookings(b);
        setClients(c);
        setEmployees(e);
        setCategories(cats);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onSelectService = (id: string) => {
    setServiceId(id);
    const service = services.find((s) => s.id === id);
    if (service?.price) {
      setTotalPrice(String(service.price.price));
      const hours = Number(service.price.hours) || 0;
      const minutes = Number(service.price.minutes) || 0;
      setTotalDuration(String(hours * 60 + minutes));
    }
  };

  const onCreate = async () => {
    if (!studioClientId || !date || !timeSlot || !totalPrice) return;
    setSubmitting(true);
    try {
      await bookingsApi.create({
        studioClientId,
        employeeId: employeeId || undefined,
        date,
        timeSlot,
        totalPrice: Number(totalPrice),
        totalDuration: `${totalDuration}min`,
        serviceIds: serviceId ? [serviceId] : undefined,
      });
      toast.success('Booking created');
      setModalOpen(false);
      setStudioClientId('');
      setEmployeeId('');
      setServiceId('');
      setDate('');
      setTimeSlot('');
      setTotalPrice('');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const onStatusChange = async (id: string, status: Booking['status']) => {
    await bookingsApi.updateStatus(id, status);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Schedule"
        description="Bookings and appointments for your studio."
        action={
          <Button onClick={() => setModalOpen(true)} disabled={clients.length === 0}>
            <Plus size={16} /> New booking
          </Button>
        }
      />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No bookings yet"
            description={clients.length === 0 ? 'Add a client first, then create a booking.' : undefined}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3.5 last:border-b-0 hover:bg-gray-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{b.studioClient.client.user.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {new Date(b.date).toLocaleDateString()} · {b.timeSlot} · {b.employee?.name ?? 'Unassigned'}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <span className="text-xs text-gray-600">
                    {b.currency} {b.totalPrice}
                  </span>
                  <select
                    value={b.status}
                    onChange={(e) => onStatusChange(b.id, e.target.value as Booking['status'])}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${STATUS_COLORS[b.status]}`}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No-show</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New booking">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Client</Label>
            <Select value={studioClientId} onChange={(e) => setStudioClientId(e.target.value)}>
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.client.user.name}
                </option>
              ))}
            </Select>
          </div>
          {services.length > 0 && (
            <div>
              <Label>Service (optional — fills in price &amp; duration)</Label>
              <Select value={serviceId} onChange={(e) => onSelectService(e.target.value)}>
                <option value="">Custom / none</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.categoryName} — {s.name} {s.price ? `($${s.price.price})` : ''}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div>
            <Label>Instructor (optional — defaults to you)</Label>
            <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">Default</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price</Label>
              <Input type="number" min={0} value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="80" />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input type="number" min={0} value={totalDuration} onChange={(e) => setTotalDuration(e.target.value)} />
            </div>
          </div>
          <Button onClick={onCreate} disabled={submitting || !studioClientId || !date || !timeSlot || !totalPrice}>
            {submitting ? 'Creating…' : 'Create booking'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
