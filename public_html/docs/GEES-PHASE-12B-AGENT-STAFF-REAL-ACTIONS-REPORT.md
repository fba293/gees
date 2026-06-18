# GEES Phase 12B — Agent + Staff Real Actions

## Scope

Phase 12B connects real Supabase actions for agent, staff, and admin assignment workflows.

## Database/RLS update applied

A new RLS policy was added to `public.profiles`:

`gees_profiles_select_assigned_students`

This allows an assigned agent or staff user to read the basic profile row of students assigned to them. Without this policy, the assigned student list could show student IDs but not names/emails.

SQL file added:

`public_html/supabase/sql/phase12b_profiles_assigned_student_visibility.sql`

## Changed files

- `public_html/portal/shared/js/portal-crud-12b.js`
- `public_html/portal/admin/students.html`
- `public_html/portal/agent/students.html`
- `public_html/portal/staff/dashboard.html`
- `public_html/supabase/sql/phase12b_profiles_assigned_student_visibility.sql`
- `public_html/docs/GEES-PHASE-12B-AGENT-STAFF-REAL-ACTIONS-REPORT.md`

## Admin real actions

Page:

`/portal/admin/students.html`

Actions:

- List live Supabase students.
- List available agents.
- List available staff profiles.
- Assign a student to an agent.
- Assign a student to a staff member.
- Sync assignment to all current applications for that student.

## Agent real actions

Page:

`/portal/agent/students.html`

Actions:

- Show only students assigned to the logged-in agent.
- Create a referral request as a real `support_tickets` row.

## Staff real actions

Page:

`/portal/staff/dashboard.html`

Actions:

- Show applications assigned to the logged-in staff profile.
- Update application status directly in Supabase.

Supported statuses:

- under review
- documents required
- offer received
- visa processing
- approved
- rejected

## Demo behavior

Demo accounts stay in safe UI mode. Real actions require real Supabase users.

## Test order

1. Login as a real admin/super_admin.
2. Open `/portal/admin/students.html`.
3. Assign a student to a real agent and real staff profile.
4. Login as that real agent.
5. Open `/portal/agent/students.html` and confirm the assigned student appears.
6. Login as that real staff account.
7. Open `/portal/staff/dashboard.html` and update an assigned application status.

## Next phase

Phase 12C should connect admin catalogue CRUD:

- Universities create/edit
- Courses create/edit
- Application management table for admin
- User management actions
