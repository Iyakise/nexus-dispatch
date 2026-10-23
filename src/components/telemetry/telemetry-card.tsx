import { Icon } from "@/components/icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  classifyTemperature,
  formatCelsius,
  STANDARD_COLD_CHAIN,
  type ThermalRange,
} from "@/lib/thermal";
import { Sparkline } from "./sparkline";
import { ThermalBadge } from "./thermal-badge";

export interface TelemetryCardProps {
  /** Reefer / asset identifier, shown in the mono face. */
  assetId: string;
  /** Short description, e.g. cargo or route. */
  subtitle?: string;
  /** Current reading, °C. */
  celsius: number;
  /** Last ~6 hours of readings, oldest first. */
  history: number[];
  humidityPct: number;
  batteryPct: number;
  /** Whether the sensor is reporting. */
  online?: boolean;
  range?: ThermalRange;
  className?: string;
}

/**
 * Cold-chain telemetry card (DESIGN.md): asset ID + sensor status header,
 * primary reading in telemetry-lg, 6-hour sparkline, humidity/battery footer.
 */
export function TelemetryCard({
  assetId,
  subtitle,
  celsius,
  history,
  humidityPct,
  batteryPct,
  online = true,
  range = STANDARD_COLD_CHAIN,
  className,
}: TelemetryCardProps) {
  const status = classifyTemperature(celsius, range);

  return (
    <Card className={cn(status === "excursion" && "border-thermal-excursion-border", className)}>
      <CardHeader className="py-space-sm">
        <div className="min-w-0">
          <p className="truncate font-mono text-telemetry-md text-on-surface">{assetId}</p>
          {subtitle ? <p className="truncate text-body-sm text-on-surface-variant">{subtitle}</p> : null}
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-space-xs text-label-md",
            online ? "text-thermal-safe-text" : "text-on-surface-variant",
          )}
        >
          <span
            aria-hidden
            className={cn("h-2 w-2 rounded-full", online ? "bg-thermal-safe" : "bg-outline")}
          />
          {online ? "Sensor online" : "No signal"}
        </span>
      </CardHeader>
      <CardContent className="space-y-space-md p-space-md">
        <div className="flex items-end justify-between gap-space-md">
          <p
            className={cn(
              "font-mono text-telemetry-lg",
              status === "safe" && "text-on-surface",
              status === "warning" && "text-thermal-warning-text",
              status === "excursion" && "text-thermal-excursion-text",
            )}
          >
            {formatCelsius(celsius)}
          </p>
          <ThermalBadge celsius={celsius} range={range} />
        </div>
        <Sparkline values={history} status={status} range={range} label={`${assetId} 6-hour thermal profile`} />
        <div className="flex items-center justify-between border-t border-slate-100 pt-space-sm font-mono text-telemetry-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-space-xs">
            <Icon name="humidity_percentage" size={16} />
            {humidityPct}% RH
          </span>
          <span className="inline-flex items-center gap-space-xs">
            <Icon name="battery_full" size={16} />
            {batteryPct}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
