-- Phase 20: Final validation queries
select 'profiles' as table_name, count(*) from public.profiles
union all select 'students', count(*) from public.students
union all select 'agents', count(*) from public.agents
union all select 'staff_profiles', count(*) from public.staff_profiles
union all select 'applications', count(*) from public.applications
union all select 'documents', count(*) from public.documents;
