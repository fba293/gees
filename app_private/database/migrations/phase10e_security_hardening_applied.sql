-- GEES Phase 10E security hardening summary.
-- This was applied to the connected Supabase GEES project during Phase 10E.

create or replace function public.set_gees_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.handle_gees_new_auth_user() from public, anon, authenticated;
revoke execute on function public.queue_gees_profile_approval() from public, anon, authenticated;
revoke execute on function public.set_gees_updated_at() from public, anon, authenticated;

revoke execute on function public.approve_gees_user(uuid, text) from public, anon;
revoke execute on function public.reject_gees_user(uuid, text) from public, anon;
revoke execute on function public.get_pending_gees_user_approvals() from public, anon;

grant execute on function public.approve_gees_user(uuid, text) to authenticated;
grant execute on function public.reject_gees_user(uuid, text) to authenticated;
grant execute on function public.get_pending_gees_user_approvals() to authenticated;

-- RLS WITH CHECK clauses were also hardened for applications, documents, and support_tickets.
