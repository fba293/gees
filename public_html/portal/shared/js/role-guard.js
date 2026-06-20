(function(){
  'use strict';
  if(window.GEES_ROLE_GUARD_REAL_READY) return;
  window.GEES_ROLE_GUARD_REAL_READY = true;

  var flashKey='gees_portal_flash_message';
  var authWatchBound=false;

  function loginFor(cfg){
    var roles=(cfg.requiredRoles||[]).join(',');
    if(roles.indexOf('agent')!==-1)return '/portal/auth/agent-login.html';
    if(roles.indexOf('staff')!==-1)return '/portal/auth/staff-login.html';
    if(roles.indexOf('admin')!==-1||roles.indexOf('super_admin')!==-1)return '/portal/auth/admin-login.html';
    return '/portal/auth/student-login.html';
  }
  function normaliseRole(role){
    if(window.GEESAuthService&&window.GEESAuthService.normaliseRole)return window.GEESAuthService.normaliseRole(role);
    return String(role||'').toLowerCase().replace(/-/g,'_').replace(/\s+/g,'_');
  }
  function hasPermission(session,permission){
    if(!permission||!session)return true;
    var role=normaliseRole(session.role);if(role==='super_admin')return true;
    var permissions=session.permissions||[];return permissions.indexOf('*')!==-1||permissions.indexOf(permission)!==-1;
  }
  function canAccess(cfg,session){
    if(cfg&&cfg.allowGuest)return true;
    if(!session)return false;
    var roles=(cfg.requiredRoles||[]).map(normaliseRole),role=normaliseRole(session.role);
    if(role==='super_admin')return true;
    if(roles.length&&roles.indexOf(role)===-1)return false;
    if(cfg.requiredTeam&&role==='staff'&&session.teamId!==cfg.requiredTeam)return false;
    if(cfg.requiredPermission&&!hasPermission(session,cfg.requiredPermission))return false;
    return !session.status||session.status==='active';
  }
  function setFlash(message){try{sessionStorage.setItem(flashKey,message);}catch(e){}}
  function redirectToLogin(cfg,reason){
    if(reason)setFlash(reason);
    var next=encodeURIComponent(location.pathname+location.search+location.hash);
    location.replace(loginFor(cfg)+'?next='+next+(reason?'&reason=session-expired':''));
  }
  function gate(message){
    if(!document.body)return;
    var el=document.getElementById('gees-portal-session-gate');
    if(!el){
      el=document.createElement('div');el.id='gees-portal-session-gate';el.className='gees-portal-session-gate';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
      el.innerHTML='<div><span class="gees-portal-session-spinner" aria-hidden="true"></span><strong>GEES Portal</strong><p></p></div>';
      document.body.appendChild(el);
    }
    var p=el.querySelector('p');if(p)p.textContent=message||'Checking your secure session…';
    el.hidden=false;
  }
  function removeGate(){var el=document.getElementById('gees-portal-session-gate');if(el)el.remove();}
  function installGateStyles(){
    if(document.getElementById('gees-portal-session-gate-style'))return;
    var style=document.createElement('style');style.id='gees-portal-session-gate-style';
    style.textContent='.gees-portal-session-gate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;background:var(--gees-bg,#fff);color:var(--gees-text,#141927)}.gees-portal-session-gate>div{display:grid;justify-items:center;gap:12px;text-align:center}.gees-portal-session-gate strong{font:900 1.25rem/1 Inter,system-ui,sans-serif}.gees-portal-session-gate p{margin:0;color:var(--gees-muted,#657085);font:700 .92rem/1.5 Inter,system-ui,sans-serif}.gees-portal-session-spinner{width:38px;height:38px;border:3px solid rgba(20,25,39,.15);border-top-color:#ffcc69;border-radius:999px;animation:geesPortalSpin .75s linear infinite}@keyframes geesPortalSpin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.gees-portal-session-spinner{animation:none}}';
    document.head.appendChild(style);
  }
  async function getSession(){return window.GEESAuthService&&typeof window.GEESAuthService.getPortalSession==='function'?await window.GEESAuthService.getPortalSession():null;}
  function watchAuth(cfg){
    if(authWatchBound)return;authWatchBound=true;
    var client=window.GEESSupabase||window.GEES_REAL_SUPABASE;
    if(!client||!client.auth||!client.auth.onAuthStateChange)return;
    client.auth.onAuthStateChange(function(event){
      if(event==='SIGNED_OUT'&&document.documentElement.getAttribute('data-portal-ready')==='true'){
        redirectToLogin(cfg,'Your session expired. Please sign in again.');
      }
    });
  }
  async function run(){
    var cfg=window.GEES_PORTAL_PAGE||{};
    installGateStyles();
    document.documentElement.setAttribute('data-portal-ready','false');
    gate('Checking your secure GEES session…');
    try{
      var session=await getSession();
      window.GEESCurrentPortalSession=session||null;
      if(!cfg.allowGuest&&!session){redirectToLogin(cfg,'Please sign in to continue.');return;}
      if(!canAccess(cfg,session)){
        location.replace('/portal/forbidden.html?from='+encodeURIComponent(location.pathname)+'&role='+encodeURIComponent(session?session.role:'guest'));
        return;
      }
      document.documentElement.setAttribute('data-portal-ready','true');
      if(document.body){document.body.dataset.sessionRole=session?session.role:'guest';document.body.dataset.sessionTeam=(session&&session.teamId)||'guest';document.body.dataset.sessionSource=(session&&session.source)||'guest';}
      removeGate();
      watchAuth(cfg);
      document.dispatchEvent(new CustomEvent('gees:portal-session-ready',{detail:{session:session||null}}));
    }catch(error){
      console.error('[GEES Role Guard] Failed.',error);
      redirectToLogin(cfg,'We could not verify your session. Please sign in again.');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
