const W = 660;
const H = 220;
const PL = 46;
const PB = 26;
const PT = 14;
const PR = 10;
const CHART_W = W - PL - PR;
const CHART_H = H - PT - PB;

function niceMax(val: number): number {
  if (val <= 0) return 100;
  const exp = 10 ** Math.floor(Math.log10(val));
  const ceil = Math.ceil(val / exp) * exp;
  return ceil === val ? ceil + exp : ceil;
}

function buildTicks(max: number, count = 4): number[] {
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) => Math.round(step * i));
}

function fmtTick(v: number): string {
  if (v === 0) return '0';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `${v % 1000 === 0 ? v / 1000 : (v / 1000).toFixed(1)}k`;
  return `${v}`;
}

export function RevenueChart({ data }: { data: { label: string; value: number }[] }) {
  const n = data.length;
  if (n === 0) return null;

  const maxY = niceMax(Math.max(...data.map((d) => d.value)));
  const ticks = buildTicks(maxY);

  const pts: [number, number][] = data.map((d, i) => [
    n === 1 ? PL + CHART_W / 2 : PL + (i / (n - 1)) * CHART_W,
    PT + CHART_H - (d.value / maxY) * CHART_H,
  ]);

  let linePath = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1][0] + pts[i][0]) / 2;
    linePath += ` C ${mx},${pts[i - 1][1]} ${mx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }
  const areaPath = `${linePath} L ${pts[n - 1][0]},${PT + CHART_H} L ${pts[0][0]},${PT + CHART_H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[220px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-500)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-accent-500)" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {ticks.map((tick) => {
        const y = PT + CHART_H - (tick / maxY) * CHART_H;
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
          {data[i].label}
        </text>
      ))}

      <path d={areaPath} fill="url(#rev-fill)" />
      <path d={linePath} fill="none" stroke="var(--color-accent-500)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="white" stroke="var(--color-accent-500)" strokeWidth={2} />
      ))}
    </svg>
  );
}
