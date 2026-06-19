# GEES Batch 01 — v12.8 Front-End Sync Package

Date: 2026-06-20

## Purpose

Finish the v12.8 public front-end foundation before moving to No Demo / Real Data Mode.

## Included public files

- public_html/index.html
- public_html/header.js
- public_html/index.css
- public_html/global.css
- public_html/global.js
- public_html/courses.html
- public_html/services.html
- public_html/blog.html
- public_html/destinations.html
- public_html/contact-us.html
- public_html/404.html
- public_html/gees-router.js
- public_html/sw.js

## Fixes included

- True PJAX root structure using #gees-pjax-root.
- Router replaces only #gees-pjax-root.
- Public pages use universal header and footer placeholders.
- Removed skip-link leftovers from changed public pages.
- Contact page old conflicting scripts removed.
- Homepage search overlay alignment patch included.
- Homepage PJAX return bridge included.
- Service worker cache updated for v12.8.

## Validation

- node --check gees-router.js passed.
- node --check header.js passed.
- node --check global.js passed.
- node --check sw.js passed.
- Public page scan found gees-pjax-root on all included public pages.
- Public page scan found no main-content root usage in included public pages.
- Public page scan found no skip-link text in included public pages.

## Supabase note

The separate Supabase leads RLS hardening migration was already applied live and added to GitHub in a previous commit.

## Next batch

Batch 02 will remove demo/localStorage/mock behavior and move portal/auth/dashboard screens to real Supabase data with clean zero-state UI.
