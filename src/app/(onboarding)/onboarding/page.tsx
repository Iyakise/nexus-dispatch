import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingStepper } from "../onboarding-stepper";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create your workspace" };

export default function OnboardingStep1Page() {
  return (
    <div className="min-h-screen bg-brand-slate px-margin py-margin-lg">
      <div className="mx-auto flex max-w-xl flex-col gap-space-xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-space-sm text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-action">
              <Icon name="hub" size={18} />
            </div>
            <span className="text-title-md">Nexus Dispatch</span>
          </Link>
          <OnboardingStepper current={1} />
        </div>

        <div>
          <h1 className="text-headline-lg text-white">Create your workspace</h1>
          <p className="mt-space-xs text-body-md text-slate-400">Set up your company and owner account. Takes about a minute.</p>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="p-space-xl">
            <SignupForm />
          </CardContent>
        </Card>

        <p className="text-center text-body-sm text-slate-400">
          Already have a workspace?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
