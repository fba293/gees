-- Phase 13: Storage and documents
insert into storage.buckets (id, name, public) values ('student-documents','student-documents',false)
on conflict (id) do nothing;

alter table public.documents add column if not exists storage_path text;
alter table public.documents add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;
alter table public.documents add column if not exists reviewed_at timestamptz;

-- Storage policies should be reviewed in Supabase dashboard before production.
