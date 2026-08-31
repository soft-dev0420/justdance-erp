import { Boxes, CalendarCheck2, Sparkles } from 'lucide-react';

import type { ActivityLogEntry } from '@/lib/types';

const ICON_STYLE: Record<string, { bg: string; fg: string; Icon: typeof CalendarCheck2 }> = {
  booking: { bg: 'bg-accent-100', fg: 'text-accent-600', Icon: CalendarCheck2 },
  stock: { bg: 'bg-blue-100', fg: 'text-blue-600', Icon: Boxes },
};

function ActivityIcon({ type }: { type: string }) {
  const style = ICON_STYLE[type] ?? { bg: 'bg-gray-100', fg: 'text-gray-600', Icon: Sparkles };
  return (
    <div className={`z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ${style.bg}`}>
      <style.Icon size={11} className={style.fg} />
    </div>
  );
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function ActivityFeed({ items }: { items: ActivityLogEntry[] }) {
  return (
    <section className="flex h-[420px] flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">Activity feed</h2>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">Nothing yet — activity shows up here as it happens.</p>
      ) : (
        <div className="relative flex-1 overflow-y-auto pr-1">
          <div className="absolute top-2 bottom-2 left-3 w-px bg-gray-200" />
          <div className="relative z-10 space-y-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <ActivityIcon type={item.type} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">{item.message}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {timeAgo(item.createdAt)}
                    {item.sub && ` • ${item.sub}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
