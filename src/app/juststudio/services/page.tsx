'use client';

import { Loader2, Plus, Tags } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { CategoryCard } from '@/components/juststudio/services/category-card';
import { ServiceFormModal } from '@/components/juststudio/services/service-form-modal';
import { ServiceStats } from '@/components/juststudio/services/service-stats';
import { PageHeader } from '@/components/juststudio/page-header';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { Input, Label } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { catalogApi, studioApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Category, Service } from '@/lib/types';

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [serviceModal, setServiceModal] = useState<{ categoryId: number; service: Service | null } | null>(null);

  const load = () => catalogApi.listCategories().then(setCategories);

  useEffect(() => {
    Promise.all([load(), studioApi.me().then((s) => setCurrency(s.currency ?? 'USD'))])
      .catch((err) => toast.error(err instanceof ApiError ? err.message : 'Failed to load services'))
      .finally(() => setLoading(false));
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

  const onDeleteCategory = async (category: Category) => {
    if (!confirm(`Delete "${category.category}" and all its services?`)) return;
    try {
      await catalogApi.removeCategory(category.id);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete category');
    }
  };

  const onDeleteService = async (service: Service) => {
    if (!confirm(`Delete "${service.name}"?`)) return;
    try {
      await catalogApi.removeService(service.id);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete service');
    }
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

      <div className="space-y-6 p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState icon={Tags} title="No categories yet" description="Add a category (e.g. Private Lessons) to start listing priced services." />
        ) : (
          <>
            <ServiceStats categories={categories} currency={currency} />
            <div className="flex flex-col gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onAddService={(categoryId) => setServiceModal({ categoryId, service: null })}
                  onEditService={(service) => setServiceModal({ categoryId: service.categoryId, service })}
                  onDeleteService={(service) => void onDeleteService(service)}
                  onDeleteCategory={(category) => void onDeleteCategory(category)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Add category">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Category name</Label>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Private Lessons" />
          </div>
          <Button onClick={() => void onAddCategory()} disabled={submitting || !categoryName.trim()}>
            {submitting ? 'Adding…' : 'Add category'}
          </Button>
        </div>
      </Modal>

      {serviceModal && <ServiceFormModal categoryId={serviceModal.categoryId} service={serviceModal.service} onClose={() => setServiceModal(null)} onSaved={load} />}
    </div>
  );
}
