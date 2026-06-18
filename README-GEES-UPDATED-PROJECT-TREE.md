# GEES Updated Project Tree — Before Phase 11

Generated package date: 2026-06-18

This ZIP contains the updated structured GEES project tree before Phase 11.

## Source baseline
- Latest public/portal package: Phase 10D full portal/auth/admin approval package.
- Phase 10E live QA / first-admin bootstrap docs and SQL overlaid.
- Latest available public pages from the working files were copied where available.
- Missing files/folders from the agreed tree were created as placeholders.

## Important
- Placeholder files are marked in `docs/GEES-PLACEHOLDER-FILES-REPORT.csv`.
- Binary placeholders such as `.mp4` and `.pdf` must be replaced with real production assets before live use.
- Portal pages do not use the public header/footer.
- Public pages should use the universal `header.js` and `footer.js` pattern.
- Supabase service-role keys are not included.
- Supabase Storage remains skipped for no-payment launch.

## Main folders
```text
public_html/   Public website + portal frontend
app_private/   Future private backend/server-side storage structure
archive/       Old files/backups/previous designs placeholder structure
```
