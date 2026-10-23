-- ============================================================================
-- supabase/tests/rls_smoke_test.sql
--
-- Manual, human-readable proof that tenant isolation and read-only
-- enforcement actually work — not just that the policies exist. Run this
-- against a fresh `supabase db reset` (migrations + seed.sql applied),
-- e.g.:
--
--   supabase db reset
--   psql "$(supabase status -o env | grep DB_URL | cut -d= -f2)" \
--     -f supabase/tests/rls_smoke_test.sql
--
-- Every section states what it expects; read the \echo lines against the
-- actual output. This is not a pgTAP suite (no pass/fail assertions) —
-- it's meant to be read, the same way you'd read `EXPLAIN ANALYZE` output.
--
-- NOTE: on Supabase's own Postgres, `auth.jwt()`/`auth.uid()` read from
-- PostgREST's `request.jwt.claims` GUC, which is exactly what
-- `set_config('request.jwt.claims', ..., false)` below simulates — this
-- is the standard way to exercise RLS policies directly in psql without
-- going through PostgREST/a real HTTP request.
-- ============================================================================

\echo '=== As service_role (bypasses RLS): row counts per table ==='
set role service_role;
select 'tenants' t, count(*) from public.tenants
union all select 'shipments', count(*) from public.shipments
union all select 'telematics_logs', count(*) from public.telematics_logs
union all select 'alerts', count(*) from public.alerts;
reset role;
\echo 'EXPECT: tenants=2, shipments=3, telematics_logs=48, alerts=1'

\echo ''
\echo '=== As Acme admin (Marcus Chen): should see only Acme rows ==='
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"a1111111-0000-4000-8000-000000000001","app_metadata":{"tenant_id":"11111111-1111-4111-8111-111111111111","tenant_role":"admin"}}', false);
select reference_code, status, client_name from public.shipments order by reference_code;
\echo 'EXPECT: exactly NX-8921 and NX-8940 (Acme''s two shipments) — never BP-4471 (BioPharm)'

\echo ''
\echo '-- Acme admin tries to read BioPharm''s tenant row directly by id --'
select * from public.tenants where id = '22222222-2222-4222-8222-222222222222';
\echo 'EXPECT: 0 rows'

\echo ''
\echo '-- Acme admin inserts a shipment into their OWN tenant (tenant is active) --'
insert into public.shipments (tenant_id, client_name, cargo_description, origin_label, destination_label)
values ('11111111-1111-4111-8111-111111111111', 'Test Client', 'Test cargo', 'Origin', 'Dest')
returning reference_code, status;
\echo 'EXPECT: succeeds, returns a new NX-#### row'

\echo ''
\echo '-- Acme admin tries to insert INTO BioPharm''s tenant_id (forged cross-tenant write) --'
insert into public.shipments (tenant_id, client_name, cargo_description, origin_label, destination_label)
values ('22222222-2222-4222-8222-222222222222', 'Cross-tenant attempt', 'x', 'x', 'x');
\echo 'EXPECT: ERROR — new row violates row-level security policy'

reset role;

\echo ''
\echo '=== As Acme driver (Elena Rostova): should see ONLY her own assigned shipment ==='
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"a1111111-0000-4000-8000-000000000002","app_metadata":{"tenant_id":"11111111-1111-4111-8111-111111111111","tenant_role":"driver"}}', false);
select reference_code, driver_id from public.shipments;
\echo 'EXPECT: exactly NX-8921, driver_id = a1111111-...-002 (Elena) — not NX-8940 (Devonte''s)'
reset role;

\echo ''
\echo '=== As BioPharm owner (Priya Nair): tenant is past_due -> read-only ==='
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"a2222222-0000-4000-8000-000000000001","app_metadata":{"tenant_id":"22222222-2222-4222-8222-222222222222","tenant_role":"owner"}}', false);
select reference_code, status from public.shipments;
\echo 'EXPECT: exactly BP-4471 (reads still work while read-only)'
select app.is_tenant_writable() as biopharm_writable;
\echo 'EXPECT: f (false)'

\echo ''
\echo '-- BioPharm owner tries to insert a shipment while past_due --'
insert into public.shipments (tenant_id, client_name, cargo_description, origin_label, destination_label)
values ('22222222-2222-4222-8222-222222222222', 'Should fail', 'x', 'x', 'x');
\echo 'EXPECT: ERROR — new row violates row-level security policy (blocked by is_tenant_writable(), not by tenant_id)'

reset role;
