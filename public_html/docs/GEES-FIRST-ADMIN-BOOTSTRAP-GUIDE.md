# GEES First Admin Bootstrap Guide

## Goal

Create the first safe `super_admin` user without opening public admin signup.

## Step 1 — Create the user

Choose one method:

### Method A — Supabase Dashboard

1. Open Supabase Dashboard.
2. Go to Authentication → Users.
3. Add a new user.
4. Use your real admin email.
5. Set a strong password.
6. Confirm the user if needed.

### Method B — Website signup

1. Open the website.
2. Sign up as a student using your admin email.
3. After the user exists, promote it with the SQL below.

## Step 2 — Promote to super admin

Open Supabase SQL Editor and run:

```sql
-- Replace this email first
select public.gees_promote_first_admin_by_email('your-admin-email@example.com');
```

If you do not install the helper function, use the direct template in:

`public_html/supabase/sql/phase10e_first_admin_promote_by_email.sql`

## Step 3 — Login

Go to:

`/portal/auth/admin-login.html`

Use the same email/password.

Expected redirect:

`/portal/super-admin/dashboard.html`

## Step 4 — Verify

Check that you can open:

- `/portal/admin/dashboard.html`
- `/portal/admin/approvals.html`
- `/portal/super-admin/dashboard.html`
- `/portal/super-admin/approvals.html`

## Warning

Do not add a public super-admin signup page.
