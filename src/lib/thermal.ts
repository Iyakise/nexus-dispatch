/**
 * Thermal classification for cold-chain telemetry.
 *
 * Default band is the 2–8 °C biological standard (DESIGN.md). A reading within
 * `warnMargin` of either bound is a warning (trending toward an excursion);
 * anything outside the band is an excursion.
 *
 * Bounds are parameters because tenants/shipments will later carry their own
 * profiles (e.g. frozen −20 °C, controlled room temperature 15–25 °C).
 */

export type ThermalStatus = "safe" | "warning" | "excursion";

export interface ThermalRange {
  /** Lower bound, °C (inclusive). */
  min: number;
  /** Upper bound, °C (inclusive). */
  max: number;
  /** Distance from a bound at which a reading becomes a warning, °C. */
  warnMargin: number;
}

export const STANDARD_COLD_CHAIN: ThermalRange = {
  min: 2,
  max: 8,
  warnMargin: 0.5,
};

export function classifyTemperature(
  celsius: number,
  range: ThermalRange = STANDARD_COLD_CHAIN,
): ThermalStatus {
  // Fail safe: a missing/invalid sensor value must never read as "safe".
  if (!Number.isFinite(celsius)) return "excursion";
  if (celsius < range.min || celsius > range.max) return "excursion";
  if (
    celsius <= range.min + range.warnMargin ||
    celsius >= range.max - range.warnMargin
  ) {
    return "warning";
  }
  return "safe";
}

export function formatCelsius(celsius: number, fractionDigits = 1): string {
  if (!Number.isFinite(celsius)) return "--.-°C";
  return `${celsius.toFixed(fractionDigits)}°C`;
}
