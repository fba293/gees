-- GEES Phase 11H: Fix user delete blocked by approvals foreign keys
-- Problem: Supabase user/profile deletion failed because approvals.requested_by referenced public.profiles(id).
-- Fix: keep the approval record, but set requested_by/reviewed_by to NULL when the referenced profile is deleted.

ALTER TABLE public.approvals
  DROP CONSTRAINT IF EXISTS approvals_requested_by_fkey;

ALTER TABLE public.approvals
  ADD CONSTRAINT approvals_requested_by_fkey
  FOREIGN KEY (requested_by)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

ALTER TABLE public.approvals
  DROP CONSTRAINT IF EXISTS approvals_reviewed_by_fkey;

ALTER TABLE public.approvals
  ADD CONSTRAINT approvals_reviewed_by_fkey
  FOREIGN KEY (reviewed_by)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = tc.constraint_name
  AND rc.constraint_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = 'approvals'
  AND tc.constraint_name IN ('approvals_requested_by_fkey','approvals_reviewed_by_fkey')
ORDER BY tc.constraint_name;
