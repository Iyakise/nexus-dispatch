# supabase/

Database schema, RLS policies and seed data for Nexus Dispatch. Written
against Supabase (Postgres 15+ with the `pgcrypto` and `postgis`
extensions, which every Supabase project has by default).

## Structure

```
migrations/    9 files, applied in filename order (timestamp prefix)
seed.sql       Two demo tenants + realistic data for local development
tests/         Manual RLS verification script (see below)
```

## First-time setup

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. From the project root: `supabase init` (if you haven't already linked this repo to a Supabase project) then `supabase start` to run Postgres, Auth and the rest of the stack locally in Docker.
3. Apply everything and load the seed data:
   ```
   supabase db reset
   ```
   This runs every file in `migrations/` in order, then `seed.sql`.
4. Point the app at it: copy the `API URL` / `anon key` / `service_role key` that `supabase status` prints into `.env.local` (see `.env.example` at the project root).

## What's in each migration

| File | Creates |
|---|---|
| `20260922085900_extensions.sql` | `pgcrypto`, `postgis` |
| `20260922090000_app_helpers.sql` | `app` schema; `app.current_tenant_id()`, `app.current_role_name()`, `app.set_updated_at()` |
| `20260922090100_tenants.sql` | `tenants`; `app.is_tenant_writable()` (needs the table, so it lives here, not in app_helpers) |
| `20260922090200_users.sql` | `users` (extends `auth.users`); the trigger that syncs `tenant_id`/`role` into the JWT |
| `20260922090300_vehicles.sql` | `vehicles`; backfills `users.assigned_vehicle_id` |
| `20260922090400_tariffs.sql` | `tariffs` |
| `20260922090500_shipments.sql` | `shipments`; composite FKs enforcing same-tenant references |
| `20260922090600_telematics_logs.sql` | `telematics_logs` (append-only, high volume) |
| `20260922090700_alerts.sql` | `alerts` |
| `20260922090800_grants.sql` | Explicit table/schema grants (see note below) |

## How tenant isolation actually works

Every table has `tenant_id uuid not null`. Every table has RLS enabled AND
**forced** (`force row level security` — this also applies RLS to the
table owner, not just other roles, which matters once you're debugging as
`postgres` in the SQL editor and want RLS to actually apply).

The tenant a request belongs to is **not** looked up from a table on every
query. It travels in the JWT: `public.users` has a trigger
(`app.sync_user_claims`) that copies `tenant_id` and `role` into
`auth.users.raw_app_meta_data` whenever a user row is inserted or those
columns change. Every RLS policy reads it back out via
`app.current_tenant_id()` / `app.current_role_name()`, which read
`auth.jwt()`. This is why the tenant check is cheap — no join, no
subquery, just a JSON key lookup on data Postgres already has for the
request.

**Important:** a role change made via `public.users` is not retroactive to
an access token the user is already holding — it takes effect on that
user's next token refresh / re-login. If you need it to apply immediately
(e.g. "revoke this driver's access right now"), also revoke their Supabase
Auth session, not just update the row.

**Read-only enforcement:** `app.is_tenant_writable()` checks
`tenants.subscription_status` and returns `false` for `past_due` /
`canceled`. Every INSERT/UPDATE/DELETE policy on operational tables gates
on this (with one deliberate exception: acknowledging/resolving an alert
stays allowed even when read-only, since silencing a stale alert on a
canceled account shouldn't require an active subscription). SELECT
policies never check it — historical data stays readable.

## Why `20260922090800_grants.sql` exists

RLS restricts *which rows* a role can see; it does nothing without a base
`GRANT` on the table itself. A hosted Supabase project already runs
`grant ... to authenticated, service_role` as part of its own project
bootstrap, before your migrations ever run — so on Supabase, this
migration is technically redundant. It's included anyway so the schema is
correct standalone (self-hosted Supabase, or plain Postgres, like this
project's own verification setup), instead of silently depending on
platform behavior that lives outside these migration files.

## Verifying it yourself

`supabase/tests/rls_smoke_test.sql` is a manual (not pgTAP) script that
logs in as three different seeded users and shows the actual query
results, each with an `EXPECT:` line stating what should happen. Run it
after `supabase db reset`:

```
supabase db reset
psql "$(supabase status -o env | grep DB_URL | cut -d= -f2)" -f supabase/tests/rls_smoke_test.sql
```

It demonstrates, against real (seeded) data:
- An Acme admin sees only Acme's shipments/alerts, never BioPharm's
- An Acme admin cannot even read BioPharm's `tenants` row
- Inserting a shipment tagged with BioPharm's `tenant_id` while
  authenticated as an Acme user is rejected by RLS
- An Acme driver sees only her own assigned shipment, not a colleague's
- BioPharm (seeded as `past_due`) can still read its data but cannot
  insert new rows — read-only mode enforced at the database layer, not
  just hidden in the UI

This exact file (not a paraphrase of it) was run against a local Postgres
instance with a stub `auth` schema while building this project, and every
`EXPECT:` line matched.

## Known limitations / next steps

- `telematics_logs` is a plain table. It's the highest write-volume table
  in the schema and should become a native Postgres partitioned table
  (`partition by range (recorded_at)`, monthly) before production
  ingestion traffic starts — converting an already-populated plain table
  to partitioned requires a rebuild, so this is much cheaper to decide now
  than later. Not done in Phase 2 because it adds complexity with no
  benefit until there's real volume.
- A user belongs to exactly one tenant in this model (matches the Stitch
  screens — you sign in to one org's subdomain). There's no
  multi-tenant-membership table; if that's ever needed, `public.users`
  will need to become a join table instead of an `auth.users` extension.
- Client Portals (a Stitch screen) will need their own, narrower RLS
  policies in a later phase — the current `shipments_select_scoped` policy
  only distinguishes staff roles from `driver`, not an external client
  role yet.
