/* GEES Supabase Role Guard Starter - Phase 10A
   This is a starter replacement for demo role-guard after Supabase is enabled.
*/
(function () {
  'use strict';

  function getRequiredRoles() {
    const el = document.querySelector('[data-required-roles], [data-required-role]') || document.body;
    const raw = el.dataset.requiredRoles || el.dataset.requiredRole || document.body.dataset.requiredRoles || document.body.dataset.requiredRole || '';
    return raw.split(',').map(v => v.trim()).filter(Boolean);
  }

  async function initGuard() {
    if (!window.GEESSupabaseClient || !window.GEESSupabaseClient.isConfigured()) {
      document.documentElement.classList.add('gees-demo-guard-active');
      return;
    }

    const required = getRequiredRoles();
    if (!window.GEESSupabaseAuth || required.length === 0) return;

    try {
      const result = await window.GEESSupabaseAuth.requireRole(required);
      if (result.allowed && result.profile) {
        document.documentElement.dataset.geesRole = result.profile.role;
        document.documentElement.dataset.geesStatus = result.profile.status;
        window.GEES_CURRENT_PROFILE = result.profile;
        window.dispatchEvent(new CustomEvent('gees:profile-ready', { detail: result.profile }));
      }
    } catch (error) {
      console.error('[GEES] Supabase role guard failed:', error);
      window.location.href = '/portal/auth/student-login.html?next=' + encodeURIComponent(location.pathname);
    }
  }

  document.addEventListener('DOMContentLoaded', initGuard);
})();
