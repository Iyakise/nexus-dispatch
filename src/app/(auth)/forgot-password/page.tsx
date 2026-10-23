import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-slate px-margin py-margin-lg">
      <div className="w-full max-w-md space-y-space-xl">
        <div className="flex flex-col items-center gap-space-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-action text-white">
            <Icon name="lock_reset" size={26} />
          </div>
          <div>
            <p className="text-headline-sm text-white">Reset your password</p>
            <p className="text-body-sm text-slate-400">We&apos;ll email you a secure link</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="p-space-xl">
            <ForgotPasswordForm />
          </CardContent>
        </Card>

        <p className="text-center text-body-sm text-slate-400">
          <Link href="/login" className="inline-flex items-center gap-space-xs text-white hover:underline">
            <Icon name="arrow_back" size={16} /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
