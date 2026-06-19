-- Phase 18: Public leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text null,
  phone text null,
  preferred_country text null,
  message text null,
  source text not null default 'website',
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;
drop policy if exists gees_leads_public_insert on public.leads;
create policy gees_leads_public_insert on public.leads for insert to anon with check (true);
drop policy if exists gees_leads_admin_select on public.leads;
create policy gees_leads_admin_select on public.leads for select to authenticated using (is_gees_admin());
grant insert on public.leads to anon;
grant select, update on public.leads to authenticated;
