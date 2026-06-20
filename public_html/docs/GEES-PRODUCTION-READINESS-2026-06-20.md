# GEES Production Readiness Snapshot

Date: 2026-06-20

## Completed and applied

- Real Supabase Auth replaces the previous local demo auth flow.
- Portal guards read real Supabase session/profile data.
- Public lead forms can insert real `leads` records.
- Portal dashboards use real Supabase counts and zero states.
- Private `gees-student-documents` Storage bucket is configured for PDF, PNG, JPEG, and WEBP uploads up to 10 MB.
- Document metadata is written to `public.documents` after an upload.
- Application status workflow, staff work items, commissions, and admin reports use controlled RPC functions.
- Sensitive new workflow RPCs are no longer anonymously executable.
- Foreign-key lookup indexes were applied; the migration is stored at `supabase/sql/20260620_add_fk_lookup_indexes.sql`.
- Targeted repository scans found no remaining obvious demo credential/action strings.

## Current real-data baseline

- Profiles: 9
- Students: 5
- Agents: 3
- Applications: 0
- Documents: 0
- Leads: 0
- Tasks: 0

## Remaining manual live QA

1. Sign in as a real student, agent, staff member, and admin.
2. Submit one public contact form and verify a `leads` record.
3. Upload one student document and verify both Storage and `documents` metadata.
4. Submit one application and update its status from staff/admin.
5. Create and update one staff work item.
6. Exercise an agent commission from creation to paid status.
7. Open Admin Reports after data exists.
8. Enable leaked-password protection in Supabase Auth settings.

## Intentional review items

- Some authenticated `SECURITY DEFINER` functions remain exposed because they power role checks, approvals, and controlled workflows. They perform internal role checks. Do not revoke them without role-based browser tests.
- Performance advisor still reports RLS evaluation and overlapping-policy opportunities. These are optimizations, not anonymous-access issues. Update only after role-based tests confirm equivalent behavior.
