(function(){
  'use strict';

  function waitForClient(){
    if(window.GEESWaitForSupabaseClient && typeof window.GEESWaitForSupabaseClient === 'function'){
      return window.GEESWaitForSupabaseClient();
    }
    return Promise.resolve(window.GEESSupabase || null);
  }

  function betterUnavailableMessage(){
    return 'Supabase client is still loading or blocked by the browser/CDN. Hard refresh once. If it continues, open /portal/shared/js/supabase-client.js?v=11.3.0 and confirm the file loads.';
  }

  function patch(){
    var service = window.GEESAuthService;
    if(!service || service.__geesReadyBridgePatched) return;
    service.__geesReadyBridgePatched = true;

    ['login','signup','getRealSession','listPendingUserApprovals','approveUser','rejectUser'].forEach(function(name){
      if(typeof service[name] !== 'function') return;
      var original = service[name];
      service[name] = async function(){
        var client = await waitForClient();
        if(!client && (name === 'signup' || name === 'login')){
          throw new Error(betterUnavailableMessage());
        }
        return original.apply(service, arguments);
      };
    });
  }

  patch();
  document.addEventListener('DOMContentLoaded', patch);
  setTimeout(patch, 300);
})();
