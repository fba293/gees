-- Phase 16: Staff task management
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text null,
  priority text not null default 'normal',
  status text not null default 'open',
  due_date date null,
  assigned_to uuid null references public.profiles(id) on delete set null,
  created_by uuid null references public.profiles(id) on delete set null,
  application_id uuid null references public.applications(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tasks enable row level security;
drop policy if exists gees_tasks_access on public.tasks;
create policy gees_tasks_access on public.tasks for all to authenticated using (is_gees_admin() or assigned_to=auth.uid() or created_by=auth.uid()) with check (is_gees_admin() or assigned_to=auth.uid() or created_by=auth.uid());
grant select, insert, update on public.tasks to authenticated;
