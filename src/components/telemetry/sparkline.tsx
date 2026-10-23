import { STANDARD_COLD_CHAIN, type ThermalRange, type ThermalStatus } from "@/lib/thermal";
import { cn } from "@/lib/utils";

const STROKE: Record<ThermalStatus, string> = {
  safe: "stroke-thermal-safe",
  warning: "stroke-thermal-warning",
  excursion: "stroke-thermal-excursion",
};
const FILL: Record<ThermalStatus, string> = {
  safe: "fill-thermal-safe",
  warning: "fill-thermal-warning",
  excursion: "fill-thermal-excursion",
};

export interface SparklineProps {
  /** Readings in °C, oldest first (evenly spaced). */
  values: number[];
  status: ThermalStatus;
  range?: ThermalRange;
  width?: number;
  height?: number;
  /** Accessible summary, e.g. "6-hour thermal profile". */
  label: string;
  className?: string;
}

/**
 * Lightweight SVG thermal profile with the compliant band shaded. Phase 4
 * replaces this with a realtime chart for full-size views; this stays as the
 * cheap in-card version.
 */
export function Sparkline({
  values,
  status,
  range = STANDARD_COLD_CHAIN,
  width = 240,
  height = 48,
  label,
  className,
}: SparklineProps) {
  if (values.length < 2) return null;

  const pad = 2;
  const lo = Math.min(range.min - 1.5, ...values);
  const hi = Math.max(range.max + 1.5, ...values);
  const x = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - lo) / (hi - lo)) * (height - pad * 2);

  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = values[values.length - 1] ?? range.min;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-12 w-full", className)}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      {/* compliant band */}
      <rect
        x={0}
        y={y(range.max)}
        width={width}
        height={y(range.min) - y(range.max)}
        className="fill-thermal-safe/10"
      />
      <line x1={0} x2={width} y1={y(range.max)} y2={y(range.max)} className="stroke-thermal-safe/40" strokeDasharray="3 3" />
      <line x1={0} x2={width} y1={y(range.min)} y2={y(range.min)} className="stroke-thermal-safe/40" strokeDasharray="3 3" />
      <polyline
        points={points}
        fill="none"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={STROKE[status]}
      />
      <circle cx={x(values.length - 1)} cy={y(last)} r={3} className={FILL[status]} />
    </svg>
  );
}
