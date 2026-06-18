# GEES Phase 10C — Supabase Auth Connection + Demo Fallback

## Status
Completed safely. This phase updated the portal frontend package only. No new Supabase migrations were applied in this phase.

## Connected Supabase Project
- Project name: GEES
- Project ref: `spljrvlebfeljqrqkiee`
- Client connection file: `/portal/shared/js/supabase-client.js`
- Key type used in frontend: Supabase publishable key
- Service role key: **not included**

## What Changed

### New shared files
- `/portal/shared/js/supabase-client.js`
- `/portal/shared/js/auth-service.js`
- `/portal/shared/js/auth-page.js`

### Updated shared files
- `/portal/shared/js/role-guard.js`
- `/portal/shared/js/portal-shell.js`
- `/portal/shared/css/portal.css`

### Updated auth pages
- `/portal/auth/student-login.html`
- `/portal/auth/agent-login.html`
- `/portal/auth/staff-login.html`
- `/portal/auth/admin-login.html`
- `/portal/auth/student-signup.html`
- `/portal/auth/agent-signup.html`
- `/portal/auth/staff-signup.html`

### Root auth redirects
- `/student-login.html` → `/portal/auth/student-login.html`
- `/agent-login.html` → `/portal/auth/agent-login.html`
- `/staff-login.html` → `/portal/auth/staff-login.html`
- `/admin-login.html` → `/portal/auth/admin-login.html`
- `/student-signup.html` → `/portal/auth/student-signup.html`
- `/agent-signup.html` → `/portal/auth/agent-signup.html`
- `/staff-signup.html` → `/portal/auth/staff-signup.html`

## Login Flow
1. User submits login form.
2. If email ends with `@gees.demo`, the system uses the existing demo fallback.
3. Otherwise, the system tries Supabase Auth login.
4. After successful Supabase login, it reads the `profiles` table.
5. It validates expected portal role.
6. It blocks non-active accounts.
7. It saves a safe frontend portal session.
8. It redirects to the correct dashboard.

## Signup Flow
- Student signup creates a Supabase Auth user with `role=student` metadata.
- Agent signup creates a Supabase Auth user with `role=agent` metadata and pending approval.
- Staff signup creates a Supabase Auth user with `role=staff` metadata and pending approval.
- Admin and Super Admin signup is blocked from public pages.

## Role Redirects
- Student → `/portal/student/dashboard.html`
- Agent → `/portal/agent/dashboard.html`
- Staff → `/portal/staff/dashboard.html` or team dashboard
- Admin → `/portal/admin/dashboard.html`
- Super Admin → `/portal/super-admin/dashboard.html`

## Demo Fallback Kept
The previous demo accounts still work:
- `student@gees.demo` / `Student@123`
- `agent@gees.demo` / `Agent@123`
- `staff@gees.demo` / `Staff@123`
- `admin@gees.demo` / `Admin@123`
- `super@gees.demo` / `Super@123`

## No-Payment Launch Notes
- Supabase Storage is still skipped.
- Document upload can remain demo/coming soon until storage is enabled.
- The frontend uses Supabase Auth and Postgres only.

## Important Manual Check
Supabase Auth email confirmation settings may affect login after signup. If confirmation is enabled, users must confirm their email before login.
