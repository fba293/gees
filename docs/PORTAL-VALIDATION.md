# GEES Portal Validation

Run these checks from the repository root before pushing portal changes:

```bash
node scripts/check-gees.mjs
```

Then validate the active JavaScript runtime exactly as GitHub Actions does:

```bash
node --check scripts/check-gees.mjs
node --check public_html/global.js
node --check public_html/gees-leads.js
node --check public_html/gees-router.js
node --check public_html/sw.js
node --check public_html/portal/shared/js/supabase-client.js
node --check public_html/portal/shared/js/auth-service.js
node --check public_html/portal/shared/js/auth-page.js
node --check public_html/portal/shared/js/role-guard.js
node --check public_html/portal/shared/js/portal-shell.js
node --check public_html/portal/shared/js/portal-ui.js
node --check public_html/portal/shared/js/portal-live-data.js
node --check public_html/portal/shared/js/portal-crud.js
node --check public_html/portal/shared/js/portal-document-upload.js
node --check public_html/portal/shared/js/portal-workflow.js
node --check public_html/portal/shared/js/portal-commissions.js
node --check public_html/portal/shared/js/portal-work-items.js
node --check public_html/portal/shared/js/portal-reports.js
```

## Validation rules

The active portal gate fails when:

- a required live portal file is missing;
- an active page contains old demo credentials or a demo action marker;
- an active portal auth page loads `demo-backend.js`;
- the public lead auto-loader is missing;
- the portal mobile layer or safe viewport support is missing;
- the live dashboard adapter can use aggregate counts outside admin roles;
- any active runtime JavaScript file has a syntax error.

## Browser QA before production

Test with real accounts after the static checks pass:

1. Student: sign in, profile update, application save/submit, document upload.
2. Agent: sign in, assigned students, commissions, support records.
3. Staff: sign in, work-item status update, assigned application status update.
4. Admin: sign in, approval workflow, reports, commission/payment actions.
5. Public: submit one contact form and verify exactly one `leads` row.
6. Mobile: iPhone Safari and Android Chrome drawer, tables, upload controls, dark mode, and service-worker refresh.
