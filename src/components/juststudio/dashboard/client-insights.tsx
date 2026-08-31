import { Sparkles, UserPlus, UserRoundCheck } from 'lucide-react';

export function ClientInsights({
  newThisMonth,
  returning,
  vip,
}: {
  newThisMonth: number;
  returning: number;
  vip: number;
}) {
  const items = [
    { label: 'New clients', sub: 'This month', value: newThisMonth, bg: 'bg-blue-100', fg: 'text-blue-600', Icon: UserPlus },
    { label: 'Returning', sub: '2+ visits', value: returning, bg: 'bg-emerald-100', fg: 'text-emerald-600', Icon: UserRoundCheck },
    { label: 'VIP clients', sub: 'Total', value: vip, bg: 'bg-amber-100', fg: 'text-amber-600', Icon: Sparkles },
  ];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">Client insights</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.fg}`}>
                <item.Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
