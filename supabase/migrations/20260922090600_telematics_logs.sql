-- ============================================================================
-- 20260922090600_telematics_logs.sql
--
-- Raw sensor readings streamed from each reefer unit: temperature, humidity,
-- battery, GPS. High write volume, append-only. Backs the 6-hour thermal
-- profile sparkline and the live fleet map.
-- ============================================================================

create table if not exists public.telematics_logs (
  id               bigint generated always as identity primary key,
  tenant_id        uuid not null references public.tenants (id) on delete cascade,
  shipment_id      uuid references public.shipments (id) on delete cascade,
  vehicle_id       uuid not null references public.vehicles (id) on delete cascade,

  recorded_at      timestamptz not null default now(),
  temperature_c    numeric(5, 2) not null,
  humidity_pct     numeric(5, 2) check (humidity_pct between 0 and 100),
  battery_pct      smallint check (battery_pct between 0 and 100),
  location         geography(point, 4326),
  speed_kmh        numeric(5, 1) check (speed_kmh >= 0),
  -- False once a unit stops reporting on schedule; flips the telemetry
  -- card's "Sensor online" indicator. Set by the ingestion worker, not
  -- inferred here, since "on schedule" depends on that unit's own ping
  -- interval.
  is_online        boolean not null default true,

  created_at       timestamptz not null default now(),

  constraint telematics_shipment_vehicle_tenant_fk
    foreign key (shipment_id, tenant_id) references public.shipments (id, tenant_id),
  constraint telematics_vehicle_tenant_fk
    foreign key (vehicle_id, tenant_id) references public.vehicles (id, tenant_id)
);

comment on table public.telematics_logs is
  'Append-only sensor readings (temperature/humidity/battery/GPS) per reading interval. High write volume — see partitioning note below before this reaches production scale.';
comment on column public.telematics_logs.is_online is
  'Set by the ingestion worker based on that unit''s expected ping interval, not derived from recorded_at here.';

-- Requires shipments to already have its (id, tenant_id) unique constraint
-- (added in 20260922090500_shipments.sql, right after that table's own
-- creation, so it's available here).

-- Query patterns: "last N hours for this shipment" (sparklines, alerts
-- evaluation) and "last N hours for this vehicle" (fleet map). tenant_id
-- leads every index so RLS-filtered scans stay index-only within a tenant.
create index if not exists telematics_tenant_shipment_recorded_idx
  on public.telematics_logs (tenant_id, shipment_id, recorded_at desc);
create index if not exists telematics_tenant_vehicle_recorded_idx
  on public.telematics_logs (tenant_id, vehicle_id, recorded_at desc);

alter table public.telematics_logs enable row level security;
alter table public.telematics_logs force row level security;

create policy telematics_select_scoped
  on public.telematics_logs for select
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and (
      app.current_role_name() <> 'driver'
      or shipment_id in (
        select s.id from public.shipments s where s.driver_id = auth.uid()
      )
    )
  );

-- No authenticated INSERT policy: telematics rows are written exclusively
-- by the ingestion service using the service role key (device data never
-- comes from a logged-in dashboard session), which bypasses RLS entirely.
-- Likewise no UPDATE/DELETE — sensor history is immutable; a bad reading
-- gets a corrective row, not an edit, to preserve the audit trail.

-- ----------------------------------------------------------------------------
-- Scale note (not applied here — flagged for the Phase 4 realtime work):
-- this table should become a native Postgres partitioned table
-- (`partition by range (recorded_at)`, monthly) once ingestion volume
-- justifies it, with old partitions detached to cold storage. Converting
-- an already-populated plain table to partitioned requires a rebuild, so
-- deciding this **before** production traffic starts is much cheaper than
-- migrating later.
-- ----------------------------------------------------------------------------
