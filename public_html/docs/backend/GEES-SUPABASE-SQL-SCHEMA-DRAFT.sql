-- GEES Supabase SQL Schema Draft
-- Review before running in Supabase SQL Editor.
-- Phase 9B creates this blueprint only; it does not execute it.

create extension if not exists "pgcrypto";

-- 1) ENUMS

do $$ begin
  create type public.gees_role as enum ('student','agent','staff','admin','super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gees_user_status as enum ('pending','active','rejected','suspended','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gees_application_status as enum ('draft','submitted','under_review','documents_required','offer_received','visa_processing','approved','rejected','withdrawn');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gees_document_status as enum ('pending','uploaded','under_review','approved','rejected','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gees_approval_status as enum ('pending','approved','rejected','cancelled');
exception when duplicate_object then null; end $$;

-- 2) PROFILES

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role public.gees_role not null default 'student',
  status public.gees_user_status not null default 'pending',
  team_id text,
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role public.gees_role not null,
  permission text not null,
  created_at timestamptz not null default now(),
  unique(role, permission)
);

-- 3) ROLE-SPECIFIC PROFILES

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  preferred_country text,
  preferred_level text,
  preferred_intake text,
  assigned_agent_id uuid,
  assigned_staff_id uuid,
  lead_source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  agency_name text,
  company_type text,
  country text,
  city text,
  approval_status public.gees_approval_status not null default 'pending',
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  team_id text,
  title text,
  department text,
  manager_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- 4) CATALOGUE

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  city text,
  logo_url text,
  website_url text,
  status text not null default 'active',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id) on delete set null,
  title text not null,
  field_of_study text,
  level text,
  duration text,
  tuition_fee numeric(12,2),
  currency text default 'MYR',
  intake_months text[],
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5) APPLICATIONS AND DOCUMENTS

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  agent_id uuid references public.agents(id),
  staff_id uuid references public.staff_profiles(id),
  university_id uuid references public.universities(id),
  course_id uuid references public.courses(id),
  status public.gees_application_status not null default 'draft',
  intake text,
  application_no text unique,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  old_status public.gees_application_status,
  new_status public.gees_application_status not null,
  note text,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  document_type text not null,
  file_name text,
  storage_bucket text,
  storage_path text,
  mime_type text,
  size_bytes bigint,
  status public.gees_document_status not null default 'pending',
  uploaded_by uuid references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6) FINANCE AND AGREEMENTS

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  student_id uuid references public.students(id),
  application_id uuid references public.applications(id),
  amount numeric(12,2) not null default 0,
  currency text not null default 'MYR',
  status text not null default 'pending',
  due_at date,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id),
  application_id uuid references public.applications(id),
  amount numeric(12,2) not null default 0,
  currency text not null default 'MYR',
  payment_type text,
  status text not null default 'pending',
  receipt_document_id uuid references public.documents(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agreements (
  id uuid primary key default gen_random_uuid(),
  related_user_id uuid references public.profiles(id),
  related_agent_id uuid references public.agents(id),
  title text not null,
  status text not null default 'draft',
  storage_bucket text,
  storage_path text,
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7) OPERATIONS

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  approval_type text not null,
  target_table text,
  target_id uuid,
  requested_by uuid references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  status public.gees_approval_status not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_table text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  opened_by uuid not null references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  subject text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  title text,
  participant_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- 8) INDEXES

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_students_user_id on public.students(user_id);
create index if not exists idx_agents_user_id on public.agents(user_id);
create index if not exists idx_applications_student_id on public.applications(student_id);
create index if not exists idx_documents_student_id on public.documents(student_id);
create index if not exists idx_notifications_recipient_id on public.notifications(recipient_id);
create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
