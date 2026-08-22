'use client';

import { AlertTriangle, Loader2, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { Input, Label, Textarea } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { ApiError } from '@/lib/api-fetch';
import { clientsApi } from '@/lib/api';
import type { StudioClient } from '@/lib/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<StudioClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => clientsApi.list().then(setClients).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onAdd = async () => {
    if (!email) return;
    setSubmitting(true);
    try {
      await clientsApi.create({ email, notes });
      toast.success('Client added');
      setModalOpen(false);
      setEmail('');
      setNotes('');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add client');
    } finally {
      setSubmitting(false);
    }
  };

  const onRemove = async (id: string) => {
    if (!confirm('Remove this client from your studio list?')) return;
    await clientsApi.remove(id);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Everyone who trains or performs with your studio."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add client
          </Button>
        }
      />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : clients.length === 0 ? (
          <EmptyState icon={Users} title="No clients yet" description="Add a client by the email they registered with in the Just Dance app." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {clients.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3.5 last:border-b-0 hover:bg-gray-50">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-900">{c.client.user.name}</p>
                    {c.client.hasInjury && <AlertTriangle size={13} className="flex-shrink-0 text-amber-500" />}
                  </div>
                  <p className="truncate text-xs text-gray-500">{c.client.user.email}</p>
                  {c.notes && <p className="mt-1 truncate text-xs text-gray-400">{c.notes}</p>}
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <span className="text-xs text-gray-500">{c.visitedTimes} visits</span>
                  <button onClick={() => onRemove(c.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add client">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Client&apos;s email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dancer@example.com" />
            <p className="mt-1.5 text-xs text-gray-500">They need an existing Just Dance account with this email.</p>
          </div>
          <div>
            <Label>Notes (optional)</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={onAdd} disabled={submitting || !email}>
            {submitting ? 'Adding…' : 'Add client'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
