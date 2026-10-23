-- ============================================================================
-- supabase/seed.sql
--
-- Local/dev seed data. Two tenants so isolation is visibly testable, not
-- just theoretically correct. Values match what's shown in the Stitch
-- screens (shipment #NX-8921, +3.2°C, drivers, an open thermal-excursion
-- alert) so the dashboard looks "real" against fresh seed data.
--
-- Run with: supabase db reset   (applies migrations, then this file)
-- or:       psql "$DATABASE_URL" -f supabase/seed.sql
--
-- NOT for production: fixed UUIDs, a service-role-equivalent context, and
-- auth.users rows with no real credentials.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- Tenants
-- ----------------------------------------------------------------------------
insert into public.tenants (id, name, slug, billing_plan, subscription_status, trial_ends_at, current_period_end)
values
  ('11111111-1111-4111-8111-111111111111', 'Acme Cold-Chain Logistics', 'acme', 'growth', 'active', null, now() + interval '23 days'),
  -- Second tenant is deliberately past_due, so the read-only-mode UI and
  -- RLS write-block both have something to demonstrate against seed data.
  ('22222222-2222-4222-8222-222222222222', 'BioPharm Labs', 'biopharm', 'starter', 'past_due', null, now() - interval '4 days')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Auth identities (minimal auth.users rows — Supabase's `supabase db reset`
-- seeds auth.users itself in a hosted project; this block exists so this
-- file also works standalone against a bare Postgres/local Supabase CLI
-- instance). Passwords are unusable placeholders — sign-in for seeded
-- users goes through Supabase Auth's admin API / magic link, not a
-- password these rows define.
-- ----------------------------------------------------------------------------
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role)
values
  ('a1111111-0000-4000-8000-000000000001', 'marcus.chen@acme.nexusdispatch.com', crypt('seed-only-not-a-real-password', gen_salt('bf')), now(), '{}'::jsonb, '{}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('a1111111-0000-4000-8000-000000000002', 'elena.rostova@acme.nexusdispatch.com', crypt('seed-only-not-a-real-password', gen_salt('bf')), now(), '{}'::jsonb, '{}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('a1111111-0000-4000-8000-000000000003', 'devonte.vance@acme.nexusdispatch.com', crypt('seed-only-not-a-real-password', gen_salt('bf')), now(), '{}'::jsonb, '{}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
  ('a2222222-0000-4000-8000-000000000001', 'priya.nair@biopharm.nexusdispatch.com', crypt('seed-only-not-a-real-password', gen_salt('bf')), now(), '{}'::jsonb, '{}'::jsonb, now(), now(), 'authenticated', 'authenticated')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- public.users
-- The app.sync_user_claims trigger (20260922090200_users.sql) copies
-- tenant_id/role into auth.users.raw_app_meta_data automatically on this
-- insert — no need to set raw_app_meta_data by hand above.
-- ----------------------------------------------------------------------------
insert into public.users (id, tenant_id, role, full_name, email)
values
  ('a1111111-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'admin',      'Marcus Chen',    'marcus.chen@acme.nexusdispatch.com'),
  ('a1111111-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'driver',     'Elena Rostova',  'elena.rostova@acme.nexusdispatch.com'),
  ('a1111111-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'driver',     'Devonte Vance',  'devonte.vance@acme.nexusdispatch.com'),
  ('a2222222-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'owner',      'Priya Nair',     'priya.nair@biopharm.nexusdispatch.com')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Vehicles
-- ----------------------------------------------------------------------------
insert into public.vehicles (id, tenant_id, label, type, status, reefer_unit_id, thermal_min_c, thermal_max_c)
values
  ('b1111111-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Van #04',  'van',   'active', 'RF-2207', 2.0, 8.0),
  ('b1111111-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'Reefer #12', 'truck', 'active', 'RF-1180', 2.0, 8.0),
  ('b2222222-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'Cold Van #01', 'van', 'active', 'RF-9042', 2.0, 8.0)
on conflict (id) do nothing;

update public.users set assigned_vehicle_id = 'b1111111-0000-4000-8000-000000000001' where id = 'a1111111-0000-4000-8000-000000000002';
update public.users set assigned_vehicle_id = 'b1111111-0000-4000-8000-000000000002' where id = 'a1111111-0000-4000-8000-000000000003';

-- ----------------------------------------------------------------------------
-- Tariffs
-- ----------------------------------------------------------------------------
insert into public.tariffs (id, tenant_id, name, billing_interval, rate_amount, currency)
values
  ('c1111111-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Standard cold-chain', 'per_shipment', 185.00, 'USD'),
  ('c2222222-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'Starter rate', 'per_shipment', 140.00, 'USD')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Shipments — reference_code is set explicitly here (not left to the
-- app.next_shipment_reference() default) so the seeded IDs match the
-- Stitch screens exactly.
-- ----------------------------------------------------------------------------
insert into public.shipments (
  id, tenant_id, reference_code, status, vehicle_id, driver_id, tariff_id,
  client_name, cargo_description, origin_label, destination_label,
  thermal_min_c, thermal_max_c, scheduled_pickup_at, scheduled_delivery_at, actual_pickup_at
)
values
  (
    'd1111111-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'NX-8921', 'in_transit',
    'b1111111-0000-4000-8000-000000000001', 'a1111111-0000-4000-8000-000000000002', 'c1111111-0000-4000-8000-000000000001',
    'BioPharm Labs', 'Insulin batches', 'Boston Hub', 'Philadelphia Distribution Center',
    2.0, 8.0, now() - interval '38 minutes', now() + interval '42 minutes', now() - interval '38 minutes'
  ),
  (
    'd1111111-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'NX-8940', 'exception',
    'b1111111-0000-4000-8000-000000000002', 'a1111111-0000-4000-8000-000000000003', 'c1111111-0000-4000-8000-000000000001',
    'MedGene Therapeutics', 'Cell culture', 'NYC BWI', 'NJ Turnpike South',
    2.0, 8.0, now() - interval '2 hours', now() + interval '1 hour 15 minutes', now() - interval '2 hours'
  ),
  (
    'd2222222-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'BP-4471', 'pending',
    'b2222222-0000-4000-8000-000000000001', null, 'c2222222-0000-4000-8000-000000000001',
    'BioPharm Labs internal', 'Vaccine trial samples', 'Newark Lab', 'Trenton Cold Store',
    2.0, 8.0, now() + interval '3 hours', now() + interval '6 hours', null
  )
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Telematics — a short thermal history per in-flight shipment, most recent
-- last, ending exactly at the values shown on the Stitch dashboard.
-- ----------------------------------------------------------------------------
insert into public.telematics_logs (tenant_id, shipment_id, vehicle_id, recorded_at, temperature_c, humidity_pct, battery_pct, speed_kmh, is_online)
select
  '11111111-1111-4111-8111-111111111111',
  'd1111111-0000-4000-8000-000000000001',
  'b1111111-0000-4000-8000-000000000001',
  now() - (make_interval(mins => (24 - g)) ),
  round((3.0 + sin(g / 3.0) * 0.4 + g * 0.01)::numeric, 2),  -- drifts to ~3.2°C
  48 + (g % 4),
  92 - (g / 3),
  round((30 + random() * 25)::numeric, 1),
  true
from generate_series(1, 24) as g
on conflict do nothing;

insert into public.telematics_logs (tenant_id, shipment_id, vehicle_id, recorded_at, temperature_c, humidity_pct, battery_pct, speed_kmh, is_online)
select
  '11111111-1111-4111-8111-111111111111',
  'd1111111-0000-4000-8000-000000000002',
  'b1111111-0000-4000-8000-000000000002',
  now() - (make_interval(mins => (24 - g) * 5)),
  round((6.2 + g * 0.08)::numeric, 2),  -- climbs steadily up to the +8.1°C excursion
  50 + (g % 5),
  greatest(10, 64 - g),
  round((20 + random() * 40)::numeric, 1),
  true
from generate_series(1, 24) as g
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Alerts — one open critical thermal excursion on NX-8940, matching the
-- "+8.1°C OVER" badge in the Stitch dashboard.
-- ----------------------------------------------------------------------------
insert into public.alerts (id, tenant_id, shipment_id, vehicle_id, telematics_log_id, type, severity, status, message, triggered_at)
select
  'e1111111-0000-4000-8000-000000000001',
  '11111111-1111-4111-8111-111111111111',
  'd1111111-0000-4000-8000-000000000002',
  'b1111111-0000-4000-8000-000000000002',
  (select id from public.telematics_logs
     where shipment_id = 'd1111111-0000-4000-8000-000000000002'
     order by recorded_at desc limit 1),
  'thermal_excursion', 'critical', 'open',
  'Reefer #12 (RF-1180) reads +8.1°C on shipment NX-8940, 0.1°C above the 8.0°C limit.',
  now() - interval '6 minutes'
on conflict (id) do nothing;

commit;
