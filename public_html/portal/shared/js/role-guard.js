(function(){
  'use strict';
  async function run(){
    var cfg=window.GEES_PORTAL_PAGE||{};
    if(!cfg.role&&!cfg.roles) return;
    try{
      var s=await window.GEESAuthService.getPortalSession();
      if(!s) return location.replace('/portal/auth/student-login.html?next='+encodeURIComponent(location.pathname));
      var allowed=cfg.roles||[cfg.role];
      if(cfg.role==='admin') allowed=['admin','super_admin'];
      if(allowed.indexOf(s.role)===-1) return location.replace('/portal/forbidden.html');
      if(s.status!=='active') return location.replace('/portal/forbidden.html?reason=pending');
      window.GEESCurrentPortalSession=s;
      document.dispatchEvent(new CustomEvent('gees:portal-session-ready',{detail:s}));
    }catch(e){console.error(e);location.replace('/portal/auth/student-login.html');}
  }
  document.addEventListener('DOMContentLoaded',run);
})();
