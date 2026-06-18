# GEES Phase 11J — Supabase CDN Path Rollback Fix

## Issue

Signup still showed:

`Supabase client is still loading or blocked by the browser/CDN.`

## Root cause

Phase 11I changed the Supabase CDN to an explicit UMD path. On the live setup, that path did not reliably expose `window.supabase`, so the GEES Supabase client could not be created.

The older working CDN path was:

`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`

## Fix

Changed files:

- `public_html/portal/shared/js/supabase-client.js`
- `public_html/portal/auth/student-signup.html`
- `public_html/portal/auth/agent-signup.html`
- `public_html/portal/auth/staff-signup.html`
- `public_html/docs/GEES-PHASE-11J-SUPABASE-CDN-PATH-ROLLBACK-FIX.md`

## What changed

- Restored the working Supabase CDN package URL.
- Kept the CDN fallback to unpkg.
- Updated cache-busting version to `11.4.0`.
- Kept the safe storage and wait-for-client logic.

## Test

After upload, open:

`/portal/shared/js/supabase-client.js?v=11.4.0`

Then hard refresh signup pages:

- `/portal/auth/student-signup.html`
- `/portal/auth/agent-signup.html`
- `/portal/auth/staff-signup.html`
