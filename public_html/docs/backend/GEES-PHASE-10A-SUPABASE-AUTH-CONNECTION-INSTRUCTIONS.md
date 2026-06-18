# GEES Phase 10A — Supabase Auth Connection Starter Instructions

This file explains how to connect the new Supabase starter files without breaking your current demo portal.

## 1. Upload starter files

Upload these files into your website:

```text
public_html/portal/shared/js/supabase-config.example.js
public_html/portal/shared/js/supabase-client.js
public_html/portal/shared/js/supabase-auth-service.js
public_html/portal/shared/js/auth-page-supabase-starter.js
public_html/portal/shared/js/role-guard-supabase-starter.js
```

They will not affect the site until referenced by pages and configured.

## 2. Create config file

Copy:

```text
supabase-config.example.js
```

To:

```text
supabase-config.js
```

Then paste your Supabase anon/public key:

```js
window.GEES_SUPABASE_CONFIG = {
  enabled: true,
  url: 'https://spljrvlebfeljqrqkiee.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_PUBLIC_KEY',
  demoFallback: true,
  debug: true
};
```

## 3. Add scripts to auth pages only after SQL is applied

Add before `</body>` in auth pages:

```html
<script src="/portal/shared/js/supabase-config.js"></script>
<script src="/portal/shared/js/supabase-client.js"></script>
<script src="/portal/shared/js/supabase-auth-service.js"></script>
<script src="/portal/shared/js/auth-page-supabase-starter.js"></script>
```

## 4. Add role guard to portal pages only after SQL is applied

Add before `</body>` in dashboard pages after the existing portal scripts:

```html
<script src="/portal/shared/js/supabase-config.js"></script>
<script src="/portal/shared/js/supabase-client.js"></script>
<script src="/portal/shared/js/supabase-auth-service.js"></script>
<script src="/portal/shared/js/role-guard-supabase-starter.js"></script>
```

## 5. Recommended rollout

1. Apply SQL in Supabase SQL Editor.
2. Run validation SQL.
3. Create one real student test user through signup.
4. Confirm row appears in `profiles` and `students`.
5. Enable Supabase scripts on only `student-login.html` and `student-signup.html` first.
6. Test Student login.
7. Then connect Agent, Staff, Admin.

## Important

Do not remove demo fallback until real Supabase login works for all roles.
