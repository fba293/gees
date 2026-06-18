# GEES Phase 10E — Live Browser QA + First Admin Bootstrap Report

## Status

Phase 10E is prepared and the database-side hardening has been applied to the connected GEES Supabase project.

## Completed in Supabase

- GEES project checked: `spljrvlebfeljqrqkiee`.
- Existing profile list checked: no real GEES profile users found yet.
- Approval flow functions from Phase 10D are present.
- Phase 10E security hardening migration applied.
- Public/anonymous execution removed from sensitive GEES functions where possible.
- Approval RPC functions kept authenticated-only.
- RLS policy `WITH CHECK` clauses strengthened for:
  - `applications`
  - `documents`
  - `support_tickets`

## Why first admin bootstrap is manual

Admin and super-admin signup must not be public. The first admin account should be created manually and promoted through a controlled SQL step. This prevents random users from creating admin accounts through public signup forms.

## Required manual flow

1. Upload the latest Phase 10D files to your live site.
2. Create a normal user account in Supabase Auth or through a public signup page.
3. Copy that user's email.
4. Open Supabase SQL Editor.
5. Run `phase10e_first_admin_promote_by_email.sql` after replacing the placeholder email.
6. Login via `/portal/auth/admin-login.html`.
7. Confirm admin/super-admin dashboard access.

## Live QA not yet executed

Live browser QA requires your deployed domain and browser session. This package includes the QA checklist and role guard test matrix to run after upload.

## No-payment launch notes

- Supabase Storage remains skipped.
- Document upload should stay demo/coming-soon until storage is enabled later.
- Database/Auth/RLS can continue on the free setup.
