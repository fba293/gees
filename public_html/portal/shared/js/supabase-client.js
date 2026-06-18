(function(){
  'use strict';
  var CONFIG = {
    url: 'https://spljrvlebfeljqrqkiee.supabase.co',
    publishableKey: 'sb_publishable_frMPUvpzQw7aM415cDlIRg_jvuUwsCa',
    projectRef: 'spljrvlebfeljqrqkiee',
    mode: 'supabase-with-demo-fallback',
    version: '10.3.0'
  };

  function hasSupabaseFactory(){
    return !!(window.supabase && typeof window.supabase.createClient === 'function');
  }

  function createClient(){
    if(!hasSupabaseFactory()){
      console.warn('[GEES Supabase] Supabase JS library is unavailable. Demo fallback will stay active.');
      return null;
    }
    if(!CONFIG.url || !CONFIG.publishableKey){
      console.warn('[GEES Supabase] Missing project URL or publishable key. Demo fallback will stay active.');
      return null;
    }
    try{
      return window.supabase.createClient(CONFIG.url, CONFIG.publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'gees_supabase_auth'
        },
        global: {
          headers: { 'x-gees-client': 'portal-phase-10c' }
        }
      });
    }catch(error){
      console.error('[GEES Supabase] Failed to create client.', error);
      return null;
    }
  }

  window.GEESSupabaseConfig = CONFIG;
  window.GEESSupabase = createClient();
})();
