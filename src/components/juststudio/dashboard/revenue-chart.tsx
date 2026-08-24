interface Props {
  revenueData: { day: string; value: number }[];
  loading?: boolean;
}

const W = 660,
  H = 220,
  PL = 52,
  PB = 30,
  PT = 14,
  PR = 10;
const chartW = W - PL - PR;
const chartH = H - PT - PB;

function niceMax(val: number): number {
  if (val <= 0) return 500;
  const exp = Math.pow(10, Math.floor(Math.log10(val)));
  const ceil = Math.ceil(val / exp) * exp;
  return ceil === val ? ceil + exp : ceil;
}

function buildTicks(max: number, count = 5): number[] {
  const step = max / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(step * i));
}

function fmtTick(v: number): string {
  if (v === 0) return '0';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${v % 1000 === 0 ? v / 1000 : (v / 1000).toFixed(1)}k`;
  return `${v}`;
}

export function RevenueChart({ revenueData, loading }: Props) {
  if (loading) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[280px] w-full" preserveAspectRatio="none">
        {[0, 1, 2, 3, 4].map((i) => {
          const y = PT + (i / 4) * chartH;
          return (
            <g key={i}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <rect x={0} y={y - 5} width={36} height={10} rx={3} fill="#f1f5f9" className="animate-pulse" />
            </g>
          );
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const x = PL + (i / 6) * chartW;
          return <rect key={i} x={x - 14} y={H - 22} width={28} height={10} rx={3} fill="#f1f5f9" className="animate-pulse" />;
        })}
        <path
          d={`M ${PL},${PT + chartH * 0.6} C ${PL + chartW * 0.15},${PT + chartH * 0.4} ${PL + chartW * 0.3},${PT + chartH * 0.7} ${PL + chartW * 0.5},${PT + chartH * 0.3} C ${PL + chartW * 0.65},${PT + chartH * 0.1} ${PL + chartW * 0.8},${PT + chartH * 0.5} ${PL + chartW},${PT + chartH * 0.45}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={2.5}
          strokeLinecap="round"
          className="animate-pulse"
        />
      </svg>
    );
  }

  const n = revenueData.length;
  if (!n) return null;

  const rawMax = Math.max(...revenueData.map((d) => d.value));
  const maxY = niceMax(rawMax);
  const ticks = buildTicks(maxY);

  const pts: [number, number][] = revenueData.map((d, i) => [PL + (i / (n - 1)) * chartW, PT + chartH - (d.value / maxY) * chartH]);

  let linePath = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1][0] + pts[i][0]) / 2;
    linePath += ` C ${mx},${pts[i - 1][1]} ${mx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }
  const areaPath = `${linePath} L ${pts[n - 1][0]},${PT + chartH} L ${pts[0][0]},${PT + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[280px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6e3bff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6e3bff" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {ticks.map((tick) => {
        const y = PT + chartH - (tick / maxY) * chartH;
        return (
          <g key={tick}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
              {fmtTick(tick)}
            </text>
          </g>
        );
      })}

      {pts.map(([x], i) => (
        <text key={i} x={x} y={H - 6} textAnchor="middle" fontSize={11} fill="#94a3b8">
          {revenueData[i].day}
        </text>
      ))}

      <path d={areaPath} fill="url(#rev-fill)" />
      <path d={linePath} fill="none" stroke="#6e3bff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="white" stroke="#6e3bff" strokeWidth={2} />
      ))}
    </svg>
  );
}
