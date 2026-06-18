# GEES Supabase Beginner Setup Steps

## 1. Confirm project

Use your existing Supabase project:

```text
Project name: GEES
Project ref: spljrvlebfeljqrqkiee
Region: ap-southeast-2
```

## 2. Do not paste service role key into frontend

Only the Supabase URL and anon public key go inside website JavaScript.

Never expose:

```text
service_role key
JWT secret
database password
SMTP password
```

## 3. Install frontend client later

For static/cPanel website, easiest first step is CDN import:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Later, if the project moves to a build system, use npm.

## 4. Create tables after approval

Run the schema from:

```text
GEES-SUPABASE-SQL-SCHEMA-DRAFT.sql
```

Only after reviewing it.

## 5. Enable Row Level Security

Run the RLS file after tables exist:

```text
GEES-SUPABASE-RLS-POLICY-BLUEPRINT.sql
```

## 6. Create first admin user manually

Beginner-safe method:

1. Sign up one user from Supabase Auth or your admin signup page.
2. Open Supabase SQL editor.
3. Update that user profile role to `super_admin`.
4. Use that super admin to approve future admins/staff.

Example after tables exist:

```sql
update public.profiles
set role = 'super_admin', status = 'active'
where email = 'your-email@example.com';
```

## 7. Create Storage buckets later

Start without file uploads if needed. Add storage when applications/documents are ready.

Recommended buckets:

```text
student-documents
agreements
receipts
profile-media
support-attachments
```

## 8. Keep demo fallback during migration

During Phase 10A and 10B, login can attempt Supabase first. If Supabase is not configured, demo login should still work locally.

## 9. Test role access after every step

Test these flows:

```text
student → student dashboard only
agent → agent pages only
staff → staff pages only
admin → admin pages only
super_admin → all pages
```

## 10. Go live only after RLS tests pass

Do not add real student documents until storage rules and table RLS are tested.
