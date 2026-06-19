# GEES Phase 12D — Admin User Management Actions

## Scope

Phase 12D adds a real admin user management page connected to Supabase profiles.

## Changed files

- `public_html/portal/shared/js/gees-users.js`
- `public_html/portal/shared/js/portal-shell.js`
- `public_html/portal/admin/users.html`
- `public_html/docs/GEES-PHASE-12D-ADMIN-USER-MANAGEMENT-ACTIONS-REPORT.md`

## New page

`/portal/admin/users.html`

## Real actions added

- List live users from `public.profiles`.
- Show total user count.
- Show student count.
- Show agent count.
- Show staff count.
- Update user status:
  - pending
  - active
  - rejected
  - suspended
  - archived
- Assign user team:
  - staff
  - ekhlas
  - maanisha
  - rafshan
  - seo
- Allow super-admin to update role:
  - student
  - agent
  - staff
  - admin
  - super_admin

## Safety rule

Admins can update status and team. Role changes are shown only for real super-admin sessions.

## Navigation update

The portal sidebar now includes `Users` for both admin and super-admin.

## Test order

1. Login as real admin or super-admin.
2. Open `/portal/admin/users.html`.
3. Change one non-critical user status to suspended.
4. Save the row.
5. Change it back to active.
6. Login as super-admin and verify the role dropdown is visible.
7. Login as normal admin and verify the role dropdown is not visible.

## Next phase

Phase 12E should add detailed user profile drill-down and audit logging for admin user changes.
