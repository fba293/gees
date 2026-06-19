-- Phase 14: Application workflow history
create table if not exists public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  old_status gees_application_status null,
  new_status gees_application_status not null,
  note text null,
  changed_by uuid null references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.application_status_history enable row level security;
drop policy if exists gees_app_status_history_admin_staff_student_select on public.application_status_history;
create policy gees_app_status_history_admin_staff_student_select on public.application_status_history for select to authenticated using (is_gees_admin() or exists (select 1 from public.applications a join public.students s on s.id=a.student_id where a.id=application_id and s.user_id=auth.uid()));
grant select, insert on public.application_status_history to authenticated;
