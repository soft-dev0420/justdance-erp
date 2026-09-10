'use client';

import { Boxes, X } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { stockApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import { useLanguage } from '@/lib/i18n';
import type { StockItem } from '@/lib/types';

import { CATEGORIES, UNITS } from './types';

interface FormData {
  name: string;
  category: string;
  currentStock: number;
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

export function AddStockModal({ onClose, onAdd }: { onClose: () => void; onAdd: (created: StockItem) => void }) {
  const { t } = useLanguage();
  const blank: FormData = { name: '', category: '', currentStock: 0, minStock: 0, parLevel: 0, unit: '', description: '', sku: '' };
  const [form, setForm] = useState<FormData>(blank);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: ['currentStock', 'minStock', 'parLevel'].includes(name) ? parseInt(value) || 0 : value }));
  };

  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.name.trim()) err.name = t.nameRequired;
    if (!form.category) err.category = t.categoryRequired;
    if (!form.unit) err.unit = t.unitRequired;
    return err;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const created = await stockApi.create({
        name: form.name,
        category: form.category,
        unit: form.unit,
        currentStock: form.currentStock,
        minStock: form.minStock,
        parLevel: form.parLevel || undefined,
        description: form.description || undefined,
        sku: form.sku || undefined,
      });
      toast.success(t.productAdded);
      onAdd(created);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.failedToAddProduct);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50">
                  <Boxes size={16} className="text-accent-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{t.addProduct}</h3>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
              <div>
                <label className={labelCls}>{t.nameStar}</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder={t.namePlaceholderInventory} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{t.categoryStar}</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                    <option value="">{t.selectEllipsis}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                </div>
                <div>
                  <label className={labelCls}>{t.unitStar}</label>
                  <select name="unit" value={form.unit} onChange={handleChange} className={inputCls}>
                    <option value="">{t.selectEllipsis}</option>
                    {UNITS.map((u) => (
                      <option key={u} value={u} className="capitalize">
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.unit && <p className="mt-1 text-xs text-red-500">{errors.unit}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>{t.inStockLabel}</label>
                  <input type="number" name="currentStock" min="0" value={form.currentStock} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t.minimumLabel}</label>
                  <input type="number" name="minStock" min="0" value={form.minStock} onChange={handleChange} className={inputCls} />
                  <p className="mt-1 text-[10px] text-gray-400">{t.lowStockThresholdHint}</p>
                </div>
                <div>
                  <label className={labelCls}>{t.parLevelLabel}</label>
                  <input type="number" name="parLevel" min="0" value={form.parLevel} onChange={handleChange} className={inputCls} />
                  <p className="mt-1 text-[10px] text-gray-400">{t.targetToRestockHint}</p>
                </div>
              </div>

              <div>
                <label className={labelCls}>{t.skuLabel}</label>
                <input type="text" name="sku" value={form.sku} onChange={handleChange} className={inputCls} placeholder={t.optionalPlaceholder} />
              </div>

              <div>
                <label className={labelCls}>{t.descriptionLabel}</label>
                <textarea name="description" rows={2} value={form.description} onChange={handleChange} className={inputCls} placeholder={t.optionalPlaceholder} />
              </div>
            </div>

            <div className="flex justify-end gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white">
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-600 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                {loading ? t.adding : t.addProduct}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
