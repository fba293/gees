# GEES Phase 10C — Next Steps

## Next recommended phase
Phase 10D: Create Real Test Users + Admin Approval Flow.

## Recommended order
1. Create a real student signup from `/portal/auth/student-signup.html`.
2. Confirm email if Supabase email confirmation is enabled.
3. Login as the real student from `/portal/auth/student-login.html`.
4. Create an agent signup and confirm it remains pending.
5. Create a staff signup and confirm it remains pending.
6. Manually promote one trusted user to `admin` or `super_admin` from Supabase SQL.
7. Build the admin approval UI for pending agent/staff accounts.
8. Add a safe admin action log for approvals.

## Admin user creation warning
Do not allow public admin signup. Admin and Super Admin should be created manually by project owner only.

## Storage warning
Keep file upload in demo mode until you decide whether to use Supabase Storage or another storage provider.
