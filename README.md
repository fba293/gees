# GEES Website + Portal

This repository contains the structured GEES public website, role-based portal, Supabase backend setup files, and project documentation.

Current baseline: before Phase 11, with Supabase Auth/portal foundation, admin approval flow, and live QA bootstrap prepared.

## Upload target

Deploy the contents of `public_html/` to your hosting `public_html` directory.

## Notes

- Some files/folders are placeholders and should be replaced with the real uploaded production files/assets where needed.
- Do not commit Supabase service-role keys, passwords, or private `.env` secrets.
- Supabase testing settings before Phase 11: Email provider ON, Allow new users ON, Confirm email OFF for development testing only.
