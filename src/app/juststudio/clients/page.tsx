'use client';

import { Loader2, Plus, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { ClientCard } from '@/components/juststudio/clients/client-card';
import { ClientFilters } from '@/components/juststudio/clients/client-filters';
import { ClientFormModal } from '@/components/juststudio/clients/client-form-modal';
import { ClientProfilePanel } from '@/components/juststudio/clients/client-profile-panel';
import { DeleteClientModal } from '@/components/juststudio/clients/delete-client-modal';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { ApiError } from '@/lib/api-fetch';
import { bookingsApi, clientsApi, employeesApi } from '@/lib/api';
import type { Booking, Employee, StudioClient } from '@/lib/types';

const PAGE_SIZE = 10;

export default function ClientsPage() {
  const [clients, setClients] = useState<StudioClient[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<StudioClient | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudioClient | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    Promise.all([clientsApi.list(), employeesApi.list(), bookingsApi.list()])
      .then(([c, e, b]) => {
        setClients(c);
        setEmployees(e);
        setBookings(b);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...clients];
    if (statusFilter !== 'all') result = result.filter((c) => c.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.client.user.name.toLowerCase().includes(q) || c.client.user.email.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.client.user.name.localeCompare(b.client.user.name);
      if (sortBy === 'name-desc') return b.client.user.name.localeCompare(a.client.user.name);
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'visits') return b.visitedTimes - a.visitedTimes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [clients, statusFilter, searchQuery, sortBy]);

  // Reset to page 1 wherever a filter actually changes, rather than
  // reacting to the change after the fact in an effect.
  const onStatusFilterChange = (v: string) => {
    setStatusFilter(v);
    setPage(1);
  };
  const onSearchQueryChange = (v: string) => {
    setSearchQuery(v);
    setPage(1);
  };
  const onSortByChange = (v: string) => {
    setSortBy(v);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onAdd = async (values: { email: string; instructorId: string; notes: string }) => {
    setSubmitting(true);
    try {
      const created = await clientsApi.create({ email: values.email, instructorId: values.instructorId || undefined, notes: values.notes || undefined });
      setClients((prev) => [created, ...prev]);
      toast.success('Client added');
      setFormMode(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add client');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = async (values: { instructorId: string; notes: string; status: string; hasInjury: boolean; injuryNotes: string }) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const updated = await clientsApi.update(selected.id, {
        instructorId: values.instructorId || undefined,
        notes: values.notes,
        status: values.status,
        hasInjury: values.hasInjury,
        injuryNotes: values.injuryNotes,
      });
      setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelected(updated);
      toast.success('Client updated');
      setFormMode(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save changes');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await clientsApi.remove(deleteTarget.id);
      setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success('Client removed');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to remove client');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Clients"
        description="Everyone who trains or performs with your studio."
        action={
          <Button onClick={() => setFormMode('add')}>
            <Plus size={16} /> Add client
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
              <ClientFilters
                statusFilter={statusFilter}
                setStatusFilter={onStatusFilterChange}
                searchQuery={searchQuery}
                setSearchQuery={onSearchQueryChange}
                sortBy={sortBy}
                setSortBy={onSortByChange}
              />

              {pageItems.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No clients found"
                  description={searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Add a client by the email they registered with in the Just Dance app.'}
                />
              ) : (
                <div className="space-y-3">
                  {pageItems.map((c) => (
                    <ClientCard
                      key={c.id}
                      client={c}
                      isSelected={selected?.id === c.id}
                      onSelect={(client) => setSelected((prev) => (prev?.id === client.id ? null : client))}
                      onEdit={(client) => {
                        setSelected(client);
                        setFormMode('edit');
                      }}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-500">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                          page === p ? 'border border-accent-600 bg-accent-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <ClientProfilePanel
          client={selected}
          bookings={bookings}
          onClose={() => setSelected(null)}
          onEdit={(client) => {
            setSelected(client);
            setFormMode('edit');
          }}
          onDelete={setDeleteTarget}
        />
      </div>

      <ClientFormModal
        key={formMode === 'edit' ? selected?.id : formMode}
        mode={formMode}
        client={selected}
        employees={employees}
        submitting={submitting}
        onClose={() => setFormMode(null)}
        onSubmitAdd={onAdd}
        onSubmitEdit={onEdit}
      />

      {deleteTarget && (
        <DeleteClientModal clientName={deleteTarget.client.user.name} submitting={submitting} onClose={() => setDeleteTarget(null)} onConfirm={onDelete} />
      )}
    </div>
  );
}
