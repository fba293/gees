-- Replace this email with your real first admin email before running.
update public.profiles
set role = 'super_admin', status = 'active', team_id = 'super_admin', updated_at = now()
where lower(email) = lower('REPLACE_WITH_YOUR_EMAIL@example.com');

select id, email, role, status, team_id
from public.profiles
where lower(email) = lower('REPLACE_WITH_YOUR_EMAIL@example.com');
