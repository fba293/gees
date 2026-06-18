# GEES Phase 12C — Catalogue and Application Management

## Scope

Phase 12C adds live portal pages for catalogue records and application review.

## Changed files

- `public_html/portal/shared/js/gees-catalogue.js`
- `public_html/portal/shared/js/gees-applications.js`
- `public_html/portal/shared/js/portal-shell.js`
- `public_html/portal/admin/catalogue.html`
- `public_html/portal/admin/applications.html`
- `public_html/docs/GEES-PHASE-12C-ADMIN-CATALOGUE-APPLICATION-MANAGEMENT-REPORT.md`

## Catalogue page

Page:

`/portal/admin/catalogue.html`

Added:

- Create university form.
- Create course form.
- Course-to-university selector.
- Live university table.
- Live course table.

## Applications page

Page:

`/portal/admin/applications.html`

Added:

- Live application list.
- Student context.
- University/course context.
- Status update selector.

## Navigation

The portal sidebar now includes:

- Applications
- Catalogue

for admin and super-admin navigation.

## Test order

1. Login as a real admin or super-admin.
2. Open `/portal/admin/catalogue.html`.
3. Create a university.
4. Create a course.
5. Create a student application.
6. Open `/portal/admin/applications.html`.
7. Update the application status.

## Next phase

Phase 12D should focus on user management actions.
