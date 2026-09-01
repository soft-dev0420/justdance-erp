'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/juststudio/ui/button';
import { Input, Label } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { catalogApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
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
        toast.success('Service updated');
      } else {
        await catalogApi.createService({ categoryId, name: name.trim(), hours, minutes, price: Number(price), description: description.trim() || undefined });
        toast.success('Service added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={service ? 'Edit service' : 'Add service'}>
      <div className="flex flex-col gap-4">
        <div>
          <Label>Service name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="60-min private lesson" />
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
        <div>
          <Label>Description (optional)</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's included" />
        </div>
        <Button onClick={() => void onSubmit()} disabled={submitting || !name.trim() || !price}>
          {submitting ? 'Saving…' : service ? 'Save changes' : 'Add service'}
        </Button>
      </div>
    </Modal>
  );
}
