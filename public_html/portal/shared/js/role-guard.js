(function(){
  'use strict';

  var DEMO_PERMISSION_ALIAS = {
    admin: ['manage_approvals','view_reports','view_audit_logs','manage_users','admin.dashboard','admin.reports','admin.help','admin.wiki','admin.analytics','admin.crm','admin.agreements','admin.students'],
    super_admin: ['*']
  };

  function loginFor(cfg){
    var roles = (cfg.requiredRoles || []).join(',');
    if(roles.indexOf('agent') !== -1) return '/portal/auth/agent-login.html';
    if(roles.indexOf('staff') !== -1) return '/portal/auth/staff-login.html';
    if(roles.indexOf('admin') !== -1 || roles.indexOf('super_admin') !== -1) return '/portal/auth/admin-login.html';
    return '/portal/auth/student-login.html';
  }

  function normaliseRole(role){
    if(window.GEESAuthService && window.GEESAuthService.normaliseRole) return window.GEESAuthService.normaliseRole(role);
    if(window.GEESDemoBackend && window.GEESDemoBackend.normaliseRole) return window.GEESDemoBackend.normaliseRole(role);
    return String(role || '').toLowerCase().replace(/-/g, '_').replace(/\s+/g, '_');
  }

  function hasPermission(session, permission){
    if(!permission || !session) return true;
    var role = normaliseRole(session.role);
    if(role === 'super_admin') return true;
    var permissions = session.permissions || [];
    if(permissions.indexOf('*') !== -1 || permissions.indexOf(permission) !== -1) return true;
    if(session.source === 'demo'){
      var aliases = DEMO_PERMISSION_ALIAS[role] || [];
      if(aliases.indexOf('*') !== -1 || aliases.indexOf(permission) !== -1) return true;
    }
    return false;
  }

  function canAccess(cfg, session){
    if(cfg && cfg.allowGuest) return true;
    if(!session) return false;
    var roles = (cfg.requiredRoles || []).map(normaliseRole);
    var role = normaliseRole(session.role);
    if(role === 'super_admin') return true;
    if(roles.length && roles.indexOf(role) === -1) return false;
    if(cfg.requiredTeam && role === 'staff' && session.teamId !== cfg.requiredTeam) return false;
    if(cfg.requiredPermission && !hasPermission(session, cfg.requiredPermission)) return false;
    if(session.source === 'supabase' && session.status && session.status !== 'active') return false;
    return true;
  }

  function redirectToLogin(cfg){
    var next = encodeURIComponent(location.pathname + location.search + location.hash);
    location.replace(loginFor(cfg) + '?next=' + next);
  }

  async function getSession(){
    if(window.GEESAuthService && typeof window.GEESAuthService.getPortalSession === 'function'){
      return await window.GEESAuthService.getPortalSession();
    }
    if(window.GEESDemoBackend && typeof window.GEESDemoBackend.session === 'function'){
      return window.GEESDemoBackend.session();
    }
    return null;
  }

  async function run(){
    var cfg = window.GEES_PORTAL_PAGE || {};
    try{
      var session = await getSession();
      window.GEESCurrentPortalSession = session || null;
      if(!cfg.allowGuest && !session){
        redirectToLogin(cfg);
        return;
      }
      if(!canAccess(cfg, session)){
        location.replace('/portal/forbidden.html?from=' + encodeURIComponent(location.pathname) + '&role=' + encodeURIComponent(session ? session.role : 'guest'));
        return;
      }
      document.documentElement.setAttribute('data-portal-ready', 'true');
      if(document.body){
        document.body.dataset.sessionRole = session ? session.role : 'guest';
        document.body.dataset.sessionTeam = (session && session.teamId) || 'guest';
        document.body.dataset.sessionSource = (session && session.source) || 'guest';
      }
      document.dispatchEvent(new CustomEvent('gees:portal-session-ready', { detail: { session: session || null } }));
    }catch(error){
      console.error('[GEES Role Guard] Failed.', error);
      redirectToLogin(cfg);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
