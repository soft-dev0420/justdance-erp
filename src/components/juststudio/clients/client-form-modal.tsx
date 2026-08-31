'use client';

import { useState } from 'react';

import { Button } from '@/components/juststudio/ui/button';
import { Input, Label, Select, Textarea } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import type { Employee, StudioClient } from '@/lib/types';

import { STATUS_LABELS } from './types';

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
      <Modal open title="Add client" onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Client&apos;s email</Label>
            <Input type="email" value={add.email} onChange={(e) => setAdd((s) => ({ ...s, email: e.target.value }))} placeholder="dancer@example.com" />
            <p className="mt-1.5 text-xs text-gray-500">They need an existing Just Dance account with this email.</p>
          </div>
          <div>
            <Label>Instructor (optional)</Label>
            <Select value={add.instructorId} onChange={(e) => setAdd((s) => ({ ...s, instructorId: e.target.value }))}>
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Notes (optional)</Label>
            <Textarea rows={3} value={add.notes} onChange={(e) => setAdd((s) => ({ ...s, notes: e.target.value }))} />
          </div>
          <Button onClick={() => onSubmitAdd(add)} disabled={submitting || !add.email}>
            {submitting ? 'Adding…' : 'Add client'}
          </Button>
        </div>
      </Modal>
    );
  }

  if (mode === 'edit' && client) {
    return (
      <Modal open title={`Edit ${client.client.user.name}`} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={edit.status} onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value }))}>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Instructor</Label>
              <Select value={edit.instructorId} onChange={(e) => setEdit((s) => ({ ...s, instructorId: e.target.value }))}>
                <option value="">Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea rows={3} value={edit.notes} onChange={(e) => setEdit((s) => ({ ...s, notes: e.target.value }))} />
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 select-none">
            <span className="text-sm font-medium text-gray-800">Has an injury to note</span>
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
              <Label>Injury details</Label>
              <Input value={edit.injuryNotes} onChange={(e) => setEdit((s) => ({ ...s, injuryNotes: e.target.value }))} placeholder="e.g. Recovering from a knee sprain" />
            </div>
          )}

          <Button onClick={() => onSubmitEdit(edit)} disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </Modal>
    );
  }

  return null;
}
