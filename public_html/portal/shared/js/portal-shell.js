(function(){
  'use strict';
  document.addEventListener('click',function(e){if(e.target.matches('[data-gees-logout]')){e.preventDefault();window.GEESAuthService.logout();}});
  document.addEventListener('gees:portal-session-ready',function(e){var n=document.querySelector('[data-gees-user-name]');if(n)n.textContent=e.detail.full_name||e.detail.email;});
})();
