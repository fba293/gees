# GEES Phase 10F — Auth Settings UX + Approval Diagnostics Fix

## Purpose

Phase 10F improves live testing before Phase 11 by replacing confusing raw Supabase Auth errors with clear GEES instructions and adding diagnostics to the admin approval page.

## Problems fixed

- `email rate limit exceeded`
- `Signups not allowed for this instance`
- Demo admin trying to view live Supabase approvals
- Agent/staff approval request exists in Supabase but does not show because no real admin/super_admin session is active
- Admin signup confusion

## Files changed

- `public_html/portal/shared/js/auth-page.js`
- `public_html/portal/shared/js/admin-approval-flow.js`
- `public_html/portal/shared/css/phase10f-diagnostics.css`
- `public_html/portal/admin/approvals.html`
- `public_html/portal/super-admin/approvals.html`
- `public_html/portal/auth/admin-signup.html`
- `public_html/admin-signup.html`
- `public_html/docs/GEES-PHASE-10F-AUTH-UX-APPROVAL-DIAGNOSTICS-REPORT.md`
- `public_html/docs/GEES-PHASE-10F-LIVE-TESTING-FIX-CHECKLIST.csv`

## Correct Supabase testing settings

In Supabase Dashboard:

1. Authentication → Providers → Email Provider: ON
2. Allow new users to sign up: ON
3. Confirm email: OFF for development testing only
4. Turn Confirm email back ON for production after custom SMTP is configured

## Correct approval testing flow

1. Create one real normal user.
2. Run first-admin bootstrap SQL for that user email.
3. Login through `/portal/auth/admin-login.html` with the real account.
4. Open `/portal/admin/approvals.html`.
5. Pending agent/staff requests should appear.

Demo admin credentials can open demo pages, but cannot read live Supabase approvals.
