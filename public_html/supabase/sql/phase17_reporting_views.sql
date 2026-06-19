-- Phase 17: Reporting views
create or replace view public.v_gees_application_status_counts as
select status::text as status, count(*)::bigint as total
from public.applications
group by status;

create or replace view public.v_gees_monthly_applications as
select date_trunc('month', created_at)::date as month, count(*)::bigint as total
from public.applications
group by 1
order by 1 desc;
