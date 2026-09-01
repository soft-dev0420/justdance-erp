import { AlertTriangle, Boxes, Layers, PackageX } from 'lucide-react';

import type { StockItem } from '@/lib/types';

import { getStockStatus } from './types';

export function StockStats({ items }: { items: StockItem[] }) {
  const total = items.length;
  const lowStock = items.filter((i) => getStockStatus(i.currentStock, i.minStock) === 'low-stock').length;
  const outStock = items.filter((i) => getStockStatus(i.currentStock, i.minStock) === 'out-of-stock').length;
  const totalUnits = items.reduce((sum, i) => sum + i.currentStock, 0);

  const stats = [
    { key: 'total', label: 'Total products', value: total, sub: 'In inventory', icon: Boxes, iconBg: 'bg-blue-50 text-blue-600' },
    { key: 'low', label: 'Low stock', value: lowStock, sub: 'Requires attention', icon: AlertTriangle, iconBg: 'bg-orange-50 text-orange-500' },
    { key: 'out', label: 'Out of stock', value: outStock, sub: outStock > 0 ? 'Needs restocking' : 'All items stocked', icon: PackageX, iconBg: 'bg-red-50 text-red-500' },
    { key: 'units', label: 'Total units', value: totalUnits, sub: 'Across all products', icon: Layers, iconBg: 'bg-accent-50 text-accent-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.key} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <div className="text-sm font-medium text-gray-500">{s.label}</div>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${s.iconBg}`}>
              <s.icon size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
          <div className="mt-1.5 text-xs text-gray-500">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
