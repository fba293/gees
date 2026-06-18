# GEES Phase 8 — Full Portal Integration + Live Upload Readiness

Generated: 2026-06-18 00:35 UTC

## Completed

1. Integrated the structured Phase 7 portal into the existing `public_html/portal/` tree.
2. Updated public header portal links to use `/portal/auth/...` routes.
3. Added safe legacy root redirects for old dashboard/auth URLs.
4. Added clean URL support for portal routes in `.htaccess`.
5. Added `sw.js` with Phase 8 cache version and portal-safe network-first handling.
6. Added `manifest.json` with portal shortcuts.
7. Hardened portal login `next` redirect handling to block external open redirects.
8. Improved portal shell logout routing by role.
9. Removed unauthorized SEO staff sidebar links to admin-only pages.
10. Added backend-ready documentation and live upload checklist.

## Upload guidance

Upload the contents of this ZIP directly into `public_html/`. The ZIP already contains a top-level `public_html/` folder for safe cPanel extraction.

After upload:

1. Open Chrome DevTools → Application → Service Workers → Unregister old worker once.
2. Hard refresh with cache disabled.
3. Test `/portal/auth/student-login.html`, `/portal/auth/agent-login.html`, `/portal/auth/staff-login.html`, and `/portal/auth/admin-login.html`.
4. Test old links such as `/student-dashboard.html` and `/admin-super-dashboard.html`.

## Demo credentials

See `docs/GEES-PHASE-7-DEMO-CREDENTIALS.csv` for the full list.

## Backend readiness

The current demo layer is isolated in:

```text
portal/shared/js/demo-backend.js
portal/shared/data/*.json
```

When the real backend is added later, replace the demo adapter while keeping page routes and UI structure stable.
