# GEES Website + Portal

Structured GEES public website, role-based portal, Supabase setup files, and project documentation.

Current baseline: Phase 10F before Phase 11.

## Phase 10F status

Auth UX and approval diagnostics have been added:

- clearer Supabase signup-disabled message
- clearer email-rate-limit message
- clear warning when demo admin tries to view real approvals
- admin/super-admin approval diagnostics
- public admin signup remains blocked
- first-admin bootstrap docs included

## Deploy

Upload `public_html/` to your hosting `public_html` directory.

## Security

Never commit Supabase service-role keys, passwords, private `.env` files, or hosting credentials.
