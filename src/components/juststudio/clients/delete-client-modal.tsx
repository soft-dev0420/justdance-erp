'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/juststudio/ui/button';
import { Modal } from '@/components/juststudio/ui/modal';

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
  return (
    <Modal open title="Remove client" onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <p className="mb-6 text-sm text-gray-500">
          Remove <span className="font-medium text-gray-900">{clientName}</span> from your studio&apos;s client list? This won&apos;t delete their Just Dance account.
        </p>
        <div className="flex w-full gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={submitting} className="flex-1">
            {submitting ? 'Removing…' : 'Remove'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
