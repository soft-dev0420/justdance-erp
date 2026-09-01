'use client';

import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { CreateRoleModal } from '@/components/juststudio/permissions/create-role-modal';
import { PermissionsMatrix } from '@/components/juststudio/permissions/permissions-matrix';
import { RoleDetails } from '@/components/juststudio/permissions/role-details';
import { RoleList } from '@/components/juststudio/permissions/role-list';
import { UnsavedBar } from '@/components/juststudio/permissions/unsaved-bar';
import { MODULES } from '@/components/juststudio/permissions/types';
import { rolesApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { Role } from '@/lib/types';

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [allPerms, setAllPerms] = useState<Record<string, Record<string, boolean>>>({});
  const [savedPerms, setSavedPerms] = useState<Record<string, Record<string, boolean>>>({});
  const [details, setDetails] = useState<Record<string, { name: string; description: string }>>({});
  const [savedDetails, setSavedDetails] = useState<Record<string, { name: string; description: string }>>({});

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await rolesApi.list();
      setRoles(data);

      const perms: Record<string, Record<string, boolean>> = {};
      const dets: Record<string, { name: string; description: string }> = {};
      for (const r of data) {
        perms[r.id] = r.permissions;
        dets[r.id] = { name: r.name, description: r.description };
      }
      setAllPerms(perms);
      setSavedPerms(structuredClone(perms));
      setDetails(dets);
      setSavedDetails(structuredClone(dets));

      setSelectedId((prev) => prev || data.find((r) => r.name !== 'owner')?.id || data[0]?.id || '');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRoles();
  }, [loadRoles]);

  const selectedRole = roles.find((r) => r.id === selectedId);
  const locked = selectedRole?.name === 'owner';
  const currentPerms = useMemo(() => allPerms[selectedId] ?? {}, [allPerms, selectedId]);
  const currentDetails = details[selectedId] ?? { name: '', description: '' };

  const hasUnsavedChanges = useMemo(() => {
    if (!selectedRole || locked) return false;
    const permChanged = JSON.stringify(allPerms[selectedId] ?? {}) !== JSON.stringify(savedPerms[selectedId] ?? {});
    const det = details[selectedId];
    const saved = savedDetails[selectedId];
    const detailChanged = det?.name !== saved?.name || det?.description !== saved?.description;
    return permChanged || detailChanged;
  }, [allPerms, savedPerms, details, savedDetails, selectedId, selectedRole, locked]);

  const allEnabled = useMemo(
    () =>
      MODULES.every((m) => {
        if (!currentPerms[m.id]) return false;
        return m.granular?.every((g) => currentPerms[`${m.id}.${g.id}`]) ?? true;
      }),
    [currentPerms],
  );

  const filteredRoles = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }, [roles, search]);

  const handleTogglePerm = (key: string, value: boolean) => {
    setAllPerms((prev) => {
      const rPerms = { ...(prev[selectedId] ?? {}) };
      rPerms[key] = value;
      const mod = MODULES.find((m) => m.id === key);
      mod?.granular?.forEach((g) => {
        rPerms[`${key}.${g.id}`] = value;
      });
      return { ...prev, [selectedId]: rPerms };
    });
  };

  const handleToggleAll = (value: boolean) => {
    setAllPerms((prev) => {
      const rPerms: Record<string, boolean> = {};
      MODULES.forEach((mod) => {
        rPerms[mod.id] = value;
        mod.granular?.forEach((g) => {
          rPerms[`${mod.id}.${g.id}`] = value;
        });
      });
      return { ...prev, [selectedId]: rPerms };
    });
  };

  const handleSave = async () => {
    if (!selectedRole || locked || isSaving) return;
    setIsSaving(true);
    try {
      const updated = await rolesApi.update(selectedId, {
        name: currentDetails.name,
        description: currentDetails.description,
        permissions: allPerms[selectedId] ?? {},
      });
      setSavedPerms((prev) => ({ ...prev, [selectedId]: structuredClone(allPerms[selectedId] ?? {}) }));
      setSavedDetails((prev) => ({ ...prev, [selectedId]: { name: updated.name, description: updated.description } }));
      setRoles((prev) => prev.map((r) => (r.id === selectedId ? { ...r, name: updated.name, description: updated.description } : r)));
      toast.success('Role saved');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setAllPerms((prev) => ({ ...prev, [selectedId]: structuredClone(savedPerms[selectedId] ?? {}) }));
    setDetails((prev) => ({ ...prev, [selectedId]: { ...savedDetails[selectedId]! } }));
  };

  const handleCreateRole = async (name: string, description: string) => {
    try {
      const created = await rolesApi.create({ name, description });
      setRoles((prev) => [...prev, created]);
      setAllPerms((prev) => ({ ...prev, [created.id]: created.permissions }));
      setSavedPerms((prev) => ({ ...prev, [created.id]: structuredClone(created.permissions) }));
      setDetails((prev) => ({ ...prev, [created.id]: { name: created.name, description: created.description } }));
      setSavedDetails((prev) => ({ ...prev, [created.id]: { name: created.name, description: created.description } }));
      setSelectedId(created.id);
      setShowCreateModal(false);
      toast.success(`Role "${created.name}" created`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create role');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <header className="flex flex-shrink-0 flex-col gap-2 border-b border-gray-100 bg-white px-4 py-3 md:h-[88px] md:flex-row md:items-center md:justify-between md:gap-0 md:px-8 md:py-0">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">Roles &amp; permissions</h2>
          <p className="mt-0.5 hidden text-sm text-gray-500 md:block">Control what each role can see and do.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex h-9 flex-shrink-0 items-center gap-2 self-start rounded-lg bg-accent-500 px-4 text-sm font-medium text-white shadow-sm shadow-accent-200/50 transition-all hover:bg-accent-600 md:h-10 md:self-auto md:px-5"
        >
          <Plus size={16} />
          Create role
        </button>
      </header>

      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        <div className="h-full w-full flex-shrink-0 md:w-[320px]">
          <RoleList roles={filteredRoles} selectedId={selectedId} search={search} isLoading={isLoading} onSelectRole={setSelectedId} onSearchChange={setSearch} onCreateRole={() => setShowCreateModal(true)} />
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 pb-28">
          {isLoading ? (
            <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
              <div className="animate-pulse space-y-4 rounded-2xl border border-gray-100 bg-white p-6">
                <div className="h-5 w-1/4 rounded bg-gray-100" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-11 rounded-lg bg-gray-50" />
                  <div className="h-11 rounded-lg bg-gray-50" />
                </div>
              </div>
            </div>
          ) : !selectedRole ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-24 text-center">
              <p className="text-base font-semibold text-gray-900">No roles yet</p>
              <p className="max-w-xs text-sm text-gray-500">Create a role to control what your team can see and do.</p>
              <button onClick={() => setShowCreateModal(true)} className="flex h-9 items-center gap-2 rounded-lg bg-accent-500 px-5 text-sm font-medium text-white transition-all hover:bg-accent-600">
                <Plus size={16} />
                Create a role
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
              <RoleDetails
                locked={locked}
                details={currentDetails}
                onChangeName={(name) => setDetails((prev) => ({ ...prev, [selectedId]: { ...prev[selectedId]!, name } }))}
                onChangeDescription={(description) => setDetails((prev) => ({ ...prev, [selectedId]: { ...prev[selectedId]!, description } }))}
              />
              <PermissionsMatrix currentPerms={currentPerms} locked={locked} allEnabled={allEnabled} onToggle={handleTogglePerm} onToggleAll={handleToggleAll} />
            </div>
          )}
        </div>

        {hasUnsavedChanges && <UnsavedBar roleName={currentDetails.name} onSave={() => void handleSave()} onDiscard={handleDiscard} isSaving={isSaving} />}
      </div>

      {showCreateModal && <CreateRoleModal onClose={() => setShowCreateModal(false)} onCreate={(name, description) => void handleCreateRole(name, description)} />}
    </div>
  );
}
