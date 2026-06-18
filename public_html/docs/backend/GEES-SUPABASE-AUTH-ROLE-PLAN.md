# GEES Supabase Auth and Role Plan

## Auth source of truth

Supabase Auth will own:

```text
user id
email
password/session
email verification later
password reset later
```

The public `profiles` table will own:

```text
role
status
full name
phone
team_id
avatar_url
last_login_at
```

## Roles

```text
student
agent
staff
admin
super_admin
```

## User status

```text
pending
active
rejected
suspended
archived
```

## Approval behavior

| Signup type | Initial status | Access behavior |
|---|---|---|
| Student | active or pending_review | Can access student dashboard depending on business decision |
| Agent | pending | Cannot access full portal until admin approval |
| Staff | pending | Must be approved by admin/super admin |
| Admin | pending | Must be created/approved by super admin |
| Super Admin | manual | Created manually by project owner |

## Frontend role guard logic

1. Check Supabase session.
2. Fetch `profiles` row.
3. Check `role`.
4. Check `status`.
5. Check page allowed roles.
6. Redirect if unauthorized.

## Database role guard logic

Frontend is not enough. RLS policies must also block data access based on `auth.uid()` and role from `profiles`.
