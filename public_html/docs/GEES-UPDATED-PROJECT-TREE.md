# GEES Updated Project Tree Before Phase 11

```text
GEES-UPDATED-PROJECT-TREE-BEFORE-PHASE-11/
├── app_private/
│   ├── agreements/
│   │   └── .gitkeep
│   ├── config/
│   │   └── .gitkeep
│   ├── crm/
│   │   └── .gitkeep
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── .gitkeep
│   │   │   ├── phase10d_approval_flow_reference.sql
│   │   │   ├── phase10d_first_admin_bootstrap.sql
│   │   │   ├── phase10e_first_admin_helper_function.sql
│   │   │   ├── phase10e_first_admin_promote_by_email.sql
│   │   │   └── phase10e_security_hardening_applied.sql
│   │   └── seeds/
│   │       └── .gitkeep
│   ├── leads/
│   │   └── .gitkeep
│   ├── logs/
│   │   └── .gitkeep
│   ├── receipts/
│   │   └── .gitkeep
│   └── student-documents/
│       └── .gitkeep
├── archive/
│   ├── backup-before-cleanup/
│   │   └── .gitkeep
│   ├── duplicate-files/
│   │   └── .gitkeep
│   ├── old-header-footer/
│   │   └── .gitkeep
│   ├── old-homepage/
│   │   └── .gitkeep
│   ├── old-root-files/
│   │   └── .gitkeep
│   └── previous-designs/
│       └── .gitkeep
├── public_html/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── blog/
│   │   │   │   └── .gitkeep
│   │   │   ├── campus/
│   │   │   │   └── .gitkeep
│   │   │   ├── counselors/
│   │   │   │   └── .gitkeep
│   │   │   ├── destinations/
│   │   │   │   └── .gitkeep
│   │   │   ├── flags/
│   │   │   │   └── .gitkeep
│   │   │   ├── journey/
│   │   │   │   └── .gitkeep
│   │   │   ├── lottie/
│   │   │   │   └── .gitkeep
│   │   │   ├── og/
│   │   │   │   └── .gitkeep
│   │   │   ├── payment/
│   │   │   │   └── .gitkeep
│   │   │   ├── qr/
│   │   │   │   └── .gitkeep
│   │   │   ├── reviews/
│   │   │   │   └── .gitkeep
│   │   │   ├── slider-logos/
│   │   │   │   └── .gitkeep
│   │   │   └── students/
│   │   │       └── .gitkeep
│   │   ├── logos/
│   │   │   ├── .gitkeep
│   │   │   ├── favicon.png
│   │   │   ├── gees-logo-white.png
│   │   │   └── gees-logo.png
│   │   ├── school-fees/
│   │   │   ├── .gitkeep
│   │   │   ├── fairview-fees.pdf
│   │   │   ├── mahsa-fees.pdf
│   │   │   └── st-johns-fees.pdf
│   │   ├── university-logos/
│   │   │   ├── australia/
│   │   │   │   └── .gitkeep
│   │   │   ├── bangladesh/
│   │   │   │   └── .gitkeep
│   │   │   ├── canada/
│   │   │   │   └── .gitkeep
│   │   │   ├── china/
│   │   │   │   └── .gitkeep
│   │   │   ├── germany/
│   │   │   │   └── .gitkeep
│   │   │   ├── ireland/
│   │   │   │   └── .gitkeep
│   │   │   ├── malaysia/
│   │   │   │   └── .gitkeep
│   │   │   ├── newzealand/
│   │   │   │   └── .gitkeep
│   │   │   ├── sweden/
│   │   │   │   └── .gitkeep
│   │   │   ├── uk/
│   │   │   │   └── .gitkeep
│   │   │   └── usa/
│   │   │       └── .gitkeep
│   │   └── videos/
│   │       ├── .gitkeep
│   │       └── contact-form-animation.mp4
│   ├── blog/
│   │   └── index.html
│   ├── components/
│   │   └── README.md
│   ├── country-pages/
│   │   └── index.html
│   ├── data/
│   │   ├── public/
│   │   │   ├── universities/
│   │   │   │   ├── australia.json
│   │   │   │   ├── canada.json
│   │   │   │   ├── malaysia.json
│   │   │   │   ├── newzealand.json
│   │   │   │   ├── uk.json
│   │   │   │   └── usa.json
│   │   │   ├── countries.json
│   │   │   ├── courses.json
│   │   │   ├── language-centers.json
│   │   │   ├── search-data.json
│   │   │   └── services.json
│   │   └── schema/
│   │       ├── blog.schema.json
│   │       ├── course.schema.json
│   │       ├── organization.schema.json
│   │       └── university.schema.json
│   ├── docs/
│   │   ├── DASHBOARD-ROUTE-MAP-FINAL.csv
│   │   ├── GEES-BACKEND-READY-DEMO-DATA-MAP.md
│   │   ├── GEES-FIRST-ADMIN-BOOTSTRAP-GUIDE.md
│   │   ├── GEES-PHASE-10C-AUTH-QA-CHECKLIST.csv
│   │   ├── GEES-PHASE-10C-NEXT-STEPS.md
│   │   ├── GEES-PHASE-10C-SUPABASE-AUTH-CONNECTION-REPORT.md
│   │   ├── GEES-PHASE-10D-NEXT-STEPS.md
│   │   ├── GEES-PHASE-10D-REAL-USER-TEST-CHECKLIST.csv
│   │   ├── GEES-PHASE-10D-REAL-USERS-APPROVAL-FLOW-REPORT.md
│   │   ├── GEES-PHASE-10D-VALIDATION-SUMMARY.csv
│   │   ├── GEES-PHASE-10E-LIVE-BROWSER-QA-CHECKLIST.csv
│   │   ├── GEES-PHASE-10E-LIVE-QA-FIRST-ADMIN-BOOTSTRAP-REPORT.md
│   │   ├── GEES-PHASE-10E-NEXT-STEPS.md
│   │   ├── GEES-PHASE-10E-ROLE-GUARD-TEST-MATRIX.csv
│   │   ├── GEES-PHASE-10E-SUPABASE-SECURITY-HARDENING-REPORT.md
│   │   ├── GEES-PHASE-10E-VALIDATION-SUMMARY.csv
│   │   ├── GEES-PHASE-7-DASHBOARD-UI-DEMO-CONNECTIONS-REPORT.md
│   │   ├── GEES-PHASE-7-DEMO-CREDENTIALS.csv
│   │   ├── GEES-PHASE-7-QA-CHECKLIST.csv
│   │   ├── GEES-PHASE-8-FULL-PORTAL-INTEGRATION-REPORT.md
│   │   ├── GEES-PHASE-8-LIVE-UPLOAD-CHECKLIST.csv
│   │   ├── GEES-PHASE-8-ROUTE-TEST-MATRIX.csv
│   │   ├── GEES-PHASE-8-VALIDATION-SUMMARY.md
│   │   ├── GEES-PLACEHOLDER-FILES-REPORT.csv
│   │   ├── GEES-PORTAL-FOUNDATION-IMPLEMENTATION-REPORT.md
│   │   ├── GEES-REAL-FILES-INCLUDED-REPORT.csv
│   │   └── ROLE-ACCESS-MATRIX-FINAL.csv
│   ├── portal/
│   │   ├── admin/
│   │   │   ├── agreement-management.html
│   │   │   ├── analytics.html
│   │   │   ├── approvals.html
│   │   │   ├── crm-dashboard.html
│   │   │   ├── dashboard.html
│   │   │   ├── help.html
│   │   │   ├── reports.html
│   │   │   ├── students.html
│   │   │   └── wiki.html
│   │   ├── agent/
│   │   │   ├── commissions.html
│   │   │   ├── dashboard.html
│   │   │   ├── scholarships.html
│   │   │   ├── students.html
│   │   │   ├── support.html
│   │   │   └── universities.html
│   │   ├── auth/
│   │   │   ├── admin-login.html
│   │   │   ├── agent-login.html
│   │   │   ├── agent-signup.html
│   │   │   ├── staff-login.html
│   │   │   ├── staff-signup.html
│   │   │   ├── student-login.html
│   │   │   └── student-signup.html
│   │   ├── chat/
│   │   │   └── portal-chat.html
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── empty-state.html
│   │   │   │   ├── notification-panel.html
│   │   │   │   ├── sidebar.html
│   │   │   │   └── topbar.html
│   │   │   ├── css/
│   │   │   │   └── portal.css
│   │   │   ├── data/
│   │   │   │   ├── demo-applications.json
│   │   │   │   ├── demo-approvals.json
│   │   │   │   ├── demo-audit-logs.json
│   │   │   │   ├── demo-commissions.json
│   │   │   │   ├── demo-documents.json
│   │   │   │   ├── demo-notifications.json
│   │   │   │   ├── demo-students.json
│   │   │   │   └── demo-users.json
│   │   │   ├── js/
│   │   │   │   ├── admin-approval-flow.js
│   │   │   │   ├── auth-page.js
│   │   │   │   ├── auth-service.js
│   │   │   │   ├── demo-backend.js
│   │   │   │   ├── portal-links.js
│   │   │   │   ├── portal-shell.js
│   │   │   │   ├── portal-ui.js
│   │   │   │   ├── role-guard.js
│   │   │   │   └── supabase-client.js
│   │   │   └── route-manifest.json
│   │   ├── staff/
│   │   │   ├── ekhlas/
│   │   │   │   ├── community-auditor.html
│   │   │   │   ├── dashboard.html
│   │   │   │   ├── india-outreach.html
│   │   │   │   └── training-manuals.html
│   │   │   ├── maanisha/
│   │   │   │   ├── dashboard.html
│   │   │   │   ├── inti-benchmarks.html
│   │   │   │   ├── revenue-forecast.html
│   │   │   │   └── university-vault.html
│   │   │   ├── rafshan/
│   │   │   │   ├── community-manager.html
│   │   │   │   ├── dashboard.html
│   │   │   │   ├── reels-library.html
│   │   │   │   └── strategy-calendar.html
│   │   │   ├── seo/
│   │   │   │   └── dashboard.html
│   │   │   └── dashboard.html
│   │   ├── student/
│   │   │   ├── application.html
│   │   │   ├── dashboard.html
│   │   │   ├── details.html
│   │   │   ├── document-vault.html
│   │   │   └── pipeline.html
│   │   ├── super-admin/
│   │   │   ├── ai-seo-dashboard.html
│   │   │   ├── approvals.html
│   │   │   ├── audit-logs.html
│   │   │   ├── dashboard.html
│   │   │   └── uni-wiki.html
│   │   ├── forbidden.html
│   │   └── not-found.html
│   ├── programs/
│   │   ├── business/
│   │   │   └── index.html
│   │   ├── computer-science/
│   │   │   └── index.html
│   │   ├── design/
│   │   │   └── index.html
│   │   ├── engineering/
│   │   │   └── index.html
│   │   ├── hospitality/
│   │   │   └── index.html
│   │   ├── law/
│   │   │   └── index.html
│   │   ├── medicine/
│   │   │   └── index.html
│   │   └── index.html
│   ├── scripts/
│   │   └── README.md
│   ├── services/
│   │   └── index.html
│   ├── supabase/
│   │   └── sql/
│   │       ├── phase10d_approval_flow_reference.sql
│   │       ├── phase10d_first_admin_bootstrap.sql
│   │       ├── phase10e_first_admin_helper_function.sql
│   │       ├── phase10e_first_admin_promote_by_email.sql
│   │       └── phase10e_security_hardening_applied.sql
│   ├── templates/
│   │   └── README.md
│   ├── tests/
│   │   └── README.md
│   ├── universities/
│   │   ├── australia/
│   │   │   └── index.html
│   │   ├── canada/
│   │   │   └── index.html
│   │   ├── europe/
│   │   │   └── index.html
│   │   ├── malaysia/
│   │   │   └── index.html
│   │   ├── newzealand/
│   │   │   └── index.html
│   │   ├── uk/
│   │   │   └── index.html
│   │   ├── usa/
│   │   │   └── index.html
│   │   └── index.html
│   ├── .htaccess
│   ├── 404.html
│   ├── admin-dashboard.html
│   ├── admin-help.html
│   ├── admin-login.html
│   ├── admin-reports.html
│   ├── admin-super-ai-seo-dashboard.html
│   ├── admin-super-approvals.html
│   ├── admin-super-audit-logs.html
│   ├── admin-super-dashboard.html
│   ├── admin-super-uni-wiki.html
│   ├── admin-wiki.html
│   ├── agent-commissions.html
│   ├── agent-dashboard.html
│   ├── agent-login.html
│   ├── agent-scholarships.html
│   ├── agent-signup.html
│   ├── agent-students.html
│   ├── agent-support.html
│   ├── agent-universities.html
│   ├── agreement-management.html
│   ├── agreement-signing.html
│   ├── analytics.html
│   ├── application-checklist.html
│   ├── blog.html
│   ├── contact-us.html
│   ├── courses.html
│   ├── crm-dashboard.html
│   ├── destinations.html
│   ├── ekhlas-community-auditor.html
│   ├── ekhlas-india-outreach.html
│   ├── ekhlas-portal-dashboard.html
│   ├── ekhlas-training-manuals.html
│   ├── footer.js
│   ├── gees-auth.css
│   ├── gees-auth.js
│   ├── global.css
│   ├── global.js
│   ├── header.js
│   ├── index-search.js
│   ├── index.css
│   ├── index.html
│   ├── index.js
│   ├── language-center-list.html
│   ├── maanisha-inti-benchmarks.html
│   ├── maanisha-portal-dashboard.html
│   ├── maanisha-revenue-forecast.html
│   ├── maanisha-university-vault.html
│   ├── manifest.json
│   ├── offline.html
│   ├── partners.html
│   ├── payment.html
│   ├── privacy-policy.html
│   ├── rafshan-community-manager.html
│   ├── rafshan-portal-dashboard.html
│   ├── rafshan-reels-library.html
│   ├── rafshan-strategy-calendar.html
│   ├── refer-and-earn.html
│   ├── robots.txt
│   ├── scholarship.html
│   ├── seo-dashboard.html
│   ├── services.html
│   ├── sitemap.xml
│   ├── staff-dashboard.html
│   ├── staff-login.html
│   ├── staff-signup.html
│   ├── student-application.html
│   ├── student-dashboard.html
│   ├── student-document-vault.html
│   ├── student-login.html
│   ├── student-pipeline.html
│   ├── student-portal-details.html
│   ├── student-signup.html
│   ├── sw.js
│   ├── terms-and-conditions.html
│   ├── terms.html
│   ├── thank-you.html
│   ├── universities.html
│   ├── visa-tracker.html
│   └── welcome-kit.html
└── README-GEES-UPDATED-PROJECT-TREE.md
```
