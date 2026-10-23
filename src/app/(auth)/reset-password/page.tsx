import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Create a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-slate px-margin py-margin-lg">
      <div className="w-full max-w-md space-y-space-xl">
        <div className="flex flex-col items-center gap-space-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-action text-white">
            <Icon name="shield_lock" size={26} />
          </div>
          <div>
            <p className="text-headline-sm text-white">Create a new password</p>
            <p className="text-body-sm text-slate-400">Choose something you haven&apos;t used before</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="p-space-xl">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
