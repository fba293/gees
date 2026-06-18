# GEES Phase 11B — Real Test Data + Dashboard Validation

## Status

Phase 11B adds safe test-data SQL, dashboard validation SQL, cleanup SQL, and a live dashboard adapter fix.

## What changed

### Updated live dashboard adapter

- `public_html/portal/shared/js/portal-live-data.js`

Fixes included:

- Updated version to `11.1.0`.
- Fixed notification unread count to use `is_read = false` instead of the non-existing `read_at` column.
- Fixed application list queries to use valid columns only: `id`, `status`, `created_at`, `updated_at`, `intake`, `application_no`.
- Added clearer empty-state wording for Phase 11B seed data.

### New Supabase SQL files

- `public_html/supabase/sql/phase11b_seed_live_dashboard_test_data.sql`
- `public_html/supabase/sql/phase11b_validate_live_dashboard_test_data.sql`
- `public_html/supabase/sql/phase11b_cleanup_live_dashboard_test_data.sql`

## Important testing order

Run the seed SQL only after you have created real accounts:

1. Real student account with active profile.
2. Real agent account approved by admin.
3. Real staff account approved by admin.
4. Real admin or super_admin account.

The SQL does not create Auth users. It only attaches test records to existing real profiles.

## Pages to validate

- `/portal/student/dashboard.html`
- `/portal/agent/dashboard.html`
- `/portal/staff/dashboard.html`
- `/portal/staff/ekhlas/dashboard.html`
- `/portal/staff/maanisha/dashboard.html`
- `/portal/staff/rafshan/dashboard.html`
- `/portal/staff/seo/dashboard.html`
- `/portal/admin/dashboard.html`
- `/portal/super-admin/dashboard.html`

## Cleanup

Run `phase11b_cleanup_live_dashboard_test_data.sql` to remove Phase 11B test records only.
