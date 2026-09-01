import { AlertTriangle } from 'lucide-react';

import { ModuleCard } from './module-card';
import { Toggle } from './toggle';
import { MODULES } from './types';

const coreModules = MODULES.filter((m) => m.group === 'core');
const managementModules = MODULES.filter((m) => m.group === 'management');
const sensitiveModules = MODULES.filter((m) => m.group === 'sensitive');

export function PermissionsMatrix({
  currentPerms,
  locked,
  allEnabled,
  onToggle,
  onToggleAll,
}: {
  currentPerms: Record<string, boolean>;
  locked: boolean;
  allEnabled: boolean;
  onToggle: (key: string, value: boolean) => void;
  onToggleAll: (value: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Enable all</span>
          <Toggle checked={allEnabled} onChange={onToggleAll} disabled={locked} />
        </div>
      </div>

      <div>
        <h4 className="mb-4 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Core operations</h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {coreModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} perms={currentPerms} onToggle={onToggle} locked={locked} />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <h4 className="mb-4 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Management</h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {managementModules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} perms={currentPerms} onToggle={onToggle} locked={locked} />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <h4 className="mb-4 flex items-center gap-2 pl-1 text-xs font-semibold uppercase tracking-wider text-red-500">
          <AlertTriangle size={13} />
          Sensitive access
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
