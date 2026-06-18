/* GEES Auth Page Supabase Starter - Phase 10A
   Add this only after schema/RLS is applied and supabase-config.js is enabled.
*/
(function () {
  'use strict';

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function setStatus(form, message, type = 'info') {
    const status = qs('[data-status]', form) || qs('[data-status]');
    if (!status) return;
    status.textContent = message;
    status.dataset.type = type;
    status.setAttribute('role', type === 'error' ? 'alert' : 'status');
  }

  function formToObject(form) {
    const data = new FormData(form);
    const out = {};
    data.forEach((value, key) => {
      if (value instanceof File) return;
      out[key] = String(value).trim();
    });
    return out;
  }

  async function bindLogin(form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!window.GEESSupabaseAuth || !window.GEESSupabaseClient || !window.GEESSupabaseClient.isConfigured()) {
        setStatus(form, 'Supabase is not enabled yet. Keep using demo login until setup is complete.', 'error');
        return;
      }

      const payload = formToObject(form);
      const email = payload.email || payload.user_email || payload.login_email;
      const password = payload.password || payload.user_password || payload.login_password;

      if (!email || !password) {
        setStatus(form, 'Please enter email and password.', 'error');
        return;
      }

      try {
        setStatus(form, 'Signing in securely...', 'info');
        const result = await window.GEESSupabaseAuth.signIn(email, password);
        setStatus(form, 'Login successful. Redirecting...', 'success');
        const next = new URLSearchParams(location.search).get('next');
        window.location.href = next && next.startsWith('/portal/') ? next : result.redirectTo;
      } catch (error) {
        setStatus(form, error.message || 'Login failed.', 'error');
      }
    });
  }

  async function bindSignup(form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!window.GEESSupabaseAuth || !window.GEESSupabaseClient || !window.GEESSupabaseClient.isConfigured()) {
        setStatus(form, 'Supabase is not enabled yet. Keep using demo signup until setup is complete.', 'error');
        return;
      }

      const payload = formToObject(form);
      payload.role = form.dataset.role || document.body.dataset.role || payload.role || 'student';

      if (!payload.email || !payload.password) {
        setStatus(form, 'Please enter email and password.', 'error');
        return;
      }

      try {
        setStatus(form, 'Creating your account...', 'info');
        const result = await window.GEESSupabaseAuth.signUp(payload);
        setStatus(form, 'Account created. Check email if confirmation is enabled.', 'success');
        window.location.href = result.redirectTo;
      } catch (error) {
        setStatus(form, error.message || 'Signup failed.', 'error');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    qsa('form[data-auth-form]').forEach(bindLogin);
    qsa('form[data-auth-signup-form]').forEach(bindSignup);
  });
})();
