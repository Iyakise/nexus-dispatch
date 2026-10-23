import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { OnboardingStepper } from "../../onboarding-stepper";

export const metadata: Metadata = { title: "You're all set" };

const CHECKLIST = ["Company fundamentals", "Subscription tariff", "Trial activated"];

export default async function OnboardingStep4Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tenantId = (user?.app_metadata as { tenant_id?: string } | undefined)?.tenant_id;
  const { data: tenant } = tenantId
    ? await supabase.from("tenants").select("name, slug").eq("id", tenantId).maybeSingle()
    : { data: null };

  return (
    <div className="min-h-screen bg-brand-slate px-margin py-margin-lg">
      <div className="mx-auto flex max-w-xl flex-col gap-space-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-action">
              <Icon name="hub" size={18} />
            </div>
            <span className="text-title-md">Nexus Dispatch</span>
          </div>
          <OnboardingStepper current={4} />
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="space-y-space-lg p-space-xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-thermal-safe text-white">
              <Icon name="task_alt" size={30} filled />
            </div>
            <div>
              <h1 className="text-headline-md text-on-surface">
                {tenant?.name ? `${tenant.name} is ready` : "Your workspace is ready"}
              </h1>
              {tenant?.slug ? (
                <p className="mt-space-xs font-mono text-telemetry-sm text-on-surface-variant">
                  {tenant.slug}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nexusdispatch.com"}
                </p>
              ) : null}
            </div>

            <ul className="space-y-space-sm text-left">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-space-sm text-body-md text-on-surface">
                  <Icon name="check_circle" size={18} filled className="text-thermal-safe" />
                  {item}
                </li>
              ))}
            </ul>

            <Button asChild className="w-full">
              <Link href="/dashboard">
                Go to dashboard <Icon name="arrow_forward" size={18} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
