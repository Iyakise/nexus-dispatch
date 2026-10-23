set role authenticated;
select set_config('request.jwt.claims', '{"sub":"a1111111-0000-4000-8000-000000000001","app_metadata":{"tenant_id":"11111111-1111-4111-8111-111111111111","tenant_role":"admin"}}', false);
insert into public.shipments (tenant_id, client_name, cargo_description, origin_label, destination_label)
values ('22222222-2222-4222-8222-222222222222', 'Cross-tenant attempt', 'x', 'x', 'x');