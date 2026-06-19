# GEES Phase 12E to 20 Deployment Status

Branch: `phase-12e-20-core-files`

## GitHub status

The branch has been created and partial remaining-core phase files have been pushed.

Pushed examples:

- `public_html/docs/GEES-PHASE-12E-20-README.md`
- `public_html/docs/gees-phase-core.css.txt`
- `public_html/portal/admin/user-details.html`
- `public_html/portal/shared/js/phase12e-user-audit.js`
- `public_html/portal/student/upload-documents.html`
- `public_html/portal/shared/js/phase13-document-upload.js`
- `public_html/portal/application/workflow.html`

## Supabase status

Applied live:

- Audit log foundation was checked/created.
- Student document storage bucket was checked/created.
- Document table storage/review columns were checked/created.
- Application status history table was checked/created.
- Commission and agreement extra columns were checked/created.
- Public leads table was checked/created.
- `gees_tasks` table was checked/created.

## Important security note

Supabase currently reports RLS disabled for:

- `public.gees_tasks`
- `public.leads`

Do not launch these two tables publicly until RLS policies are confirmed.

## Next safe step

Enable RLS and add policies for `gees_tasks` and `leads`, then continue pushing the remaining files in smaller batches.
