import { z } from "zod";
import { isoTimestampSchema, uuidSchema } from "./common";

/** Mirrors public.tenant_role (20260922090200_users.sql). */
export const tenantRoleSchema = z.enum(["owner", "admin", "dispatcher", "driver", "viewer"]);
export type TenantRole = z.infer<typeof tenantRoleSchema>;

/** Roles that may write to most operational tables (see the RLS policies). */
export const DISPATCHER_UP_ROLES: readonly TenantRole[] = ["owner", "admin", "dispatcher"];
/** Roles that may manage tenant settings, teammates, billing and deletes. */
export const ADMIN_ROLES: readonly TenantRole[] = ["owner", "admin"];

export const userSchema = z.object({
  id: uuidSchema,
  tenantId: uuidSchema,
  role: tenantRoleSchema,
  fullName: z.string().min(1).max(200),
  email: z.email(),
  phone: z.string().min(1).max(32).nullable(),
  avatarUrl: z.url().nullable(),
  assignedVehicleId: uuidSchema.nullable(),
  isActive: z.boolean(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});
export type User = z.infer<typeof userSchema>;

/**
 * A user editing their own profile. Matches users_update_self in Postgres:
 * role/tenantId/isActive are excluded, not merely optional — that policy
 * requires role to come back unchanged, so the form must never offer it.
 */
export const updateOwnProfileSchema = z.object({
  fullName: z.string().min(1).max(200).optional(),
  phone: z.string().min(1).max(32).nullable().optional(),
  avatarUrl: z.url().nullable().optional(),
});
export type UpdateOwnProfileInput = z.infer<typeof updateOwnProfileSchema>;

/** An owner/admin editing a teammate. Matches users_update_admin. */
export const updateTeammateSchema = z.object({
  role: tenantRoleSchema.optional(),
  isActive: z.boolean().optional(),
  assignedVehicleId: uuidSchema.nullable().optional(),
});
export type UpdateTeammateInput = z.infer<typeof updateTeammateSchema>;

/**
 * Seat invite (Phase 3). Provisioning itself goes through the Supabase
 * Auth admin API with the service role — this schema validates the invite
 * *form*, not a direct table insert (there is no authenticated INSERT
 * policy on public.users; see 20260922090200_users.sql).
 */
export const inviteTeammateSchema = z.object({
  email: z.email(),
  fullName: z.string().min(1).max(200),
  role: tenantRoleSchema,
});
export type InviteTeammateInput = z.infer<typeof inviteTeammateSchema>;
