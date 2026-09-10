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
import { useLanguage } from '@/lib/i18n';
import type { Category, Service } from '@/lib/types';

export default function ServicesPage() {
  const { t } = useLanguage();
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
      .catch((err) => toast.error(err instanceof ApiError ? err.message : t.failedToLoadServices))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddCategory = async () => {
    if (!categoryName.trim()) return;
    setSubmitting(true);
    try {
      await catalogApi.createCategory(categoryName.trim());
      toast.success(t.categoryAdded);
      setCategoryModalOpen(false);
      setCategoryName('');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.failedToAddCategory);
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteCategory = async (category: Category) => {
    if (!confirm(t.confirmDeleteCategory.replace('{value}', category.category))) return;
    try {
      await catalogApi.removeCategory(category.id);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.failedToDeleteCategory);
    }
  };

  const onDeleteService = async (service: Service) => {
    if (!confirm(t.confirmDeleteService.replace('{value}', service.name))) return;
    try {
      await catalogApi.removeService(service.id);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.failedToDeleteService);
    }
  };

  return (
    <div>
      <PageHeader
        title={t.navServices}
        description={t.servicesPageDescription}
        action={
          <Button onClick={() => setCategoryModalOpen(true)}>
            <Plus size={16} /> {t.addCategory}
          </Button>
        }
      />

      <div className="space-y-6 p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState icon={Tags} title={t.noCategoriesYet} description={t.addCategoryHint} />
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

      <Modal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} title={t.addCategory}>
        <div className="flex flex-col gap-4">
          <div>
            <Label>{t.categoryNameLabel}</Label>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder={t.categoryNamePlaceholder} />
          </div>
          <Button onClick={() => void onAddCategory()} disabled={submitting || !categoryName.trim()}>
            {submitting ? t.adding : t.addCategory}
          </Button>
        </div>
      </Modal>

      {serviceModal && <ServiceFormModal categoryId={serviceModal.categoryId} service={serviceModal.service} onClose={() => setServiceModal(null)} onSaved={load} />}
    </div>
  );
}
