import "server-only";
import { createAdminClient } from "./admin";

export interface PublicTenantInfo {
  id: string;
  name: string;
  slug: string;
}

/**
 * Looks up a tenant's display name by subdomain slug, for the login page
 * to show "Signing in to Acme Cold-Chain Logistics" before the visitor
 * has authenticated. Uses the admin (service-role) client deliberately:
 * tenants_select_own in Postgres requires an authenticated session
 * already matching that tenant, so an anonymous visitor cannot read this
 * through the normal RLS-protected client — correctly so, since most
 * tenant columns (billing plan, Stripe IDs, subscription status) are not
 * meant to be public. Only `id`, `name` and `slug` are selected here and
 * returned to the page; nothing sensitive leaves this function.
 */
export async function getTenantBySlug(slug: string): Promise<PublicTenantInfo | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("tenants").select("id, name, slug").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("getTenantBySlug failed:", error.message);
    return null;
  }
  return data;
}
