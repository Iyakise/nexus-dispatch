import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "@/lib/env";

/**
 * Service-role Supabase client. Bypasses RLS entirely — this is the ONLY
 * client allowed to insert a tenant row (no authenticated INSERT policy
 * exists on public.tenants) or provision a teammate's public.users row
 * (same story; see 20260922090100_tenants.sql / 20260922090200_users.sql).
 *
 * `import "server-only"` makes any accidental import of this module from
 * client code a build-time error, not a leaked service-role key at
 * runtime. Never pass this client, or anything derived from it, to a
 * Client Component or a route a browser can hit unauthenticated.
 */
export function createAdminClient() {
  const env = getSupabaseServerEnv();
  return createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
