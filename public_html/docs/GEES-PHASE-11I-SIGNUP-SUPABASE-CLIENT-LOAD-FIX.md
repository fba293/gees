# GEES Phase 11I — Signup Supabase Client Load Fix

## Issue

Student, agent, and staff signup showed:

`Supabase client is unavailable. Signup is temporarily in demo/setup mode.`

## Root cause

The signup pages were still loading older auth scripts and depended on the Supabase CDN being ready before `supabase-client.js` executed. If the CDN was slow, cached, blocked, or the old script was still loaded, `window.GEESSupabase` stayed empty and signup failed.

## Fix

Changed files:

- `public_html/portal/shared/js/supabase-client.js`
- `public_html/portal/shared/js/supabase-ready-bridge.js`
- `public_html/portal/auth/student-signup.html`
- `public_html/portal/auth/agent-signup.html`
- `public_html/portal/auth/staff-signup.html`
- `public_html/docs/GEES-PHASE-11I-SIGNUP-SUPABASE-CLIENT-LOAD-FIX.md`

## What changed

- Updated signup pages to version `11.3.0` for cache busting.
- Switched the Supabase CDN URL to the explicit UMD build.
- Added an `unpkg` CDN fallback if jsDelivr fails.
- Added `supabase-ready-bridge.js` so signup waits for the Supabase client before submitting.
- Updated `supabase-client.js` to dynamically load the Supabase library if it was not ready.

## Test

After deployment, open:

- `/portal/auth/student-signup.html`
- `/portal/auth/agent-signup.html`
- `/portal/auth/staff-signup.html`

Then hard refresh and test again.

## Important

This fix solves the missing Supabase client problem. Supabase Auth settings must still allow signup:

- Email provider ON
- Allow new users to sign up ON
- Confirm email OFF temporarily during development testing
