import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pricing" };

/**
 * Figures and tier structure adapted from the Stitch export. Dropped from
 * the original copy: specific regulatory/certification claims ("FDA 21
 * CFR §11 compliant", "NIST-traceable", "SOC 2 Type II") and a numeric
 * SLA guarantee — none of that is true yet (GxP/21 CFR Part 11 work is
 * the deferred Phase 6), and shipping a false compliance claim on a
 * pricing page is a real liability, not a cosmetic detail. Feature
 * descriptions below describe what the product does or will do, which is
 * normal for a pricing page; specific audited certifications are not
 * claimed anywhere.
 */
const TIERS = [
  {
    name: "Starter Fleet",
    badge: "Entry operations",
    blurb: "Small regional couriers, local produce and fresh-food distribution.",
    price: "$119",
    note: "Billed annually ($1,428/yr)",
    cta: "Start free trial",
    href: "/onboarding",
    highlighted: false,
    features: [
      "Up to 10 vehicles included ($12/mo per additional)",
      "Live GPS tracking",
      "Temperature excursion alerts (email)",
      "Standard support, Mon–Fri",
      "30-day telemetry retention",
    ],
  },
  {
    name: "Pro Cold-Chain",
    badge: "Pharma & reefer fleets",
    blurb: "Mid-sized pharmaceutical, biologics, vaccine and clinical cold-chain operations.",
    price: "$319",
    note: "Billed annually ($3,828/yr)",
    cta: "Start free trial",
    href: "/onboarding",
    highlighted: true,
    features: [
      "Everything in Starter, plus:",
      "Up to 35 reefer vehicles ($9/mo per additional)",
      "6-hour thermal & humidity history per shipment",
      "Branded customer tracking portals",
      "ePOD signature capture with photo and geo-stamp",
      "1-year audit log retention",
    ],
  },
  {
    name: "Enterprise",
    badge: "National & high-security",
    blurb: "National distributors, global pharma manufacturers and government contracts.",
    price: "$719",
    note: "Billed annually, or custom invoice",
    cta: "Contact sales",
    href: "/faq",
    highlighted: false,
    features: [
      "All Pro Cold-Chain capabilities, plus:",
      "Unlimited fleet vehicles",
      "Dedicated database instance",
      "ERP/QMS connector integrations",
      "24/7 dispatch support desk",
      "Custom procurement and MSAs",
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-margin py-margin-lg lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="default">Transparent pricing · no hidden setup fees</Badge>
        <h1 className="mt-space-lg text-headline-lg text-on-surface">Predictable pricing for fleets of any size</h1>
        <p className="mt-space-sm text-body-lg text-on-surface-variant">
          Scale as your shipment volume grows. No surprise telemetry surcharges.
        </p>
      </div>

      <div className="mt-margin-lg grid gap-space-lg lg:grid-cols-3">
        {TIERS.map((tier) => (
          <Card key={tier.name} className={cn(tier.highlighted && "border-action shadow-overlay lg:-translate-y-space-sm")}>
            <CardHeader className="flex-col items-start gap-space-sm border-b-0 pb-0">
              <Badge variant={tier.highlighted ? "default" : "outline"}>{tier.badge}</Badge>
              <p className="text-headline-sm text-on-surface">{tier.name}</p>
              <p className="text-body-sm text-on-surface-variant">{tier.blurb}</p>
            </CardHeader>
            <CardContent className="space-y-space-lg">
              <div>
                <span className="text-display-lg text-on-surface">{tier.price}</span>
                <span className="text-body-md text-on-surface-variant"> / month</span>
                <p className="mt-space-xs text-body-sm text-on-surface-variant">{tier.note}</p>
              </div>
              <Button asChild className="w-full" variant={tier.highlighted ? "default" : "secondary"}>
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
              <ul className="space-y-space-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-space-sm text-body-sm text-on-surface">
                    <Icon name="check_circle" size={16} filled className="mt-0.5 shrink-0 text-thermal-safe" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-margin-lg text-center text-body-sm text-on-surface-variant">
        Need a custom plan or compliance questionnaire? <Link href="/faq" className="text-action hover:underline">Visit the FAQ</Link>.
      </p>
    </div>
  );
}
