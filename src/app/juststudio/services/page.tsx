'use client';

import { Loader2, Plus, Tags, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { Input, Label } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { catalogApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Category } from '@/lib/types';

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const [serviceModalFor, setServiceModalFor] = useState<number | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('60');
  const [price, setPrice] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const load = () => catalogApi.listCategories().then(setCategories).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onAddCategory = async () => {
    if (!categoryName.trim()) return;
    setSubmitting(true);
    try {
      await catalogApi.createCategory(categoryName.trim());
      toast.success('Category added');
      setCategoryModalOpen(false);
      setCategoryName('');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const onRemoveCategory = async (id: number) => {
    if (!confirm('Delete this category and all its services?')) return;
    await catalogApi.removeCategory(id);
    load();
  };

  const onAddService = async () => {
    if (serviceModalFor === null || !serviceName.trim() || !price) return;
    setSubmitting(true);
    try {
      await catalogApi.createService({
        categoryId: serviceModalFor,
        name: serviceName.trim(),
        hours,
        minutes,
        price: Number(price),
      });
      toast.success('Service added');
      setServiceModalFor(null);
      setServiceName('');
      setHours('0');
      setMinutes('60');
      setPrice('');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add service');
    } finally {
      setSubmitting(false);
    }
  };

  const onRemoveService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await catalogApi.removeService(id);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description="Your priced offerings, organized by category — pulled into Schedule when booking."
        action={
          <Button onClick={() => setCategoryModalOpen(true)}>
            <Plus size={16} /> Add category
          </Button>
        }
      />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState icon={Tags} title="No categories yet" description="Add a category (e.g. Private Lessons) to start listing priced services." />
        ) : (
          <div className="flex flex-col gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setServiceModalFor(cat.id)}
                      className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
                    >
                      <Plus size={13} /> Add service
                    </button>
                    <button onClick={() => onRemoveCategory(cat.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {cat.services.length === 0 ? (
                  <p className="px-4 py-4 text-xs text-gray-400">No services in this category yet.</p>
                ) : (
                  cat.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between border-t border-gray-100 px-4 py-3 hover:bg-gray-50">
                      <div>
                        <p className="text-sm text-gray-700">{service.name}</p>
                        {service.price && (
                          <p className="text-xs text-gray-500">
                            {service.price.hours !== '0' && `${service.price.hours}h `}
                            {service.price.minutes}min
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {service.price && <span className="text-sm font-medium text-gray-700">${service.price.price}</span>}
                        <button onClick={() => onRemoveService(service.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Add category">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Category name</Label>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Private Lessons" />
          </div>
          <Button onClick={onAddCategory} disabled={submitting || !categoryName.trim()}>
            {submitting ? 'Adding…' : 'Add category'}
          </Button>
        </div>
      </Modal>

      <Modal open={serviceModalFor !== null} onClose={() => setServiceModalFor(null)} title="Add service">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Service name</Label>
            <Input value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="60-min private lesson" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Hours</Label>
              <Input type="number" min={0} value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
            <div>
              <Label>Minutes</Label>
              <Input type="number" min={0} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="80" />
            </div>
          </div>
          <Button onClick={onAddService} disabled={submitting || !serviceName.trim() || !price}>
            {submitting ? 'Adding…' : 'Add service'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
