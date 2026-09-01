'use client';

import { AlertTriangle, Minus, Plus, X } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { stockApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { StockItem } from '@/lib/types';

type MovementType = 'replenish' | 'use';

export function UpdateStockModal({
  product,
  defaultType = 'replenish',
  onClose,
  onUpdate,
}: {
  product: StockItem;
  defaultType?: MovementType;
  onClose: () => void;
  onUpdate: (updated: StockItem) => void;
}) {
  const [data, setData] = useState({ type: defaultType, quantity: 0, notes: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) || 0 : value }));
  };

  const willBeNegative = data.type === 'use' && data.quantity > product.currentStock;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (willBeNegative || data.quantity <= 0) return;
    setLoading(true);
    try {
      const updated = await stockApi.adjust(product.id, { type: data.type, quantity: data.quantity, notes: data.notes || undefined });
      toast.success('Stock updated');
      onUpdate(updated);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Update stock</h3>
                <p className="mt-0.5 max-w-[260px] truncate text-sm text-gray-500">{product.name}</p>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Current stock</span>
                <span className="text-lg font-bold text-gray-900">
                  {product.currentStock} <span className="text-sm font-normal text-gray-500">{product.unit}</span>
                </span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Operation</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['replenish', 'use'] as MovementType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setData((prev) => ({ ...prev, type }))}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 py-4 transition-all ${
                        data.type === type ? 'border-accent-500 bg-accent-50' : 'border-gray-200 bg-white hover:border-accent-300'
                      }`}
                    >
                      <div className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-full ${data.type === type ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-500'}`}>
                        {type === 'replenish' ? <Plus size={16} /> : <Minus size={16} />}
                      </div>
                      <span className={`text-sm font-semibold ${data.type === type ? 'text-accent-700' : 'text-gray-700'}`}>{type === 'replenish' ? 'Add stock' : 'Use stock'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{data.type === 'replenish' ? 'Quantity to add' : 'Quantity to use'}</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    required
                    value={data.quantity}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border px-3 py-2 pr-16 text-sm shadow-sm outline-none transition-colors ${
                      willBeNegative ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-300' : 'border-gray-200 focus:border-accent-500 focus:ring-1 focus:ring-accent-500'
                    }`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{product.unit}</span>
                </div>
                {willBeNegative && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <AlertTriangle size={13} className="shrink-0" />
                    Cannot exceed {product.currentStock} {product.unit}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={data.notes}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || willBeNegative || data.quantity <= 0}
                className={`rounded-lg px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors ${
                  loading || willBeNegative || data.quantity <= 0 ? 'cursor-not-allowed bg-gray-300' : 'bg-accent-500 hover:bg-accent-600'
                }`}
              >
                {loading ? 'Updating…' : 'Update stock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
