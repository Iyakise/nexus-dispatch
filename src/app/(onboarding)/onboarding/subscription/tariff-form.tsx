"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createOnboardingTariff, type ActionResult } from "../../actions";

const initialState: ActionResult = {};

const PRESETS = [
  { name: "Starter rate", billingInterval: "per_shipment", rateAmount: "140.00", blurb: "Flat fee per completed shipment." },
  { name: "Standard cold-chain", billingInterval: "per_shipment", rateAmount: "185.00", blurb: "Covers 2–8°C monitored transit." },
  { name: "Growth distance-based", billingInterval: "per_km", rateAmount: "2.40", blurb: "Scales with route distance." },
] as const;

export function TariffForm() {
  const [state, formAction, pending] = useActionState(createOnboardingTariff, initialState);
  const [selected, setSelected] = useState<number>(1);

  return (
    <form action={formAction} className="space-y-space-lg">
      <div className="grid gap-space-md sm:grid-cols-3">
        {PRESETS.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-lg border p-space-md text-left transition-colors",
              selected === i ? "border-action bg-primary-fixed" : "border-input bg-white hover:bg-surface-container-low",
            )}
          >
            <p className="text-title-md text-on-surface">{p.name}</p>
            <p className="mt-space-xs text-body-sm text-on-surface-variant">{p.blurb}</p>
          </button>
        ))}
      </div>

      <input type="hidden" name="name" value={PRESETS[selected]?.name} />

      <div className="grid gap-space-lg sm:grid-cols-2">
        <div className="space-y-space-xs">
          <Label htmlFor="billingInterval">Billed</Label>
          <Select name="billingInterval" defaultValue={PRESETS[selected]?.billingInterval} key={`bi-${selected}`}>
            <SelectTrigger id="billingInterval">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per_shipment">Per shipment</SelectItem>
              <SelectItem value="per_km">Per kilometre</SelectItem>
              <SelectItem value="per_kg">Per kilogram</SelectItem>
              <SelectItem value="monthly_flat">Monthly flat fee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-space-xs">
          <Label htmlFor="rateAmount">Rate (USD)</Label>
          <Input id="rateAmount" name="rateAmount" type="number" step="0.01" min="0" defaultValue={PRESETS[selected]?.rateAmount} key={`ra-${selected}`} required />
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg border border-thermal-excursion-border bg-thermal-excursion-bg px-space-md py-space-sm text-body-sm text-thermal-excursion-text">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Continue"}
        {!pending ? <Icon name="arrow_forward" size={18} /> : null}
      </Button>
      <p className="text-center text-body-sm text-on-surface-variant">You can add more tariffs later from Billing &amp; Tariffs.</p>
    </form>
  );
}
