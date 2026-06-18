# GEES Phase 11 — Real Dashboard Data Connection

## Status

Phase 11 connects the main GEES portal dashboards and staff team dashboards to live Supabase tables while keeping demo accounts safe in demo/static mode.

## What changed

### New shared live-data adapter

- `public_html/portal/shared/js/portal-live-data.js`
- `public_html/portal/shared/css/portal-live-data.css`

The live adapter waits for the portal session, verifies that the user is a real Supabase session, then loads role-based counts and recent records from Supabase.

### Updated dashboards

- `public_html/portal/student/dashboard.html`
- `public_html/portal/agent/dashboard.html`
- `public_html/portal/staff/dashboard.html`
- `public_html/portal/staff/ekhlas/dashboard.html`
- `public_html/portal/staff/maanisha/dashboard.html`
- `public_html/portal/staff/rafshan/dashboard.html`
- `public_html/portal/staff/seo/dashboard.html`
- `public_html/portal/admin/dashboard.html`
- `public_html/portal/super-admin/dashboard.html`

## Role data mapping

| Role | Live tables used |
|---|---|
| Student | `applications`, `documents`, `notifications`, public catalogue counts |
| Agent | `students`, `applications`, `commissions`, `support_tickets`, public catalogue counts |
| Staff | `applications`, `documents`, `support_tickets`, `notifications`, public catalogue counts |
| Admin | `applications`, `profiles`, `audit_logs`, `get_pending_gees_user_approvals()` |
| Super Admin | `profiles`, `applications`, `audit_logs`, `get_pending_gees_user_approvals()`, public catalogue counts |

## Safety behavior

- Demo accounts remain in demo/static mode.
- Real Supabase users load live records filtered by RLS.
- Missing/empty tables show a clean empty state, not broken UI.
- Failed RLS checks show dashboard connection status instead of crashing.
- No Supabase service-role key is exposed.

## Required testing before Phase 12

1. Login as real student and check dashboard counts.
2. Login as real agent and check referred student/application counts.
3. Login as real staff and check assigned work counts on the correct team dashboard.
4. Login as real admin and check approvals/user/application counts.
5. Login as real super admin and check system-wide stats.
6. Login with demo accounts and confirm they stay in demo mode.

## Notes

Some counters may show `0` until real application, document, commission, notification, support-ticket, and audit-log records are created in Supabase.
