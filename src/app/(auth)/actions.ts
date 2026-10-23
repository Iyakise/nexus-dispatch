"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
}

const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

/**
 * Email/password sign-in. The tenant isn't selected here — a user's
 * account belongs to exactly one tenant already (see public.users), so
 * Supabase Auth resolves the account from the email alone and the
 * JWT's tenant_id claim (synced by app.sync_user_claims) does the rest.
 * The subdomain the person signed in from is a presentational hint, not
 * a credential.
 */
export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // Supabase returns the same message for "no such user" and "wrong
    // password" by design (so a login form can't be used to enumerate
    // which emails have accounts) — passed straight through here.
    return { error: error.message };
  }

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/") ? next : "/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const requestResetSchema = z.object({ email: z.email("Enter a valid email address") });

export async function requestPasswordReset(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = requestResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  // Deliberately not surfaced even on failure (other than a malformed
  // email, caught above): confirming or denying an email has an account
  // is the same account-enumeration leak noted in signIn(). The
  // confirmation screen always shows success; a real failure (bad SMTP
  // config, etc.) shows up in server logs, not to the visitor.
  if (error) {
    console.error("resetPasswordForEmail failed:", error.message);
  }

  redirect(`/forgot-password/sent?email=${encodeURIComponent(parsed.data.email)}`);
}

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords don't match",
        input: ctx.value,
      });
    }
  });

/**
 * Sets a new password for the currently-authenticated session. Reached
 * only via the one-time link from the reset email, which Supabase Auth
 * exchanges for a short-lived session before this page ever renders —
 * there is no separate reset token handled here.
 */
export async function updatePassword(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your new password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: error.message };
  }

  redirect("/reset-password/success");
}
