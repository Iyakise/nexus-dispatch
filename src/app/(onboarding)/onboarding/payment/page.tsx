import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingStepper } from "../../onboarding-stepper";

export const metadata: Metadata = { title: "Billing" };

/**
 * Deliberately a placeholder: Stripe Billing integration is Phase 5. A
 * tenant's subscription_status defaults to 'trialing' at creation (see
 * 20260922090100_tenants.sql), which app.is_tenant_writable() already
 * treats as fully writable — so skipping payment here does not leave the
 * account in a degraded state. This step exists so the 4-step flow the
 * product brief asked for has a real stop here, without pretending to
 * collect a card we have nowhere to send yet.
 */
export default function OnboardingStep3Page() {
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
          <OnboardingStepper current={3} />
        </div>

        <div>
          <h1 className="text-headline-lg text-white">You&apos;re on a 14-day trial</h1>
          <p className="mt-space-xs text-body-md text-slate-400">No card needed to get started.</p>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="space-y-space-lg p-space-xl">
            <div className="flex items-start gap-space-md rounded-lg border bg-surface-container-low p-space-md">
              <Icon name="info" size={20} className="mt-0.5 shrink-0 text-action" />
              <div>
                <p className="text-title-md text-on-surface">Billing isn&apos;t connected yet</p>
                <p className="mt-space-xs text-body-sm text-on-surface-variant">
                  Your workspace is fully usable on the trial. We&apos;ll email you before it ends, and you&apos;ll be
                  able to add a card from Billing &amp; Tariffs once that&apos;s ready.
                </p>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/onboarding/welcome">
                Continue <Icon name="arrow_forward" size={18} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
