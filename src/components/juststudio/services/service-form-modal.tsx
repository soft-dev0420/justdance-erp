'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/juststudio/ui/button';
import { Input, Label } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { catalogApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import { useLanguage } from '@/lib/i18n';
import type { Service } from '@/lib/types';

export function ServiceFormModal({
  categoryId,
  service,
  onClose,
  onSaved,
}: {
  categoryId: number;
  service: Service | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState(service?.name ?? '');
  const [hours, setHours] = useState(service?.price?.hours ?? '0');
  const [minutes, setMinutes] = useState(service?.price?.minutes ?? '60');
  const [price, setPrice] = useState(service?.price ? String(service.price.price) : '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!name.trim() || !price) return;
    setSubmitting(true);
    try {
      if (service) {
        await catalogApi.updateService(service.id, { name: name.trim(), hours, minutes, price: Number(price), description: description.trim() || undefined });
        toast.success(t.serviceUpdated);
      } else {
        await catalogApi.createService({ categoryId, name: name.trim(), hours, minutes, price: Number(price), description: description.trim() || undefined });
        toast.success(t.serviceAdded);
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.failedToSaveService);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={service ? t.editService : t.addService}>
      <div className="flex flex-col gap-4">
        <div>
          <Label>{t.serviceNameLabel}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.serviceNamePlaceholder} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>{t.hoursLabel}</Label>
            <Input type="number" min={0} value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <div>
            <Label>{t.minutesLabel}</Label>
            <Input type="number" min={0} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </div>
          <div>
            <Label>{t.priceLabel}</Label>
            <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="80" />
          </div>
        </div>
        <div>
          <Label>{t.descriptionOptional}</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.whatsIncludedPlaceholder} />
        </div>
        <Button onClick={() => void onSubmit()} disabled={submitting || !name.trim() || !price}>
          {submitting ? t.saving : service ? t.saveChanges : t.addService}
        </Button>
      </div>
    </Modal>
  );
}
