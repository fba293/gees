# GEES Portal Responsive QA Matrix

## Shared coverage

The portal uses `portal-mobile.css`, loaded by the universal `portal-shell.js`.

Coverage applies to student, agent, staff, admin, and super-admin portal pages, including legacy root dashboard URLs that redirect into `/portal/`.

## Device widths to verify

| Viewport | Expected behavior |
|---|---|
| 320 × 568 | One-column cards/forms, 44px touch controls, no page-level horizontal scroll, table wrapper scrolls horizontally only when needed. |
| 375 × 667 | Drawer opens over content, background page is locked, drawer remains scrollable, title truncates safely. |
| 390 × 844 | Safe-area padding works on modern iPhones, no input zoom, stacked hero controls remain usable. |
| 412 × 915 | One-column dashboard cards, full-width action buttons where needed, toast stays inside visible area. |
| 768 × 1024 | Tablet drawer mode, two-column cards/actions where space permits, readable table scrolling. |
| 820 × 1180 | Tablet portrait layout, stable top bar and no clipped user controls. |
| 1024 × 768 | Tablet landscape layout, responsive drawer and two-column dashboard grids. |
| 1280 × 800 | Desktop sidebar, two/four-column layout according to content, persistent top bar. |
| 1440 × 900 | Desktop layout with comfortable content spacing. |
| 1600 px and wider | Content width is capped for readable line lengths and balanced white space. |

## Interaction checks

- Open/close the mobile navigation with the menu button, overlay, nav link, and Escape key.
- Confirm the page cannot scroll behind an open drawer while the drawer itself still scrolls.
- Confirm theme toggle, refresh buttons, forms, select controls, and logout remain at least 44px tall on touch devices.
- Confirm iOS Safari does not zoom when focusing portal inputs.
- Confirm wide tables scroll inside `.gees-table-wrap` without creating page-level horizontal scroll.
- Confirm dark mode, reduced-motion mode, and print mode remain readable.
- Confirm the service worker refreshes `portal-shell.js` and `portal-mobile.css` using network-first behavior.
