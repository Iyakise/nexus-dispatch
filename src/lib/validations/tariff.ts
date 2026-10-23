import { z } from "zod";
import { currencyCodeSchema, isoTimestampSchema, uuidSchema } from "./common";

/** Mirrors public.billing_interval (20260922090400_tariffs.sql). */
export const billingIntervalSchema = z.enum(["per_shipment", "per_km", "per_kg", "monthly_flat"]);
export type BillingInterval = z.infer<typeof billingIntervalSchema>;

export const tariffSchema = z.object({
  id: uuidSchema,
  tenantId: uuidSchema,
  name: z.string().min(1).max(120),
  description: z.string().max(500).nullable(),
  billingInterval: billingIntervalSchema,
  rateAmount: z.number().nonnegative(),
  currency: currencyCodeSchema,
  isActive: z.boolean(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});
export type Tariff = z.infer<typeof tariffSchema>;

export const createTariffSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  billingInterval: billingIntervalSchema.default("per_shipment"),
  rateAmount: z.number().nonnegative(),
  currency: currencyCodeSchema.default("USD"),
});
export type CreateTariffInput = z.infer<typeof createTariffSchema>;

export const updateTariffSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  billingInterval: billingIntervalSchema.optional(),
  rateAmount: z.number().nonnegative().optional(),
  currency: currencyCodeSchema.optional(),
  isActive: z.boolean().optional(),
});
export type UpdateTariffInput = z.infer<typeof updateTariffSchema>;
