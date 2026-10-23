import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
import { TelemetryCard } from "@/components/telemetry/telemetry-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Nexus Dispatch — Cold-Chain Dispatch Platform",
  description: "Multi-tenant cold-chain logistics, telematics and dispatch, built for pharma, biologics and perishables.",
};

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  { icon: "map", title: "Live fleet map", body: "Every vehicle and reefer unit on one map, with route and ETA." },
  { icon: "thermostat", title: "Thermal monitoring", body: "Per-shipment temperature bands with early-warning and excursion alerts." },
  { icon: "local_shipping", title: "Dispatch workboard", body: "Assign drivers and vehicles, track status from pending to delivered." },
  { icon: "receipt_long", title: "Flexible tariffs", body: "Rate cards per shipment, distance or weight — set your own pricing." },
  { icon: "group", title: "Role-based access", body: "Owner, admin, dispatcher, driver and viewer roles, enforced at the database." },
  { icon: "lock", title: "Tenant isolation", body: "Every customer's data is isolated with row-level security, not just app logic." },
];

const SAMPLE_HISTORY = [4.1, 4.2, 4.4, 4.3, 4.5, 4.6, 4.4, 4.3, 4.2, 4.4, 4.6, 4.8, 4.7, 4.5, 4.4, 4.6, 4.9, 5.0, 4.8, 4.6, 4.5, 4.4, 4.3, 4.2];

export default function LandingPage() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary-fixed/40 to-white">
        <div className="mx-auto grid max-w-7xl gap-margin-lg px-margin py-margin-lg lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="space-y-space-lg">
            <Badge variant="default">Multi-tenant cold-chain dispatch</Badge>
            <h1 className="text-headline-lg-mobile text-on-surface lg:text-display-lg">
              Cold-chain dispatch and telemetry, built for pharma and perishables
            </h1>
            <p className="max-w-xl text-body-lg text-on-surface-variant">
              Track every shipment&apos;s temperature, dispatch your fleet, and catch excursions before they become
              write-offs — in one platform, isolated per customer at the database layer.
            </p>
            <div className="flex flex-wrap gap-space-md">
              <Button asChild size="default">
                <Link href="/onboarding">
                  Start free trial <Icon name="arrow_forward" size={18} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="text-body-sm text-on-surface-variant">14-day trial. No card required.</p>
          </div>

          <TelemetryCard
            assetId="RF-2207"
            subtitle="NX-8921 · Insulin batches"
            celsius={4.2}
            history={SAMPLE_HISTORY}
            humidityPct={48}
            batteryPct={92}
            className="lg:justify-self-end lg:max-w-sm"
          />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-margin py-margin-lg lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-headline-lg text-on-surface">Everything a cold-chain dispatcher needs</h2>
          <p className="mt-space-sm text-body-lg text-on-surface-variant">
            Built on the same database model from day one, not bolted on later.
          </p>
        </div>
        <div className="mt-margin-lg grid gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="space-y-space-sm p-space-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-action">
                  <Icon name={f.icon} size={22} />
                </div>
                <p className="text-title-md text-on-surface">{f.title}</p>
                <p className="text-body-sm text-on-surface-variant">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-surface-container-low">
        <div className="mx-auto max-w-4xl space-y-space-lg px-margin py-margin-lg text-center lg:py-20">
          <h2 className="text-headline-lg text-on-surface">Set up your workspace in a minute</h2>
          <p className="text-body-lg text-on-surface-variant">
            Create your company, invite your team, and start dispatching — no setup call required.
          </p>
          <Button asChild size="default">
            <Link href="/onboarding">
              Start free trial <Icon name="arrow_forward" size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
