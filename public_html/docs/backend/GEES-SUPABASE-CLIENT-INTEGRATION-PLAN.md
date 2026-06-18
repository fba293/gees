# GEES Supabase Client Integration Plan

## New frontend file

Create this in Phase 10A:

```text
public_html/portal/shared/js/gees-supabase-client.js
```

## Responsibilities

```text
1. Store Supabase URL and anon key.
2. Initialize Supabase client.
3. Provide auth helpers.
4. Provide profile lookup helper.
5. Provide dashboard redirect helper.
6. Keep demo fallback until Supabase is stable.
```

## Suggested frontend auth flow

```text
1. User submits login form.
2. gees-auth.js calls Supabase login first.
3. Supabase returns user session.
4. Fetch public.profiles row by user.id.
5. Check role and status.
6. Redirect to role dashboard.
7. If Supabase is not configured, fallback to Phase 8 demo login.
```

## Suggested signup flow

```text
1. User submits signup form.
2. Create Supabase Auth user.
3. Insert public.profiles row with role and pending/active status.
4. Insert role-specific table row: students / agents / staff_profiles.
5. Notify admin through approvals table.
6. Redirect to thank-you page.
```

## Role redirect map

```text
student -> /portal/student/dashboard.html
agent -> /portal/agent/dashboard.html
staff -> /portal/staff/dashboard.html
admin -> /portal/admin/dashboard.html
super_admin -> /portal/super-admin/dashboard.html
```

## Demo fallback rule

Do not remove Phase 8 demo backend until:

```text
Supabase Auth login works
profiles table works
role guard works
logout works
direct URL role protection works
```
