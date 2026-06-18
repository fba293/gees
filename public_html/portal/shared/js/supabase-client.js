(function(){
  'use strict';
  var cfg={
    url:'https://spljrvlebfeljqrqkiee.supabase.co',
    publishableKey:'sb_publishable_frMPUvpzQw7aM415cDlIRg_jvuUwsCa',
    projectRef:'spljrvlebfeljqrqkiee'
  };
  window.GEES_SUPABASE_SETTINGS=cfg;
  if(!window.supabase||!window.supabase.createClient){
    window.GEESSupabase=null;
    console.warn('[GEES] Supabase CDN not loaded.');
    return;
  }
  window.GEESSupabase=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'gees_supabase_auth'}});
})();
