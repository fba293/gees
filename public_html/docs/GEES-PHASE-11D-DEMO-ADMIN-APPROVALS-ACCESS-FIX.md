# GEES Phase 11D — Demo Admin Approvals Access Fix

## Issue

After demo admin login, clicking the approvals page redirected to:

`/portal/forbidden.html?from=/portal/admin/approvals.html&role=admin`

The page required `manage_approvals`, but the demo admin session did not expose that Supabase-style permission key.

## Fix

Changed:

- `public_html/portal/shared/js/role-guard.js`

The role guard now includes safe demo permission aliases for admin demo sessions:

- `manage_approvals`
- `view_reports`
- `view_audit_logs`
- `manage_users`

## Expected behavior

- Demo admin can open `/portal/admin/approvals.html`.
- Demo admin still cannot read live Supabase approval rows; the approvals page diagnostics will explain that a real Supabase admin/super_admin is required for live approvals.
- Real admin/super_admin access remains unchanged.

## Test

1. Login with demo admin.
2. Open `/portal/admin/approvals.html`.
3. Page should open and show diagnostics instead of redirecting to forbidden.
