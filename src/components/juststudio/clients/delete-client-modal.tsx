'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/juststudio/ui/button';
import { Modal } from '@/components/juststudio/ui/modal';
import { useLanguage } from '@/lib/i18n';

export function DeleteClientModal({
  clientName,
  submitting,
  onClose,
  onConfirm,
}: {
  clientName: string;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLanguage();
  const [before, after] = t.removeClientConfirm.split('{value}');
  return (
    <Modal open title={t.removeClientTitle} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <p className="mb-6 text-sm text-gray-500">
          {before}
          <span className="font-medium text-gray-900">{clientName}</span>
          {after}
        </p>
        <div className="flex w-full gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {t.cancel}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={submitting} className="flex-1">
            {submitting ? t.removing : t.remove}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
