import { z } from "zod";

/**
 * Shared primitives so every table schema below stays consistent (and so a
 * form validating a partial row — an insert vs. a driver-status update —
 * can compose from the same pieces instead of redefining them).
 */

export const uuidSchema = z.uuid();

export const isoTimestampSchema = z.iso.datetime({ offset: true });

/** Three-letter ISO 4217 code, upper-cased. */
export const currencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "Use a 3-letter ISO 4217 currency code, e.g. USD");

/** Subdomain segment: <slug>.nexusdispatch.com — mirrors tenants_slug_format in the DB. */
export const tenantSlugSchema = z
  .string()
  .min(1)
  .max(63)
  .regex(
    /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/,
    "Lowercase letters, numbers and hyphens only; must start and end alphanumeric",
  );

/** [longitude, latitude] — GeoJSON order, not [lat, lon]. */
export const geoPointSchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
});
export type GeoPoint = z.infer<typeof geoPointSchema>;
