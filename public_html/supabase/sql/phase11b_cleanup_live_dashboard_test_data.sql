-- GEES Phase 11B cleanup: remove only Phase 11B test records.
DELETE FROM public.audit_logs WHERE metadata->>'phase' = '11B';
DELETE FROM public.support_tickets WHERE subject LIKE '[GEES-11B]%';
DELETE FROM public.notifications WHERE title LIKE '[GEES-11B]%';
DELETE FROM public.commissions WHERE status LIKE 'phase11b_test%';
DELETE FROM public.documents WHERE file_name LIKE 'GEES-11B-%';
DELETE FROM public.application_status_history WHERE note LIKE '[GEES-11B]%';
DELETE FROM public.applications WHERE application_no LIKE 'GEES-11B-%';

SELECT 'phase11b_cleanup_complete' AS result;
