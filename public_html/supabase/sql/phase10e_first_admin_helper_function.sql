-- GEES Phase 10E optional helper: promote first admin by email
-- Run this once in Supabase SQL Editor.
-- Then run: select public.gees_promote_first_admin_by_email('your-email@example.com');

create or replace function public.gees_promote_first_admin_by_email(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_email text;
begin
  if p_email is null or length(trim(p_email)) < 5 then
    raise exception 'A valid email is required';
  end if;

  select id, email into v_user_id, v_email
  from auth.users
  where lower(email) = lower(trim(p_email))
  limit 1;

  if v_user_id is null then
    raise exception 'No Supabase Auth user found for email: %', p_email;
  end if;

  insert into public.profiles (id, email, full_name, role, status, created_at, updated_at)
  values (v_user_id, v_email, v_email, 'super_admin', 'active', now(), now())
  on conflict (id) do update
    set role = 'super_admin',
        status = 'active',
        email = excluded.email,
        updated_at = now();

  insert into public.audit_logs (actor_id, action, entity_table, entity_id, metadata)
  values (v_user_id, 'first_admin_bootstrap', 'profiles', v_user_id, jsonb_build_object('email', v_email, 'role', 'super_admin'));

  return jsonb_build_object('ok', true, 'user_id', v_user_id, 'email', v_email, 'role', 'super_admin', 'status', 'active');
end;
$$;

revoke execute on function public.gees_promote_first_admin_by_email(text) from public, anon, authenticated;
-- Only use this from SQL Editor. Do not grant it to web users.
