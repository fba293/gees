-- GEES core RLS performance optimization
-- Applied live on 2026-06-20.
-- Each rule preserves the original access condition while caching auth.uid()
-- once per query via (select auth.uid()).

alter policy gees_profiles_select on public.profiles
  using ((id = (select auth.uid())) or is_gees_admin());
alter policy gees_profiles_update on public.profiles
  using ((id = (select auth.uid())) or is_gees_admin())
  with check ((id = (select auth.uid())) or is_gees_admin());
alter policy gees_profiles_select_assigned_students on public.profiles
  using (
    exists (select 1 from students s join agents a on a.id = s.assigned_agent_id where s.user_id = profiles.id and a.user_id = (select auth.uid()))
    or exists (select 1 from students s join staff_profiles sp on sp.id = s.assigned_staff_id where s.user_id = profiles.id and sp.user_id = (select auth.uid()))
  );

alter policy gees_students_insert on public.students
  with check ((user_id = (select auth.uid())) or is_gees_admin());
alter policy gees_students_select on public.students
  using (
    user_id = (select auth.uid()) or is_gees_admin()
    or exists (select 1 from agents a where a.id = students.assigned_agent_id and a.user_id = (select auth.uid()))
    or exists (select 1 from staff_profiles sp where sp.id = students.assigned_staff_id and sp.user_id = (select auth.uid()))
  );
alter policy gees_students_update on public.students
  using (
    user_id = (select auth.uid()) or is_gees_admin()
    or exists (select 1 from agents a where a.id = students.assigned_agent_id and a.user_id = (select auth.uid()))
    or exists (select 1 from staff_profiles sp where sp.id = students.assigned_staff_id and sp.user_id = (select auth.uid()))
  )
  with check (
    user_id = (select auth.uid()) or is_gees_admin()
    or exists (select 1 from agents a where a.id = students.assigned_agent_id and a.user_id = (select auth.uid()))
    or exists (select 1 from staff_profiles sp where sp.id = students.assigned_staff_id and sp.user_id = (select auth.uid()))
  );

alter policy gees_agents_insert on public.agents
  with check ((user_id = (select auth.uid())) or is_gees_admin());
alter policy gees_agents_select on public.agents
  using ((user_id = (select auth.uid())) or is_gees_admin());
alter policy gees_agents_update on public.agents
  using ((user_id = (select auth.uid())) or is_gees_admin())
  with check ((user_id = (select auth.uid())) or is_gees_admin());

alter policy gees_applications_insert on public.applications
  with check (is_gees_admin() or exists (select 1 from students s where s.id = applications.student_id and s.user_id = (select auth.uid())));
alter policy gees_applications_select on public.applications
  using (
    is_gees_admin()
    or exists (select 1 from students s where s.id = applications.student_id and s.user_id = (select auth.uid()))
    or exists (select 1 from agents a where a.id = applications.agent_id and a.user_id = (select auth.uid()))
    or exists (select 1 from staff_profiles sp where sp.id = applications.staff_id and sp.user_id = (select auth.uid()))
  );
alter policy gees_applications_update on public.applications
  using (
    is_gees_admin()
    or exists (select 1 from students s where s.id = applications.student_id and s.user_id = (select auth.uid()))
    or exists (select 1 from agents a where a.id = applications.agent_id and a.user_id = (select auth.uid()))
    or exists (select 1 from staff_profiles sp where sp.id = applications.staff_id and sp.user_id = (select auth.uid()))
  )
  with check (
    is_gees_admin()
    or exists (select 1 from students s where s.id = applications.student_id and s.user_id = (select auth.uid()))
    or exists (select 1 from agents a where a.id = applications.agent_id and a.user_id = (select auth.uid()))
    or exists (select 1 from staff_profiles sp where sp.id = applications.staff_id and sp.user_id = (select auth.uid()))
  );

alter policy gees_documents_insert on public.documents
  with check (is_gees_admin() or uploaded_by = (select auth.uid()) or exists (select 1 from students s where s.id = documents.student_id and s.user_id = (select auth.uid())));
alter policy gees_documents_select on public.documents
  using (is_gees_admin() or uploaded_by = (select auth.uid()) or exists (select 1 from students s where s.id = documents.student_id and s.user_id = (select auth.uid())));
alter policy gees_documents_update on public.documents
  using (is_gees_admin() or uploaded_by = (select auth.uid()) or has_gees_permission('manage_assigned_applications'::text))
  with check (is_gees_admin() or uploaded_by = (select auth.uid()) or has_gees_permission('manage_assigned_applications'::text));

alter policy gees_tasks_select_assigned_or_admin on public.gees_tasks
  using (is_gees_admin() or assigned_to = (select auth.uid()) or created_by = (select auth.uid()));
alter policy gees_tasks_insert_self_or_admin on public.gees_tasks
  with check (is_gees_admin() or assigned_to = (select auth.uid()) or created_by = (select auth.uid()));
alter policy gees_tasks_update_assigned_creator_or_admin on public.gees_tasks
  using (is_gees_admin() or assigned_to = (select auth.uid()) or created_by = (select auth.uid()))
  with check (is_gees_admin() or assigned_to = (select auth.uid()) or created_by = (select auth.uid()));

alter policy gees_commissions_select on public.commissions
  using (is_gees_admin() or exists (select 1 from agents a where a.id = commissions.agent_id and a.user_id = (select auth.uid())));

alter policy gees_support_tickets_select on public.support_tickets
  using (opened_by = (select auth.uid()) or assigned_to = (select auth.uid()) or is_gees_admin());
alter policy gees_support_tickets_insert on public.support_tickets
  with check (opened_by = (select auth.uid()) or is_gees_admin());
alter policy gees_support_tickets_update on public.support_tickets
  using (opened_by = (select auth.uid()) or assigned_to = (select auth.uid()) or is_gees_admin())
  with check (opened_by = (select auth.uid()) or assigned_to = (select auth.uid()) or is_gees_admin());
