/* GEES Auth — Real Supabase Mode v14.0.0
   No demo IDs, no demo passwords, no local demo sessions. */
(function(){
  'use strict';
  if(window.GEES_REAL_AUTH_READY) return;
  window.GEES_REAL_AUTH_READY = true;

  const CONFIG = {
    version: '14.0.0-real-data',
    supabaseUrl: 'https://spljrvlebfeljqrqkiee.supabase.co',
    publishableKey: 'sb_publishable_frMPUvpzQw7aM415cDlIRg_jvuUwsCa',
    cdn: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    roles: {
      student: { label:'Student', login:'/student-login.html', signup:'/student-signup.html', dashboard:'/portal/student/dashboard', allowed:['student'], icon:'fa-graduation-cap' },
      agent: { label:'Agent', login:'/agent-login.html', signup:'/agent-signup.html', dashboard:'/portal/agent/dashboard', allowed:['agent'], icon:'fa-handshake' },
      staff: { label:'Staff', login:'/staff-login.html', signup:'/staff-signup.html', dashboard:'/portal/staff/dashboard', allowed:['staff'], icon:'fa-user-tie' },
      admin: { label:'Admin', login:'/admin-login.html', signup:'/contact-us.html', dashboard:'/portal/admin/dashboard', allowed:['admin','super_admin'], icon:'fa-shield-halved' },
      'super-admin': { label:'Super Admin', login:'/admin-login.html', signup:'/contact-us.html', dashboard:'/portal/super-admin/dashboard', allowed:['super_admin'], icon:'fa-user-shield' }
    },
    demoKeys: [
      'gees_demo_auth_users_v13',
      'gees_demo_auth_session_v13',
      'gees_demo_admin_notifications_v13'
    ]
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clean = value => String(value || '').trim();
  const cleanEmail = value => clean(value).toLowerCase();

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once:true });
    else fn();
  }

  function normalizeRole(role){
    const value = String(role || '').toLowerCase().replace(/_/g,'-').replace(/\s+/g,'-').trim();
    if(value === 'superadmin') return 'super-admin';
    if(value === 'super-admin') return 'super-admin';
    if(value === 'internal') return 'admin';
    return CONFIG.roles[value] ? value : 'student';
  }

  function dbRole(role){
    return normalizeRole(role).replace('super-admin','super_admin');
  }

  function roleFromPath(){
    const path = location.pathname.toLowerCase();
    if(path.includes('super-admin')) return 'super-admin';
    if(path.includes('admin')) return 'admin';
    if(path.includes('agent')) return 'agent';
    if(path.includes('staff')) return 'staff';
    return 'student';
  }

  function currentRole(form){
    return normalizeRole(form?.dataset?.role || document.body?.dataset?.role || roleFromPath());
  }

  function roleMeta(role){ return CONFIG.roles[normalizeRole(role)] || CONFIG.roles.student; }

  function setStatus(form, message, type){
    const target = $('[data-auth-status]', form) || $('.status-message', form) || $('[data-signup-status]', form) || $('[data-form-status]', form);
    if(target){
      target.textContent = message || '';
      target.className = target.className.replace(/\b(status|is)-(success|error|info|warning)\b/g,'').trim();
      target.classList.add(type === 'error' ? 'is-error' : type === 'success' ? 'is-success' : 'is-info');
      target.hidden = !message;
    } else if(message) {
      console[type === 'error' ? 'error' : 'log']('[GEES Auth]', message);
    }
  }

  function setBusy(form, busy, label){
    const btn = $('button[type="submit"], .auth-submit', form);
    if(!btn) return;
    if(!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = !!busy;
    btn.classList.toggle('is-loading', !!busy);
    if(busy) btn.innerHTML = '<span class="auth-loader-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>' + (label || 'Please wait...') + '</span>';
    else btn.innerHTML = btn.dataset.originalHtml;
  }

  function clearDemoStorage(){
    try{
      CONFIG.demoKeys.forEach(key => localStorage.removeItem(key));
      Object.keys(localStorage).forEach(key => {
        if(/^gees_demo_/i.test(key) || /^gees_demo_signup_draft_v13:/i.test(key)) localStorage.removeItem(key);
      });
    }catch(error){}
    delete window.GEESDemoAuth;
  }

  function removeDemoUi(root){
    const scope = root || document;
    $$('.gees-demo-credential-card, .gees-demo-draft-indicator, .gees-auth-demo-success-burst, [data-demo-fill], [data-demo-copy], [data-demo-draft-indicator], [data-clear-demo-draft]', scope).forEach(el => {
      const host = el.closest('.gees-demo-credential-card, .gees-demo-draft-indicator') || el;
      host.remove();
    });
    $$('[data-auth-real-mode-label]', scope).forEach(el => { el.textContent = 'Real Supabase mode'; });
  }

  function loadSupabase(){
    if(window.GEES_REAL_SUPABASE) return Promise.resolve(window.GEES_REAL_SUPABASE);
    if(window.supabase && typeof window.supabase.createClient === 'function'){
      window.GEES_REAL_SUPABASE = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.publishableKey, {
        auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
      });
      return Promise.resolve(window.GEES_REAL_SUPABASE);
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-gees-supabase-cdn]');
      if(existing){ existing.addEventListener('load', () => resolve(loadSupabase()), { once:true }); existing.addEventListener('error', reject, { once:true }); return; }
      const script = document.createElement('script');
      script.src = CONFIG.cdn;
      script.defer = true;
      script.dataset.geesSupabaseCdn = 'true';
      script.onload = () => resolve(loadSupabase());
      script.onerror = () => reject(new Error('Could not load Supabase client. Please check your internet connection.'));
      document.head.appendChild(script);
    });
  }

  async function client(){ return loadSupabase(); }

  function formValue(form, selectors){
    for(const selector of selectors){
      const el = $(selector, form);
      if(el && clean(el.value)) return clean(el.value);
    }
    return '';
  }

  function collectSignupMetadata(form, role){
    const data = { role: dbRole(role), lead_source: 'portal_signup' };
    const fd = new FormData(form);
    for(const [key, value] of fd.entries()){
      if(value instanceof File) continue;
      const name = String(key || '').trim();
      if(!name || /password|confirm/i.test(name)) continue;
      data[name] = clean(value);
    }
    data.full_name = data.full_name || data.name || formValue(form, ['#fullName','input[name="full_name"]','input[name="name"]','input[name="student_name"]','input[name="agency_contact_name"]']);
    data.phone = data.phone || [data.country_code, data.mobile || data.phone_number].filter(Boolean).join(' ').trim();
    if(role === 'agent') data.agency_name = data.agency_name || data.business_name || data.company_name || data.organization;
    if(role === 'staff') data.team_id = data.team_id || data.department || 'staff';
    return data;
  }

  async function getProfile(sb, userId){
    const { data, error } = await sb.from('profiles').select('id,email,full_name,role,status,team_id,last_login_at').eq('id', userId).maybeSingle();
    if(error) throw error;
    return data;
  }

  function dashboardFor(profile, requestedRole){
    const actual = String(profile?.role || dbRole(requestedRole)).replace('_','-');
    if(actual === 'super-admin') return CONFIG.roles['super-admin'].dashboard;
    const normalized = normalizeRole(actual);
    return roleMeta(normalized).dashboard;
  }

  function validateRole(profile, requestedRole){
    const requested = normalizeRole(requestedRole);
    const allowed = roleMeta(requested).allowed;
    const actual = String(profile?.role || '').toLowerCase();
    if(!allowed.includes(actual)){
      throw new Error('This account is not allowed to access the selected portal. Please choose the correct login type.');
    }
    const status = String(profile?.status || '').toLowerCase();
    if(status && !['active','verified','approved'].includes(status)){
      throw new Error('Your account is not active yet. Please wait for GEES approval or contact support.');
    }
  }

  async function handleLogin(form){
    const role = currentRole(form);
    const email = cleanEmail(formValue(form, ['input[type="email"]','input[name="email"]','#email','#loginEmail']));
    const password = formValue(form, ['input[type="password"]','input[name="password"]','#password','#loginPassword']);
    if(!email || !password) throw new Error('Please enter your real email and password.');
    const sb = await client();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if(error) throw new Error(error.message || 'Login failed. Please check your credentials.');
    const profile = await getProfile(sb, data.user.id);
    if(!profile) throw new Error('Your auth account exists but no GEES profile was found. Please contact GEES support.');
    validateRole(profile, role);
    try{ await sb.from('profiles').update({ last_login_at: new Date().toISOString() }).eq('id', data.user.id); }catch(error){}
    setStatus(form, 'Login successful. Opening your portal...', 'success');
    window.setTimeout(() => { location.href = dashboardFor(profile, role); }, 450);
  }

  async function handleSignup(form){
    const role = currentRole(form);
    if(['admin','super-admin'].includes(role)) throw new Error('Admin accounts cannot be created from the public signup page.');
    const email = cleanEmail(formValue(form, ['input[type="email"]','input[name="email"]','#email','#studentEmail','#agentEmail','#staffEmail']));
    const password = formValue(form, ['input[name="password"]','input[type="password"]','#password','#studentPassword','#agentPassword','#staffPassword']);
    const confirm = formValue(form, ['input[name="confirm_password"]','input[name="confirmPassword"]','#confirmPassword','#studentConfirmPassword','#agentConfirmPassword','#staffConfirmPassword']);
    if(!email || !password) throw new Error('Please enter a real email and password.');
    if(password.length < 8) throw new Error('Password must be at least 8 characters.');
    if(confirm && confirm !== password) throw new Error('Passwords do not match.');
    const metadata = collectSignupMetadata(form, role);
    const sb = await client();
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: metadata } });
    if(error) throw new Error(error.message || 'Signup failed.');
    const message = role === 'student'
      ? 'Account created. Please check your email if verification is required, then sign in.'
      : 'Application received. GEES will review and approve your account before portal access.';
    setStatus(form, message, 'success');
    form.reset();
    window.setTimeout(() => {
      if(role === 'student' && data.session) location.href = roleMeta(role).dashboard;
      else location.href = '/thank-you.html?type=' + encodeURIComponent(role + '-signup');
    }, 900);
  }

  function setupRoleSwitcher(){
    $$('[data-auth-role-option]').forEach(input => {
      input.addEventListener('change', () => {
        if(!input.checked) return;
        const role = normalizeRole(input.value);
        const meta = roleMeta(role);
        const form = $('[data-auth-form]');
        document.body.dataset.role = role;
        document.body.className = document.body.className.replace(/\bgees-auth-role-\S+/g,'').trim() + ' gees-auth-role-' + role.replace('_','-');
        if(form){ form.dataset.role = role; form.dataset.redirect = meta.dashboard; }
        $('[data-auth-form-label]') && ($('[data-auth-form-label]').textContent = meta.label + ' Portal');
      });
    });
  }

  function setupPasswordToggles(){
    document.addEventListener('click', event => {
      const btn = event.target.closest('[data-password-toggle]');
      if(!btn) return;
      const group = btn.closest('.input-group, .form-field, form') || document;
      const input = group.querySelector('input[type="password"], input[type="text"][name*="password" i]');
      if(!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if(icon) icon.className = show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  }

  function setupForms(){
    $$('form[data-auth-form], form[data-gees-auth], form.auth-form, form#loginForm, form#geesLoginForm').forEach(form => {
      if(form.dataset.geesRealAuthBound === 'true') return;
      form.dataset.geesRealAuthBound = 'true';
      form.addEventListener('submit', async event => {
        event.preventDefault();
        clearDemoStorage();
        removeDemoUi(document);
        const isSignup = /signup|register|create/i.test(document.body.dataset.page || location.pathname) || form.matches('[data-signup-form]') || !!form.querySelector('input[name="confirm_password"], input[name="confirmPassword"]');
        setBusy(form, true, isSignup ? 'Creating account...' : 'Signing in...');
        setStatus(form, isSignup ? 'Creating your real GEES account...' : 'Checking real GEES account...', 'info');
        try{
          if(isSignup) await handleSignup(form);
          else await handleLogin(form);
        }catch(error){
          setStatus(form, error.message || 'Authentication failed.', 'error');
        }finally{
          setBusy(form, false);
        }
      }, true);
    });
  }

  function blockOldDemoGlobals(){
    Object.defineProperty(window, 'GEESDemoAuth', {
      configurable: true,
      get(){ return undefined; },
      set(){ return true; }
    });
  }

  function init(){
    clearDemoStorage();
    blockOldDemoGlobals();
    removeDemoUi(document);
    setupRoleSwitcher();
    setupPasswordToggles();
    setupForms();
    loadSupabase().catch(() => {});
  }

  ready(init);
})();
