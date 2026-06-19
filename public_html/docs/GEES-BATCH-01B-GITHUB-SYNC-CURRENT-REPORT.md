# GEES Batch 01B — GitHub Sync Current Report

Date: 2026-06-20

## Pushed to GitHub main

- `public_html/gees-router.js`
- `public_html/sw.js`
- `public_html/global.js`
- `public_html/404.html`
- `supabase/sql/20260620_harden_leads_authenticated_insert_policy.sql`
- `public_html/docs/GEES-BATCH-01-V12.8-FRONTEND-SYNC-REPORT.md`

## Latest Batch 01B commits

- `bcbc4044da661176134996a06abe4977a6ed6475` — synced global runtime v12.8
- `d21962de74e014a626bf581e297ce093c9870618` — synced 404 page v12.8
- `abe91e0dd69dd54a7e2d7d90f52e19b7c74b2542` — added runtime safety layer

## Runtime safety layer

The runtime safety layer in `global.js` normalizes old public pages while remaining large HTML/CSS files are being synced:

- Converts `main#main-content` to `#gees-pjax-root` at runtime.
- Adds `data-gees-pjax-view="true"`.
- Removes skip-link elements if old header/page markup injects them.
- Auto-loads `/gees-router.js?v=12.8.0` if a page does not already include it.
- Dispatches `gees:page:ready` for page-specific initializers.

## Still inside ZIP for direct upload / future exact sync

- `public_html/index.html`
- `public_html/header.js`
- `public_html/index.css`
- `public_html/global.css`
- `public_html/courses.html`
- `public_html/services.html`
- `public_html/blog.html`
- `public_html/destinations.html`
- `public_html/contact-us.html`

## Honest status

GitHub is functionally protected by router + service worker + global runtime safety. The exact large static replacements remain packaged in the ZIP for direct upload or future full-file sync.

## Next batch

Batch 02 — No Demo / Real Data Mode.
