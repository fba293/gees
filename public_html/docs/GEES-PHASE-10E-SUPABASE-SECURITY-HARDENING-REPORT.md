# GEES Phase 10E — Supabase Security Hardening Report

## Applied

- `set_gees_updated_at()` recreated with fixed `search_path`.
- Trigger-only functions revoked from public/anon/authenticated direct execution.
- Approval RPC functions revoked from public/anon and granted only to authenticated users.
- Helper functions revoked from public/anon and granted only to authenticated users.
- Three permissive `WITH CHECK (true)` RLS policies were replaced with bounded checks.

## Remaining advisory warnings

Supabase may still warn that authenticated users can execute some `SECURITY DEFINER` functions. This is expected for the current no-payment launch because the frontend approval flow needs authenticated admin RPCs.

Risk is reduced because:

- Anonymous users cannot execute the approval RPCs.
- The functions check `is_gees_admin()` before making changes.
- Non-admin authenticated users receive an error.

For future production hardening, move admin-only RPCs to Supabase Edge Functions or a non-public API schema.
