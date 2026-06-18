-- GEES Phase 11G: Fix authenticated table privileges for Supabase portal
-- Problem fixed: real users could login but frontend received "permission denied for table profiles".
-- RLS policies were present, but table GRANT privileges were missing for authenticated users.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public catalogue read access
GRANT SELECT ON TABLE public.universities, public.courses TO anon, authenticated;

-- Authenticated portal tables. RLS policies still control row visibility.
GRANT SELECT, INSERT, UPDATE ON TABLE
  public.profiles,
  public.students,
  public.agents,
  public.staff_profiles,
  public.applications,
  public.documents,
  public.notifications,
  public.support_tickets
TO authenticated;

-- Admin/reporting support tables. RLS and RPC checks still control access.
GRANT SELECT, INSERT, UPDATE ON TABLE
  public.commissions,
  public.approvals,
  public.audit_logs
TO authenticated;

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

SELECT
  has_table_privilege('authenticated','public.profiles','select') AS profiles_select,
  has_table_privilege('authenticated','public.profiles','update') AS profiles_update,
  has_table_privilege('authenticated','public.students','select') AS students_select,
  has_table_privilege('authenticated','public.applications','select') AS applications_select,
  has_table_privilege('authenticated','public.notifications','select') AS notifications_select,
  has_table_privilege('anon','public.universities','select') AS anon_universities_select,
  has_table_privilege('anon','public.courses','select') AS anon_courses_select;
