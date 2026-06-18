# GEES Phase 10D — Real Test Users + Admin Approval Flow

## Status
Phase 10D is complete.

## Supabase work applied
- Added automatic approval queue trigger for new pending agent/staff profiles.
- Added secure RPC function: `get_pending_gees_user_approvals()`.
- Added secure RPC function: `approve_gees_user(user_id, note)`.
- Added secure RPC function: `reject_gees_user(user_id, note)`.
- Approval actions update `profiles.status`.
- Agent approval actions update `agents.approval_status`.
- Approval/rejection writes `notifications` for the user.
- Approval/rejection writes `audit_logs` for admins.
- Existing public view access was revoked; frontend uses admin-checked RPC instead.

## Frontend work prepared
- Added admin approvals page: `/portal/admin/approvals.html`.
- Upgraded super-admin approvals page: `/portal/super-admin/approvals.html`.
- Added page script: `/portal/shared/js/admin-approval-flow.js`.
- Upgraded `/portal/shared/js/auth-service.js` with approval RPC methods.
- Added Approvals link to admin sidebar.
- Kept demo fallback and Supabase auth support.

## Real test users
No real auth users were created automatically because your Supabase project currently has `0` profiles and creating password users requires either browser signup or a service-role/admin API key. Service-role keys must never be placed in frontend files.

Use the included `phase10d_first_admin_bootstrap.sql` after you create your first normal signup account.

## Current database validation
- Public GEES tables: 21
- Roles: 5
- Permissions: 18
- Role-permission mappings: 51
- GEES RLS policies: 47
- GEES helper/RPC functions: 12
- Current profiles: 0
- Current approval records: 0
- Demo catalogue rows: 3 universities + 3 courses

## Recommended first live test
1. Upload Phase 10D changed files.
2. Open `/portal/auth/student-signup.html` and create your own account.
3. Run `phase10d_first_admin_bootstrap.sql` with your email to promote yourself to `super_admin`.
4. Open `/portal/auth/agent-signup.html` and create an agent test account.
5. Sign in as super admin and open `/portal/admin/approvals.html`.
6. Approve the agent.
7. Sign in as the agent and confirm dashboard access.
