# GEES Phase 11E — Approvals Diagnostics + SQL Path Fix

## Issues reported

1. `/public_html/supabase/sql/phase10e_first_admin_promote_by_email.sql` showed 404.
2. Demo admin approvals page showed missing diagnostics.
3. Pending approvals tried to call the live approval RPC from a demo session.

## SQL URL note

On live hosting, `public_html` is the web root. It should not be part of the public URL.

Correct public path after deployment:

`/supabase/sql/phase10e_first_admin_promote_by_email.sql`

Recommended safer method:

Open the SQL file from GitHub or ZIP, copy it, replace the email, and run it in Supabase SQL Editor.

## Approval RPC note

The approval RPC is available to authenticated users, but not anonymous demo sessions. That is correct.

The frontend issue was that demo admin was still trying to call the live approval RPC. Demo admin should only show diagnostics, not call live approval functions.

## Fixes applied

Changed files:

- `public_html/portal/shared/js/admin-approval-flow.js`
- `public_html/portal/admin/approvals.html`
- `public_html/portal/super-admin/approvals.html`
- `public_html/docs/GEES-PHASE-11E-APPROVALS-DIAGNOSTICS-PATH-FIX.md`

## Expected behavior

- Demo admin can open approvals page.
- Demo admin sees diagnostics only.
- Real Supabase admin/super_admin can load pending approvals.
- Approve/reject buttons only work for real Supabase admin/super_admin sessions.

## Required deployment step

After uploading/pulling latest files, hard refresh with `Ctrl + Shift + R`, then test `/portal/admin/approvals.html`.
