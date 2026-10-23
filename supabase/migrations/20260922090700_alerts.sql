-- ============================================================================
-- 20260922090700_alerts.sql
--
-- Operational alerts: thermal excursions, geofence breaches, offline
-- devices, low battery, delays. Drives the "Cold-Chain Alerts" screen and
-- the red badge count in the nav rail.
-- ============================================================================

do $$ begin
  create type public.alert_type as enum (
    'thermal_excursion', 'geofence_breach', 'device_offline', 'battery_low', 'delivery_delay'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.alert_severity as enum ('info', 'warning', 'critical');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.alert_status as enum ('open', 'acknowledged', 'resolved');
exception when duplicate_object then null;
end $$;

create table if not exists public.alerts (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references public.tenants (id) on delete cascade,
  shipment_id      uuid references public.shipments (id) on delete cascade,
  vehicle_id       uuid references public.vehicles (id) on delete cascade,
  -- The specific reading that triggered this alert, where applicable
  -- (thermal_excursion, mainly) — lets the UI jump straight to the exact
  -- point on the sparkline.
  telematics_log_id bigint references public.telematics_logs (id) on delete set null,

  type             public.alert_type not null,
  severity         public.alert_severity not null default 'warning',
  status           public.alert_status not null default 'open',
  message          text not null,

  triggered_at     timestamptz not null default now(),
  acknowledged_at  timestamptz,
  acknowledged_by  uuid references public.users (id) on delete set null,
  resolved_at      timestamptz,
  resolved_by      uuid references public.users (id) on delete set null,

  created_at       timestamptz not null default now(),

  constraint alerts_shipment_tenant_fk
    foreign key (shipment_id, tenant_id) references public.shipments (id, tenant_id),
  constraint alerts_vehicle_tenant_fk
    foreign key (vehicle_id, tenant_id) references public.vehicles (id, tenant_id),
  constraint alerts_ack_consistency
    check (
      (status = 'open' and acknowledged_at is null and resolved_at is null)
      or (status = 'acknowledged' and acknowledged_at is not null and resolved_at is null)
      or (status = 'resolved' and resolved_at is not null)
    )
);

comment on table public.alerts is
  'Operational alerts (thermal excursions, geofence, offline, battery, delay). Backs the alerts screen and nav badge count.';

create index if not exists alerts_tenant_status_idx
  on public.alerts (tenant_id, status);
create index if not exists alerts_tenant_open_severity_idx
  on public.alerts (tenant_id, severity) where status = 'open';
create index if not exists alerts_shipment_id_idx
  on public.alerts (shipment_id) where shipment_id is not null;

alter table public.alerts enable row level security;
alter table public.alerts force row level security;

create policy alerts_select_scoped
  on public.alerts for select
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

-- No authenticated INSERT: alerts are raised by the ingestion/evaluation
-- service (service role) when a telematics reading crosses a threshold,
-- not typed in by a person.
create policy alerts_insert_service_only
  on public.alerts for insert
  to authenticated
  with check (false);

-- Acknowledge/resolve is the one write action available to operations
-- staff on this table, and it's allowed even when the tenant is otherwise
-- read-only: silencing a stale alert on a canceled account shouldn't
-- require a live subscription.
create policy alerts_update_acknowledge
  on public.alerts for update
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin', 'dispatcher')
  )
  with check (tenant_id = app.current_tenant_id());

create policy alerts_delete_admin
  on public.alerts for delete
  to authenticated
  using (
    tenant_id = app.current_tenant_id()
    and app.current_role_name() in ('owner', 'admin')
    and app.is_tenant_writable()
  );
