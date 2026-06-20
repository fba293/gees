-- GEES public lead capture hardening
-- Applied live on 2026-06-20. Safe to re-run.
-- Anonymous visitors may create only new leads and must provide a usable email or phone.

alter policy gees_leads_public_insert on public.leads
with check (
  full_name is not null
  and length(trim(full_name)) between 2 and 160
  and coalesce(length(trim(email)), 0) <= 220
  and coalesce(length(trim(phone)), 0) <= 80
  and coalesce(length(trim(preferred_country)), 0) <= 120
  and coalesce(length(trim(message)), 0) <= 3000
  and coalesce(length(trim(source)), 0) <= 120
  and status = 'new'
  and (
    nullif(trim(coalesce(email, '')), '') is not null
    or nullif(trim(coalesce(phone, '')), '') is not null
  )
);