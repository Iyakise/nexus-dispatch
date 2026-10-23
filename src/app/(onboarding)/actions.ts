"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { tenantSlugSchema } from "@/lib/validations/common";
import { createTariffSchema } from "@/lib/validations/tariff";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ActionResult {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const signUpSchema = z.object({
  companyName: z.string().min(1, "Enter your company name").max(200),
  slug: tenantSlugSchema,
  fullName: z.string().min(1, "Enter your name").max(200),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
});

/**
 * Onboarding step 1: creates the auth user, the tenant row, and the
 * owner's public.users row — in that order, with rollback if a later
 * step fails, so we never leave an orphan auth user with no tenant.
 *
 * Both inserts use the service-role admin client because neither has an
 * authenticated INSERT policy in Postgres (see 20260922090100_tenants.sql
 * / 20260922090200_users.sql) — tenant and seat provisioning are
 * deliberately service-role-only operations, not something RLS lets a
 * freshly-signed-up user do to themselves directly.
 */
export async function signUpAndCreateTenant(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    companyName: formData.get("companyName"),
    slug: formData.get("slug"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }
  const { companyName, slug, fullName, email, password } = parsed.data;

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) {
    return { error: signUpError.message };
  }
  const userId = signUpData.user?.id;
  if (!userId) {
    return { error: "Couldn't create your account. Please try again." };
  }

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({ name: companyName, slug })
    .select("id")
    .single();

  if (tenantError) {
    await admin.auth.admin.deleteUser(userId); // roll back the orphaned auth user
    const message = tenantError.code === "23505" ? "That workspace address is already taken — try another." : tenantError.message;
    return { error: message, fieldErrors: tenantError.code === "23505" ? { slug: "Already taken" } : undefined };
  }

  const { error: userRowError } = await admin
    .from("users")
    .insert({ id: userId, tenant_id: tenant.id, role: "owner", full_name: fullName, email });

  if (userRowError) {
    await admin.from("tenants").delete().eq("id", tenant.id);
    await admin.auth.admin.deleteUser(userId);
    return { error: "Couldn't finish setting up your account. Please try again." };
  }

  // The access token signUp() just issued was minted before the row above
  // existed, so it carries no tenant_id claim yet (app.sync_user_claims
  // fires on the public.users insert, but that only updates auth.users —
  // it can't retroactively rewrite an already-issued JWT). Explicitly set
  // app_metadata, then refresh the session to mint a new token that
  // actually carries it — otherwise every RLS policy would see this user
  // as tenant-less until their token happened to refresh on its own.
  await admin.auth.admin.updateUserById(userId, {
    app_metadata: { tenant_id: tenant.id, tenant_role: "owner" },
  });
  await supabase.auth.refreshSession();

  redirect("/onboarding/subscription");
}

const tariffFormSchema = createTariffSchema.pick({ name: true, billingInterval: true, rateAmount: true });

/** Onboarding step 2: the tenant's first rate card, created as its own owner. */
export async function createOnboardingTariff(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = tariffFormSchema.safeParse({
    name: formData.get("name"),
    billingInterval: formData.get("billingInterval"),
    rateAmount: Number(formData.get("rateAmount")),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the tariff details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const tenantId = (user.app_metadata as { tenant_id?: string }).tenant_id;
  if (!tenantId) {
    return { error: "Your session is missing workspace info — try signing in again." };
  }

  const { error } = await supabase.from("tariffs").insert({ tenant_id: tenantId, ...parsed.data, currency: "USD" });
  if (error) {
    return { error: error.message };
  }

  redirect("/onboarding/payment");
}
