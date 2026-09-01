import { Clock, DollarSign, Layers, Tags } from 'lucide-react';

import type { Category } from '@/lib/types';

export function ServiceStats({ categories, currency }: { categories: Category[]; currency: string }) {
  const services = categories.flatMap((c) => c.services);
  const totalCategories = categories.length;
  const totalServices = services.length;
  const priced = services.filter((s) => s.price);
  const avgPrice = priced.length ? Math.round(priced.reduce((sum, s) => sum + (s.price?.price ?? 0), 0) / priced.length) : 0;
  const avgDuration = priced.length ? Math.round(priced.reduce((sum, s) => sum + Number(s.price?.hours ?? 0) * 60 + Number(s.price?.minutes ?? 0), 0) / priced.length) : 0;

  const stats = [
    { key: 'categories', label: 'Categories', value: totalCategories, sub: 'In your catalog', icon: Tags, iconBg: 'bg-blue-50 text-blue-600' },
    { key: 'services', label: 'Services', value: totalServices, sub: 'Priced offerings', icon: Layers, iconBg: 'bg-accent-50 text-accent-600' },
    { key: 'price', label: 'Avg. price', value: `${currency} ${avgPrice}`, sub: 'Across all services', icon: DollarSign, iconBg: 'bg-emerald-50 text-emerald-600' },
    { key: 'duration', label: 'Avg. duration', value: `${avgDuration}m`, sub: 'Per session', icon: Clock, iconBg: 'bg-orange-50 text-orange-500' },
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
          <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          <div className="mt-1.5 text-xs text-gray-500">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
