import { Pencil, Trash2 } from 'lucide-react';

import type { StockItem } from '@/lib/types';

import { STATUS_COLOR, STATUS_LABEL, getCategoryColor, getProgressColor, getStockProgress, getStockStatus } from './types';

export function StockRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  item: StockItem;
  isSelected: boolean;
  onSelect: (item: StockItem) => void;
  onEdit: (item: StockItem) => void;
  onDelete: (item: StockItem) => void;
}) {
  const status = getStockStatus(item.currentStock, item.minStock);
  const pct = getStockProgress(item.currentStock, item.minStock);
  const barColor = getProgressColor(pct);
  const catCls = getCategoryColor(item.category);
  const rowBg = status === 'out-of-stock' ? 'bg-red-50/30' : status === 'low-stock' ? 'bg-orange-50/20' : '';

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group grid cursor-pointer grid-cols-12 items-center gap-4 border-b border-gray-50 px-6 py-4 transition-colors last:border-0 ${
        isSelected ? 'bg-accent-50/60' : `hover:bg-gray-50/80 ${rowBg}`
      }`}
    >
      <div className="col-span-5 flex min-w-0 items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold uppercase ${catCls}`}>{item.category.slice(0, 2)}</div>
        <div className="min-w-0">
          <div className={`truncate text-sm font-semibold transition-colors ${isSelected ? 'text-accent-700' : 'text-gray-900 group-hover:text-accent-600'}`}>{item.name}</div>
          {item.description && <div className="mt-0.5 truncate text-xs text-gray-500">{item.description}</div>}
        </div>
      </div>

      <div className="col-span-2">
        <div className="truncate text-sm font-medium capitalize text-gray-700">{item.category}</div>
        <div className="mt-0.5 text-xs text-gray-500">{item.unit}</div>
      </div>

      <div className="col-span-4 pr-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="font-medium text-gray-700">
            {item.currentStock} / min {item.minStock} {item.unit}
          </span>
          <span className={`font-semibold ${STATUS_COLOR[status]}`}>{STATUS_LABEL[status]}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="col-span-1 flex justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          title="Edit product"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 shadow-sm transition-all hover:border-gray-200 hover:bg-white hover:text-gray-700"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          title="Delete product"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
