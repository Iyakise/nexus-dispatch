import { z } from "zod";
import { isoTimestampSchema, tenantSlugSchema, uuidSchema } from "./common";

/** Mirrors public.subscription_status (20260922090100_tenants.sql). */
export const subscriptionStatusSchema = z.enum(["trialing", "active", "past_due", "canceled"]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

/** Mirrors public.billing_plan. */
export const billingPlanSchema = z.enum(["starter", "growth", "enterprise"]);
export type BillingPlan = z.infer<typeof billingPlanSchema>;

/** past_due/canceled tenants are read-only — matches app.is_tenant_writable() in Postgres. */
export const WRITABLE_SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[] = ["trialing", "active"];

export function isTenantWritable(status: SubscriptionStatus): boolean {
  return WRITABLE_SUBSCRIPTION_STATUSES.includes(status);
}

export const tenantSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(200),
  slug: tenantSlugSchema,
  billingPlan: billingPlanSchema,
  subscriptionStatus: subscriptionStatusSchema,
  stripeCustomerId: z.string().min(1).nullable(),
  stripeSubscriptionId: z.string().min(1).nullable(),
  trialEndsAt: isoTimestampSchema.nullable(),
  currentPeriodEnd: isoTimestampSchema.nullable(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});
export type Tenant = z.infer<typeof tenantSchema>;

/**
 * What a client is actually allowed to submit. Matches
 * tenants_update_own_admin in Postgres: name and billingPlan are all an
 * owner/admin can change client-side — status and Stripe fields are
 * service-role-only (driven by Stripe webhooks), so they're deliberately
 * absent here, not just optional.
 */
export const updateTenantSettingsSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  billingPlan: billingPlanSchema.optional(),
});
export type UpdateTenantSettings = z.infer<typeof updateTenantSettingsSchema>;

/**
 * Tenant provisioning (signup, Phase 3). Server-only — id/status/Stripe
 * fields are assigned by the backend, not submitted by the signup form.
 */
export const createTenantSchema = z.object({
  name: z.string().min(1).max(200),
  slug: tenantSlugSchema,
  billingPlan: billingPlanSchema.default("starter"),
});
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
