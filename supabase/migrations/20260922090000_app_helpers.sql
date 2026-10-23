-- ============================================================================
-- 20260922090000_app_helpers.sql
--
-- Shared helper functions used by every RLS policy in this project.
--
-- Tenant identity travels in the JWT, not in a session variable, because
-- Supabase's PostgREST connection pool does not let us set a per-request
-- `app.current_tenant_id` GUC reliably (it's a pooled connection, not one
-- connection per request). Instead, a Postgres trigger on `auth.users`
-- (see 20260922090200_users.sql) copies `tenant_id` into
-- `raw_app_meta_data`, a Supabase Auth "sign up / admin update" trigger
-- keeps it refreshed, and every RLS policy reads it back out of the JWT via
-- `auth.jwt()`. `app_metadata` is only writable with the service role key,
-- so a tenant can never forge a different tenant_id for itself client-side.
-- ============================================================================

create schema if not exists app;

comment on schema app is
  'Internal helper functions for multi-tenant RLS. Not exposed via PostgREST.';

-- ----------------------------------------------------------------------------
-- app.current_tenant_id()
--
-- The tenant_id claim embedded in the caller's JWT (auth.jwt()->app_metadata).
-- Returns NULL for anon/unauthenticated requests and for the service role
-- (which does not go through RLS at all, so this never gets called for it).
-- STABLE, not IMMUTABLE: the result depends on the current JWT, which is
-- constant only within a single statement/transaction.
-- ----------------------------------------------------------------------------
create or replace function app.current_tenant_id()
returns uuid
language sql
stable
security invoker
set search_path = ''
as $$
  select nullif(
    coalesce(
      auth.jwt() -> 'app_metadata' ->> 'tenant_id',
      auth.jwt() -> 'user_metadata' ->> 'tenant_id'
    ),
    ''
  )::uuid
$$;

comment on function app.current_tenant_id() is
  'Tenant UUID from the caller''s JWT app_metadata. NULL if absent/anon.';

-- ----------------------------------------------------------------------------
-- app.current_role_name()
--
-- The caller's role within their tenant (owner / admin / dispatcher /
-- driver / viewer), also carried in app_metadata so it is available without
-- a table lookup. Used by policies that restrict destructive actions
-- (e.g. only owner/admin may delete a shipment).
-- ----------------------------------------------------------------------------
create or replace function app.current_role_name()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select auth.jwt() -> 'app_metadata' ->> 'tenant_role'
$$;

comment on function app.current_role_name() is
  'Caller''s tenant role (owner/admin/dispatcher/driver/viewer) from the JWT.';

-- NOTE: app.is_tenant_writable() is defined in
-- 20260922090100_tenants.sql, not here — its body reads public.tenants,
-- which doesn't exist yet at this point in the migration sequence.
-- LANGUAGE SQL function bodies are validated against the catalog at
-- CREATE FUNCTION time (not just on first call), so the table must exist
-- first. Keeping it right after `create table tenants` also keeps the
-- function next to the table it reads.

revoke all on function app.current_tenant_id() from public;
revoke all on function app.current_role_name() from public;
grant execute on function app.current_tenant_id() to authenticated, service_role;
grant execute on function app.current_role_name() to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- app.set_updated_at()
--
-- Shared BEFORE UPDATE trigger: every table below has `updated_at`, and none
-- of them trust the client to set it correctly.
-- ----------------------------------------------------------------------------
create or replace function app.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
