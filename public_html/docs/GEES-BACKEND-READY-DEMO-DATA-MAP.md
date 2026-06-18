# GEES Backend-Ready Demo Data Map

## Current demo files

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

## Future database tables

| Demo Data | Future Table | Notes |
|---|---|---|
| demo-users.json | users | role, teamId, permissions, password handled by real auth provider |
| demo-students.json | students | student profile and assigned counselor/agent |
| demo-applications.json | applications | status, progress, university/program choices |
| demo-documents.json | documents | file metadata only; actual files stored privately |
| demo-commissions.json | commissions | agent payouts and status |
| demo-approvals.json | approvals | super admin approval workflow |
| demo-audit-logs.json | audit_logs | immutable security/action logs |
| demo-notifications.json | notifications | per-user alert center |

## Future private storage

Use the existing planned private folders:

```text
app_private/student-documents/
app_private/receipts/
app_private/agreements/
app_private/logs/
app_private/config/
```

## API endpoints later

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/me
GET  /api/dashboard/:role
GET  /api/students
POST /api/students
GET  /api/applications
POST /api/documents/upload
GET  /api/commissions
GET  /api/approvals
POST /api/approvals/:id/action
GET  /api/audit-logs
GET  /api/notifications
```
