-- ============================================================================
-- 20260922085900_extensions.sql
--
-- Extensions every later migration in this project depends on:
--   pgcrypto — gen_random_uuid() for every primary key default
--   postgis  — geography(point, 4326) columns on shipments/telematics_logs
--
-- Both ship in the `extensions` schema on Supabase projects by default and
-- are already enabled on a fresh project; `create extension if not exists`
-- makes this migration a no-op there while still being correct against a
-- plain, unconfigured Postgres instance (e.g. this local verification run).
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists postgis;
