-- GEES performance hardening: foreign-key lookup indexes
-- Applied live on 2026-06-20. Safe to re-run.

create index if not exists idx_agents_approved_by_fk on public.agents (approved_by);

create index if not exists idx_agreements_user_fk on public.agreements (related_user_id);
create index if not exists idx_agreements_agent_fk on public.agreements (related_agent_id);
create index if not exists idx_agreements_signature_user on public.agreements (signed_by);

create index if not exists idx_app_status_hist_app_fk on public.application_status_history (application_id);
create index if not exists idx_app_status_hist_changed_by_fk on public.application_status_history (changed_by);

create index if not exists idx_applications_course_fk on public.applications (course_id);
create index if not exists idx_applications_university_fk on public.applications (university_id);

create index if not exists idx_approval_request_user on public.approvals (requested_by);
create index if not exists idx_approval_review_user on public.approvals (reviewed_by);

create index if not exists idx_chat_sender_user on public.chat_messages (sender_id);

create index if not exists idx_comm_agent_lookup on public.commissions (agent_id);
create index if not exists idx_comm_application_lookup on public.commissions (application_id);
create index if not exists idx_payout_student_ref on public.commissions (student_id);
create index if not exists idx_finance_approval_user on public.commissions (approved_by);

create index if not exists idx_courses_university_fk on public.courses (university_id);

create index if not exists idx_documents_review_user on public.documents (reviewed_by);
create index if not exists idx_documents_upload_user on public.documents (uploaded_by);

create index if not exists idx_gees_tasks_assigned_lookup on public.gees_tasks (assigned_to);
create index if not exists idx_gees_tasks_creator_lookup on public.gees_tasks (created_by);

create index if not exists idx_payments_application_lookup on public.payments (application_id);
create index if not exists idx_pmt_doc_ref on public.payments (receipt_document_id);
create index if not exists idx_payment_student_lookup on public.payments (student_id);

create index if not exists idx_role_permissions_permission_lookup on public.role_permissions (permission);
create index if not exists idx_staff_profiles_manager_lookup on public.staff_profiles (manager_id);
create index if not exists idx_ticket_owner_ref on public.support_tickets (assigned_to);
create index if not exists idx_uni_creator_ref on public.universities (created_by);
