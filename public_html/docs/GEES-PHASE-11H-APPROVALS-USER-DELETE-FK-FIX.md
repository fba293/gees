# GEES Phase 11H — Approvals User Delete FK Fix

## Issue

Deleting a Supabase user/profile failed with:

`Unable to delete row as it is currently referenced by a foreign key constraint from the table approvals.`

The blocking constraint was:

`approvals_requested_by_fkey`

## Root cause

`public.approvals.requested_by` referenced `public.profiles(id)` with `ON DELETE NO ACTION`.

When a profile was deleted, approval records still pointed to that profile, so Postgres blocked the delete.

## Fix applied directly to Supabase

Changed these approval foreign keys:

- `approvals_requested_by_fkey` → `ON DELETE SET NULL`
- `approvals_reviewed_by_fkey` → `ON DELETE SET NULL`

This keeps approval history rows but removes the deleted profile reference.

## Verification

Both approval foreign keys now show:

`delete_rule = SET NULL`

## SQL file added

`public_html/supabase/sql/phase11h_fix_approvals_on_delete_profiles.sql`

The fix has already been applied live. The SQL file is for record keeping and future re-run if needed.

## Next test

Try deleting the same user again from Supabase Auth/Profiles.

If another table blocks deletion next, check the new foreign key name and apply the same decision carefully: `SET NULL` for optional history references, `CASCADE` only for child rows that should be removed with the user.
