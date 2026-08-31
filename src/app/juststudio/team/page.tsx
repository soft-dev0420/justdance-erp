'use client';

import { Loader2, Plus, UserSquare2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { TeamFilters } from '@/components/juststudio/team/team-filters';
import { TeamFormModal } from '@/components/juststudio/team/team-form-modal';
import { TeamMemberCard } from '@/components/juststudio/team/team-member-card';
import { TeamProfilePanel } from '@/components/juststudio/team/team-profile-panel';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { ApiError } from '@/lib/api-fetch';
import { employeesApi, rolesApi } from '@/lib/api';
import type { Employee, Role } from '@/lib/types';

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeRole, setActiveRole] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  const [selected, setSelected] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    Promise.all([employeesApi.list(), rolesApi.list()])
      .then(([e, r]) => {
        setEmployees(e);
        setRoles(r);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of employees) {
      const name = e.role?.name ?? 'No role';
      counts[name] = (counts[name] ?? 0) + 1;
    }
    return counts;
  }, [employees]);

  const filtered = useMemo(() => {
    let result = [...employees];
    if (activeRole !== 'All') result = result.filter((e) => (e.role?.name ?? 'No role') === activeRole);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q) || (e.email ?? '').toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sortBy === 'role') return (a.role?.name ?? '').localeCompare(b.role?.name ?? '');
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [employees, activeRole, sortBy, searchQuery]);

  const onAdd = async (values: { name: string; email: string; roleId: string; speciality: string }) => {
    setSubmitting(true);
    try {
      const created = await employeesApi.create({
        name: values.name,
        email: values.email,
        roleId: values.roleId || undefined,
        speciality: values.speciality || undefined,
      });
      setEmployees((prev) => [...prev, created]);
      toast.success('Invite sent');
      setFormMode(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to invite team member');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = async (values: { name: string; roleId: string; speciality: string; status: Employee['status'] }) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      // update() returns the role relation populated; updateStatus() doesn't
      // (it's a plain Prisma update with no include), so it can't be used as
      // the merged source of truth on its own — apply the status locally
      // onto update()'s fuller response instead.
      const withDetails = await employeesApi.update(selected.id, {
        name: values.name,
        roleId: values.roleId || undefined,
        speciality: values.speciality,
      });
      await employeesApi.updateStatus(selected.id, values.status);
      const merged = { ...withDetails, status: values.status };
      setEmployees((prev) => prev.map((e) => (e.id === merged.id ? merged : e)));
      setSelected(merged);
      toast.success('Team member updated');
      setFormMode(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save changes');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Team"
        description="Everyone with access to this studio."
        action={
          <Button onClick={() => setFormMode('add')}>
            <Plus size={16} /> Invite team member
          </Button>
        }
      />

      <div className="flex flex-1">
        <div className="flex-1 p-6 sm:p-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-accent-500" size={24} />
            </div>
          ) : (
            <>
              <TeamFilters
                roleCounts={roleCounts}
                total={employees.length}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              {filtered.length === 0 ? (
                <EmptyState icon={UserSquare2} title="No team members found" description={searchQuery || activeRole !== 'All' ? 'Try adjusting your filters.' : undefined} />
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((member) => (
                    <TeamMemberCard key={member.id} member={member} isSelected={selected?.id === member.id} onSelect={(m) => setSelected((prev) => (prev?.id === m.id ? null : m))} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <TeamProfilePanel
          member={selected}
          onClose={() => setSelected(null)}
          onEdit={(m) => {
            setSelected(m);
            setFormMode('edit');
          }}
        />
      </div>

      <TeamFormModal
        key={formMode === 'edit' ? selected?.id : formMode}
        mode={formMode}
        member={selected}
        roles={roles}
        submitting={submitting}
        onClose={() => setFormMode(null)}
        onSubmitAdd={onAdd}
        onSubmitEdit={onEdit}
      />
    </div>
  );
}
