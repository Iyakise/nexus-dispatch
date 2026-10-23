import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  classifyTemperature,
  formatCelsius,
  STANDARD_COLD_CHAIN,
  type ThermalRange,
  type ThermalStatus,
} from "@/lib/thermal";

const STATUS_META: Record<ThermalStatus, { icon: "check_circle" | "warning" | "error"; label: string }> = {
  safe: { icon: "check_circle", label: "In range" },
  warning: { icon: "warning", label: "Near limit" },
  excursion: { icon: "error", label: "Excursion" },
};

export interface ThermalBadgeProps {
  /** Reading in °C. */
  celsius: number;
  /** Override the computed status (e.g. server-side classification). */
  status?: ThermalStatus;
  range?: ThermalRange;
  className?: string;
}

/**
 * Temperature chip. Status is conveyed by icon + accessible label as well as
 * colour, so it stays readable for colour-blind operators.
 */
export function ThermalBadge({
  celsius,
  status,
  range = STANDARD_COLD_CHAIN,
  className,
}: ThermalBadgeProps) {
  const resolved = status ?? classifyTemperature(celsius, range);
  const meta = STATUS_META[resolved];
  return (
    <Badge variant={resolved} className={cn("gap-space-xs font-mono text-telemetry-sm", className)}>
      <Icon
        name={meta.icon}
        size={14}
        filled
        className={cn(resolved === "excursion" && "animate-excursion-pulse")}
      />
      <span>{formatCelsius(celsius)}</span>
      <span className="sr-only">{meta.label}</span>
    </Badge>
  );
}
