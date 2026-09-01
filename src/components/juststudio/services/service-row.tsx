import { Clock, Pencil, Tag, Trash2 } from 'lucide-react';

import type { Service } from '@/lib/types';

export function ServiceRow({ service, onEdit, onDelete }: { service: Service; onEdit: (service: Service) => void; onDelete: (service: Service) => void }) {
  return (
    <div className="group flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-3.5 transition-colors first:border-t-0 hover:bg-gray-50">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">{service.name}</p>
        {service.description && <p className="mt-0.5 truncate text-xs text-gray-500">{service.description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {service.price && (
          <>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {service.price.hours !== '0' && `${service.price.hours}h `}
              {service.price.minutes}min
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
              <Tag size={12} className="text-gray-400" />
              {service.price.price}
            </span>
          </>
        )}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(service)} className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-700">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(service)} className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-red-500">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
