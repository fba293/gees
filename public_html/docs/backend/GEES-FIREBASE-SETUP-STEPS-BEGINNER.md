# GEES Firebase Setup Steps — Beginner-Friendly Launch

Generated: 2026-06-18 01:15 UTC

## Step 1 — Create Firebase project

1. Go to Firebase Console.
2. Create a project named `gees-portal` or `global-education-expert-services`.
3. Disable Google Analytics at first if you want the easiest setup. It can be enabled later.

## Step 2 — Enable Authentication

1. Open Build → Authentication.
2. Click Get started.
3. Enable Email/Password provider.
4. Later enable password reset and email verification.

## Step 3 — Create first admin user

1. Create your own admin email/password in Firebase Authentication.
2. Copy the generated Firebase UID.
3. Create a Firestore document:

```text
users/{uid}
```

With:

```json
{
  "uid": "PASTE_UID_HERE",
  "email": "admin@gees.demo",
  "displayName": "GEES Admin",
  "role": "super_admin",
  "status": "active",
  "permissions": ["*"]
}
```

## Step 4 — Create Firestore database

1. Open Build → Firestore Database.
2. Create database.
3. Start in locked/production mode, not test mode.
4. Add rules based on the security blueprint.

## Step 5 — Create Storage only when ready for file uploads

Because GEES needs document upload, use Firebase Storage with strict rules. Add budget alerts before allowing real users to upload files.

Recommended first limits:

```text
Max document size: 5 MB
Allowed types: PDF, JPG, JPEG, PNG
Path pattern: student-documents/{studentId}/{docId}/{fileName}
```

## Step 6 — Add Firebase config to portal

Create:

```text
public_html/portal/shared/js/firebase-config.js
```

It should hold only public Firebase config keys. Never put service account private keys in browser JS.

## Step 7 — Replace demo backend gradually

Do not replace the entire portal at once. Replace in this order:

1. Login/logout
2. Current user session
3. Role guard
4. Dashboard stats
5. Student applications
6. Document metadata
7. File upload
8. Notifications
9. Approvals
10. Audit logs

## Step 8 — Keep demo fallback until launch

Keep `demo-backend.js` available in development mode. That way you can test UI even if Firebase is offline or not configured.

## Step 9 — Test before live release

Test with these accounts:

```text
student
agent
staff
admin
super_admin
```

Check:

```text
wrong role blocked
right role allowed
logout works
refresh keeps session
uploaded file visible only to allowed user/admin
approval actions create audit logs
```
