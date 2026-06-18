# GEES Phase 12A — Student Real CRUD Forms

## Scope

Phase 12 has started with the student portal because student data creation is the safest foundation before agent/staff/admin actions.

## Changed files

- `public_html/portal/shared/css/portal-crud.css`
- `public_html/portal/shared/js/portal-crud.js`
- `public_html/portal/student/application.html`
- `public_html/portal/student/document-vault.html`
- `public_html/portal/student/details.html`
- `public_html/docs/GEES-PHASE-12A-STUDENT-REAL-CRUD-FORMS-REPORT.md`

## Real CRUD actions added

### Student Application

- Load live universities from Supabase.
- Load live courses from Supabase.
- Create application draft in `public.applications`.
- Submit application with status `submitted`.
- List logged-in student applications.

### Student Document Vault

- Create document metadata record in `public.documents`.
- Link document record to an application.
- Mark document record as `uploaded`.
- List logged-in student document records.

### Student Details

- Update `public.profiles` fields:
  - full name
  - phone
- Update `public.students` fields:
  - preferred country
  - preferred level
  - preferred intake
  - notes
- Create support ticket in `public.support_tickets`.

## Demo behavior

Demo accounts stay in safe UI mode and do not create Supabase rows. Real CRUD actions require a real Supabase student login.

## Security

All actions still rely on Supabase RLS policies:

- Students can only access their own profile and student records.
- Students can only create/list their own applications.
- Students can only create/list their own document records.
- Support tickets are linked to the logged-in user.

## Test order

1. Login as a real student.
2. Open `/portal/student/details.html` and update profile.
3. Open `/portal/student/application.html` and save a draft.
4. Submit another application.
5. Open `/portal/student/document-vault.html` and add a document record.
6. Return to dashboard and confirm live counts after refresh.

## Next phase

Phase 12B should connect agent and staff actions:

- Agent assigned student list
- Admin assign student to agent/staff
- Staff assigned application list
- Staff application status update
