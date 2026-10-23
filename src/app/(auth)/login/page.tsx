import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { getTenantBySlug } from "@/lib/supabase/tenant-lookup";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ next }, headerList] = await Promise.all([searchParams, headers()]);

  // Set by src/proxy.ts from the request's Host header. Present only when
  // the visitor is on a tenant subdomain (acme.nexusdispatch.com), not on
  // the bare root domain.
  const tenantSlug = headerList.get("x-tenant-slug");
  const tenant = tenantSlug ? await getTenantBySlug(tenantSlug) : null;

  const nextPath = next && next.startsWith("/") ? next : "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-slate px-margin py-margin-lg">
      <div className="w-full max-w-md space-y-space-xl">
        <div className="flex flex-col items-center gap-space-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-action text-white">
            <Icon name="shield_lock" size={26} />
          </div>
          <div>
            <p className="text-headline-sm text-white">Nexus Dispatch</p>
            <p className="text-body-sm text-slate-400">Cold-chain dispatch platform</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="space-y-space-lg p-space-xl">
            {tenant ? (
              <div className="flex items-center gap-space-sm rounded-lg border bg-surface-container-low px-space-md py-space-sm">
                <Icon name="corporate_fare" size={20} className="text-action" />
                <div className="min-w-0">
                  <p className="truncate text-title-md text-on-surface">{tenant.name}</p>
                  <p className="text-body-sm text-on-surface-variant">Signing in to this workspace</p>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-headline-md text-on-surface">Sign in</h1>
                <p className="mt-space-xs text-body-sm text-on-surface-variant">
                  Use your organisation&apos;s own sign-in address (e.g. acme.{process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nexusdispatch.com"}) if you have it, or sign in below.
                </p>
              </div>
            )}

            <LoginForm nextPath={nextPath} />
          </CardContent>
        </Card>

        <p className="text-center text-body-sm text-slate-400">
          New to Nexus Dispatch?{" "}
          <Link href="/onboarding" className="text-white hover:underline">
            Start a 14-day trial
          </Link>
        </p>
      </div>
    </div>
  );
}
