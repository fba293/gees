-- Phase 12E: Audit-log lookup performance for admin profile drill-down and audit history.
-- Safe to apply more than once. Does not change records or RLS policies.
create index if not exists idx_audit_logs_entity_created_at
  on public.audit_logs (entity_id, created_at desc)
  where entity_id is not null;

create index if not exists idx_audit_logs_actor_created_at
  on public.audit_logs (actor_id, created_at desc)
  where actor_id is not null;
