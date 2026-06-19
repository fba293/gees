-- Phase 19: Security review helpers
-- Run Supabase advisors after applying all migrations.
-- Confirm: no frontend service-role key, RLS enabled, SMTP configured, password reset URL configured.

select schemaname, tablename, rowsecurity
from pg_tables
where schemaname='public'
order by tablename;
