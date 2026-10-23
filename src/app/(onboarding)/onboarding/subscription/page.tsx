import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { OnboardingStepper } from "../../onboarding-stepper";
import { TariffForm } from "./tariff-form";

export const metadata: Metadata = { title: "Set a tariff" };

export default async function OnboardingStep2Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tenantId = (user?.app_metadata as { tenant_id?: string } | undefined)?.tenant_id;

  const { data: tenant } = tenantId
    ? await supabase.from("tenants").select("name").eq("id", tenantId).maybeSingle()
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
          <OnboardingStepper current={2} />
        </div>

        <div>
          <h1 className="text-headline-lg text-white">Set your first tariff</h1>
          <p className="mt-space-xs text-body-md text-slate-400">
            {tenant?.name ? `For ${tenant.name}. ` : ""}How you&apos;ll charge for shipments. You can add more later.
          </p>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="p-space-xl">
            <TariffForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
