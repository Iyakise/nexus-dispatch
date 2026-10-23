# Nexus Dispatch

Multi-tenant cold-chain logistics, telematics and dispatch platform.

**Status: Phase 1 + 2 + 3 complete** (project setup, design tokens, database schema, RLS, auth, onboarding, marketing pages).
Phases 4–5 and the deferred Phase 6 (GxP / 21 CFR Part 11 screens) are not started.

Stack: Next.js 16 (App Router, strict TypeScript) · Tailwind CSS 3.4 · Radix UI + shadcn-style components · Material Symbols icons · Supabase (Postgres + RLS) · Zod. Mapbox, Stripe and Resend are wired in later phases.

---

## Install (first time)

1. **Install Node.js 20.9 or newer** (the LTS build from nodejs.org is fine). Check with `node -v`.
2. **Unzip** the project and open a terminal (Command Prompt, PowerShell or VS Code terminal) **inside the unzipped `nexus-dispatch` folder**.
3. Run:

   ```
   npm install
   ```

4. Copy the env template (nothing in it is needed for Phase 1):

   ```
   copy .env.example .env.local        # Windows
   cp .env.example .env.local          # macOS / Linux
   ```

5. Start the app:

   ```
   npm run dev
   ```

6. Open **http://localhost:3000/design-system**. The green "Live verification" bar at the top should read `Tokens 71/71 · Fonts 4/4`.

### Download the Stitch images (do this once, on your machine)

The Stitch screens link to 23 images hosted on `lh3.googleusercontent.com`. Those links are temporary, so save them locally before they expire:

```
npm run assets:list        # shows the URLs, no download
npm run assets:download    # saves to public/images/stitch/ + manifest.json
```

The script skips files it already has. If a download fails, the link has expired: re-export from Stitch and run it again.

---

## Phase 2: database (Supabase)

Everything is in `supabase/` — see **`supabase/README.md`** for the full
walkthrough (what each migration creates, how tenant isolation actually
works, how to verify it yourself). Short version:

```
supabase start          # local Postgres + Auth, via Docker
supabase db reset       # applies migrations/, then seed.sql
```

- **8 tables**, all with `tenant_id`, all with RLS **enabled and forced**: `tenants`, `users`, `vehicles`, `tariffs`, `shipments`, `telematics_logs`, `alerts`.
- **Tenant identity travels in the JWT**, not a session variable — a trigger keeps `auth.users.raw_app_meta_data` in sync with `public.users(tenant_id, role)`, and every policy reads it back via `app.current_tenant_id()` / `app.current_role_name()`. No per-request table lookup.
- **Read-only enforcement**: `app.is_tenant_writable()` returns false for `past_due`/`canceled` tenants; every write policy on operational tables gates on it. Reads always work — history stays visible even on a canceled account.
- **Seed data** (`supabase/seed.sql`): two tenants — Acme (active) and BioPharm Labs (seeded `past_due`, so read-only mode has something to demonstrate) — with shipment `#NX-8921` at 3.2°C and an open critical excursion alert on `#NX-8940`, matching the Stitch dashboard.
- `src/lib/validations/*.ts` — a Zod schema (+ inferred TypeScript type) per table, plus the actual create/update input schemas the app will use, each one commented with which RLS policy it corresponds to.

This was verified against a real local Postgres instance while building it
— not just written and assumed correct. `supabase/tests/rls_smoke_test.sql`
is the exact script that was run: it logs in as three different seeded
users and proves cross-tenant reads/writes are rejected and read-only mode
actually blocks writes, with an `EXPECT:` line next to each result.

## Phase 3: auth, onboarding, marketing pages

- **`src/proxy.ts`** (Next 16's renamed `middleware.ts`) refreshes the Supabase session on every request, redirects signed-out visitors away from protected paths (`/dashboard`, `/onboarding/subscription`, `/onboarding/payment`, `/onboarding/welcome`, and the still-empty `/superadmin`, `/portal` groups) to `/login`, and reads the tenant subdomain from the `Host` header into an `x-tenant-slug` request header. **Fails safe**: if Supabase is unreachable, every protected route still redirects to `/login` rather than rendering — verified by running the app against an unreachable Supabase URL.
- **`src/lib/supabase/`** — `client.ts` (browser), `server.ts` (Server Components/Actions, cookie-backed), `admin.ts` (service-role, `import "server-only"` so a client-side import is a build error, not a leaked key), `tenant-lookup.ts` (resolves a subdomain to a tenant's public name/id for the login page, since RLS correctly refuses that lookup to an anonymous visitor).
- **Auth pages** (`/login`, `/forgot-password`, `/forgot-password/sent`, `/reset-password`, `/reset-password/success`) and their server actions in `src/app/(auth)/actions.ts`. The "link sent" copy never confirms or denies an email has an account — avoids the account-enumeration leak a literal "email sent to you@x.com" message would create.
- **Onboarding** (`/onboarding` → `/onboarding/subscription` → `/onboarding/payment` → `/onboarding/welcome`), actions in `src/app/(onboarding)/actions.ts`. Step 1 creates the auth user, the tenant row, and the owner's `public.users` row via the service-role client (neither has an authenticated INSERT policy — see `supabase/README.md`), rolls back the auth user if tenant/user creation fails partway, then explicitly refreshes the session so the very first page the owner sees already has a JWT carrying their `tenant_id` — without that, RLS would see them as tenant-less until their token happened to refresh on its own. Step 2 creates a real `tariffs` row. Step 3 is an honest placeholder (no card collection — Stripe is Phase 5; a new tenant's `trialing` status is already fully writable, so nothing is blocked by skipping it).
- **Marketing pages** (`/`, `/pricing`, `/faq`) under `src/app/(marketing)/`, replacing the Phase 1 placeholder home.
- **`/dashboard`** is a minimal authenticated placeholder (shows the signed-in tenant/user, a sign-out button) — just enough to prove the whole chain works end to end; Phase 4 replaces it with the real operational dashboard.

**Copy changes from the Stitch export, on purpose:** the login/pricing/landing screens include FDA 21 CFR Part 11, NIST-traceable calibration, HSM, SOC 2 and named-customer claims. None of that is true yet (compliance work is the deferred Phase 6), and shipping unearned certification claims on a pricing page is a real liability, not a cosmetic detail — so those were removed or softened to describe features honestly without claiming audits/certifications that haven't happened, and fabricated customer logos were dropped rather than implying specific companies are paying customers.

**Not testable in this environment:** Supabase Auth itself (sign-up, email delivery, password reset) requires the real Supabase stack (Docker). Everything was verified in the sandbox as far as it can be without it: `tsc`, `eslint`, and `next build` all pass; every public page returns 200; every protected path correctly redirects to `/login`; and the app was deliberately run against an *unreachable* Supabase URL to confirm it fails safe (redirects, doesn't crash or expose data) rather than just assumed. **Run `npm run dev` with real Supabase running and walk through signup → subscription → payment → welcome → dashboard yourself before trusting it fully** — that loop needs a real email (check Mailpit at `http://127.0.0.1:54324` for the confirmation/reset emails) and a real browser session, neither of which this sandbox can provide.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run verify` | Typecheck + lint + build (run before every commit) |
| `npm run assets:list` / `assets:download` | List / download the Stitch images |

---

## Project layout

```
supabase/
  migrations/               9 SQL files: schema, RLS policies, grants (see supabase/README.md)
  seed.sql                  Two-tenant demo data matching the Stitch screens
  tests/rls_smoke_test.sql  Manual, human-readable RLS verification
  README.md                 Full Phase 2 walkthrough
stitch-designs/            Raw Stitch export (reference only, excluded from lint/tsc/build)
public/brand/logo.svg      Logo
public/images/             Optimised brand images (WebP)
scripts/                   One-off tooling
src/proxy.ts               Session refresh, route protection, subdomain header (Next 16's middleware.ts)
src/app/
  layout.tsx               Fonts, global CSS, toast host
  design-system/           Verification page (dev only)
  (marketing)/             /, /pricing, /faq — public marketing pages
  (auth)/                  /login, /forgot-password(/sent), /reset-password(/success) + actions.ts
  (onboarding)/            /onboarding (public, step 1) → /subscription → /payment → /welcome + actions.ts
  (dashboard)/dashboard/   Authenticated placeholder (Phase 4 builds the real thing)
  (superadmin) (portal)    Still-empty route groups, Phase 5+
src/components/
  icon.tsx                 <Icon name="local_shipping" /> (Material Symbols)
  ui/                      Button, Input, Card, Badge, Table, Dialog, Sheet, Tabs, ...
  telemetry/               ThermalBadge, Sparkline, TelemetryCard
src/lib/
  supabase/                client.ts, server.ts, admin.ts (service-role), tenant-lookup.ts
  utils.ts                 cn() (tailwind-merge aware of the custom tokens)
  thermal.ts               2–8 °C classification (safe / warning / excursion)
  env.ts                   Zod-validated env access, split by service (getSupabaseServerEnv vs getServerEnv)
  validations/             One Zod schema file per table + create/update input schemas
    common.ts                 Shared primitives (uuid, iso timestamp, geo point, tenant slug)
    tenant.ts, user.ts, vehicle.ts, tariff.ts, shipment.ts, telematics.ts, alert.ts
tailwind.config.ts         All design tokens
```

---

## Design tokens

Source: `stitch-designs/precision_cold_chain_modern/DESIGN.md` and the Tailwind config inside each Stitch `code.html`. Where they disagree, the Stitch HTML wins because it matches the screenshots.

- **Colors:** the full Stitch (Material-style) set is kept under its original names, so Stitch markup converts 1:1 (`bg-primary-container`, `text-on-surface-variant`, ...). Brand aliases: `brand-indigo` `brand-slate` `brand-emerald` `brand-crimson` `brand-amber`. Electric Indigo `#4F46E5` is Stitch's `primary-container`; Stitch's `primary` is the darker `#3525cd`, used for hover.
- **Thermal palette:** `thermal-safe`, `thermal-warning`, `thermal-excursion`, each with `-bg`, `-border`, `-text`.
- **Type:** 14 named styles, e.g. `text-headline-md`, `text-body-md`, `text-telemetry-lg`. Mono (JetBrains Mono) is for temperatures, coordinates, timestamps and IDs.
- **Radius:** `rounded` 4px (badges), `rounded-lg` 8px (buttons, inputs, cards), `rounded-xl` 12px (modals).
- **Layout constants:** `h-topbar` 56px, `w-rail-expanded` 256px, `w-rail` 64px, `h-row` 44px, `h-control` 36px.
- **Spacing:** `space-xs` … `space-xl`, `gutter*`, `margin*`.

Known differences from DESIGN.md: default radius (Stitch HTML uses 4px, not 8px) and expanded rail width (256px, not 240px).

### Icons

`<Icon name="thermostat" />` is type-checked against the font's icon list. Eight names used in Stitch have since been renamed by Google (`expand_more`, `done`, `business`, `access_time`, `file_download`, `gpp_good`, `help_outline`, `security_update_good`). They still render and are accepted by `<Icon />`.

The icon font is the full ~4 MB variable font. Subset it before launch.

### Adding shadcn components

`npx shadcn add <name>` works, but it generates Lucide imports. Replace them with `<Icon />`.

---

## Notes for later phases

- `/design-system` returns 404 in production unless `NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM=true` **at build time**.
- **Deployment:** this is a Node.js app. It needs a Node host (Vercel, a VPS, a container platform), not PHP/cPanel shared hosting. The real `*.nexusdispatch.com` wildcard subdomain needs DNS + a wildcard TLS cert set up on whichever host you choose — `src/proxy.ts` already resolves the subdomain from the `Host` header, but nothing routes real DNS to your app yet.
- **Phase 4** replaces the `/dashboard` placeholder with the real operational dashboard, live fleet map (Mapbox), and realtime shipment/telemetry updates.
- **Phase 5** adds Stripe Billing (the onboarding payment step currently just skips to the trial), the driver ePOD PWA, and the superadmin portal.
- A seat invite flow (owner/admin inviting a teammate) isn't built yet — `inviteTeammateSchema` exists in `src/lib/validations/user.ts` for when it is; it would use the same service-role-insert pattern as `signUpAndCreateTenant`.
# nexus-dispatch
