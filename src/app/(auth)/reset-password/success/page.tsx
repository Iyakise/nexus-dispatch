import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Password updated" };

export default function ResetPasswordSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-slate px-margin py-margin-lg">
      <div className="w-full max-w-md space-y-space-xl">
        <div className="flex flex-col items-center gap-space-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-thermal-safe text-white">
            <Icon name="task_alt" size={26} filled />
          </div>
          <p className="text-headline-sm text-white">Password updated</p>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="space-y-space-lg p-space-xl text-center">
            <p className="text-body-md text-on-surface-variant">
              Your password has been changed. Use it next time you sign in.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Continue to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
