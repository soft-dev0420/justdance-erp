'use client';

import { Boxes, Loader2, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { Button } from '@/components/juststudio/ui/button';
import { EmptyState } from '@/components/juststudio/ui/empty-state';
import { Input, Label } from '@/components/juststudio/ui/input';
import { Modal } from '@/components/juststudio/ui/modal';
import { stockApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { StockItem } from '@/lib/types';

export default function InventoryPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [currentStock, setCurrentStock] = useState('0');
  const [minStock, setMinStock] = useState('0');

  const load = () => stockApi.list().then(setItems).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    if (!name || !category || !unit) return;
    setSubmitting(true);
    try {
      await stockApi.create({ name, category, unit, currentStock: Number(currentStock), minStock: Number(minStock) });
      toast.success('Item added');
      setModalOpen(false);
      setName('');
      setCategory('');
      setUnit('');
      setCurrentStock('0');
      setMinStock('0');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const adjust = async (id: string, type: 'replenish' | 'use') => {
    await stockApi.adjust(id, { type, quantity: 1 });
    load();
  };

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Costumes, equipment, and supplies."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add item
          </Button>
        }
      />

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-accent-500" size={24} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Boxes} title="No inventory yet" />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3.5 last:border-b-0 hover:bg-gray-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="truncate text-xs text-gray-500">{item.category}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <span className={`text-sm font-medium ${item.isLowStock ? 'text-amber-600' : 'text-gray-700'}`}>
                    {item.currentStock} {item.unit}
                  </span>
                  <button onClick={() => adjust(item.id, 'use')} className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                    <Minus size={13} />
                  </button>
                  <button onClick={() => adjust(item.id, 'replenish')} className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add inventory item">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Practice mirrors" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Equipment" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Unit</Label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs" />
            </div>
            <div>
              <Label>In stock</Label>
              <Input type="number" min={0} value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} />
            </div>
            <div>
              <Label>Min level</Label>
              <Input type="number" min={0} value={minStock} onChange={(e) => setMinStock(e.target.value)} />
            </div>
          </div>
          <Button onClick={onCreate} disabled={submitting || !name || !category || !unit}>
            {submitting ? 'Adding…' : 'Add item'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
