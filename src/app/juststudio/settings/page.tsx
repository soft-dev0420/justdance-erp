'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/juststudio/page-header';
import { OpeningHoursCard } from '@/components/juststudio/settings/opening-hours-card';
import { Button } from '@/components/juststudio/ui/button';
import { Input, Label } from '@/components/juststudio/ui/input';
import { useStudio } from '@/context/studio-context';
import { studioApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import { useLanguage } from '@/lib/i18n';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { studio, refresh } = useStudio();
  const [name, setName] = useState(studio?.name ?? '');
  const [city, setCity] = useState(studio?.city ?? '');
  const [currency, setCurrency] = useState(studio?.currency ?? 'USD');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await studioApi.update({ name, city, currency });
      await refresh();
      toast.success(t.studioUpdated);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.failedToSaveChanges);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={t.navSettings} description={t.settingsDescription} />

      <div className="flex max-w-xl flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <Label>{t.studioNameLabel}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>{t.cityLabel}</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Warsaw" />
          </div>
          <div>
            <Label>{t.currencyLabel}</Label>
            <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} />
          </div>
          <Button onClick={onSave} disabled={saving} className="mt-2">
            {saving ? t.saving : t.saveChangesLabel}
          </Button>
        </div>

        <OpeningHoursCard />
      </div>
    </div>
  );
}
