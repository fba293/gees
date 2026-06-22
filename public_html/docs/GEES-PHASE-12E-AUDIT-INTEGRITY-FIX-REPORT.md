# GEES Phase 12E — Audit Integrity and Profile Drill-Down Fix

## Scope
This batch repairs the Phase 12E portal contract against the live `public.audit_logs` schema. It does not change public marketing routes, portal authentication, role guards, or existing user records.

## Fixed
- Audit UI now reads `entity_table`, the actual live column, rather than the non-existent `entity_type` field.
- Admin user drill-down now shows audit events where the user is either the target record or the actor.
- User management now provides a direct, URL-safe **View** action for each profile.
- The Admin and Super Admin menus now point to the existing shared audit-log page.
- Added two safe audit-lookup indexes through `backend/supabase/migrations/20260622_phase12e_audit_lookup_indexes.sql`.

## Validation
- JavaScript syntax checks pass for changed JavaScript files.
- Existing noindex metadata is retained on all affected portal pages.
- No service-role key, credential, user record, private document, RLS policy, or auth workflow was changed.

## Supabase note
The live `audit_logs` table already has RLS enabled. The indexes improve the profile drill-down query pattern without changing data or access policies.
