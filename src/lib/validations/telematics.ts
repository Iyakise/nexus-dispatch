import { z } from "zod";
import { geoPointSchema, isoTimestampSchema, uuidSchema } from "./common";

/**
 * A single sensor reading. Mirrors public.telematics_logs
 * (20260922090600_telematics_logs.sql). This table is append-only and
 * written exclusively by the ingestion service with the service-role key —
 * there is deliberately no authenticated INSERT policy in Postgres — so
 * `telematicsLogSchema` is what that service validates incoming device
 * payloads against, not a schema an end user's browser ever submits.
 */
export const telematicsLogSchema = z.object({
  id: z.coerce.bigint(),
  tenantId: uuidSchema,
  shipmentId: uuidSchema.nullable(),
  vehicleId: uuidSchema,
  recordedAt: isoTimestampSchema,
  temperatureC: z.number().min(-60).max(60),
  humidityPct: z.number().min(0).max(100).nullable(),
  batteryPct: z.number().int().min(0).max(100).nullable(),
  location: geoPointSchema.nullable(),
  speedKmh: z.number().nonnegative().nullable(),
  isOnline: z.boolean(),
  createdAt: isoTimestampSchema,
});
export type TelematicsLog = z.infer<typeof telematicsLogSchema>;

/** What the ingestion worker validates a raw device payload against before insert. */
export const ingestTelematicsReadingSchema = z.object({
  tenantId: uuidSchema,
  shipmentId: uuidSchema.optional(),
  vehicleId: uuidSchema,
  recordedAt: isoTimestampSchema.optional(), // defaults to now() in Postgres if omitted
  temperatureC: z.number().min(-60).max(60),
  humidityPct: z.number().min(0).max(100).optional(),
  batteryPct: z.number().int().min(0).max(100).optional(),
  location: geoPointSchema.optional(),
  speedKmh: z.number().nonnegative().optional(),
  isOnline: z.boolean().default(true),
});
export type IngestTelematicsReadingInput = z.infer<typeof ingestTelematicsReadingSchema>;
