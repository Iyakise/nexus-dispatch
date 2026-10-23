import { z } from "zod";
import { isoTimestampSchema, uuidSchema } from "./common";

/** Mirrors public.alert_type / severity / status (20260922090700_alerts.sql). */
export const alertTypeSchema = z.enum([
  "thermal_excursion",
  "geofence_breach",
  "device_offline",
  "battery_low",
  "delivery_delay",
]);
export type AlertType = z.infer<typeof alertTypeSchema>;

export const alertSeveritySchema = z.enum(["info", "warning", "critical"]);
export type AlertSeverity = z.infer<typeof alertSeveritySchema>;

export const alertStatusSchema = z.enum(["open", "acknowledged", "resolved"]);
export type AlertStatus = z.infer<typeof alertStatusSchema>;

export const alertSchema = z.object({
  id: uuidSchema,
  tenantId: uuidSchema,
  shipmentId: uuidSchema.nullable(),
  vehicleId: uuidSchema.nullable(),
  telematicsLogId: z.coerce.bigint().nullable(),
  type: alertTypeSchema,
  severity: alertSeveritySchema,
  status: alertStatusSchema,
  message: z.string().min(1).max(500),
  triggeredAt: isoTimestampSchema,
  acknowledgedAt: isoTimestampSchema.nullable(),
  acknowledgedBy: uuidSchema.nullable(),
  resolvedAt: isoTimestampSchema.nullable(),
  resolvedBy: uuidSchema.nullable(),
  createdAt: isoTimestampSchema,
});
export type Alert = z.infer<typeof alertSchema>;

/**
 * What the alert-evaluation service validates before inserting a new
 * alert. There is no authenticated INSERT policy on public.alerts (see
 * alerts_insert_service_only in 20260922090700_alerts.sql) — alerts are
 * always raised by the service, never typed in by a person.
 */
export const createAlertSchema = z.object({
  tenantId: uuidSchema,
  shipmentId: uuidSchema.optional(),
  vehicleId: uuidSchema.optional(),
  telematicsLogId: z.coerce.bigint().optional(),
  type: alertTypeSchema,
  severity: alertSeveritySchema.default("warning"),
  message: z.string().min(1).max(500),
});
export type CreateAlertInput = z.infer<typeof createAlertSchema>;

/**
 * Acknowledge / resolve — the one write path staff use directly (see
 * alerts_update_acknowledge). Mirrors the alerts_ack_consistency DB
 * constraint: acknowledging without resolving is fine, but resolving
 * always implies (and the server should also set) resolvedAt.
 */
export const acknowledgeAlertSchema = z.object({
  status: z.enum(["acknowledged", "resolved"]),
});
export type AcknowledgeAlertInput = z.infer<typeof acknowledgeAlertSchema>;
