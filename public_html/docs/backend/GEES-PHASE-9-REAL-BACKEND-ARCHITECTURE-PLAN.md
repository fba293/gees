# GEES Phase 9 — Real Backend Architecture Plan + Database Blueprint

Generated: 2026-06-18 01:15 UTC

## Decision

For the easiest beginner-friendly launch, GEES should start with **Firebase**:

- **Firebase Authentication** for student, agent, staff, admin, and super-admin login.
- **Cloud Firestore** for portal data, applications, documents metadata, approvals, audit logs, notifications, and CRM records.
- **Cloud Storage for Firebase** for uploaded student documents, receipts, agreements, and agent/company files.
- **Cloud Functions for Firebase** only for actions that must not run directly in the browser, such as approval actions, audit-log writes, commission calculations, secure document approval, notification fan-out, and email triggers.
- **Firebase Hosting** is optional. GEES can remain on cPanel/Hostinger for public pages and still use Firebase as the backend through client SDKs.

## Why Firebase is the best beginner launch choice

Firebase is the lowest-friction backend for the current GEES portal because it gives authentication, database, storage, security rules, and serverless functions in one ecosystem. The existing demo layer from Phase 8 is already isolated in `portal/shared/js/demo-backend.js` and `portal/shared/data/*.json`, so the future real backend can replace that adapter without rebuilding the dashboard UI.

## Important billing note

Firebase Authentication and Firestore can be started small, but **Cloud Storage for Firebase now has billing-plan requirements for default buckets**. Because GEES needs document uploads, the real upload system should be planned with the Blaze plan plus strict budget alerts, security rules, and file-size limits. The public website can still stay on the current hosting while Firebase powers portal data.

## Recommended Phase 9 target architecture

```text
GEES public website
    |
    | public links / portal dropdown
    v
/portal/auth/*
    |
    | Firebase Authentication
    v
/portal/student/*, /portal/agent/*, /portal/staff/*, /portal/admin/*, /portal/super-admin/*
    |
    | role guard + Firestore Security Rules
    v
Cloud Firestore collections
    |
    | metadata only
    v
Cloud Storage private files
    |
    | server-trusted workflows
    v
Cloud Functions
```

## Backend modules

| Module | Firebase product | Purpose |
|---|---|---|
| Login/signup | Firebase Auth | Email/password identity, password reset, verification later |
| Role profile | Firestore `users` | App role, status, team, permissions, profile metadata |
| Student CRM | Firestore `students` | Student profile, owner/agent/staff assignment |
| Applications | Firestore `applications` | University/program choices, status, timeline |
| Documents | Firestore `documents` + Storage | Metadata in Firestore, file in Storage |
| Agent portal | Firestore `agents`, `commissions` | Students, payouts, partner tracking |
| Staff portal | Firestore `staff_tasks`, team assignment | Ekhlas/Maanisha/Rafshan/SEO workspaces |
| Admin portal | Firestore + Cloud Functions | Approvals, audits, reports, security actions |
| Notifications | Firestore `notifications` + Functions | User alerts and admin alerts |
| Audit logs | Firestore `audit_logs` via Functions | Immutable record of sensitive actions |

## Role model

Use **Firebase Auth UID** as the user identity and store GEES-specific role data in Firestore:

```text
/users/{uid}
```

Each user profile should include:

```json
{
  "uid": "firebaseAuthUid",
  "email": "student@example.com",
  "displayName": "Student Name",
  "role": "student",
  "status": "active",
  "teamId": null,
  "permissions": ["student:read_self"],
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

## Launch-safe role strategy

Start simple:

```text
student
agent
staff
aadmin-like: admin
super_admin
```

Then add permission arrays gradually:

```text
students:read_assigned
students:update_assigned
applications:review
approvals:manage
audit_logs:read
documents:approve
commissions:read_assigned
```

## Security rules principle

Frontend role guards are only for user experience. The real security must be in Firebase Security Rules and Cloud Functions. A user should not be able to read or write restricted data even if they manually open DevTools or directly call Firebase.

## Demo-to-real replacement plan

Current Phase 8 demo files:

```text
portal/shared/js/demo-backend.js
portal/shared/data/demo-users.json
portal/shared/data/demo-students.json
portal/shared/data/demo-applications.json
portal/shared/data/demo-documents.json
portal/shared/data/demo-commissions.json
portal/shared/data/demo-approvals.json
portal/shared/data/demo-audit-logs.json
portal/shared/data/demo-notifications.json
```

Replace with:

```text
portal/shared/js/firebase-backend.js
portal/shared/js/firebase-config.js
portal/shared/js/firebase-auth-adapter.js
portal/shared/js/firebase-data-adapter.js
```

The page UI should keep calling a stable adapter API such as:

```text
GEESBackend.getCurrentUser()
GEESBackend.getDashboardStats(role)
GEESBackend.getApplications()
GEESBackend.uploadDocument(file, metadata)
GEESBackend.createNotification(payload)
GEESBackend.logout()
```

## Collection naming style

Use plural snake_case or plural lowercase consistently. Recommended:

```text
users
students
agents
staff_profiles
applications
documents
commissions
approvals
audit_logs
notifications
support_tickets
chat_threads
chat_messages
universities
courses
payments
agreements
```

## Backend phases after this blueprint

1. Create Firebase project.
2. Enable Authentication with email/password.
3. Create Firestore database.
4. Create Storage bucket with budget alert and strict rules.
5. Add Firebase config to portal.
6. Replace demo auth with Firebase Auth.
7. Replace demo data reads with Firestore reads.
8. Add Storage uploads for documents.
9. Add Cloud Functions for sensitive workflows.
10. Move admin-only workflows from browser into Cloud Functions.

## Sources consulted

- Firebase Authentication: https://firebase.google.com/docs/auth
- Cloud Firestore: https://firebase.google.com/docs/firestore
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Cloud Storage for Firebase: https://firebase.google.com/docs/storage
- Cloud Storage Security Rules: https://firebase.google.com/docs/storage/security
- Cloud Storage billing requirements FAQ: https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
- Cloud Functions for Firebase: https://firebase.google.com/docs/functions
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Firebase Pricing: https://firebase.google.com/pricing
