"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAndCreateTenant, type ActionResult } from "../actions";

const initialState: ActionResult = {};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpAndCreateTenant, initialState);
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "nexusdispatch.com";

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="space-y-space-lg">
      <div className="space-y-space-xs">
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          name="companyName"
          required
          placeholder="Acme Cold-Chain Logistics"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
          aria-invalid={Boolean(fieldError("companyName"))}
        />
        {fieldError("companyName") ? <p className="text-body-sm text-thermal-excursion-text">{fieldError("companyName")}</p> : null}
      </div>

      <div className="space-y-space-xs">
        <Label htmlFor="slug">Workspace address</Label>
        <div className="flex items-center overflow-hidden rounded-lg border border-input bg-white focus-within:border-action focus-within:shadow-focus-ring">
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(slugify(e.target.value));
            }}
            className="border-0 shadow-none focus-visible:shadow-none"
            aria-invalid={Boolean(fieldError("slug"))}
          />
          <span className="shrink-0 pr-space-md font-mono text-telemetry-sm text-on-surface-variant">.{rootDomain}</span>
        </div>
        {fieldError("slug") ? <p className="text-body-sm text-thermal-excursion-text">{fieldError("slug")}</p> : null}
      </div>

      <div className="grid gap-space-lg sm:grid-cols-2">
        <div className="space-y-space-xs">
          <Label htmlFor="fullName">Your name</Label>
          <Input id="fullName" name="fullName" required placeholder="Marcus Chen" aria-invalid={Boolean(fieldError("fullName"))} />
          {fieldError("fullName") ? <p className="text-body-sm text-thermal-excursion-text">{fieldError("fullName")}</p> : null}
        </div>
        <div className="space-y-space-xs">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(fieldError("email"))} />
          {fieldError("email") ? <p className="text-body-sm text-thermal-excursion-text">{fieldError("email")}</p> : null}
        </div>
      </div>

      <div className="space-y-space-xs">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} aria-invalid={Boolean(fieldError("password"))} />
        {fieldError("password") ? <p className="text-body-sm text-thermal-excursion-text">{fieldError("password")}</p> : null}
        <p className="text-body-sm text-on-surface-variant">At least 8 characters.</p>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg border border-thermal-excursion-border bg-thermal-excursion-bg px-space-md py-space-sm text-body-sm text-thermal-excursion-text">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating your workspace…" : "Create workspace"}
        {!pending ? <Icon name="arrow_forward" size={18} /> : null}
      </Button>
      <p className="text-center text-body-sm text-on-surface-variant">14-day free trial. No card required yet.</p>
    </form>
  );
}
