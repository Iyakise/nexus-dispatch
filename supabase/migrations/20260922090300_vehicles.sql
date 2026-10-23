-- ============================================================================
-- 20260922090300_vehicles.sql
--
-- Fleet assets: the reefer trucks/vans/trailers a tenant dispatches.
-- Also backfills the driver -> vehicle assignment FK on public.users that
-- 20260922090200_users.sql deferred (vehicles didn't exist yet).
-- ============================================================================

do $$ begin
  create type public.vehicle_type as enum ('van', 'truck', 'trailer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.vehicle_status as enum ('active', 'maintenance', 'retired');
exception when duplicate_object then null;
end $$;

create table if not exists public.vehicles (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references public.tenants (id) on delete cascade,
  -- Fleet-facing label shown throughout the dashboard, e.g. "Van #04".
  label               text not null,
  vin                 text,
  plate_number        text,
  type                public.vehicle_type not null default 'van',
  status              public.vehicle_status not null default 'active',
  -- Reefer unit identity, distinct from the vehicle itself (a trailer's
  -- reefer unit can be swapped) — shown on telemetry cards as the asset id.
  reefer_unit_id      text,
  -- Default thermal band for this unit; a shipment may override both
  -- bounds for its own cargo (see shipments.thermal_min_c/max_c).
  thermal_min_c       numeric(4, 1) not null default 2.0,
  thermal_max_c       numeric(4, 1) not null default 8.0,
  last_maintenance_at timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint vehicles_thermal_range_valid check (thermal_min_c < thermal_max_c)
);

comment on table public.vehicles is
  'Reefer fleet assets (vans/trucks/trailers) a tenant dispatches.';
comment on column public.vehicles.reefer_unit_id is
  'Cold-chain unit identity shown on telemetry cards, e.g. "RF-2207". Distinct from the vehicle: a trailer''s reefer unit can be swapped.';

create index if not exists vehicles_tenant_id_idx on public.vehicles (tenant_id);
create unique index if not exists vehicles_tenant_id_vin_idx
  on public.vehicles (tenant_id, vin) where vin is not null;

drop trigger if exists set_updated_at on public.vehicles;
create trigger set_updated_at
  before update on public.vehicles
  for each row execute function app.set_updated_at();

alter table public.vehicles enable row level security;
alter table public.vehicles force row level security;

create policy vehicles_select_same_tenant
  on public.vehicles for select
  to authenticated
  using (tenant_id = app.current_tenant_id());

create policy vehicles_insert_dispatcher_up
  on public.vehicles for insert
  to authenticated
  with check (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin', 'dispatcher')
    and app.is_tenant_writable()
  );

create policy vehicles_update_dispatcher_up
  on public.vehicles for update
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin', 'dispatcher')
    and app.is_tenant_writable()
  )
  with check (tenant_id = app.current_tenant_id());

create policy vehicles_delete_admin
  on public.vehicles for delete
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
  );

-- ----------------------------------------------------------------------------
-- Deferred FK: a driver's currently-assigned vehicle.
-- ----------------------------------------------------------------------------
alter table public.users
  add column if not exists assigned_vehicle_id uuid
    references public.vehicles (id) on delete set null;

create index if not exists users_assigned_vehicle_id_idx
  on public.users (assigned_vehicle_id)
  where assigned_vehicle_id is not null;
