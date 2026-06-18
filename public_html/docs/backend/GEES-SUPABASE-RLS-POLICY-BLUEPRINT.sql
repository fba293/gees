-- GEES Supabase RLS Policy Blueprint
-- Review carefully before running.
-- This assumes GEES-SUPABASE-SQL-SCHEMA-DRAFT.sql has already run.

-- Helper function: current user's GEES role
create or replace function public.current_gees_role()
returns public.gees_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Helper function: admin check
create or replace function public.is_gees_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin','super_admin')
    and status = 'active'
  );
$$;

-- Helper function: super admin check
create or replace function public.is_gees_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'super_admin'
    and status = 'active'
  );
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.students enable row level security;
alter table public.agents enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.universities enable row level security;
alter table public.courses enable row level security;
alter table public.applications enable row level security;
alter table public.application_status_history enable row level security;
alter table public.documents enable row level security;
alter table public.commissions enable row level security;
alter table public.payments enable row level security;
alter table public.agreements enable row level security;
alter table public.approvals enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.support_tickets enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- PROFILES
create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_gees_admin());

create policy "profiles_update_own_limited_or_admin" on public.profiles
for update using (id = auth.uid() or public.is_gees_admin())
with check (id = auth.uid() or public.is_gees_admin());

create policy "profiles_insert_own" on public.profiles
for insert with check (id = auth.uid());

-- ROLE PERMISSIONS
create policy "role_permissions_read_authenticated" on public.role_permissions
for select to authenticated using (true);

create policy "role_permissions_manage_super_admin" on public.role_permissions
for all using (public.is_gees_super_admin()) with check (public.is_gees_super_admin());

-- STUDENTS
create policy "students_select_owner_or_admin" on public.students
for select using (user_id = auth.uid() or public.is_gees_admin());

create policy "students_insert_owner_or_admin" on public.students
for insert with check (user_id = auth.uid() or public.is_gees_admin());

create policy "students_update_owner_or_admin" on public.students
for update using (user_id = auth.uid() or public.is_gees_admin())
with check (user_id = auth.uid() or public.is_gees_admin());

-- AGENTS
create policy "agents_select_owner_or_admin" on public.agents
for select using (user_id = auth.uid() or public.is_gees_admin());

create policy "agents_insert_owner_or_admin" on public.agents
for insert with check (user_id = auth.uid() or public.is_gees_admin());

create policy "agents_update_owner_or_admin" on public.agents
for update using (user_id = auth.uid() or public.is_gees_admin())
with check (user_id = auth.uid() or public.is_gees_admin());

-- STAFF
create policy "staff_select_owner_or_admin" on public.staff_profiles
for select using (user_id = auth.uid() or public.is_gees_admin());

create policy "staff_manage_admin" on public.staff_profiles
for all using (public.is_gees_admin()) with check (public.is_gees_admin());

-- CATALOGUE
create policy "universities_read_authenticated" on public.universities
for select to authenticated using (status = 'active' or public.is_gees_admin());

create policy "universities_manage_admin" on public.universities
for all using (public.is_gees_admin()) with check (public.is_gees_admin());

create policy "courses_read_authenticated" on public.courses
for select to authenticated using (status = 'active' or public.is_gees_admin());

create policy "courses_manage_admin" on public.courses
for all using (public.is_gees_admin()) with check (public.is_gees_admin());

-- APPLICATIONS: simple launch policy, refine assigned agent/staff in Phase 10C
create policy "applications_select_related_or_admin" on public.applications
for select using (
  public.is_gees_admin()
  or exists (select 1 from public.students s where s.id = student_id and s.user_id = auth.uid())
  or exists (select 1 from public.agents a where a.id = agent_id and a.user_id = auth.uid())
  or exists (select 1 from public.staff_profiles sp where sp.id = staff_id and sp.user_id = auth.uid())
);

create policy "applications_insert_student_or_admin" on public.applications
for insert with check (
  public.is_gees_admin()
  or exists (select 1 from public.students s where s.id = student_id and s.user_id = auth.uid())
);

create policy "applications_update_staff_admin" on public.applications
for update using (public.is_gees_admin() or public.current_gees_role() = 'staff')
with check (public.is_gees_admin() or public.current_gees_role() = 'staff');

-- DOCUMENTS
create policy "documents_select_related_or_admin" on public.documents
for select using (
  public.is_gees_admin()
  or exists (select 1 from public.students s where s.id = student_id and s.user_id = auth.uid())
);

create policy "documents_insert_student_or_admin" on public.documents
for insert with check (
  public.is_gees_admin()
  or exists (select 1 from public.students s where s.id = student_id and s.user_id = auth.uid())
);

create policy "documents_update_reviewer_or_admin" on public.documents
for update using (public.is_gees_admin() or public.current_gees_role() = 'staff')
with check (public.is_gees_admin() or public.current_gees_role() = 'staff');

-- COMMISSIONS
create policy "commissions_select_agent_or_admin" on public.commissions
for select using (
  public.is_gees_admin()
  or exists (select 1 from public.agents a where a.id = agent_id and a.user_id = auth.uid())
);

create policy "commissions_manage_admin" on public.commissions
for all using (public.is_gees_admin()) with check (public.is_gees_admin());

-- NOTIFICATIONS
create policy "notifications_select_own" on public.notifications
for select using (recipient_id = auth.uid() or public.is_gees_admin());

create policy "notifications_update_own_read_state" on public.notifications
for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

create policy "notifications_insert_admin" on public.notifications
for insert with check (public.is_gees_admin());

-- APPROVALS AND AUDIT LOGS
create policy "approvals_admin_only" on public.approvals
for all using (public.is_gees_admin()) with check (public.is_gees_admin());

create policy "audit_logs_admin_read" on public.audit_logs
for select using (public.is_gees_admin());

create policy "audit_logs_admin_insert" on public.audit_logs
for insert with check (public.is_gees_admin());

-- PAYMENTS / AGREEMENTS / SUPPORT / CHAT are starter policies, refine during their implementation phase.
create policy "payments_admin_or_related_student" on public.payments
for select using (
  public.is_gees_admin()
  or exists (select 1 from public.students s where s.id = student_id and s.user_id = auth.uid())
);

create policy "payments_manage_admin" on public.payments
for all using (public.is_gees_admin()) with check (public.is_gees_admin());

create policy "agreements_related_or_admin" on public.agreements
for select using (related_user_id = auth.uid() or public.is_gees_admin());

create policy "agreements_manage_admin" on public.agreements
for all using (public.is_gees_admin()) with check (public.is_gees_admin());

create policy "support_tickets_owner_or_admin" on public.support_tickets
for select using (opened_by = auth.uid() or assigned_to = auth.uid() or public.is_gees_admin());

create policy "support_tickets_insert_owner" on public.support_tickets
for insert with check (opened_by = auth.uid());

create policy "chat_threads_participant_or_admin" on public.chat_threads
for select using (auth.uid() = any(participant_ids) or public.is_gees_admin());

create policy "chat_messages_thread_participant_or_admin" on public.chat_messages
for select using (
  public.is_gees_admin()
  or exists (select 1 from public.chat_threads t where t.id = thread_id and auth.uid() = any(t.participant_ids))
);

create policy "chat_messages_insert_participant" on public.chat_messages
for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from public.chat_threads t where t.id = thread_id and auth.uid() = any(t.participant_ids))
);
