# GEES Auth Settings Note

For development testing before Phase 11:

1. Supabase Authentication > Providers > Email Provider: ON
2. Allow new users to sign up: ON
3. Confirm email: OFF for testing only

For production:

1. Turn Confirm email back ON
2. Configure custom SMTP
3. Keep admin/super-admin signup private

Agent/staff signup should create pending profiles. They will only show in approvals after logging in with a real Supabase admin or super_admin account, not a demo admin.
