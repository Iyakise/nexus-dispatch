import { z } from "zod";
import { geoPointSchema, isoTimestampSchema, uuidSchema } from "./common";

/** Mirrors public.shipment_status (20260922090500_shipments.sql). */
export const shipmentStatusSchema = z.enum([
  "pending",
  "dispatched",
  "in_transit",
  "delivered",
  "cancelled",
  "exception",
]);
export type ShipmentStatus = z.infer<typeof shipmentStatusSchema>;

/**
 * "NX-8921" — mirrors app.next_shipment_reference()'s output format.
 * Editable client-side only when a tenant needs their own scheme; the DB
 * default (auto-incrementing per tenant) covers the common case.
 */
export const referenceCodeSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[A-Z0-9][A-Z0-9-]*$/, "Upper-case letters, digits and hyphens only");

// See the NOTE in vehicle.ts: Zod 4's .check() takes a single ctx argument
// (ctx.value / ctx.issues.push), not the (value, ctx) => ctx.addIssue(...)
// shape from Zod 3's .superRefine(). Each schema below inlines its own
// check with its own optional/nullable field types rather than sharing one
// helper, to avoid a shared type that's either too loose (`unknown`,
// needing a cast) or has to be redeclared per schema anyway.

export const shipmentSchema = z
  .object({
    id: uuidSchema,
    tenantId: uuidSchema,
    referenceCode: referenceCodeSchema,
    status: shipmentStatusSchema,
    vehicleId: uuidSchema.nullable(),
    driverId: uuidSchema.nullable(),
    tariffId: uuidSchema.nullable(),
    clientName: z.string().min(1).max(200),
    cargoDescription: z.string().min(1).max(500),
    originLabel: z.string().min(1).max(200),
    destinationLabel: z.string().min(1).max(200),
    originPoint: geoPointSchema.nullable(),
    destinationPoint: geoPointSchema.nullable(),
    thermalMinC: z.number().min(-40).max(40).nullable(),
    thermalMaxC: z.number().min(-40).max(40).nullable(),
    scheduledPickupAt: isoTimestampSchema.nullable(),
    scheduledDeliveryAt: isoTimestampSchema.nullable(),
    actualPickupAt: isoTimestampSchema.nullable(),
    actualDeliveryAt: isoTimestampSchema.nullable(),
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .check((ctx) => {
    const { thermalMinC, thermalMaxC } = ctx.value;
    if (thermalMinC !== null && thermalMaxC !== null && thermalMinC >= thermalMaxC) {
      ctx.issues.push({
        code: "custom",
        path: ["thermalMaxC"],
        message: "thermalMaxC must be greater than thermalMinC",
        input: ctx.value,
      });
    }
  });
export type Shipment = z.infer<typeof shipmentSchema>;

/**
 * New-dispatch-ticket form. Matches shipments_insert_dispatcher_up:
 * tenantId is never in the payload — the server derives it from the
 * caller's own JWT claim, exactly like the RLS policy does, so a client
 * can't even attempt to set it.
 */
export const createShipmentSchema = z
  .object({
    referenceCode: referenceCodeSchema.optional(), // omit to use the DB default (app.next_shipment_reference())
    vehicleId: uuidSchema.optional(),
    driverId: uuidSchema.optional(),
    tariffId: uuidSchema.optional(),
    clientName: z.string().min(1).max(200),
    cargoDescription: z.string().min(1).max(500),
    originLabel: z.string().min(1).max(200),
    destinationLabel: z.string().min(1).max(200),
    originPoint: geoPointSchema.optional(),
    destinationPoint: geoPointSchema.optional(),
    thermalMinC: z.number().min(-40).max(40).optional(),
    thermalMaxC: z.number().min(-40).max(40).optional(),
    scheduledPickupAt: isoTimestampSchema.optional(),
    scheduledDeliveryAt: isoTimestampSchema.optional(),
  })
  .check((ctx) => {
    const { thermalMinC, thermalMaxC } = ctx.value;
    if (thermalMinC !== undefined && thermalMaxC !== undefined && thermalMinC >= thermalMaxC) {
      ctx.issues.push({
        code: "custom",
        path: ["thermalMaxC"],
        message: "thermalMaxC must be greater than thermalMinC",
        input: ctx.value,
      });
    }
  });
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;

/** Dispatcher/admin edit — any field. */
export const updateShipmentSchema = z
  .object({
    status: shipmentStatusSchema.optional(),
    vehicleId: uuidSchema.nullable().optional(),
    driverId: uuidSchema.nullable().optional(),
    tariffId: uuidSchema.nullable().optional(),
    clientName: z.string().min(1).max(200).optional(),
    cargoDescription: z.string().min(1).max(500).optional(),
    originLabel: z.string().min(1).max(200).optional(),
    destinationLabel: z.string().min(1).max(200).optional(),
    originPoint: geoPointSchema.nullable().optional(),
    destinationPoint: geoPointSchema.nullable().optional(),
    thermalMinC: z.number().min(-40).max(40).nullable().optional(),
    thermalMaxC: z.number().min(-40).max(40).nullable().optional(),
    scheduledPickupAt: isoTimestampSchema.nullable().optional(),
    scheduledDeliveryAt: isoTimestampSchema.nullable().optional(),
    actualPickupAt: isoTimestampSchema.nullable().optional(),
    actualDeliveryAt: isoTimestampSchema.nullable().optional(),
  })
  .check((ctx) => {
    const { thermalMinC, thermalMaxC } = ctx.value;
    if (
      thermalMinC !== undefined &&
      thermalMinC !== null &&
      thermalMaxC !== undefined &&
      thermalMaxC !== null &&
      thermalMinC >= thermalMaxC
    ) {
      ctx.issues.push({
        code: "custom",
        path: ["thermalMaxC"],
        message: "thermalMaxC must be greater than thermalMinC",
        input: ctx.value,
      });
    }
  });
export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;

/**
 * The narrow subset a driver may actually submit. shipments_update_dispatcher_up
 * lets a driver UPDATE their own shipment row at the RLS layer, but RLS
 * can't restrict *which columns* change — this schema is that restriction,
 * enforced in the server action/route handler before the update is issued.
 */
export const driverUpdateShipmentSchema = z.object({
  status: z.enum(["in_transit", "delivered", "exception"]).optional(),
  actualPickupAt: isoTimestampSchema.optional(),
  actualDeliveryAt: isoTimestampSchema.optional(),
});
export type DriverUpdateShipmentInput = z.infer<typeof driverUpdateShipmentSchema>;
