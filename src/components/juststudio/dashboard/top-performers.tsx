import Link from 'next/link';

import { getInitials } from '@/components/juststudio/clients/types';

const RANK_STYLE = ['bg-amber-400 text-white', 'bg-gray-300 text-gray-700', 'bg-amber-700 text-white'];

export function TopPerformers({
  performers,
  currency,
}: {
  performers: { id: string; name: string; count: number; revenue: number }[];
  currency: string;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">Top instructors</h2>
      {performers.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400 italic">No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {performers.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">{getInitials(p.name)}</div>
                  <div
                    className={`absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold ${RANK_STYLE[i] ?? 'bg-gray-200 text-gray-600'}`}
                  >
                    {i + 1}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.count} booking{p.count === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-bold text-gray-800">
                  {currency} {p.revenue.toLocaleString()}
                </p>
                <p className="text-[10px] text-accent-600">revenue</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href="/juststudio/team" className="mt-5 block w-full rounded-lg border border-gray-200 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
        View all staff
      </Link>
    </section>
  );
}
