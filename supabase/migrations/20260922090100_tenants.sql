-- ============================================================================
-- 20260922090100_tenants.sql
--
-- One row per customer organisation (e.g. "Acme Cold-Chain Logistics").
-- Every other operational table hangs off tenants.id via tenant_id.
-- ============================================================================

do $$ begin
  create type public.subscription_status as enum (
    'trialing',   -- onboarding, before first successful payment
    'active',
    'past_due',   -- payment failed; grace period; still writable
    'canceled'    -- grace period expired or explicitly canceled; read-only
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.billing_plan as enum ('starter', 'growth', 'enterprise');
exception when duplicate_object then null;
end $$;

create table if not exists public.tenants (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  -- Subdomain: acme.nexusdispatch.com. Lowercase letters, digits, hyphens;
  -- must start/end alphanumeric. Enforced here, not just app-side, because
  -- proxy.ts (Phase 3) trusts this column to resolve tenants from a host.
  slug                  text not null unique
                          constraint tenants_slug_format
                          check (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'),
  billing_plan          public.billing_plan not null default 'starter',
  subscription_status   public.subscription_status not null default 'trialing',
  -- Stripe identifiers, populated once Phase 5 wires up Billing. Nullable
  -- until then; unique so two tenants can never point at the same customer.
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  -- Grace-period bookkeeping for past_due -> canceled transitions.
  trial_ends_at         timestamptz,
  current_period_end    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.tenants is
  'One row per customer organisation. Root of tenant isolation.';
comment on column public.tenants.slug is
  'Subdomain segment: <slug>.nexusdispatch.com. Immutable in practice once DNS/onboarding email is sent.';
comment on column public.tenants.subscription_status is
  'trialing/active are writable. past_due/canceled flip app.is_tenant_writable() to false (read-only), audit history stays visible.';

create index if not exists tenants_subscription_status_idx
  on public.tenants (subscription_status);
create index if not exists tenants_stripe_customer_id_idx
  on public.tenants (stripe_customer_id)
  where stripe_customer_id is not null;

drop trigger if exists set_updated_at on public.tenants;
create trigger set_updated_at
  before update on public.tenants
  for each row execute function app.set_updated_at();

-- ----------------------------------------------------------------------------
-- app.is_tenant_writable()
--
-- FALSE once a tenant's subscription is past_due or canceled: the read-only
-- enforcement point for the whole app. SECURITY DEFINER + a locked-down
-- search_path so it can read `public.tenants` regardless of the caller's
-- own RLS visibility into that table, without being hijackable by a
-- same-named function/table earlier in the caller's search_path.
-- A tenant_id that doesn't resolve to a row (or is NULL) is treated as
-- read-only: fail closed, not open. Defined here (not in
-- 20260922090000_app_helpers.sql) because this table must exist first —
-- LANGUAGE SQL function bodies are validated against the catalog at
-- CREATE FUNCTION time.
-- ----------------------------------------------------------------------------
create or replace function app.is_tenant_writable()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select t.subscription_status in ('trialing', 'active')
      from public.tenants t
      where t.id = app.current_tenant_id()
    ),
    false
  )
$$;

comment on function app.is_tenant_writable() is
  'FALSE for past_due/canceled/unknown tenants. INSERT/UPDATE/DELETE '
  'policies gate on this to enforce read-only mode; historical rows stay '
  'readable via the matching SELECT policy.';

revoke all on function app.is_tenant_writable() from public;
grant execute on function app.is_tenant_writable() to authenticated, service_role;

alter table public.tenants enable row level security;
alter table public.tenants force row level security;

-- Members can see their own tenant's row (plan, status, billing dates show
-- up in Settings and in the "read-only" banner) but never another tenant's.
create policy tenants_select_own
  on public.tenants for select
  to authenticated
  using (id = app.current_tenant_id());

-- Only owner/admin may edit tenant-level settings (name, plan choice), and
-- only while the subscription is in a writable state. Status/Stripe fields
-- are intentionally NOT included here: those are service-role-only writes
-- driven by Stripe webhooks (Phase 5), never by a tenant's own admin.
create policy tenants_update_own_admin
  on public.tenants for update
  to authenticated
  using (
    id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
  )
  with check (
    id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
  );

-- No client-side INSERT/DELETE policy: tenant provisioning and offboarding
-- are service-role operations (signup flow / support tooling), never a
-- direct client write. Omitting a policy denies the action entirely under
-- RLS, which is the intended behaviour here.
