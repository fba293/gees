-- Phase 10F debug helper. Safe to run in Supabase SQL Editor.
select role, status, count(*) as total
from public.profiles
group by role, status
order by role, status;

select approval_type, target_table, status, count(*) as total
from public.approvals
group by approval_type, target_table, status
order by approval_type, status;

select p.email, p.full_name, p.role, p.status, a.status as approval_status, a.created_at
from public.profiles p
left join public.approvals a on a.target_table='profiles' and a.target_id=p.id and a.approval_type='user_activation'
where p.role in ('agent','staff')
order by p.created_at desc;
