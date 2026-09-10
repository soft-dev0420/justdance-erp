'use client';

import { useState } from 'react';

import { Button } from '@/components/juststudio/ui/button';
import { Input, Label, Select } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { useLanguage } from '@/lib/i18n';
import type { Employee, Role } from '@/lib/types';

import { statusLabel } from './types';

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
  const { t } = useLanguage();
  const STATUS_OPTIONS: Employee['status'][] = ['available', 'vacation', 'sick', 'unavailable', 'off-duty'];
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
      <Modal open title={t.inviteTeamMember} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div>
            <Label>{t.fieldName}</Label>
            <Input value={add.name} onChange={(e) => setAdd((s) => ({ ...s, name: e.target.value }))} placeholder={t.fullNamePlaceholder} />
          </div>
          <div>
            <Label>{t.email}</Label>
            <Input type="email" value={add.email} onChange={(e) => setAdd((s) => ({ ...s, email: e.target.value }))} placeholder={t.emailPlaceholderTeammate} />
          </div>
          <div>
            <Label>{t.roleOptional}</Label>
            <Select value={add.roleId} onChange={(e) => setAdd((s) => ({ ...s, roleId: e.target.value }))}>
              <option value="">{t.noRoleAssignedYet}</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t.specialityOptional}</Label>
            <Input value={add.speciality} onChange={(e) => setAdd((s) => ({ ...s, speciality: e.target.value }))} placeholder={t.specialityPlaceholder} />
          </div>
          <Button onClick={() => onSubmitAdd(add)} disabled={submitting || !add.name || !add.email}>
            {submitting ? t.sendingInvite : t.sendInvite}
          </Button>
        </div>
      </Modal>
    );
  }

  if (mode === 'edit' && member) {
    return (
      <Modal open title={`${t.edit} ${member.name}`} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <div>
            <Label>{t.fieldName}</Label>
            <Input value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.fieldRole}</Label>
              <Select value={edit.roleId} onChange={(e) => setEdit((s) => ({ ...s, roleId: e.target.value }))}>
                <option value="">{t.unassigned}</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t.availability}</Label>
              <Select value={edit.status} onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value as Employee['status'] }))}>
                {STATUS_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {statusLabel(value, t)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>{t.speciality}</Label>
            <Input value={edit.speciality} onChange={(e) => setEdit((s) => ({ ...s, speciality: e.target.value }))} placeholder={t.specialityPlaceholder} />
          </div>
          <Button onClick={() => onSubmitEdit(edit)} disabled={submitting || !edit.name}>
            {submitting ? t.saving : t.saveChanges}
          </Button>
        </div>
      </Modal>
    );
  }

  return null;
}
