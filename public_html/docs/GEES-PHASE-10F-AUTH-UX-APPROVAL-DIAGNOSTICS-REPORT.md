# GEES Phase 10F — Auth Settings UX + Approval Diagnostics Fix

## Completed

- Added user-friendly message for `email rate limit exceeded`.
- Added user-friendly message for `Signups not allowed for this instance`.
- Added clear warning that demo admin cannot view real Supabase approvals.
- Added real admin/super_admin approval diagnostics.
- Kept public admin signup blocked intentionally.
- Added first-admin bootstrap reminders.
- Added approval page empty-state troubleshooting.

## Current backend observation

At the time of this fix, Supabase had one pending agent profile and one pending user activation approval. The approval exists, but it only appears after logging in with a real bootstrapped admin/super_admin.

## Required Supabase settings for testing

- Email provider: ON
- Allow new users to sign up: ON
- Confirm email: OFF for testing only

## Before Phase 11

Confirm these live:

- student signup works
- agent signup becomes pending
- staff signup becomes pending
- first real admin is bootstrapped
- `/portal/admin/approvals.html` shows pending rows for real admin
- approve/reject buttons work
