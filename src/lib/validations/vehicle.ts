import { z } from "zod";
import { isoTimestampSchema, uuidSchema } from "./common";

/** Mirrors public.vehicle_type / public.vehicle_status (20260922090300_vehicles.sql). */
export const vehicleTypeSchema = z.enum(["van", "truck", "trailer"]);
export type VehicleType = z.infer<typeof vehicleTypeSchema>;

export const vehicleStatusSchema = z.enum(["active", "maintenance", "retired"]);
export type VehicleStatus = z.infer<typeof vehicleStatusSchema>;

/**
 * NOTE on `.check()`: Zod 4's callback takes a single `ctx` argument
 * (`ctx.value`, `ctx.issues.push(...)`) — NOT the classic two-arg
 * `(value, ctx) => ctx.addIssue(...)` shape carried over from
 * `.superRefine()` in Zod 3. Verified directly against the installed zod
 * version: the two-arg form type-checks (nothing on `ctx` is statically
 * typed away) but silently never records the issue, so invalid data
 * passes validation. Each schema below inlines its own check rather than
 * sharing one helper, because a shared helper's parameter type would have
 * to either widen to `unknown` (losing the property names) or be
 * re-declared per schema anyway — inlining is the less error-prone option.
 */

export const vehicleSchema = z
  .object({
    id: uuidSchema,
    tenantId: uuidSchema,
    label: z.string().min(1).max(120),
    vin: z.string().min(1).max(32).nullable(),
    plateNumber: z.string().min(1).max(32).nullable(),
    type: vehicleTypeSchema,
    status: vehicleStatusSchema,
    reeferUnitId: z.string().min(1).max(64).nullable(),
    thermalMinC: z.number().min(-40).max(40),
    thermalMaxC: z.number().min(-40).max(40),
    lastMaintenanceAt: isoTimestampSchema.nullable(),
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .check((ctx) => {
    if (ctx.value.thermalMinC >= ctx.value.thermalMaxC) {
      ctx.issues.push({
        code: "custom",
        path: ["thermalMaxC"],
        message: "thermalMaxC must be greater than thermalMinC",
        input: ctx.value,
      });
    }
  });
export type Vehicle = z.infer<typeof vehicleSchema>;

export const createVehicleSchema = z
  .object({
    label: z.string().min(1).max(120),
    vin: z.string().min(1).max(32).optional(),
    plateNumber: z.string().min(1).max(32).optional(),
    type: vehicleTypeSchema.default("van"),
    reeferUnitId: z.string().min(1).max(64).optional(),
    thermalMinC: z.number().min(-40).max(40).default(2.0),
    thermalMaxC: z.number().min(-40).max(40).default(8.0),
  })
  .check((ctx) => {
    if (ctx.value.thermalMinC >= ctx.value.thermalMaxC) {
      ctx.issues.push({
        code: "custom",
        path: ["thermalMaxC"],
        message: "thermalMaxC must be greater than thermalMinC",
        input: ctx.value,
      });
    }
  });
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

// Not derived from createVehicleSchema.partial(): Zod rejects .partial() on
// a schema carrying a .check() refinement. Defined independently instead,
// with the thermal-bounds check only applied when the caller submits both
// bounds together (a partial update may legitimately send just one, or
// neither).
export const updateVehicleSchema = z
  .object({
    label: z.string().min(1).max(120).optional(),
    vin: z.string().min(1).max(32).optional(),
    plateNumber: z.string().min(1).max(32).optional(),
    type: vehicleTypeSchema.optional(),
    status: vehicleStatusSchema.optional(),
    reeferUnitId: z.string().min(1).max(64).optional(),
    thermalMinC: z.number().min(-40).max(40).optional(),
    thermalMaxC: z.number().min(-40).max(40).optional(),
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
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
