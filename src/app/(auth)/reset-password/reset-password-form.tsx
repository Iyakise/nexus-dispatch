"use client";

import { useActionState, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { updatePassword, type ActionResult } from "../actions";

const initialState: ActionResult = {};

interface Rule {
  label: string;
  met: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { label: "At least 8 characters", met: (pw) => pw.length >= 8 },
  { label: "Includes an uppercase letter", met: (pw) => /[A-Z]/.test(pw) },
  { label: "Includes a number", met: (pw) => /[0-9]/.test(pw) },
];

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const rulesMet = useMemo(() => RULES.map((r) => ({ ...r, ok: r.met(password) })), [password]);
  const passwordsMatch = confirm.length > 0 && confirm === password;

  return (
    <form action={formAction} className="space-y-space-lg">
      <div className="space-y-space-xs">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Icon name="key" size={18} className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 pr-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-space-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} size={18} />
          </button>
        </div>
        <ul className="space-y-0.5 pt-space-xs">
          {rulesMet.map((r) => (
            <li
              key={r.label}
              className={cn("flex items-center gap-space-xs text-body-sm", r.ok ? "text-thermal-safe-text" : "text-on-surface-variant")}
            >
              <Icon name="check_circle" size={14} filled={r.ok} />
              {r.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-space-xs">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Icon name="done_all" size={18} className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="pl-9"
          />
        </div>
        {confirm.length > 0 ? (
          <p className={cn("text-body-sm", passwordsMatch ? "text-thermal-safe-text" : "text-thermal-excursion-text")}>
            {passwordsMatch ? "Passwords match" : "Passwords don't match"}
          </p>
        ) : null}
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg border border-thermal-excursion-border bg-thermal-excursion-bg px-space-md py-space-sm text-body-sm text-thermal-excursion-text">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
