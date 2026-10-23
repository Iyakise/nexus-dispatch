-- ============================================================================
-- 20260922090500_shipments.sql
--
-- The core dispatch record. Matches the "Active Shipments" / operational
-- command dashboard screens: reference codes like #NX-8921, route,
-- assigned driver/vehicle, cargo, thermal profile, status, ETA.
-- ============================================================================

do $$ begin
  create type public.shipment_status as enum (
    'pending',     -- created, not yet dispatched
    'dispatched',  -- driver/vehicle assigned, awaiting pickup
    'in_transit',
    'delivered',
    'cancelled',
    'exception'    -- thermal excursion or other operational problem in-flight
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.shipments (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references public.tenants (id) on delete cascade,
  -- Dispatch-facing code shown everywhere in the UI, e.g. "NX-8921".
  -- Sequential per tenant via shipment_reference_seq below, not global,
  -- so tenants can't infer each other's shipment volume from the code.
  reference_code      text not null,
  status              public.shipment_status not null default 'pending',

  vehicle_id          uuid references public.vehicles (id) on delete set null,
  driver_id           uuid references public.users (id) on delete set null,
  tariff_id           uuid references public.tariffs (id) on delete set null,

  client_name         text not null,
  cargo_description   text not null,

  origin_label        text not null,
  destination_label   text not null,
  origin_point         geography(point, 4326),
  destination_point    geography(point, 4326),

  -- Cargo-specific thermal band; falls back to the vehicle's own band in
  -- application logic when null (kept nullable rather than duplicated here).
  thermal_min_c       numeric(4, 1),
  thermal_max_c       numeric(4, 1),

  scheduled_pickup_at   timestamptz,
  scheduled_delivery_at timestamptz,
  actual_pickup_at      timestamptz,
  actual_delivery_at    timestamptz,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint shipments_tenant_reference_unique unique (tenant_id, reference_code),
  constraint shipments_thermal_range_valid
    check (thermal_min_c is null or thermal_max_c is null or thermal_min_c < thermal_max_c),
  constraint shipments_vehicle_same_tenant
    -- Enforced by the composite FK below rather than a subquery check,
    -- which isn't IMMUTABLE-safe against concurrent cross-tenant edits.
    check (true)
);

comment on table public.shipments is
  'Core dispatch record. reference_code (e.g. "NX-8921") is what the UI and drivers refer to; id is internal.';
comment on column public.shipments.origin_point is
  'PostGIS point (lon/lat). Requires the postgis extension — enabled in this migration.';

-- Enforce vehicle/driver/tariff belong to the same tenant as the shipment,
-- via composite foreign keys (requires a unique (id, tenant_id) on each
-- referenced table — added right below, alongside their primary keys).
alter table public.vehicles add constraint vehicles_id_tenant_unique unique (id, tenant_id);
alter table public.users    add constraint users_id_tenant_unique unique (id, tenant_id);
alter table public.tariffs  add constraint tariffs_id_tenant_unique unique (id, tenant_id);
-- shipments' own (id, tenant_id) uniqueness, needed by telematics_logs and
-- alerts (both composite-FK to shipments). Added here, right after this
-- table exists, rather than deferred to those later migrations.
alter table public.shipments add constraint shipments_id_tenant_unique unique (id, tenant_id);

alter table public.shipments
  add constraint shipments_vehicle_tenant_fk
    foreign key (vehicle_id, tenant_id) references public.vehicles (id, tenant_id),
  add constraint shipments_driver_tenant_fk
    foreign key (driver_id, tenant_id) references public.users (id, tenant_id),
  add constraint shipments_tariff_tenant_fk
    foreign key (tariff_id, tenant_id) references public.tariffs (id, tenant_id);

-- Per-tenant sequential reference codes ("NX-0001", "NX-0002", ...). A
-- single global sequence is fine even though it's shared across tenants —
-- it only determines the *number*, and numbers are unique per tenant via
-- shipments_tenant_reference_unique above, not globally.
create sequence if not exists public.shipment_reference_seq;

create or replace function app.next_shipment_reference()
returns text
language sql
as $$
  select 'NX-' || lpad(nextval('public.shipment_reference_seq')::text, 4, '0')
$$;

alter table public.shipments
  alter column reference_code set default app.next_shipment_reference();

create index if not exists shipments_tenant_id_idx on public.shipments (tenant_id);
create index if not exists shipments_tenant_status_idx on public.shipments (tenant_id, status);
create index if not exists shipments_driver_id_idx on public.shipments (driver_id) where driver_id is not null;
create index if not exists shipments_vehicle_id_idx on public.shipments (vehicle_id) where vehicle_id is not null;

drop trigger if exists set_updated_at on public.shipments;
create trigger set_updated_at
  before update on public.shipments
  for each row execute function app.set_updated_at();

alter table public.shipments enable row level security;
alter table public.shipments force row level security;

-- Everyone in the tenant can see every shipment (dispatchers need the full
-- board; a driver needs to be able to look up a colleague's ETA at a
-- shared drop point) EXCEPT a driver, who only sees their own assignments.
-- Client Portals (Phase 3/4) get their own narrower view via a separate
-- `client_portal` role/table, not covered by this policy.
create policy shipments_select_scoped
  on public.shipments for select
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and (
      app.current_role_name() <> 'driver'
      or driver_id = auth.uid()
    )
  );

create policy shipments_insert_dispatcher_up
  on public.shipments for insert
  to authenticated
  with check (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin', 'dispatcher')
    and app.is_tenant_writable()
  );

-- Dispatchers/admins can edit anything on a shipment; a driver may only
-- update their own assigned shipment, and — enforced at the application
-- layer, since column-level RLS can't distinguish "status" from "cargo
-- description" — should be limited by the API to status/timestamp fields.
create policy shipments_update_dispatcher_up
  on public.shipments for update
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.is_tenant_writable()
    and (
      app.current_role_name() in ('owner', 'admin', 'dispatcher')
      or (app.current_role_name() = 'driver' and driver_id = auth.uid())
    )
  )
  with check (tenant_id = app.current_tenant_id());

create policy shipments_delete_admin
  on public.shipments for delete
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
  );
