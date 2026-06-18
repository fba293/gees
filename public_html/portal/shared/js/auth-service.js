(function(){
  'use strict';

  var STORAGE = {
    session: 'gees_portal_session',
    legacy: 'gees_demo_session',
    lastAuthMode: 'gees_last_auth_mode'
  };

  var ROLE_DASHBOARD = {
    student: '/portal/student/dashboard.html',
    agent: '/portal/agent/dashboard.html',
    staff: '/portal/staff/dashboard.html',
    admin: '/portal/admin/dashboard.html',
    super_admin: '/portal/super-admin/dashboard.html'
  };

  var LEGACY_PERMISSIONS = {
    student: ['student.dashboard','student.application','student.document-vault','student.pipeline','student.details'],
    agent: ['agent.dashboard','agent.students','agent.commissions','agent.universities','agent.scholarships','agent.support'],
    staff: ['staff.dashboard','staff.ekhlas.dashboard','staff.ekhlas.india-outreach','staff.ekhlas.community-auditor','staff.ekhlas.training','staff.maanisha.dashboard','staff.maanisha.inti-benchmarks','staff.maanisha.revenue-forecast','staff.maanisha.university-vault','staff.rafshan.dashboard','staff.rafshan.community-manager','staff.rafshan.reels-library','staff.rafshan.strategy-calendar','staff.seo.dashboard'],
    admin: ['admin.dashboard','admin.reports','admin.help','admin.wiki','admin.analytics','admin.crm','admin.agreements','admin.students','manage_approvals','view_reports','view_audit_logs','manage_users'],
    super_admin: ['*']
  };

  var SUPABASE_PERMISSION_ALIAS = {
    student: ['view_own_dashboard','manage_own_profile','create_application','upload_documents','view_own_documents','use_support','use_chat'],
    agent: ['view_own_dashboard','manage_own_profile','view_assigned_students','view_commissions','use_support','use_chat'],
    staff: ['view_own_dashboard','manage_own_profile','view_assigned_students','manage_assigned_applications','upload_documents','use_support','use_chat'],
    admin: ['view_own_dashboard','manage_own_profile','view_assigned_students','manage_assigned_applications','upload_documents','manage_commissions','manage_catalogue','manage_approvals','view_reports','view_audit_logs','manage_users','use_support','use_chat'],
    super_admin: ['*']
  };

  var memoryStore = window.__GEESPortalMemoryStore || {};
  window.__GEESPortalMemoryStore = memoryStore;

  function storage(){
    if(window.GEESPortalStorage) return window.GEESPortalStorage;
    return {
      mode:'memory',
      persisted:false,
      getItem:function(key){ return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null; },
      setItem:function(key, value){ memoryStore[key] = String(value); },
      removeItem:function(key){ delete memoryStore[key]; }
    };
  }

  function normaliseRole(role){
    return String(role || '').toLowerCase().replace(/-/g, '_').replace(/\s+/g, '_');
  }

  function readJSON(key, fallback){
    try{
      var value = storage().getItem(key);
      return value ? JSON.parse(value) : fallback;
    }catch(error){ return fallback; }
  }

  function writeJSON(key, value){
    try{ storage().setItem(key, JSON.stringify(value)); return true; }
    catch(error){ memoryStore[key] = JSON.stringify(value); return false; }
  }

  function removeStored(key){ try{ storage().removeItem(key); }catch(error){ delete memoryStore[key]; } }
  function clearStoredSession(){ removeStored(STORAGE.session); removeStored(STORAGE.legacy); }

  function appendDemoSession(url, demoId){
    if(!demoId) return url;
    try{
      var target = new URL(url, location.origin);
      target.searchParams.set('gees_demo_session', demoId);
      return target.pathname + target.search + target.hash;
    }catch(error){
      return url + (url.indexOf('?') === -1 ? '?' : '&') + 'gees_demo_session=' + encodeURIComponent(demoId);
    }
  }

  function dashboardFor(role, teamId){
    role = normaliseRole(role);
    if(role === 'staff'){
      if(teamId === 'ekhlas') return '/portal/staff/ekhlas/dashboard.html';
      if(teamId === 'maanisha') return '/portal/staff/maanisha/dashboard.html';
      if(teamId === 'rafshan') return '/portal/staff/rafshan/dashboard.html';
      if(teamId === 'seo') return '/portal/staff/seo/dashboard.html';
    }
    return ROLE_DASHBOARD[role] || ROLE_DASHBOARD.student;
  }

  function safePortalNext(value, fallback){
    if(!value) return fallback;
    try{
      var url = new URL(value, location.origin);
      if(url.origin === location.origin && url.pathname.indexOf('/portal/') === 0) return url.pathname + url.search + url.hash;
    }catch(error){}
    return fallback;
  }

  function expectedRoleAllows(expectedRole, actualRole){
    expectedRole = normaliseRole(expectedRole);
    actualRole = normaliseRole(actualRole);
    if(!expectedRole) return true;
    if(expectedRole === 'admin') return actualRole === 'admin' || actualRole === 'super_admin';
    return expectedRole === actualRole;
  }

  function buildSession(profile, options){
    options = options || {};
    var role = normaliseRole(profile && profile.role) || 'student';
    var teamId = profile && profile.team_id ? profile.team_id : role;
    var permissions = [];
    if(role === 'super_admin') permissions = ['*'];
    else{
      permissions = permissions.concat(LEGACY_PERMISSIONS[role] || []);
      permissions = permissions.concat(SUPABASE_PERMISSION_ALIAS[role] || []);
      permissions = permissions.concat(options.permissions || []);
    }
    var session = {
      id: profile && profile.id,
      name: (profile && (profile.full_name || profile.email)) || 'GEES User',
      email: (profile && profile.email) || '',
      role: role,
      status: (profile && profile.status) || 'pending',
      teamId: teamId,
      dashboard: dashboardFor(role, teamId),
      permissions: Array.from(new Set(permissions)),
      source: options.source || 'supabase',
      loginAt: new Date().toISOString()
    };
    writeJSON(STORAGE.session, session);
    if(options.source === 'demo') writeJSON(STORAGE.legacy, session);
    return session;
  }

  function getSupabase(){ return window.GEESSupabase || null; }
  function isDemoEmail(email){ return /@gees\.demo$/i.test(String(email || '').trim()); }

  async function fetchProfile(userId){
    var client = getSupabase();
    if(!client || !userId) return null;
    var response = await client.from('profiles').select('id,email,full_name,phone,role,status,team_id,avatar_url').eq('id', userId).maybeSingle();
    if(response.error) throw new Error(response.error.message || 'Unable to read GEES profile.');
    return response.data;
  }

  async function fetchPermissionKeys(role){
    var client = getSupabase();
    role = normaliseRole(role);
    if(!client || !role) return [];
    try{
      var response = await client.from('role_permissions').select('permission').eq('role', role);
      if(response.error) return [];
      return (response.data || []).map(function(row){ return row.permission; }).filter(Boolean);
    }catch(error){ return []; }
  }

  async function getRealSession(){
    var client = getSupabase();
    if(!client) return null;
    var sessionResponse = await client.auth.getSession();
    if(sessionResponse.error || !sessionResponse.data || !sessionResponse.data.session) return null;
    var user = sessionResponse.data.session.user;
    var profile = await fetchProfile(user.id);
    if(!profile) return null;
    var permissionKeys = await fetchPermissionKeys(profile.role);
    return buildSession(profile, { source: 'supabase', permissions: permissionKeys });
  }

  async function getPortalSession(){
    try{
      var real = await getRealSession();
      if(real) return real;
    }catch(error){ console.warn('[GEES Auth] Supabase session check failed; falling back to local demo session.', error); }
    if(window.GEESDemoBackend && typeof window.GEESDemoBackend.sessionFromUrl === 'function'){
      var urlDemo = window.GEESDemoBackend.sessionFromUrl();
      if(urlDemo) return urlDemo;
    }
    if(window.GEESDemoBackend && typeof window.GEESDemoBackend.session === 'function') return window.GEESDemoBackend.session();
    return readJSON(STORAGE.session, null);
  }

  function explainAuthError(error, context){
    var raw = String((error && error.message) || error || '');
    var text = raw.toLowerCase();
    if(text.indexOf('operation is insecure') !== -1 || text.indexOf('securityerror') !== -1){
      return { type:'storage_blocked', message:'Browser storage is blocked. GEES now supports safe demo-session fallback, but use http://localhost or your live domain instead of opening files directly, and allow site storage/cookies.' };
    }
    if(text.indexOf('signups not allowed') !== -1 || text.indexOf('signup_disabled') !== -1 || text.indexOf('signup is disabled') !== -1){
      return { type:'signup_disabled', message:'Supabase signup is currently disabled. Turn ON Authentication → Providers → Email → Allow new users to sign up.' };
    }
    if(text.indexOf('email signups are disabled') !== -1 || text.indexOf('email_provider_disabled') !== -1){
      return { type:'email_provider_disabled', message:'Supabase Email provider is OFF. Turn ON Authentication → Providers → Email provider.' };
    }
    if(text.indexOf('email rate limit') !== -1 || text.indexOf('rate limit exceeded') !== -1 || text.indexOf('too many requests') !== -1){
      return { type:'email_rate_limit', message:'Supabase email rate limit reached. For testing, turn Confirm email OFF temporarily or configure custom SMTP.' };
    }
    if(text.indexOf('email not confirmed') !== -1) return { type:'email_not_confirmed', message:'This email is not confirmed yet. Confirm the email or turn Confirm email OFF during testing.' };
    return { type:'unknown', message: raw || 'Request failed. Please try again.' };
  }

  async function login(options){
    options = options || {};
    var email = String(options.email || '').trim().toLowerCase();
    var password = String(options.password || '');
    var expectedRole = normaliseRole(options.role);

    if(isDemoEmail(email)){
      if(!window.GEESDemoBackend) throw new Error('Demo backend is not loaded.');
      var demoSession = window.GEESDemoBackend.login(email, password, expectedRole);
      demoSession.source = 'demo';
      demoSession.status = 'active';
      writeJSON(STORAGE.session, demoSession);
      writeJSON(STORAGE.legacy, demoSession);
      try{ storage().setItem(STORAGE.lastAuthMode, 'demo'); }catch(error){}
      var next = safePortalNext(options.next, demoSession.dashboard);
      if(storage().mode === 'memory') next = appendDemoSession(next, demoSession.id);
      return { mode: 'demo', session: demoSession, next: next };
    }

    var client = getSupabase();
    if(!client) throw new Error('Supabase client is unavailable. Use demo credentials or check your internet/CDN connection.');
    var authResponse = await client.auth.signInWithPassword({ email: email, password: password });
    if(authResponse.error) throw new Error(authResponse.error.message || 'Supabase login failed.');
    if(!authResponse.data || !authResponse.data.user) throw new Error('Supabase login did not return a user session.');

    var profile = await fetchProfile(authResponse.data.user.id);
    if(!profile){ await client.auth.signOut(); clearStoredSession(); throw new Error('Your GEES profile is missing. Please contact an admin.'); }
    var actualRole = normaliseRole(profile.role);
    if(!expectedRoleAllows(expectedRole, actualRole)){ await client.auth.signOut(); clearStoredSession(); throw new Error('This account is not allowed for the selected portal.'); }
    if(profile.status !== 'active'){ await client.auth.signOut(); clearStoredSession(); throw new Error('Your GEES account is currently ' + profile.status + '. Please wait for admin approval.'); }

    var permissions = await fetchPermissionKeys(profile.role);
    var session = buildSession(profile, { source: 'supabase', permissions: permissions });
    try{ storage().setItem(STORAGE.lastAuthMode, 'supabase'); }catch(error){}
    return { mode: 'supabase', session: session, next: safePortalNext(options.next, session.dashboard) };
  }

  async function signup(options){
    options = options || {};
    var role = normaliseRole(options.role || 'student');
    if(['student','agent','staff'].indexOf(role) === -1) throw new Error('Only student, agent, and staff signup are open from the website. Admin users must be created manually.');
    var client = getSupabase();
    if(!client) throw new Error('Supabase client is unavailable. Signup is temporarily in demo/setup mode.');
    var email = String(options.email || '').trim().toLowerCase();
    var password = String(options.password || '');
    if(!email || !password) throw new Error('Email and password are required.');
    if(password.length < 8) throw new Error('Password should be at least 8 characters for real Supabase signup.');
    var metadata = Object.assign({}, options.metadata || {}, { role: role, full_name: options.fullName || options.name || '', phone: options.phone || '', team_id: role === 'staff' ? (options.teamId || 'staff') : role });
    var response = await client.auth.signUp({ email: email, password: password, options: { data: metadata, emailRedirectTo: location.origin + '/portal/auth/' + role + '-login.html' } });
    if(response.error) throw new Error(response.error.message || 'Supabase signup failed.');
    return { mode: 'supabase', user: response.data && response.data.user, session: response.data && response.data.session, status: role === 'student' ? 'active_or_email_confirmation' : 'pending_admin_approval', message: role === 'student' ? 'Signup submitted. Check your email if confirmation is enabled, then sign in.' : 'Signup submitted. Your account is pending GEES admin approval.' };
  }

  async function listPendingUserApprovals(){ var client = getSupabase(); if(!client) throw new Error('Supabase client is unavailable.'); var response = await client.rpc('get_pending_gees_user_approvals'); if(response.error) throw new Error(response.error.message || 'Unable to load pending approvals.'); return response.data || []; }
  async function approveUser(userId, note){ var client = getSupabase(); if(!client) throw new Error('Supabase client is unavailable.'); var response = await client.rpc('approve_gees_user', { p_user_id: userId, p_note: note || null }); if(response.error) throw new Error(response.error.message || 'Unable to approve user.'); return response.data; }
  async function rejectUser(userId, note){ var client = getSupabase(); if(!client) throw new Error('Supabase client is unavailable.'); var response = await client.rpc('reject_gees_user', { p_user_id: userId, p_note: note || null }); if(response.error) throw new Error(response.error.message || 'Unable to reject user.'); return response.data; }
  async function logout(){ var client = getSupabase(); try{ if(client) await client.auth.signOut(); }catch(error){} if(window.GEESDemoBackend && typeof window.GEESDemoBackend.logout === 'function') try{ window.GEESDemoBackend.logout(); }catch(error){} clearStoredSession(); }

  window.GEESAuthService = { storage: STORAGE, dashboards: ROLE_DASHBOARD, normaliseRole: normaliseRole, dashboardFor: dashboardFor, safePortalNext: safePortalNext, expectedRoleAllows: expectedRoleAllows, getPortalSession: getPortalSession, getRealSession: getRealSession, explainAuthError: explainAuthError, login: login, signup: signup, listPendingUserApprovals: listPendingUserApprovals, approveUser: approveUser, rejectUser: rejectUser, logout: logout, buildSession: buildSession };
})();
