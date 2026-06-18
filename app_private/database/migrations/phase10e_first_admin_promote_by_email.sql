-- GEES Phase 10E — Direct first admin promotion SQL
-- Use this in Supabase SQL Editor after creating a real Auth user.
-- Replace the email below before running.

with selected_user as (
  select id, email
  from auth.users
  where lower(email) = lower('your-admin-email@example.com')
  limit 1
), upsert_profile as (
  insert into public.profiles (id, email, full_name, role, status, created_at, updated_at)
  select id, email, email, 'super_admin', 'active', now(), now()
  from selected_user
  on conflict (id) do update
    set role = 'super_admin',
        status = 'active',
        email = excluded.email,
        updated_at = now()
  returning id, email, role, status
)
insert into public.audit_logs (actor_id, action, entity_table, entity_id, metadata)
select id, 'first_admin_bootstrap', 'profiles', id, jsonb_build_object('email', email, 'role', role, 'status', status)
from upsert_profile;

select id, email, role, status
from public.profiles
where lower(email) = lower('your-admin-email@example.com');
