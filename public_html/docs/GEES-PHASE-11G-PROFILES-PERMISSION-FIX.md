# GEES Phase 11G — Profiles Permission Fix

## Issue

Real Supabase login failed with:

`permission denied for table profiles`

## Root cause

RLS policies existed on `public.profiles`, but the base Postgres table privileges were missing for the `authenticated` role.

In Supabase, both are required:

1. Table privileges with `GRANT`.
2. RLS policies to restrict which rows users can access.

The project had the RLS policies, but `authenticated` did not have table-level `SELECT` on `profiles`.

## Fix applied directly to Supabase

The following table grants were applied:

- `authenticated` can `SELECT`, `INSERT`, `UPDATE` portal tables, controlled by RLS.
- `anon` and `authenticated` can `SELECT` public catalogue tables: `universities`, `courses`.
- Sequence usage granted for authenticated portal inserts.

## Verification

After the fix:

- `authenticated` has `SELECT` on `public.profiles`.
- `authenticated` has `UPDATE` on `public.profiles`.
- `authenticated` has `SELECT` on `public.students`.
- `authenticated` has `SELECT` on `public.applications`.
- `authenticated` has `SELECT` on `public.notifications`.
- `anon` has `SELECT` on `public.universities` and `public.courses`.

## SQL file added

`public_html/supabase/sql/phase11g_fix_authenticated_table_grants.sql`

This file is for record keeping and future re-run if needed. The fix has already been applied to the live Supabase project.

## Next test

Logout, hard refresh, then login again with the real Supabase account.
