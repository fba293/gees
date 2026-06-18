# GEES Portal Structure + Role Guard Foundation

Generated: 2026-06-17T22:40:40

## Completed scope

1. Created clean `/portal/` folder structure.
2. Moved/structured uploaded dashboard files into role folders.
3. Added shared portal CSS/JS foundation.
4. Added demo backend layer with demo users, sessions, role data, and demo collections.
5. Added role guard system for student, agent, staff, admin, and super admin.
6. Connected login/auth pages to correct dashboard redirects.
7. Added legacy root redirect pages and `.htaccess` route rules.
8. Added `portal/forbidden.html` and `portal/not-found.html`.
9. Added generated student pipeline page because uploaded `student-pipeline.html` was actually a CRM/admin students module.

## Demo credentials

- Student: `student@gees.demo` / `Student@123`
- Agent: `agent@gees.demo` / `Agent@123`
- Staff generic: `staff@gees.demo` / `Staff@123`
- Ekhlas staff: `ekhlas@gees.demo` / `Staff@123`
- Maanisha staff: `maanisha@gees.demo` / `Staff@123`
- Rafshan staff: `rafshan@gees.demo` / `Staff@123`
- SEO staff: `seo@gees.demo` / `Staff@123`
- Admin: `admin@gees.demo` / `Admin@123`
- Super Admin: `super@gees.demo` / `Super@123`

## Notes

- Dashboard pages do not use the public website header/footer anymore. Public header/footer markup found in uploaded pages was removed from the structured portal copies.
- Root legacy files are redirect pages only.
- Real backend can later replace `/portal/shared/js/demo-backend.js` without changing page routes.
- Some uploaded files had old public-header CSS and repeated inline styles. They are now overridden by `/portal/shared/css/portal.css`; a deeper cleanup can remove duplicate inline CSS in the next phase.
