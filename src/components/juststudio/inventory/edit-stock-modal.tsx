'use client';

import { Pencil, X } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { stockApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { StockItem } from '@/lib/types';

import { CATEGORIES, UNITS } from './types';

interface FormData {
  name: string;
  category: string;
  minStock: number;
  parLevel: number;
  unit: string;
  description: string;
  sku: string;
}

interface FormErrors {
  name?: string;
  category?: string;
  unit?: string;
}

const inputCls =
  'mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700';

export function EditStockModal({ product, onClose, onUpdate }: { product: StockItem; onClose: () => void; onUpdate: (updated: StockItem) => void }) {
  const [form, setForm] = useState<FormData>({
    name: product.name,
    category: product.category,
    minStock: product.minStock,
    parLevel: product.parLevel ?? 0,
    unit: product.unit,
    description: product.description ?? '',
    sku: product.sku ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: ['minStock', 'parLevel'].includes(name) ? parseInt(value) || 0 : value }));
  };

  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.category) err.category = 'Category is required';
    if (!form.unit) err.unit = 'Unit is required';
    return err;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const updated = await stockApi.update(product.id, {
        name: form.name,
        category: form.category,
        unit: form.unit,
        minStock: form.minStock,
        parLevel: form.parLevel || undefined,
        description: form.description || undefined,
        sku: form.sku || undefined,
      });
      toast.success('Details updated');
      onUpdate(updated);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update details');
    } finally {
      setLoading(false);
    }
  };

  const willBeLow = product.currentStock < form.minStock;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50">
                  <Pencil size={16} className="text-accent-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Edit product</h3>
                  <p className="mt-0.5 max-w-[280px] truncate text-xs text-gray-500">{product.name}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
              <div>
                <label className={labelCls}>Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className={inputCls} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                </div>
                <div>
                  <label className={labelCls}>Unit *</label>
                  <select name="unit" value={form.unit} onChange={handleChange} className={inputCls}>
                    <option value="">Select…</option>
                    {UNITS.map((u) => (
                      <option key={u} value={u} className="capitalize">
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.unit && <p className="mt-1 text-xs text-red-500">{errors.unit}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Current stock</label>
                  <input type="number" value={product.currentStock} disabled className={`${inputCls} cursor-not-allowed bg-gray-50 text-gray-500`} />
                  <p className="mt-1 text-[10px] text-gray-400">Change via update stock</p>
                </div>
                <div>
                  <label className={labelCls}>Minimum</label>
                  <input type="number" name="minStock" min="0" value={form.minStock} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Par level</label>
                  <input type="number" name="parLevel" min="0" value={form.parLevel} onChange={handleChange} className={inputCls} />
                </div>
              </div>

              {willBeLow && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <p className="text-xs text-amber-700">This threshold will immediately flag the item as low stock.</p>
                </div>
              )}

              <div>
                <label className={labelCls}>SKU</label>
                <input type="text" name="sku" value={form.sku} onChange={handleChange} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea name="description" rows={2} value={form.description} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            <div className="flex justify-end gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-600 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                {loading ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
