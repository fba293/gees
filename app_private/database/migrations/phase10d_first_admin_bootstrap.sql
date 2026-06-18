-- GEES Phase 10D: First Admin / Super Admin Bootstrap Helper
-- Use this ONLY after you create a normal account from the portal signup page.
-- Replace the email below with your own real GEES admin email.

-- 1) Create your account from /portal/auth/student-signup.html first.
-- 2) Confirm the email if Supabase email confirmation is enabled.
-- 3) Then run ONE of the updates below in Supabase SQL Editor.

-- Make first owner Super Admin:
update public.profiles
set role = 'super_admin', status = 'active', team_id = 'admin', updated_at = now()
where email = 'YOUR_ADMIN_EMAIL@example.com';

-- Optional: make another account Admin instead of Super Admin:
-- update public.profiles
-- set role = 'admin', status = 'active', team_id = 'admin', updated_at = now()
-- where email = 'YOUR_ADMIN_EMAIL@example.com';

-- Check result:
select id, email, full_name, role, status, team_id, created_at
from public.profiles
where email = 'YOUR_ADMIN_EMAIL@example.com';
