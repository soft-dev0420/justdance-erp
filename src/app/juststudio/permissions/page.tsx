'use client';

import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { rolesApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Role } from '@/lib/types';

function PermissionToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-5 w-9 flex-shrink-0 rounded-full transition ${checked ? 'bg-accent-500' : 'bg-gray-200'}`}
      >
        <span className={`block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = () =>
    rolesApi.list().then((r) => {
      setRoles(r);
      setSelectedId((prev) => prev ?? r.find((role) => role.name !== 'owner')?.id ?? r[0]?.id ?? null);
    }).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const selected = roles.find((r) => r.id === selectedId);

  const onToggle = async (key: string, value: boolean) => {
    if (!selected) return;
    // Optimistic update so the toggle feels instant.
    setRoles((prev) => prev.map((r) => (r.id === selected.id ? { ...r, permissions: { ...r.permissions, [key]: value } } : r)));
    try {
      await rolesApi.update(selected.id, { permissions: { [key]: value } });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update permission');
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-accent-500" size={24} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Roles & Permissions" description="Control what each role can see and do." />

      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
        <div className="flex flex-shrink-0 flex-col gap-1 sm:w-56">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedId(role.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm capitalize transition ${
                role.id === selectedId ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {role.name}
              <span className="ml-2 text-xs text-gray-400">({role.userCount})</span>
            </button>
          ))}
        </div>

        <div className="flex-1">
          {!selected ? (
            <EmptyState icon={ShieldCheck} title="No roles yet" />
          ) : selected.name === 'owner' ? (
            <p className="text-sm text-gray-500">The owner role always has full access and can&apos;t be restricted.</p>
          ) : (
            <div className="max-w-lg divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white px-4 shadow-sm">
              {Object.entries(selected.permissions)
                .filter(([key]) => !key.includes('.'))
                .map(([key, value]) => (
                  <PermissionToggle key={key} label={key} checked={value} onChange={(v) => onToggle(key, v)} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
