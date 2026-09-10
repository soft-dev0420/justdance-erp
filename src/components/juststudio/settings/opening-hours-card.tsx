'use client';

import { Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/juststudio/ui/button';
import { studioApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import { useLanguage, type T } from '@/lib/i18n';
import type { DayOpeningHours } from '@/lib/types';

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function dayLabel(day: string, t: T): string {
  switch (day) {
    case 'monday':
      return t.dayMonday;
    case 'tuesday':
      return t.dayTuesday;
    case 'wednesday':
      return t.dayWednesday;
    case 'thursday':
      return t.dayThursday;
    case 'friday':
      return t.dayFriday;
    case 'saturday':
      return t.daySaturday;
    case 'sunday':
      return t.daySunday;
    default:
      return day;
  }
}

export function OpeningHoursCard() {
  const { t } = useLanguage();
  const [days, setDays] = useState<DayOpeningHours[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    studioApi
      .openingHoursWeek()
      .then((week) => setDays(sortDays(week)))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : t.failedToLoadOpeningHours));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDay = (day: string, patch: Partial<DayOpeningHours>) => {
    setDays((prev) => prev?.map((d) => (d.day === day ? { ...d, ...patch } : d)) ?? null);
  };

  const onSave = async () => {
    if (!days) return;
    setSaving(true);
    try {
      const updated = await studioApi.setOpeningHoursWeek(days);
      setDays(sortDays(updated));
      toast.success(t.openingHoursSaved);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.failedToSaveOpeningHours);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-900">{t.openingHoursHeading}</h2>
      </div>
      <p className="-mt-2 text-xs text-gray-500">{t.openingHoursSubtitle}</p>

      {!days ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-accent-500" size={20} />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {days.map((d) => (
            <div key={d.day} className="flex flex-wrap items-center gap-3 py-3">
              <label className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={d.open} onChange={(e) => updateDay(d.day, { open: e.target.checked, from: d.from ?? '09:00', to: d.to ?? '18:00' })} className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500" />
                {dayLabel(d.day, t)}
              </label>
              {d.open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={d.from ?? '09:00'}
                    onChange={(e) => updateDay(d.day, { from: e.target.value })}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-accent-500 focus:bg-white focus:ring-1 focus:ring-accent-500"
                  />
                  <span className="text-xs text-gray-400">{t.toLabel}</span>
                  <input
                    type="time"
                    value={d.to ?? '18:00'}
                    onChange={(e) => updateDay(d.day, { to: e.target.value })}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-accent-500 focus:bg-white focus:ring-1 focus:ring-accent-500"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400">{t.closedLabel}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <Button onClick={() => void onSave()} disabled={saving || !days} className="mt-2 self-start">
        {saving ? t.saving : t.saveOpeningHoursLabel}
      </Button>
    </div>
  );
}

function sortDays(days: DayOpeningHours[]): DayOpeningHours[] {
  return [...days].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
}
