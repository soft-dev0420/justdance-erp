'use client';

import { Crown, Loader2, Plus, UserSquare2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { Input, Label, Select } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { employeesApi, rolesApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Employee, Role } from '@/lib/types';

const STATUS_COLORS: Record<Employee['status'], string> = {
  available: 'bg-emerald-50 text-emerald-600',
  vacation: 'bg-sky-50 text-sky-600',
  sick: 'bg-amber-50 text-amber-600',
  unavailable: 'bg-gray-100 text-gray-500',
  'off-duty': 'bg-gray-100 text-gray-500',
};

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => Promise.all([employeesApi.list(), rolesApi.list()]).then(([e, r]) => {
    setEmployees(e);
    setRoles(r);
  }).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onInvite = async () => {
    if (!name || !email) return;
    setSubmitting(true);
    try {
      await employeesApi.create({ name, email, roleId: roleId || undefined });
      toast.success('Invite sent');
      setModalOpen(false);
      setName('');
      setEmail('');
      setRoleId('');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to invite team member');
    } finally {
      setSubmitting(false);
    }
  };

  const onStatusChange = async (id: string, status: Employee['status']) => {
    await employeesApi.updateStatus(id, status);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Team"
        description="Everyone with access to this studio."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Invite team member
          </Button>
        }
      />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : employees.length === 0 ? (
          <EmptyState icon={UserSquare2} title="No team members" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3.5 last:border-b-0 hover:bg-gray-50">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-900">{emp.name}</p>
                    {emp.isOwner && <Crown size={13} className="flex-shrink-0 text-accent-500" />}
                  </div>
                  <p className="truncate text-xs text-gray-500">
                    {emp.email} {emp.role && `· ${emp.role.name}`}
                  </p>
                </div>
                {emp.isOwner ? (
                  <span className="flex-shrink-0 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-600">Owner</span>
                ) : (
                  <select
                    value={emp.status}
                    onChange={(e) => onStatusChange(emp.id, e.target.value as Employee['status'])}
                    className={`flex-shrink-0 rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${STATUS_COLORS[emp.status]}`}
                  >
                    <option value="available">Available</option>
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="off-duty">Off duty</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite team member">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@example.com" />
          </div>
          <div>
            <Label>Role (optional)</Label>
            <Select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="">No role assigned yet</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </div>
          <Button onClick={onInvite} disabled={submitting || !name || !email}>
            {submitting ? 'Sending invite…' : 'Send invite'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
