import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Placeholder landing spot for an authenticated session. Reaching this
 * page with a real user and tenant name populated is the end-to-end proof
 * that signup, tenant provisioning, and the proxy.ts auth guard all work
 * together — the real operational dashboard is built in Phase 4.
 */
export default async function DashboardPlaceholderPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tenantId = (user?.app_metadata as { tenant_id?: string } | undefined)?.tenant_id;
  const { data: tenant } = tenantId
    ? await supabase.from("tenants").select("name").eq("id", tenantId).maybeSingle()
    : { data: null };
  const { data: profile } = user
    ? await supabase.from("users").select("full_name, role").eq("id", user.id).maybeSingle()
    : { data: null };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-margin">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-space-lg p-space-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-action text-white">
            <Icon name="dashboard" size={24} />
          </div>
          <div>
            <h1 className="text-headline-md text-on-surface">{tenant?.name ?? "Your workspace"}</h1>
            <p className="mt-space-xs text-body-md text-on-surface-variant">
              Signed in as {profile?.full_name ?? user?.email} ({profile?.role ?? "unknown role"})
            </p>
          </div>
          <p className="rounded-lg border bg-surface-container-low px-space-md py-space-sm text-body-sm text-on-surface-variant">
            The real Cold-Chain Operational Command dashboard is built in Phase 4. This placeholder confirms
            sign-in, tenant resolution and route protection all work.
          </p>
          <form action={signOut}>
            <Button type="submit" variant="secondary" className="w-full">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
