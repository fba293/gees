-- Phase 15: Commissions and agreements hardening
alter table public.commissions add column if not exists approved_by uuid references public.profiles(id) on delete set null;
alter table public.commissions add column if not exists approved_at timestamptz;
alter table public.commissions add column if not exists payout_reference text;
alter table public.agreements add column if not exists signed_by uuid references public.profiles(id) on delete set null;
alter table public.agreements add column if not exists signed_at timestamptz;
grant select, insert, update on public.commissions, public.agreements to authenticated;
