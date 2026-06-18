-- GEES Phase 11B validation query
SELECT role, status, count(*) AS profiles FROM public.profiles GROUP BY role, status ORDER BY role, status;

SELECT 'applications' AS table_name, count(*) AS phase11b_rows FROM public.applications WHERE application_no LIKE 'GEES-11B-%'
UNION ALL SELECT 'documents', count(*) FROM public.documents WHERE file_name LIKE 'GEES-11B-%'
UNION ALL SELECT 'commissions', count(*) FROM public.commissions WHERE status LIKE 'phase11b_test%'
UNION ALL SELECT 'notifications', count(*) FROM public.notifications WHERE title LIKE '[GEES-11B]%'
UNION ALL SELECT 'support_tickets', count(*) FROM public.support_tickets WHERE subject LIKE '[GEES-11B]%'
UNION ALL SELECT 'audit_logs', count(*) FROM public.audit_logs WHERE metadata->>'phase' = '11B';
