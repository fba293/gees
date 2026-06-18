(function(){
  'use strict';

  var MEMORY_STORE = window.__GEESPortalMemoryStore || {};
  window.__GEESPortalMemoryStore = MEMORY_STORE;

  function canUseStorage(storage){
    if(!storage) return false;
    try{
      var key = '__gees_storage_test__';
      storage.setItem(key, '1');
      storage.removeItem(key);
      return true;
    }catch(error){
      return false;
    }
  }

  function createSafeStorage(){
    var localOK = canUseStorage(window.localStorage);
    var sessionOK = canUseStorage(window.sessionStorage);

    function getStore(){
      if(localOK) return window.localStorage;
      if(sessionOK) return window.sessionStorage;
      return null;
    }

    return {
      mode: localOK ? 'localStorage' : (sessionOK ? 'sessionStorage' : 'memory'),
      persisted: localOK || sessionOK,
      getItem: function(key){
        try{
          var store = getStore();
          if(store) return store.getItem(key);
          return Object.prototype.hasOwnProperty.call(MEMORY_STORE, key) ? MEMORY_STORE[key] : null;
        }catch(error){
          return Object.prototype.hasOwnProperty.call(MEMORY_STORE, key) ? MEMORY_STORE[key] : null;
        }
      },
      setItem: function(key, value){
        try{
          var store = getStore();
          if(store){ store.setItem(key, value); return; }
        }catch(error){}
        MEMORY_STORE[key] = String(value);
      },
      removeItem: function(key){
        try{
          var store = getStore();
          if(store) store.removeItem(key);
        }catch(error){}
        delete MEMORY_STORE[key];
      }
    };
  }

  var SAFE_STORAGE = window.GEESPortalStorage || createSafeStorage();
  window.GEESPortalStorage = SAFE_STORAGE;

  var CONFIG = {
    url: 'https://spljrvlebfeljqrqkiee.supabase.co',
    publishableKey: 'sb_publishable_frMPUvpzQw7aM415cDlIRg_jvuUwsCa',
    projectRef: 'spljrvlebfeljqrqkiee',
    mode: 'supabase-with-demo-fallback',
    version: '11.2.0',
    storageMode: SAFE_STORAGE.mode
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
          storageKey: 'gees_supabase_auth',
          storage: SAFE_STORAGE
        },
        global: {
          headers: { 'x-gees-client': 'portal-phase-11c' }
        }
      });
    }catch(error){
      console.error('[GEES Supabase] Failed to create client. Demo fallback will stay active.', error);
      return null;
    }
  }

  window.GEESSupabaseConfig = CONFIG;
  window.GEESSupabase = createClient();
})();
