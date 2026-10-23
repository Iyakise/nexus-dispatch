import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Check your email" };

interface SentPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function ResetLinkSentPage({ searchParams }: SentPageProps) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-slate px-margin py-margin-lg">
      <div className="w-full max-w-md space-y-space-xl">
        <div className="flex flex-col items-center gap-space-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-thermal-safe text-white">
            <Icon name="mark_email_read" size={26} />
          </div>
          <div>
            <p className="text-headline-sm text-white">Check your email</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-white">
          <CardContent className="space-y-space-lg p-space-xl text-center">
            <p className="text-body-md text-on-surface-variant">
              If an account exists for
              {email ? <span className="font-medium text-on-surface"> {email}</span> : " that address"}, we&apos;ve
              sent a password reset link. It expires in 60 minutes.
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Didn&apos;t get it? Check spam, or try again in a few minutes.
            </p>
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
