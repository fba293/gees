/* GEES Supabase Auth Service Starter - Phase 10A
   Uses Supabase when configured; otherwise falls back to existing demo backend if available.
*/
(function () {
  'use strict';

  const DASHBOARD_BY_ROLE = {
    student: '/portal/student/dashboard.html',
    agent: '/portal/agent/dashboard.html',
    staff: '/portal/staff/dashboard.html',
    admin: '/portal/admin/dashboard.html',
    super_admin: '/portal/super-admin/dashboard.html'
  };

  function safeRole(role) {
    return DASHBOARD_BY_ROLE[role] ? role : 'student';
  }

  function getDashboardUrl(role) {
    return DASHBOARD_BY_ROLE[safeRole(role)];
  }

  async function getSupabase() {
    if (!window.GEESSupabaseClient) return null;
    return window.GEESSupabaseClient.getClient();
  }

  async function getSession() {
    const supabase = await getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function getCurrentUser() {
    const supabase = await getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user || null;
  }

  async function getProfile() {
    const supabase = await getSupabase();
    const user = await getCurrentUser();
    if (!supabase || !user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const supabase = await getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured yet. Demo fallback can remain active.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const profile = await getProfile();
    return {
      user: data.user,
      session: data.session,
      profile,
      role: profile ? profile.role : 'student',
      redirectTo: getDashboardUrl(profile ? profile.role : 'student')
    };
  }

  async function signUp(payload) {
    const supabase = await getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured yet. Demo fallback can remain active.');
    }

    const role = safeRole(payload.role || 'student');
    if (role === 'admin' || role === 'super_admin') {
      throw new Error('Admin accounts must be created manually by the owner.');
    }

    const metadata = {
      role,
      full_name: payload.full_name || payload.fullName || '',
      phone: payload.phone || '',
      preferred_country: payload.preferred_country || payload.country || '',
      preferred_level: payload.preferred_level || payload.level || '',
      preferred_intake: payload.preferred_intake || payload.intake || '',
      agency_name: payload.agency_name || payload.agencyName || '',
      company_type: payload.company_type || payload.companyType || '',
      city: payload.city || '',
      country: payload.country || '',
      team_id: payload.team_id || payload.teamId || ''
    };

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: { data: metadata }
    });

    if (error) throw error;
    return {
      user: data.user,
      session: data.session,
      role,
      redirectTo: role === 'student' ? getDashboardUrl(role) : '/thank-you.html?type=' + encodeURIComponent(role + '-signup')
    };
  }

  async function signOut() {
    const supabase = await getSupabase();
    if (supabase) await supabase.auth.signOut();
    try { localStorage.removeItem('gees_portal_demo_session'); } catch (_) {}
    window.location.href = '/portal/auth/student-login.html';
  }

  async function requireRole(allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : String(allowedRoles || '').split(',').map(s => s.trim()).filter(Boolean);
    const supabase = await getSupabase();

    if (!supabase) {
      return { mode: 'demo', allowed: true, profile: null };
    }

    const session = await getSession();
    if (!session) {
      window.location.href = '/portal/auth/student-login.html?next=' + encodeURIComponent(location.pathname);
      return { mode: 'supabase', allowed: false, profile: null };
    }

    const profile = await getProfile();
    const role = profile && profile.role;
    const status = profile && profile.status;
    const allowed = !!profile && status === 'active' && (roles.length === 0 || roles.includes(role));

    if (!allowed) {
      window.location.href = '/portal/forbidden.html';
      return { mode: 'supabase', allowed: false, profile };
    }

    return { mode: 'supabase', allowed: true, profile };
  }

  window.GEESSupabaseAuth = {
    getDashboardUrl,
    getSession,
    getCurrentUser,
    getProfile,
    signIn,
    signUp,
    signOut,
    requireRole
  };
})();
