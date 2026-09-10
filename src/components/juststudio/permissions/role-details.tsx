import { Info } from 'lucide-react';

import { useLanguage } from '@/lib/i18n';

export function RoleDetails({
  locked,
  details,
  onChangeName,
  onChangeDescription,
}: {
  locked: boolean;
  details: { name: string; description: string };
  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
}) {
  const { t } = useLanguage();
  const appliesTo = t.appliesToEveryone.split('{value}');
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.roleDetailsHeading}</h3>
          <p className="mt-1 text-sm text-gray-500">{t.roleDetailsSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
          <span className={`inline-block h-2 w-2 rounded-full ${locked ? 'bg-gray-400' : 'bg-accent-500'}`} />
          {locked ? t.lockedRole : t.activeRole}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">{t.roleNameLabel}</label>
          <input
            type="text"
            value={details.name}
            onChange={(e) => onChangeName(e.target.value)}
            disabled={locked}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">{t.descriptionLabel}</label>
          <input
            type="text"
            value={details.description}
            onChange={(e) => onChangeDescription(e.target.value)}
            disabled={locked}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      {!locked && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
          <p className="text-sm text-blue-900">
            <strong>{t.appliesToLabel}</strong> {appliesTo[0]}
            {details.name || 'this'}
            {appliesTo[1]}
          </p>
        </div>
      )}
    </div>
  );
}
