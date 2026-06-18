-- GEES Phase 10D approval flow was applied through Supabase migrations.
-- This reference file lists the key RPC functions now expected by the frontend.

-- Load pending agent/staff approvals (admin/super_admin only):
-- select * from public.get_pending_gees_user_approvals();

-- Approve a pending agent/staff profile:
-- select public.approve_gees_user('PROFILE_UUID_HERE', 'Approved after document review');

-- Reject a pending agent/staff profile:
-- select public.reject_gees_user('PROFILE_UUID_HERE', 'Rejected because documents were incomplete');

-- Check approval records:
-- select approval_type, target_table, target_id, status, created_at, reviewed_at from public.approvals order by created_at desc;
