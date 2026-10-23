-- ============================================================================
-- 20260922090400_tariffs.sql
--
-- Rate cards a tenant defines and assigns to shipments; Stripe Billing
-- (Phase 5) meters usage against these. Kept deliberately simple here —
-- Phase 5 is where metered-usage/Stripe Price linkage gets fleshed out.
-- ============================================================================

do $$ begin
  create type public.billing_interval as enum ('per_shipment', 'per_km', 'per_kg', 'monthly_flat');
exception when duplicate_object then null;
end $$;

create table if not exists public.tariffs (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references public.tenants (id) on delete cascade,
  name              text not null,
  description       text,
  billing_interval  public.billing_interval not null default 'per_shipment',
  rate_amount       numeric(12, 2) not null check (rate_amount >= 0),
  currency          text not null default 'USD'
                       constraint tariffs_currency_format check (currency ~ '^[A-Z]{3}$'),
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.tariffs is
  'Tenant-defined rate cards assigned to shipments; basis for Stripe metered billing (Phase 5).';

create index if not exists tariffs_tenant_id_idx on public.tariffs (tenant_id);
create index if not exists tariffs_tenant_id_active_idx
  on public.tariffs (tenant_id) where is_active;

drop trigger if exists set_updated_at on public.tariffs;
create trigger set_updated_at
  before update on public.tariffs
  for each row execute function app.set_updated_at();

alter table public.tariffs enable row level security;
alter table public.tariffs force row level security;

create policy tariffs_select_same_tenant
  on public.tariffs for select
  to authenticated
  using (tenant_id = app.current_tenant_id());

create policy tariffs_insert_admin
  on public.tariffs for insert
  to authenticated
  with check (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
  );

create policy tariffs_update_admin
  on public.tariffs for update
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
  )
  with check (tenant_id = app.current_tenant_id());

create policy tariffs_delete_admin
  on public.tariffs for delete
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
  );
