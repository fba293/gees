# GEES Firebase Security Rules Blueprint

Generated: 2026-06-18 01:15 UTC

This is a planning blueprint, not the final production rules file.

## Rule principles

1. All reads and writes require authentication.
2. Every user must have a `users/{uid}` profile.
3. Students can only read/write their own student-owned data.
4. Agents can only read assigned students/applications/commissions.
5. Staff can only read assigned staff-team data.
6. Admin can manage operational data but not super-admin-only security settings.
7. Super admin can manage all portal data.
8. Audit logs should be append-only and ideally written by Cloud Functions.
9. Documents should store metadata in Firestore and binary files in Storage.
10. Storage paths must match Firestore ownership.

## Firestore helper idea

```text
isSignedIn()
getUserRole()
isSuperAdmin()
isAdmin()
isOwner(uid)
hasPermission(permissionName)
```

## Important collection-level rules

| Collection | Student | Agent | Staff | Admin | Super Admin |
|---|---:|---:|---:|---:|---:|
| users | own profile read | own profile read | own profile read | read users | full |
| students | own student record | assigned only | assigned/team only | full | full |
| applications | own only | assigned only | assigned/team only | full | full |
| documents | own metadata | assigned metadata | assigned/team metadata | full | full |
| commissions | no | own only | no | full | full |
| approvals | no | own request status | assigned only | manage | full |
| audit_logs | no | no | no | read | full |
| notifications | own only | own only | own only | own + admin | full |

## Storage rule plan

Recommended paths:

```text
/student-documents/{studentId}/{docId}/{fileName}
/agent-documents/{agentId}/{docId}/{fileName}
/agreements/{agreementId}/{fileName}
/receipts/{paymentId}/{fileName}
```

## Upload restrictions

```text
PDF/JPG/JPEG/PNG only
Max file size: 5 MB for launch
Authenticated users only
Owner or assigned admin/staff only
```

## Cloud Functions needed for secure writes

Use Cloud Functions for:

```text
approveAgent()
rejectAgent()
approveDocument()
rejectDocument()
calculateCommission()
createAuditLog()
sendNotification()
changeUserRole()
```

Never allow normal browser users to directly write sensitive fields such as:

```text
role
permissions
commissionAmount
approvalStatus by admin
verifiedAt
securityFlags
auditLog owner fields
```
