-- ============================================================================
-- 20260922090200_users.sql
--
-- Tenant-membership profile for each Supabase Auth user. One row per
-- (auth) user; a user belongs to exactly one tenant in this model (matches
-- the Stitch screens: a person signs in to one org's subdomain).
--
-- This migration also creates the trigger on auth.users that copies
-- tenant_id/role into raw_app_meta_data, which is what
-- app.current_tenant_id() / app.current_role_name() read at request time.
-- ============================================================================

do $$ begin
  create type public.tenant_role as enum (
    'owner', 'admin', 'dispatcher', 'driver', 'viewer'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.users (
  -- Same id as auth.users(id); this row IS the tenant-membership profile
  -- for that auth identity, not a separate business entity with its own id.
  id            uuid primary key references auth.users (id) on delete cascade,
  tenant_id     uuid not null references public.tenants (id) on delete cascade,
  role          public.tenant_role not null default 'viewer',
  full_name     text not null,
  email         text not null,
  phone         text,
  avatar_url    text,
  -- Drivers only: which vehicle they're currently assigned to. FK added in
  -- 20260922090300_vehicles.sql (vehicles doesn't exist yet at this point).
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.users is
  'Tenant-membership profile for an auth.users identity. 1 row per user; a user belongs to exactly one tenant.';
comment on column public.users.id is
  'Same UUID as auth.users.id — this table extends the auth identity, it does not reference it via a separate FK column.';

create index if not exists users_tenant_id_idx on public.users (tenant_id);
create unique index if not exists users_tenant_id_email_idx
  on public.users (tenant_id, lower(email));

drop trigger if exists set_updated_at on public.users;
create trigger set_updated_at
  before update on public.users
  for each row execute function app.set_updated_at();

alter table public.users enable row level security;
alter table public.users force row level security;

-- Everyone in a tenant can see their teammates (driver assignment, alert
-- "acknowledged by", the dispatcher roster in Client Portals, etc).
create policy users_select_same_tenant
  on public.users for select
  to authenticated
  using (tenant_id = app.current_tenant_id());

-- A user may always edit their own contact details/avatar...
create policy users_update_self
  on public.users for update
  to authenticated
  using (id = auth.uid() and tenant_id = app.current_tenant_id())
  with check (
    id = auth.uid()
    and tenant_id = app.current_tenant_id()
    -- ...but not their own role or which tenant they belong to. A user
    -- editing themselves must submit the row back with these unchanged;
    -- role changes go through users_update_admin below instead.
    and role = (select u.role from public.users u where u.id = auth.uid())
  );

-- ...and an owner/admin may manage any teammate's role/active flag, while
-- the tenant is writable.
create policy users_update_admin
  on public.users for update
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
  )
  with check (tenant_id = app.current_tenant_id());

-- Seat provisioning happens via the Supabase Auth admin API (invite flow,
-- Phase 3) using the service role, which bypasses RLS — so there is no
-- authenticated-role INSERT policy here by design.
create policy users_delete_admin
  on public.users for delete
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
    and id <> auth.uid()  -- can't remove yourself
  );

-- ----------------------------------------------------------------------------
-- Keep auth.users.raw_app_meta_data in sync with public.users(tenant_id, role)
--
-- This is what makes app.current_tenant_id()/current_role_name() cheap: the
-- JWT already carries the claim, no per-request table lookup needed. The
-- trigger runs SECURITY DEFINER because triggers on auth.users require
-- elevated privilege that the authenticated role doesn't have directly.
-- ----------------------------------------------------------------------------
create or replace function app.sync_user_claims()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update auth.users
  set raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object(
         'tenant_id', new.tenant_id::text,
         'tenant_role', new.role::text
       )
  where id = new.id;
  return new;
end;
$$;

comment on function app.sync_user_claims() is
  'Mirrors public.users(tenant_id, role) into auth.users.raw_app_meta_data '
  'so the JWT carries current tenant claims. NOTE: the JWT itself only '
  'refreshes on next token refresh/re-login — a role change is not '
  'retroactive to an already-issued access token still within its TTL.';

drop trigger if exists sync_user_claims on public.users;
create trigger sync_user_claims
  after insert or update of tenant_id, role on public.users
  for each row execute function app.sync_user_claims();
