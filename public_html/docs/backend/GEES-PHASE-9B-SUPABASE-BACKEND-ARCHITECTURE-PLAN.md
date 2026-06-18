# GEES Phase 9B — Supabase Backend Architecture Plan

## Purpose

This document replaces the Phase 9 Firebase blueprint with a beginner-friendly Supabase backend plan for the GEES portal.

The goal is to keep the Phase 8 frontend and demo portal structure stable, then gradually replace demo data with Supabase Auth, Supabase Postgres, Row Level Security, and Supabase Storage.

## Connected project baseline

| Item | Value |
|---|---|
| Supabase project name | GEES |
| Project ref | `spljrvlebfeljqrqkiee` |
| Region | `ap-southeast-2` |
| Database | `Postgres 17.6.1` |
| Current public tables | No custom public tables found in earlier check |
| Action taken in Phase 9B | Blueprint only; no database tables created |

## Recommended backend stack

| Layer | Supabase service | Why |
|---|---|---|
| Login/signup | Supabase Auth | Replaces demo login and role sessions. |
| Main database | Supabase Postgres | Structured relational data for students, agents, applications, payments, documents, and approvals. |
| Access protection | Row Level Security | Protects data by role and ownership even if frontend code is bypassed. |
| File storage | Supabase Storage | For student documents, agreements, receipts, and profile uploads. |
| Backend actions | Postgres functions first, Edge Functions later | Keep beginner-friendly and avoid unnecessary backend complexity at launch. |
| Demo fallback | Existing Phase 8 demo backend | Keeps site usable while Supabase migration happens step by step. |

## Launch strategy

### Stage 1 — Auth only

Connect Supabase Auth to login/signup while keeping dashboard data in demo mode.

### Stage 2 — Profiles and roles

Create `profiles`, `students`, `agents`, and `staff_profiles` tables. Store role data and make the frontend role guard read from Supabase.

### Stage 3 — Applications and documents

Move application data and document metadata into Supabase. Upload actual documents to Supabase Storage.

### Stage 4 — Admin workflow

Add approvals, notifications, audit logs, agent approval, and status updates.

### Stage 5 — Full CRM

Add commissions, payments, agreements, reports, support tickets, and chat.

## Role model

Primary GEES roles:

```text
student
agent
staff
admin
super_admin
```

Optional staff assignment fields:

```text
team_id: ekhlas | maanisha | rafshan | seo | operations | admissions
```

Role hierarchy:

```text
super_admin > admin > staff > agent > student
```

## Data ownership model

| Data type | Owner rule |
|---|---|
| Student profile | Student user owns own profile. Admin/staff can manage. |
| Agent profile | Agent user owns own profile. Admin/super admin can approve/manage. |
| Applications | Student owns. Agent/staff/admin can access when assigned. |
| Documents | Student owns. Staff/admin can review. |
| Commissions | Agent can view own commission records only. Admin/super admin can manage. |
| Audit logs | Admin/super admin only. |
| Approvals | Admin/super admin only. |

## Critical security rules

1. Enable RLS on every table that is exposed to the browser.
2. Never trust frontend role checks only.
3. Keep service-role key private and never place it in public JavaScript.
4. Store user role in `profiles.role` and optionally mirror via JWT custom claims later.
5. Store uploaded file metadata in `documents`; keep storage path protected by role/owner.
6. Keep old demo mode available until Supabase auth and role flow is stable.

## Phase 10 recommendation

Start with Supabase Auth connection only:

```text
Phase 10A: Supabase Auth Connection Starter
```

Then:

```text
Phase 10B: Profiles + Role Guard Connection
Phase 10C: Applications + Documents Tables
Phase 10D: Admin Approval Workflow
```
