-- GEES Supabase migration
-- Date: 2026-06-20
-- Purpose: harden authenticated lead inserts so public.leads no longer uses WITH CHECK (true).

DROP POLICY IF EXISTS gees_leads_authenticated_insert ON public.leads;

CREATE POLICY gees_leads_authenticated_insert
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  full_name IS NOT NULL
  AND length(trim(both FROM full_name)) >= 2
  AND length(trim(both FROM full_name)) <= 160
  AND coalesce(length(trim(both FROM email)), 0) <= 220
  AND coalesce(length(trim(both FROM phone)), 0) <= 80
  AND coalesce(length(trim(both FROM preferred_country)), 0) <= 120
  AND coalesce(length(trim(both FROM message)), 0) <= 3000
  AND coalesce(length(trim(both FROM source)), 0) <= 120
);
