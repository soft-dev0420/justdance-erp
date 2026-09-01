import { Toggle } from './toggle';
import type { PermModule } from './types';

export function ModuleCard({
  module,
  perms,
  onToggle,
  locked,
}: {
  module: PermModule;
  perms: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
  locked?: boolean;
}) {
  const masterOn = !!perms[module.id];
  const isSensitive = module.group === 'sensitive';
  const hasGranular = !!module.granular?.length;
  const isAppts = module.id === 'appointments';

  return (
    <div
      className={`rounded-2xl p-5 transition-shadow ${
        isSensitive ? 'border border-red-200 bg-red-50 shadow-sm' : `relative overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md`
      }`}
    >
      {isAppts && masterOn && <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500" />}

      <div className={`flex items-start justify-between ${hasGranular ? 'mb-4' : ''} ${isAppts && masterOn ? 'pl-3' : ''}`}>
        <div className="flex min-w-0 gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              isSensitive ? 'border border-red-200 bg-white text-red-500' : isAppts && masterOn ? 'border border-blue-200 bg-blue-50 text-blue-500' : 'border border-gray-100 bg-gray-50 text-gray-500'
            }`}
          >
            <module.icon size={18} />
          </div>
          <div className="min-w-0">
            <h5 className={`text-sm font-semibold ${isSensitive ? 'text-red-800' : 'text-gray-900'}`}>{module.name}</h5>
            <p className={`mt-1 text-xs ${isSensitive ? 'text-red-700' : 'text-gray-500'}`}>{module.description}</p>
          </div>
        </div>
        <Toggle checked={masterOn} onChange={(v) => onToggle(module.id, v)} disabled={locked} />
      </div>

      {hasGranular && (
        <div className={`space-y-3 border-t border-gray-100 pt-3 ${isAppts ? 'pl-16' : 'pl-14'} ${!masterOn ? 'pointer-events-none opacity-50 grayscale' : ''}`}>
          {module.granular!.map((g) => (
            <div key={g.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{g.label}</span>
              <Toggle checked={!!perms[`${module.id}.${g.id}`]} onChange={(v) => onToggle(`${module.id}.${g.id}`, v)} size="sm" disabled={locked || !masterOn} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
