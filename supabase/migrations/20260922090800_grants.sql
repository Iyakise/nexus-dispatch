-- ============================================================================
-- 20260922090800_grants.sql
--
-- RLS restricts *which rows* a role sees; it does nothing without a base
-- GRANT on the table itself. A hosted Supabase project runs
--   grant usage on schema public to anon, authenticated, service_role;
--   alter default privileges in schema public grant all on tables to ...;
-- as part of its own project bootstrap, before any of our migrations run —
-- so on Supabase this migration is redundant. It's included anyway so this
-- schema is correct standalone (self-hosted Supabase, plain Postgres, or
-- this project's own local verification harness), rather than silently
-- depending on bootstrap behaviour that lives outside our migrations.
--
-- `service_role` is granted everywhere because it is how every backend
-- job in this project — the telematics ingestion worker, alert evaluator,
-- Stripe webhook handler, Auth admin invite flow — writes data. It bypasses
-- RLS by Postgres convention (superuser-equivalent for this purpose), so
-- these grants, not RLS, are its only real boundary.
-- ============================================================================

grant usage on schema public to authenticated, service_role;

-- Policy expressions that call app.* functions (e.g. `using (tenant_id =
-- app.current_tenant_id())`) resolve those names once, at CREATE POLICY
-- time, as the migration's own (superuser) role — so RLS enforcement works
-- without this grant. But the app also calls app.is_tenant_writable()
-- directly (client-side "read-only mode" banner, via an RPC), and any
-- fresh, ad hoc reference to a schema-qualified name needs USAGE on that
-- schema to even resolve, regardless of EXECUTE on the function itself.
grant usage on schema app to authenticated, service_role;

grant select, insert, update, delete on
  public.tenants,
  public.users,
  public.vehicles,
  public.tariffs,
  public.shipments,
  public.telematics_logs,
  public.alerts
to authenticated;

grant all on
  public.tenants,
  public.users,
  public.vehicles,
  public.tariffs,
  public.shipments,
  public.telematics_logs,
  public.alerts
to service_role;

-- public.shipments.reference_code defaults to app.next_shipment_reference(),
-- a non-SECURITY-DEFINER function, so it runs with the *caller's* privileges
-- and needs USAGE on the underlying sequence directly.
grant usage on sequence public.shipment_reference_seq to authenticated, service_role;

-- telematics_logs.id / alerts (via gen_random_uuid(), not a sequence) don't
-- need sequence grants; telematics_logs uses `generated always as identity`,
-- whose backing sequence is owned by and only ever touched through the
-- column default — no direct grant needed for identity columns.

-- Any table/column this project adds later should get an explicit grant
-- here too: `alter default privileges` is intentionally not used, so a
-- forgotten grant fails loudly (permission denied) instead of silently
-- opening a new table to every authenticated user tenant-wide.
