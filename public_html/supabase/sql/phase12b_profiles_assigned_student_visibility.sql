-- GEES Phase 12B: Allow assigned agent/staff to read assigned student profile basics
-- Needed for real agent/student and staff/application tables to show student names/emails under RLS.

DROP POLICY IF EXISTS gees_profiles_select_assigned_students ON public.profiles;

CREATE POLICY gees_profiles_select_assigned_students
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.agents a ON a.id = s.assigned_agent_id
    WHERE s.user_id = profiles.id
      AND a.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.staff_profiles sp ON sp.id = s.assigned_staff_id
    WHERE s.user_id = profiles.id
      AND sp.user_id = auth.uid()
  )
);

SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND policyname = 'gees_profiles_select_assigned_students';
