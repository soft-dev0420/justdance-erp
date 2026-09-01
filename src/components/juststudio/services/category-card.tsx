import { Plus, Trash2 } from 'lucide-react';

import type { Category, Service } from '@/lib/types';

import { ServiceRow } from './service-row';

export function CategoryCard({
  category,
  onAddService,
  onEditService,
  onDeleteService,
  onDeleteCategory,
}: {
  category: Category;
  onAddService: (categoryId: number) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  onDeleteCategory: (category: Category) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{category.category}</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500">{category.services.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onAddService(category.id)} className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700">
            <Plus size={13} /> Add service
          </button>
          <button onClick={() => onDeleteCategory(category)} className="text-gray-400 hover:text-red-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {category.services.length === 0 ? (
        <p className="px-4 py-4 text-xs text-gray-400">No services in this category yet.</p>
      ) : (
        category.services.map((service) => <ServiceRow key={service.id} service={service} onEdit={onEditService} onDelete={onDeleteService} />)
      )}
    </div>
  );
}
