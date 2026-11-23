/** Minimal SVG charts drawn with the design tokens (light and dark). */

export function LineChart({
  points,
  max,
  format,
  height = 160,
}: {
  points: Array<{ label: string; value: number | null }>;
  max: number;
  format: (v: number) => string;
  height?: number;
}) {
  const w = 640;
  const h = height;
  const pad = { l: 36, r: 12, t: 12, b: 24 };
  const n = points.length;
  const x = (i: number) => pad.l + (n <= 1 ? 0 : (i * (w - pad.l - pad.r)) / (n - 1));
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b);
  const defined = points.map((p, i) => ({ ...p, i })).filter((p) => p.value !== null) as Array<{ label: string; value: number; i: number }>;
  const path = defined.map((p, k) => `${k === 0 ? "M" : "L"}${x(p.i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const grid = [0, 0.5, 1].map((f) => f * max);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
      {grid.map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={w - pad.r} y1={y(g)} y2={y(g)} stroke="var(--line)" strokeWidth={1} />
          <text x={pad.l - 8} y={y(g) + 4} textAnchor="end" fontSize={11} fill="var(--text-3)">
            {format(g)}
          </text>
        </g>
      ))}
      {points.map((p, i) =>
        n <= 8 || i % Math.ceil(n / 6) === 0 || i === n - 1 ? (
          <text key={i} x={x(i)} y={h - 6} textAnchor="middle" fontSize={11} fill="var(--text-3)">
            {p.label}
          </text>
        ) : null,
      )}
      {path && <path d={path} fill="none" stroke="var(--accent)" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />}
      {defined.map((p) => (
        <circle key={p.i} cx={x(p.i)} cy={y(p.value)} r={3} fill="var(--bg)" stroke="var(--accent)" strokeWidth={1.5}>
          <title>{`${p.label}: ${format(p.value)}`}</title>
        </circle>
      ))}
    </svg>
  );
}

/** Study days over recent weeks: columns are weeks, rows Monday to Sunday. */
export function ConsistencyGrid({ days, today, weeks = 20 }: { days: Record<string, "complete" | "partial" | "exam">; today: string; weeks?: number }) {
  const cell = 12;
  const gap = 3;
  const todayDate = new Date(`${today}T12:00:00Z`);
  const dow = (todayDate.getUTCDay() + 6) % 7; // Monday = 0
  const start = new Date(todayDate.getTime() - (dow + 7 * (weeks - 1)) * 86_400_000);
  const cols: Array<Array<{ date: string; state: string | null; future: boolean }>> = [];
  for (let wk = 0; wk < weeks; wk++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getTime() + (wk * 7 + d) * 86_400_000).toISOString().slice(0, 10);
      col.push({ date, state: days[date] ?? null, future: date > today });
    }
    cols.push(col);
  }
  const fill = (s: string | null, future: boolean) =>
    future ? "transparent" : s === "complete" ? "var(--text)" : s === "exam" ? "var(--accent)" : s === "partial" ? "var(--text-3)" : "var(--line)";
  return (
    <svg viewBox={`0 0 ${weeks * (cell + gap)} ${7 * (cell + gap)}`} className="h-auto w-full max-w-[420px]" role="img">
      {cols.map((col, i) =>
        col.map((c, d) => (
          <rect key={c.date} x={i * (cell + gap)} y={d * (cell + gap)} width={cell} height={cell} rx={2.5} fill={fill(c.state, c.future)}>
            <title>{c.date}</title>
          </rect>
        )),
      )}
    </svg>
  );
}
