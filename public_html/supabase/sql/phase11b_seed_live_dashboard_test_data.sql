-- GEES Phase 11B: Safe live dashboard test data seed
-- Run this in Supabase SQL Editor AFTER creating/promoting real test accounts.
-- It only uses existing auth-linked profiles; it does not create Auth users.

DO $$
DECLARE
  v_student_profile uuid;
  v_agent_profile uuid;
  v_staff_profile uuid;
  v_admin_profile uuid;
  v_student_id uuid;
  v_agent_id uuid;
  v_staff_id uuid;
  v_university_id uuid;
  v_course_id uuid;
  v_app1 uuid;
  v_app2 uuid;
BEGIN
  SELECT id INTO v_student_profile FROM public.profiles WHERE role = 'student' AND status = 'active' ORDER BY created_at LIMIT 1;
  SELECT id INTO v_agent_profile FROM public.profiles WHERE role = 'agent' AND status = 'active' ORDER BY created_at LIMIT 1;
  SELECT id INTO v_staff_profile FROM public.profiles WHERE role = 'staff' AND status = 'active' ORDER BY created_at LIMIT 1;
  SELECT id INTO v_admin_profile FROM public.profiles WHERE role IN ('admin','super_admin') AND status = 'active' ORDER BY role DESC, created_at LIMIT 1;
  SELECT id INTO v_university_id FROM public.universities WHERE status = 'active' ORDER BY created_at LIMIT 1;
  SELECT id INTO v_course_id FROM public.courses WHERE status = 'active' AND (university_id = v_university_id OR v_university_id IS NULL) ORDER BY created_at LIMIT 1;

  DELETE FROM public.audit_logs WHERE metadata->>'phase' = '11B';
  DELETE FROM public.support_tickets WHERE subject LIKE '[GEES-11B]%';
  DELETE FROM public.notifications WHERE title LIKE '[GEES-11B]%';
  DELETE FROM public.commissions WHERE status LIKE 'phase11b_test%';
  DELETE FROM public.documents WHERE file_name LIKE 'GEES-11B-%';
  DELETE FROM public.application_status_history WHERE note LIKE '[GEES-11B]%';
  DELETE FROM public.applications WHERE application_no LIKE 'GEES-11B-%';

  IF v_agent_profile IS NOT NULL THEN
    INSERT INTO public.agents (user_id, agency_name, company_type, country, city, approval_status, approved_by, approved_at, notes)
    VALUES (v_agent_profile, 'GEES Phase 11B Test Agency', 'Education Partner', 'Bangladesh', 'Dhaka', 'approved', v_admin_profile, now(), 'Phase 11B live dashboard test agent')
    ON CONFLICT (user_id) DO UPDATE SET approval_status='approved', approved_by=COALESCE(public.agents.approved_by, v_admin_profile), approved_at=COALESCE(public.agents.approved_at, now()), notes='Phase 11B live dashboard test agent', updated_at=now();
    SELECT id INTO v_agent_id FROM public.agents WHERE user_id = v_agent_profile;
  END IF;

  IF v_staff_profile IS NOT NULL THEN
    INSERT INTO public.staff_profiles (user_id, team_id, title, department, manager_id)
    VALUES (v_staff_profile, COALESCE((SELECT team_id FROM public.profiles WHERE id = v_staff_profile), 'staff'), 'Phase 11B Test Staff', 'Admissions', v_admin_profile)
    ON CONFLICT (user_id) DO UPDATE SET title='Phase 11B Test Staff', department='Admissions', manager_id=COALESCE(public.staff_profiles.manager_id, v_admin_profile), updated_at=now();
    SELECT id INTO v_staff_id FROM public.staff_profiles WHERE user_id = v_staff_profile;
  END IF;

  IF v_student_profile IS NOT NULL THEN
    INSERT INTO public.students (user_id, preferred_country, preferred_level, preferred_intake, assigned_agent_id, assigned_staff_id, lead_source, notes)
    VALUES (v_student_profile, 'Malaysia', 'Bachelor', 'September', v_agent_id, v_staff_id, 'Phase 11B Test Seed', 'Phase 11B live dashboard test student')
    ON CONFLICT (user_id) DO UPDATE SET preferred_country='Malaysia', preferred_level='Bachelor', preferred_intake='September', assigned_agent_id=COALESCE(v_agent_id, public.students.assigned_agent_id), assigned_staff_id=COALESCE(v_staff_id, public.students.assigned_staff_id), lead_source='Phase 11B Test Seed', notes='Phase 11B live dashboard test student', updated_at=now();
    SELECT id INTO v_student_id FROM public.students WHERE user_id = v_student_profile;
  END IF;

  IF v_student_id IS NOT NULL THEN
    INSERT INTO public.applications (student_id, agent_id, staff_id, university_id, course_id, status, intake, application_no, submitted_at)
    VALUES
      (v_student_id, v_agent_id, v_staff_id, v_university_id, v_course_id, 'submitted', 'September 2026', 'GEES-11B-APP-001', now() - interval '4 days'),
      (v_student_id, v_agent_id, v_staff_id, v_university_id, v_course_id, 'under_review', 'January 2027', 'GEES-11B-APP-002', now() - interval '2 days')
    ON CONFLICT (application_no) DO UPDATE SET status=EXCLUDED.status, agent_id=EXCLUDED.agent_id, staff_id=EXCLUDED.staff_id, university_id=EXCLUDED.university_id, course_id=EXCLUDED.course_id, intake=EXCLUDED.intake, updated_at=now();

    SELECT id INTO v_app1 FROM public.applications WHERE application_no = 'GEES-11B-APP-001';
    SELECT id INTO v_app2 FROM public.applications WHERE application_no = 'GEES-11B-APP-002';

    INSERT INTO public.application_status_history (application_id, old_status, new_status, note, changed_by)
    VALUES
      (v_app1, NULL, 'submitted', '[GEES-11B] Test application submitted', v_admin_profile),
      (v_app2, 'submitted', 'under_review', '[GEES-11B] Test application moved to review', v_admin_profile);

    INSERT INTO public.documents (student_id, application_id, document_type, file_name, storage_bucket, storage_path, mime_type, size_bytes, status, uploaded_by, reviewed_by, reviewed_at)
    VALUES
      (v_student_id, v_app1, 'passport', 'GEES-11B-passport.pdf', 'demo-no-storage', 'phase11b/passport.pdf', 'application/pdf', 245760, 'uploaded', v_student_profile, NULL, NULL),
      (v_student_id, v_app1, 'transcript', 'GEES-11B-transcript.pdf', 'demo-no-storage', 'phase11b/transcript.pdf', 'application/pdf', 384000, 'under_review', v_student_profile, v_staff_profile, now() - interval '1 day'),
      (v_student_id, v_app2, 'finance-proof', 'GEES-11B-finance-proof.pdf', 'demo-no-storage', 'phase11b/finance-proof.pdf', 'application/pdf', 512000, 'approved', v_student_profile, v_staff_profile, now());

    IF v_agent_id IS NOT NULL THEN
      INSERT INTO public.commissions (agent_id, student_id, application_id, amount, currency, status, due_at)
      VALUES (v_agent_id, v_student_id, v_app1, 1200, 'MYR', 'phase11b_test_pending', current_date + 14),
             (v_agent_id, v_student_id, v_app2, 950, 'MYR', 'phase11b_test_processing', current_date + 30);
    END IF;
  END IF;

  IF v_student_profile IS NOT NULL THEN
    INSERT INTO public.notifications (recipient_id, title, body, link_url, is_read)
    VALUES (v_student_profile, '[GEES-11B] Application updated', 'Your Phase 11B test application is ready for dashboard validation.', '/portal/student/dashboard.html', false);
  END IF;
  IF v_agent_profile IS NOT NULL THEN
    INSERT INTO public.notifications (recipient_id, title, body, link_url, is_read)
    VALUES (v_agent_profile, '[GEES-11B] Referred student activity', 'Phase 11B test records are ready for agent dashboard validation.', '/portal/agent/dashboard.html', false);
  END IF;
  IF v_staff_profile IS NOT NULL THEN
    INSERT INTO public.notifications (recipient_id, title, body, link_url, is_read)
    VALUES (v_staff_profile, '[GEES-11B] Staff work assigned', 'Phase 11B test records are ready for staff dashboard validation.', '/portal/staff/dashboard.html', false);
  END IF;

  IF COALESCE(v_student_profile, v_agent_profile, v_staff_profile, v_admin_profile) IS NOT NULL THEN
    INSERT INTO public.support_tickets (opened_by, assigned_to, subject, status, priority)
    VALUES (COALESCE(v_student_profile, v_agent_profile, v_staff_profile, v_admin_profile), v_staff_profile, '[GEES-11B] Live dashboard validation ticket', 'open', 'high');
  END IF;

  INSERT INTO public.audit_logs (actor_id, action, entity_table, entity_id, metadata)
  VALUES (v_admin_profile, 'phase11b.seed_live_dashboard_test_data', 'applications', v_app1, jsonb_build_object('phase','11B','student_profile',v_student_profile,'agent_profile',v_agent_profile,'staff_profile',v_staff_profile));

  RAISE NOTICE 'GEES Phase 11B seed completed. student_profile=%, agent_profile=%, staff_profile=%, admin_profile=%', v_student_profile, v_agent_profile, v_staff_profile, v_admin_profile;
END $$;

SELECT 'applications' AS table_name, count(*) AS phase11b_rows FROM public.applications WHERE application_no LIKE 'GEES-11B-%'
UNION ALL SELECT 'documents', count(*) FROM public.documents WHERE file_name LIKE 'GEES-11B-%'
UNION ALL SELECT 'commissions', count(*) FROM public.commissions WHERE status LIKE 'phase11b_test%'
UNION ALL SELECT 'notifications', count(*) FROM public.notifications WHERE title LIKE '[GEES-11B]%'
UNION ALL SELECT 'support_tickets', count(*) FROM public.support_tickets WHERE subject LIKE '[GEES-11B]%'
UNION ALL SELECT 'audit_logs', count(*) FROM public.audit_logs WHERE metadata->>'phase' = '11B';
