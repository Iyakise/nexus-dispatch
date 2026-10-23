import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";
import { TelemetryCard } from "@/components/telemetry/telemetry-card";
import { ThermalBadge } from "@/components/telemetry/thermal-badge";
import { TokenVerifier } from "@/components/token-verifier";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RADIUS_TOKENS, SHADOW_TOKENS, SPACING_TOKENS, SWATCH_GROUPS, TYPE_TOKENS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { FormDemo, OverlayDemo, TabsDemo } from "./interactive-demos";

export const metadata: Metadata = {
  title: "Design system · Nexus Dispatch",
  robots: { index: false, follow: false },
};

/** Visible in `npm run dev`; hidden in production unless explicitly enabled. */
function assertEnabled() {
  const enabled =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM === "true";
  if (!enabled) notFound();
}

/* ---- deterministic sample data (no randomness → no hydration drift) ---- */
const SAFE_HISTORY = [4.1, 4.2, 4.4, 4.3, 4.5, 4.6, 4.4, 4.3, 4.2, 4.4, 4.6, 4.8, 4.7, 4.5, 4.4, 4.6, 4.9, 5.0, 4.8, 4.6, 4.5, 4.4, 4.3, 4.2];
const WARN_HISTORY = [5.6, 5.7, 5.9, 6.0, 6.2, 6.3, 6.4, 6.6, 6.7, 6.8, 6.9, 7.0, 7.0, 7.1, 7.2, 7.2, 7.3, 7.4, 7.4, 7.5, 7.5, 7.6, 7.6, 7.6];
const EXCURSION_HISTORY = [6.2, 6.4, 6.5, 6.7, 6.9, 7.1, 7.3, 7.5, 7.7, 7.8, 7.9, 8.0, 8.1, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.9, 9.0, 9.1, 9.1];

const SHIPMENTS = [
  { id: "NX-8921", route: "Lagos → Abuja", cargo: "mRNA vaccine · 12 pallets", temp: 4.2, eta: "16:40" },
  { id: "NX-8940", route: "Port Harcourt → Enugu", cargo: "Insulin · 4 pallets", temp: 7.6, eta: "18:05" },
  { id: "NX-8899", route: "Abuja → Kano", cargo: "Plasma · 2 pallets", temp: 9.1, eta: "17:20" },
  { id: "NX-8955", route: "Ibadan → Lagos", cargo: "Dairy · 20 pallets", temp: 3.4, eta: "15:10" },
] as const;

const SAMPLE_ICONS: IconName[] = [
  "dashboard", "map", "local_shipping", "warning", "storefront", "receipt_long", "tune", "verified_user",
  "thermostat", "ac_unit", "sensors", "battery_full", "humidity_percentage", "notifications", "search", "lock",
  "check_circle", "error", "info", "download", "add", "close", "more_vert", "expand_more",
];

const NAV: { icon: IconName; label: string; badge?: string; active?: boolean }[] = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "map", label: "Live Fleet Map" },
  { icon: "local_shipping", label: "Active Shipments", badge: "88" },
  { icon: "warning", label: "Cold-Chain Alerts", badge: "3" },
  { icon: "storefront", label: "Client Portals" },
  { icon: "receipt_long", label: "Billing & Tariffs" },
  { icon: "tune", label: "System Settings" },
];

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-space-xl space-y-space-lg">
      <div>
        <h2 className="text-headline-md text-on-surface">{title}</h2>
        {description ? <p className="mt-space-xs max-w-3xl text-body-md text-on-surface-variant">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  assertEnabled();

  return (
    <div className="mx-auto max-w-7xl space-y-margin-lg px-margin py-margin-lg">
      {/* ------------------------------------------------ header */}
      <header className="space-y-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <Image src="/brand/logo.svg" alt="" width={40} height={40} unoptimized priority />
            <div>
              <h1 className="text-headline-lg">Nexus Dispatch design system</h1>
              <p className="text-body-md text-on-surface-variant">
                Phase 1 verification · tokens ported from the Stitch export (Precision Cold-Chain Modern)
              </p>
            </div>
          </div>
          <Badge variant="default">Dev only</Badge>
        </div>
        <TokenVerifier />
        <nav aria-label="Sections" className="flex flex-wrap gap-x-space-lg gap-y-space-xs text-title-md text-action">
          {["colors", "typography", "shape", "buttons", "forms", "telemetry", "table", "overlays", "shell", "icons", "assets"].map((s) => (
            <a key={s} href={`#${s}`} className="capitalize hover:underline">
              {s}
            </a>
          ))}
        </nav>
      </header>

      {/* ------------------------------------------------ colors */}
      <Section
        id="colors"
        title="Colour tokens"
        description="Each chip is painted with its Tailwind utility. The verifier above reads the computed colour back from the browser and compares it with the expected hex; a failing chip gets a red outline."
      >
        <div className="space-y-space-xl">
          {SWATCH_GROUPS.map((group) => (
            <div key={group.title} className="space-y-space-sm">
              <h3 className="text-title-md text-on-surface">{group.title}</h3>
              <div className="grid grid-cols-2 gap-space-md sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {group.swatches.map((s) => (
                  <div key={s.name} className="overflow-hidden rounded-lg border bg-white">
                    <div
                      data-expected-bg={s.hex}
                      data-token-name={s.name}
                      className={cn("h-12 border-b data-[status=fail]:outline data-[status=fail]:outline-2 data-[status=fail]:-outline-offset-2 data-[status=fail]:outline-brand-crimson", s.className)}
                    />
                    <div className="space-y-0.5 p-space-sm">
                      <p className="truncate text-label-md text-on-surface">{s.name}</p>
                      <p className="font-mono text-telemetry-sm text-on-surface-variant">{s.hex}</p>
                      {s.note ? <p className="text-body-sm text-outline">{s.note}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ typography */}
      <Section
        id="typography"
        title="Typography"
        description="IBM Plex Sans for the interface, JetBrains Mono for temperatures, coordinates, timestamps and IDs. Fonts are self-hosted."
      >
        <Card>
          <CardContent className="divide-y divide-slate-100 p-0">
            {TYPE_TOKENS.map((t) => (
              <div key={t.name} className="grid items-baseline gap-x-space-lg gap-y-space-xs px-space-lg py-space-md md:grid-cols-[220px_1fr]">
                <div>
                  <p className="font-mono text-telemetry-sm text-on-surface">{t.name}</p>
                  <p className="font-mono text-telemetry-sm text-on-surface-variant">{t.spec}</p>
                </div>
                <p className={cn("truncate text-on-surface", t.className)}>{t.sample}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------ shape */}
      <Section id="shape" title="Radius, spacing and elevation" description="Depth comes from 1px borders. Shadows exist only for floating layers.">
        <div className="grid gap-space-xl lg:grid-cols-3">
          <div className="space-y-space-sm">
            <h3 className="text-title-md">Radius</h3>
            <div className="flex flex-wrap gap-space-md">
              {RADIUS_TOKENS.map((r) => (
                <div key={r.name} className="w-28 space-y-space-xs">
                  <div className={cn("h-14 border border-action bg-primary-fixed", r.className)} />
                  <p className="text-label-md">
                    {r.name} <span className="font-mono text-telemetry-sm text-on-surface-variant">{r.value}</span>
                  </p>
                  <p className="text-body-sm text-on-surface-variant">{r.use}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-space-sm">
            <h3 className="text-title-md">Spacing</h3>
            <div className="space-y-space-sm">
              {SPACING_TOKENS.map((s) => (
                <div key={s.name} className="flex items-center gap-space-md">
                  <p className="w-24 font-mono text-telemetry-sm">{s.name}</p>
                  <div className={cn("h-space-md bg-action", s.className)} />
                  <p className="font-mono text-telemetry-sm text-on-surface-variant">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-space-sm">
            <h3 className="text-title-md">Elevation</h3>
            <div className="flex flex-wrap gap-space-lg">
              {SHADOW_TOKENS.map((s) => (
                <div key={s.name} className={cn("w-40 rounded-lg border bg-white p-space-md", s.className)}>
                  <p className="text-label-md">{s.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{s.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ buttons */}
      <Section id="buttons" title="Buttons" description="36px compact height, 32px for table-row actions.">
        <Card>
          <CardContent className="space-y-space-lg">
            <div className="flex flex-wrap items-center gap-space-md">
              <Button>Dispatch route</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Emergency override</Button>
              <Button variant="destructive-soft">Dismiss warning</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link action</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-space-md">
              <Button>
                <Icon name="add" size={18} /> New shipment
              </Button>
              <Button variant="secondary">
                <Icon name="download" size={18} /> Export CSV
              </Button>
              <Button size="sm">Acknowledge</Button>
              <Button size="sm" variant="secondary">
                View
              </Button>
              <Button size="icon" variant="secondary" aria-label="More">
                <Icon name="more_vert" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------ forms */}
      <Section id="forms" title="Form controls" description="White fields, 1px slate border, 8px radius. Focus shows an indigo border and a soft 3px ring. Tab into a field to see it.">
        <Card>
          <CardContent>
            <FormDemo />
          </CardContent>
        </Card>
        <TabsDemo />
      </Section>

      {/* ------------------------------------------------ telemetry */}
      <Section id="telemetry" title="Thermal telemetry" description="2–8 °C is compliant. Within 0.5 °C of a limit is a warning. Outside the band is an excursion, with a pulsing icon. Status is never colour alone.">
        <div className="flex flex-wrap items-center gap-space-md">
          <ThermalBadge celsius={4.2} />
          <ThermalBadge celsius={7.6} />
          <ThermalBadge celsius={9.1} />
          <ThermalBadge celsius={1.4} />
          <Badge variant="neutral">Neutral</Badge>
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <div className="grid gap-space-lg md:grid-cols-2 xl:grid-cols-3">
          <TelemetryCard assetId="RF-2207" subtitle="NX-8921 · mRNA vaccine" celsius={4.2} history={SAFE_HISTORY} humidityPct={48} batteryPct={92} />
          <TelemetryCard assetId="RF-1180" subtitle="NX-8940 · Insulin" celsius={7.6} history={WARN_HISTORY} humidityPct={51} batteryPct={64} />
          <TelemetryCard assetId="RF-3315" subtitle="NX-8899 · Plasma" celsius={9.1} history={EXCURSION_HISTORY} humidityPct={57} batteryPct={23} />
        </div>
      </Section>

      {/* ------------------------------------------------ table */}
      <Section id="table" title="Data table" description="Rows are 44px. Numeric and status columns are right-aligned in the mono face. The header sticks against a slate background.">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Shipment</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead numeric>Temp</TableHead>
              <TableHead numeric>ETA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SHIPMENTS.map((s, i) => (
              <TableRow key={s.id} data-state={i === 0 ? "selected" : undefined}>
                <TableCell className="font-mono text-telemetry-md">{s.id}</TableCell>
                <TableCell>{s.route}</TableCell>
                <TableCell className="text-on-surface-variant">{s.cargo}</TableCell>
                <TableCell numeric>
                  <ThermalBadge celsius={s.temp} />
                </TableCell>
                <TableCell numeric>{s.eta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      {/* ------------------------------------------------ overlays */}
      <Section id="overlays" title="Overlays and feedback" description="Dialog, sheets, dropdown, tooltip and toast. Each opens from the buttons below.">
        <Card>
          <CardContent>
            <OverlayDemo />
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------ shell */}
      <Section
        id="shell"
        title="Application shell dimensions"
        description="56px top bar and a 256px expanded rail, taken from the Stitch dashboard markup (DESIGN.md says 240px; the screens use 256px). The real shell is built in Phase 4."
      >
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="flex h-topbar items-center justify-between gap-space-lg bg-inverse-surface px-margin" data-testid="shell-topbar">
            <div className="flex items-center gap-space-md">
              <Image src="/brand/logo.svg" alt="" width={28} height={28} unoptimized />
              <span className="text-title-md text-inverse-on-surface">Nexus Dispatch</span>
            </div>
            <div className="relative hidden w-72 sm:block">
              <Icon name="search" size={18} className="absolute left-space-md top-1/2 -translate-y-1/2 text-secondary" />
              <input
                aria-label="Search"
                placeholder="Search shipments, reefers, VINs"
                className="h-control w-full rounded-lg border border-secondary/20 bg-surface/10 pl-9 pr-space-md text-body-sm text-inverse-on-surface placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Icon name="notifications" size={22} className="text-inverse-on-surface" label="Notifications" />
          </div>
          <div className="flex min-h-72">
            <aside className="hidden w-rail-expanded shrink-0 flex-col gap-space-xs border-r border-secondary/20 bg-inverse-surface p-space-md md:flex" data-testid="shell-rail">
              <p className="px-space-md pb-space-xs text-label-sm uppercase tracking-wider text-secondary">Operations</p>
              {NAV.map((n) => (
                <div
                  key={n.label}
                  className={cn(
                    "flex items-center gap-space-md rounded-lg px-space-md py-space-sm text-body-md",
                    n.active ? "bg-primary-container font-semibold text-on-primary" : "text-inverse-on-surface/80",
                  )}
                >
                  <Icon name={n.icon} size={20} filled={n.active} />
                  <span className="flex-1">{n.label}</span>
                  {n.badge ? <span className="rounded bg-white/10 px-space-sm font-mono text-telemetry-sm">{n.badge}</span> : null}
                </div>
              ))}
            </aside>
            <div className="flex-1 space-y-space-md p-margin">
              <h3 className="text-headline-md">Cold-Chain Operational Command</h3>
              <div className="grid gap-space-md sm:grid-cols-3">
                {[
                  { label: "Active shipments", value: "88", tone: "text-on-surface" },
                  { label: "In range", value: "82", tone: "text-thermal-safe-text" },
                  { label: "Excursions", value: "3", tone: "text-thermal-excursion-text" },
                ].map((m) => (
                  <Card key={m.label} className="p-space-lg">
                    <p className="text-label-md text-on-surface-variant">{m.label}</p>
                    <p className={cn("font-mono text-telemetry-lg", m.tone)}>{m.value}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ icons */}
      <Section id="icons" title="Icons" description="Material Symbols Outlined, self-hosted variable font. `name` is type-checked against the font's icon list.">
        <Card>
          <CardContent className="space-y-space-lg">
            <div className="grid grid-cols-4 gap-space-md sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-12">
              {SAMPLE_ICONS.map((n) => (
                <div key={n} className="flex flex-col items-center gap-space-xs rounded-lg border p-space-sm">
                  <Icon name={n} size={24} />
                  <span className="max-w-full truncate font-mono text-telemetry-sm text-on-surface-variant">{n}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-space-lg gap-y-space-sm">
              <span className="inline-flex items-center gap-space-sm text-body-md"><Icon name="verified_user" size={24} /> outlined</span>
              <span className="inline-flex items-center gap-space-sm text-body-md"><Icon name="verified_user" size={24} filled /> filled</span>
              <span className="inline-flex items-center gap-space-sm text-body-md"><Icon name="verified_user" size={24} weight={700} /> weight 700</span>
              <span className="inline-flex items-center gap-space-sm text-body-md"><Icon name="verified_user" size={40} /> 40px</span>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------ assets */}
      <Section id="assets" title="Brand assets">
        <div className="grid gap-space-lg md:grid-cols-[1fr_2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Image src="/brand/logo.svg" alt="Nexus Dispatch logo" width={96} height={96} unoptimized />
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Network illustration</CardTitle>
            </CardHeader>
            <Image src="/images/logistics-network-illustration.webp" alt="Isometric cold-chain data network" width={1376} height={768} className="h-auto w-full" />
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Dispatcher portrait</CardTitle>
            </CardHeader>
            <Image src="/images/dispatcher-headshot.webp" alt="Operations dispatcher" width={1024} height={1024} className="h-auto w-full" />
          </Card>
        </div>
      </Section>
    </div>
  );
}
