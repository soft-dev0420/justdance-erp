'use client';

import { useState } from 'react';

import { Button } from '@/components/juststudio/ui/button';
import { Input, Label, Select, Textarea } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { useLanguage } from '@/lib/i18n';
import type { Employee, StudioClient } from '@/lib/types';

import { clientStatusLabel, CLIENT_STATUSES } from './types';

interface AddValues {
  email: string;
  instructorId: string;
  notes: string;
}

interface EditValues {
  instructorId: string;
  notes: string;
  status: string;
  hasInjury: boolean;
  injuryNotes: string;
}

export function ClientFormModal({
  mode,
  client,
  employees,
  submitting,
  onClose,
  onSubmitAdd,
  onSubmitEdit,
}: {
  mode: 'add' | 'edit' | null;
  client: StudioClient | null;
  employees: Employee[];
  submitting: boolean;
  onClose: () => void;
  onSubmitAdd: (values: AddValues) => void;
  onSubmitEdit: (values: EditValues) => void;
}) {
  const { t } = useLanguage();
  // Lazy initializers read straight from props — the parent remounts this
  // component (via a `key` keyed to the target client/mode) whenever the
  // edit target changes, so there's no need to sync state via an effect.
  const [add, setAdd] = useState<AddValues>({ email: '', instructorId: '', notes: '' });
  const [edit, setEdit] = useState<EditValues>(() => ({
    instructorId: client?.instructorId ?? '',
    notes: client?.notes ?? '',
    status: client?.status ?? 'regular-customer',
    hasInjury: client?.client.hasInjury ?? false,
    injuryNotes: client?.client.injuryNotes ?? '',
  }));

  if (mode === 'add') {
    return (
      <Modal open title={t.addClient} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div>
            <Label>{t.clientsEmailLabel}</Label>
            <Input type="email" value={add.email} onChange={(e) => setAdd((s) => ({ ...s, email: e.target.value }))} placeholder={t.clientEmailPlaceholder} />
            <p className="mt-1.5 text-xs text-gray-500">{t.clientEmailHint}</p>
          </div>
          <div>
            <Label>{t.instructorOptional}</Label>
            <Select value={add.instructorId} onChange={(e) => setAdd((s) => ({ ...s, instructorId: e.target.value }))}>
              <option value="">{t.unassigned}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t.notesOptional}</Label>
            <Textarea rows={3} value={add.notes} onChange={(e) => setAdd((s) => ({ ...s, notes: e.target.value }))} />
          </div>
          <Button onClick={() => onSubmitAdd(add)} disabled={submitting || !add.email}>
            {submitting ? t.adding : t.addClient}
          </Button>
        </div>
      </Modal>
    );
  }

  if (mode === 'edit' && client) {
    return (
      <Modal open title={`${t.edit} ${client.client.user.name}`} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.statusFieldLabel}</Label>
              <Select value={edit.status} onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value }))}>
                {CLIENT_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {clientStatusLabel(value, t)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t.instructorLabel}</Label>
              <Select value={edit.instructorId} onChange={(e) => setEdit((s) => ({ ...s, instructorId: e.target.value }))}>
                <option value="">{t.unassigned}</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>{t.notesLabel}</Label>
            <Textarea rows={3} value={edit.notes} onChange={(e) => setEdit((s) => ({ ...s, notes: e.target.value }))} />
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 select-none">
            <span className="text-sm font-medium text-gray-800">{t.hasInjuryToggle}</span>
            <button
              type="button"
              role="switch"
              aria-checked={edit.hasInjury}
              onClick={() => setEdit((s) => ({ ...s, hasInjury: !s.hasInjury }))}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${edit.hasInjury ? 'bg-accent-600' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${edit.hasInjury ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </label>

          {edit.hasInjury && (
            <div>
              <Label>{t.injuryDetailsLabel}</Label>
              <Input value={edit.injuryNotes} onChange={(e) => setEdit((s) => ({ ...s, injuryNotes: e.target.value }))} placeholder={t.injuryDetailsPlaceholder} />
            </div>
          )}

          <Button onClick={() => onSubmitEdit(edit)} disabled={submitting}>
            {submitting ? t.saving : t.saveChanges}
          </Button>
        </div>
      </Modal>
    );
  }

  return null;
}
