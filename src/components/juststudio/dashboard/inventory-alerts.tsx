import { AlertTriangle, PackageX } from 'lucide-react';
import Link from 'next/link';

import type { StockItem } from '@/lib/types';

export function InventoryAlerts({ items }: { items: StockItem[] }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Inventory alerts</h2>
        {items.length > 0 && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
            {items.length} action{items.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">All stock is healthy</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isOut = item.currentStock <= 0;
            return (
              <div key={item.id} className={`rounded-xl border p-3 ${isOut ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {isOut ? <PackageX size={15} className="text-red-500" /> : <AlertTriangle size={15} className="text-amber-500" />}
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${isOut ? 'text-red-600' : 'text-amber-600'}`}>
                    {isOut ? 'Out of stock' : `Low (${item.currentStock} ${item.unit} left)`}
                  </span>
                </div>
                <Link
                  href="/juststudio/inventory"
                  className={`mt-1 block w-full rounded-lg py-1.5 text-center text-xs font-medium transition-colors ${
                    isOut ? 'bg-accent-600 text-white shadow-sm hover:bg-accent-700' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isOut ? 'Restock now' : 'Restock'}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
