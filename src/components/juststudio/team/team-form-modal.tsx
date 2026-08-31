'use client';

import { useState } from 'react';

import { Button } from '@/components/juststudio/ui/button';
import { Input, Label, Select } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import type { Employee, Role } from '@/lib/types';

import { STATUS_LABELS } from './types';

interface AddValues {
  name: string;
  email: string;
  roleId: string;
  speciality: string;
}

interface EditValues {
  name: string;
  roleId: string;
  speciality: string;
  status: Employee['status'];
}

export function TeamFormModal({
  mode,
  member,
  roles,
  submitting,
  onClose,
  onSubmitAdd,
  onSubmitEdit,
}: {
  mode: 'add' | 'edit' | null;
  member: Employee | null;
  roles: Role[];
  submitting: boolean;
  onClose: () => void;
  onSubmitAdd: (values: AddValues) => void;
  onSubmitEdit: (values: EditValues) => void;
}) {
  const [add, setAdd] = useState<AddValues>({ name: '', email: '', roleId: '', speciality: '' });
  // Lazy initializer reads straight from props — the parent remounts this
  // component (via a `key` keyed to the target member/mode) whenever the
  // edit target changes, so no effect is needed to keep this in sync.
  const [edit, setEdit] = useState<EditValues>(() => ({
    name: member?.name ?? '',
    roleId: member?.roleId ?? '',
    speciality: member?.speciality ?? '',
    status: member?.status ?? 'available',
  }));

  if (mode === 'add') {
    return (
      <Modal open title="Invite team member" onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Name</Label>
            <Input value={add.name} onChange={(e) => setAdd((s) => ({ ...s, name: e.target.value }))} placeholder="Full name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={add.email} onChange={(e) => setAdd((s) => ({ ...s, email: e.target.value }))} placeholder="teammate@example.com" />
          </div>
          <div>
            <Label>Role (optional)</Label>
            <Select value={add.roleId} onChange={(e) => setAdd((s) => ({ ...s, roleId: e.target.value }))}>
              <option value="">No role assigned yet</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Speciality (optional)</Label>
            <Input value={add.speciality} onChange={(e) => setAdd((s) => ({ ...s, speciality: e.target.value }))} placeholder="e.g. Ballroom, Hip-hop" />
          </div>
          <Button onClick={() => onSubmitAdd(add)} disabled={submitting || !add.name || !add.email}>
            {submitting ? 'Sending invite…' : 'Send invite'}
          </Button>
        </div>
      </Modal>
    );
  }

  if (mode === 'edit' && member) {
    return (
      <Modal open title={`Edit ${member.name}`} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Name</Label>
            <Input value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Role</Label>
              <Select value={edit.roleId} onChange={(e) => setEdit((s) => ({ ...s, roleId: e.target.value }))}>
                <option value="">Unassigned</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Availability</Label>
              <Select value={edit.status} onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value as Employee['status'] }))}>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>Speciality</Label>
            <Input value={edit.speciality} onChange={(e) => setEdit((s) => ({ ...s, speciality: e.target.value }))} placeholder="e.g. Ballroom, Hip-hop" />
          </div>
          <Button onClick={() => onSubmitEdit(edit)} disabled={submitting || !edit.name}>
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </Modal>
    );
  }

  return null;
}
