"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type ActionResult } from "../actions";

const initialState: ActionResult = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-space-lg">
      <input type="hidden" name="next" value={nextPath} />

      <div className="space-y-space-xs">
        <Label htmlFor="email">Work email</Label>
        <div className="relative">
          <Icon name="mail" size={18} className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline" />
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="pl-9" />
        </div>
      </div>

      <div className="space-y-space-xs">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-body-sm text-action hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Icon name="lock" size={18} className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline" />
          <Input id="password" name="password" type="password" autoComplete="current-password" required className="pl-9" />
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg border border-thermal-excursion-border bg-thermal-excursion-bg px-space-md py-space-sm text-body-sm text-thermal-excursion-text">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
        {!pending ? <Icon name="arrow_forward" size={18} /> : null}
      </Button>
    </form>
  );
}
