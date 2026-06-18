# GEES Phase 11C — Admin/Super Admin Demo Login Storage Fix

## Issue

Admin and Super Admin demo login showed:

`The operation is insecure.`

This is a browser storage/security error, usually triggered when localStorage/sessionStorage is blocked, when opening files directly, or in strict browser privacy contexts.

## Fix

Changed files only:

- `public_html/portal/shared/js/supabase-client.js`
- `public_html/portal/shared/js/auth-service.js`
- `public_html/portal/shared/js/auth-page.js`
- `public_html/portal/shared/js/demo-storage-bridge.js`
- `public_html/portal/auth/admin-login.html`

## What changed

- Added safe storage fallback for Supabase Auth.
- Removed unsafe direct storage usage in demo login flow.
- Added demo session URL fallback when only memory storage is available.
- Added a demo storage bridge to make admin/super-admin demo sessions survive restricted storage conditions.
- Updated admin login script versions to `11.2.0`.
- Improved the user-facing message for browser storage/security errors.

## Testing

Use the admin login page:

`/portal/auth/admin-login.html`

Test both admin and super-admin demo credentials after hard refresh.
