'use client';

import { ArrowDown, ArrowUp, Boxes, Minus, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { StockItem } from '@/lib/types';

import {
  STATUS_BADGE,
  STATUS_COLOR,
  STATUS_LABEL,
  formatHistoryDate,
  getCategoryColor,
  getDailyUsage,
  getDaysRemaining,
  getProgressColor,
  getStockProgress,
  getStockStatus,
  getSuggestedOrderQty,
} from './types';

type Tab = 'overview' | 'movements';

const HISTORY_STYLE: Record<string, string> = {
  initial: 'bg-blue-50 border-blue-100 text-blue-700',
  replenish: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  use: 'bg-red-50 border-red-100 text-red-600',
};

function historyIcon(type: string) {
  if (type === 'replenish') return <ArrowUp size={14} />;
  if (type === 'use') return <ArrowDown size={14} />;
  return <Boxes size={14} />;
}

function historyLabel(type: string) {
  if (type === 'use') return 'Used';
  if (type === 'replenish') return 'Restocked';
  return 'Initial stock';
}

export function StockDetailPanel({
  item,
  onClose,
  onAddStock,
  onUseStock,
  onEdit,
  onDelete,
}: {
  item: StockItem | null;
  onClose: () => void;
  onAddStock: (item: StockItem) => void;
  onUseStock: (item: StockItem) => void;
  onEdit: (item: StockItem) => void;
  onDelete: (item: StockItem) => void;
}) {
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    // Reset to the overview tab whenever a different item is selected.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab('overview');
  }, [item?.id]);

  if (!item) return null;

  const status = getStockStatus(item.currentStock, item.minStock);
  const pct = getStockProgress(item.currentStock, item.minStock);
  const barColor = getProgressColor(pct);
  const catCls = getCategoryColor(item.category);
  const sorted = [...(item.history ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const dailyUsage = getDailyUsage(item.history ?? []);
  const daysLeft = getDaysRemaining(item.currentStock, dailyUsage);
  const suggestedQty = getSuggestedOrderQty(item.currentStock, item.parLevel);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-gray-900/20" onClick={onClose} />

      <aside className="fixed inset-y-0 right-0 z-[60] flex w-full shadow-2xl sm:w-[560px]">
        <div className="flex flex-1 flex-col overflow-hidden border-l border-gray-200 bg-white">
          <div className="shrink-0 border-b border-gray-100 bg-white p-6">
            <div className="mb-1 flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider capitalize ${catCls}`}>{item.category}</span>
                <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[status]}`}>{STATUS_LABEL[status]}</span>
              </div>
              <button onClick={onClose} className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>
            <h2 className="mt-2 text-xl font-bold text-gray-900">{item.name}</h2>
            <p className="mt-0.5 text-sm capitalize text-gray-500">
              {item.unit} · {item.category}
            </p>
          </div>

          <div className="flex shrink-0 gap-5 border-b border-gray-100 bg-white px-6">
            {(['overview', 'movements'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 py-3 text-sm font-medium capitalize transition-colors ${
                  tab === t ? 'border-accent-600 text-accent-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
            {tab === 'overview' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Current stock</div>
                    <div className="text-3xl font-bold text-gray-900">{item.currentStock}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{item.unit}</div>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Minimum level</div>
                    <div className="text-3xl font-bold text-gray-900">{item.minStock}</div>
                    <div className={`mt-0.5 text-xs font-medium ${STATUS_COLOR[status]}`}>{STATUS_LABEL[status]}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-medium text-gray-700">Stock level</span>
                    <span className={`font-semibold ${STATUS_COLOR[status]}`}>{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-gray-400">
                    <span>0</span>
                    <span>min {item.minStock}</span>
                    <span>full {item.minStock * 4}+</span>
                  </div>
                </div>

                {item.description && (
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Description</div>
                    <p className="text-sm leading-relaxed text-gray-700">{item.description}</p>
                  </div>
                )}

                {status !== 'in-stock' && (suggestedQty !== null || daysLeft !== null) && (
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Reorder</div>
                    {suggestedQty !== null && (
                      <p className="text-sm text-gray-700">
                        Order <span className="font-semibold text-gray-900">{suggestedQty}</span> {item.unit}
                        {item.parLevel ? ` to reach ${item.parLevel}` : ''}
                      </p>
                    )}
                    {daysLeft !== null && <p className="mt-1 text-xs text-gray-500">{daysLeft <= 0 ? 'Out now, at current usage' : `~${daysLeft} days remaining at current usage`}</p>}
                  </div>
                )}

                {sorted.length > 0 && (
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Recent activity</div>
                      <button onClick={() => setTab('movements')} className="text-xs font-medium text-accent-600 hover:text-accent-700">
                        View all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {sorted.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${HISTORY_STYLE[entry.type] ?? 'bg-gray-50 text-gray-600'}`}>{historyIcon(entry.type)}</span>
                            <span className="text-gray-700">{historyLabel(entry.type)}</span>
                          </div>
                          <span className={`font-semibold ${entry.type === 'use' ? 'text-red-600' : 'text-emerald-600'}`}>
                            {entry.type === 'use' ? '-' : '+'}
                            {entry.quantity} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {tab === 'movements' && (
              <div className="space-y-3">
                {sorted.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-400">No movement history</div>
                ) : (
                  sorted.map((entry) => (
                    <div key={entry.id} className={`rounded-xl border p-4 ${HISTORY_STYLE[entry.type] ?? 'border-gray-100 bg-gray-50'}`}>
                      <div className="mb-1.5 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0">{historyIcon(entry.type)}</span>
                          <span className="text-sm font-semibold">{historyLabel(entry.type)}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-70">{formatHistoryDate(entry.createdAt)}</div>
                          {entry.updatedBy && <div className="mt-0.5 text-[10px] opacity-50">by {entry.updatedBy}</div>}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {entry.type === 'use' ? '−' : '+'}
                        {entry.quantity} {item.unit}
                      </div>
                      {entry.notes && <p className="mt-1.5 text-xs leading-relaxed opacity-75">{entry.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-20 shrink-0 flex-col items-center gap-3 border-l border-gray-200 bg-gray-50/80 py-6">
          <button
            onClick={() => onAddStock(item)}
            title="Add stock"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 text-white shadow-md shadow-accent-200/50 transition-colors hover:bg-accent-600"
          >
            <Plus size={20} />
          </button>

          <div className="my-1 h-px w-8 bg-gray-200" />

          <button
            onClick={() => onUseStock(item)}
            title="Use / reduce stock"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:border-accent-400 hover:text-accent-600"
          >
            <Minus size={20} />
          </button>

          <button
            onClick={() => onEdit(item)}
            title="Edit product"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:border-accent-400 hover:text-accent-600"
          >
            <Pencil size={18} />
          </button>

          <div className="mt-auto">
            <button
              onClick={() => onDelete(item)}
              title="Delete product"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-white text-red-400 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
