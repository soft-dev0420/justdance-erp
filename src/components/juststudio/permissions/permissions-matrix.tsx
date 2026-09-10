import { AlertTriangle } from 'lucide-react';

import { useLanguage } from '@/lib/i18n';

import { ModuleCard } from './module-card';
import { Toggle } from './toggle';
import type { PermModule } from './types';

export function PermissionsMatrix({
  modules,
  currentPerms,
  locked,
  allEnabled,
  onToggle,
  onToggleAll,
}: {
  modules: PermModule[];
  currentPerms: Record<string, boolean>;
  locked: boolean;
  allEnabled: boolean;
  onToggle: (key: string, value: boolean) => void;
  onToggleAll: (value: boolean) => void;
}) {
  const { t } = useLanguage();
  const coreModules = modules.filter((m) => m.group === 'core');
  const managementModules = modules.filter((m) => m.group === 'management');
  const sensitiveModules = modules.filter((m) => m.group === 'sensitive');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t.permissionsHeading}</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{t.enableAllLabel}</span>
          <Toggle checked={allEnabled} onChange={onToggleAll} disabled={locked} />
        </div>
      </div>

      <div>
        <h4 className="mb-4 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.coreOperationsHeading}</h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {coreModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} perms={currentPerms} onToggle={onToggle} locked={locked} />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <h4 className="mb-4 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{t.managementHeading}</h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {managementModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} perms={currentPerms} onToggle={onToggle} locked={locked} />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <h4 className="mb-4 flex items-center gap-2 pl-1 text-xs font-semibold uppercase tracking-wider text-red-500">
          <AlertTriangle size={13} />
          {t.sensitiveAccessHeading}
        </h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {sensitiveModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} perms={currentPerms} onToggle={onToggle} locked={locked} />
          ))}
        </div>
      </div>
    </div>
  );
}
