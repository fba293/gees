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
    }catch(error){ return false; }
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
        }catch(error){ return Object.prototype.hasOwnProperty.call(MEMORY_STORE, key) ? MEMORY_STORE[key] : null; }
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
    version: '11.4.0',
    storageMode: SAFE_STORAGE.mode
  };

  var loaderPromise = null;
  var SOURCES = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/@supabase/supabase-js@2'
  ];

  function hasSupabaseFactory(){
    return !!(window.supabase && typeof window.supabase.createClient === 'function');
  }

  function loadScript(src){
    return new Promise(function(resolve, reject){
      var existing = Array.prototype.slice.call(document.scripts).find(function(script){
        return script.src && script.src.indexOf(src) === 0;
      });
      if(existing){
        if(hasSupabaseFactory()) resolve();
        else existing.addEventListener('load', resolve, { once:true });
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = function(){ reject(new Error('Unable to load ' + src)); };
      document.head.appendChild(script);
    });
  }

  function createClient(){
    if(!hasSupabaseFactory()) return null;
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
          headers: { 'x-gees-client': 'portal-phase-11j' }
        }
      });
    }catch(error){
      console.error('[GEES Supabase] Failed to create client.', error);
      return null;
    }
  }

  async function ensureClient(){
    if(window.GEESSupabase) return window.GEESSupabase;
    if(hasSupabaseFactory()){
      window.GEESSupabase = createClient();
      return window.GEESSupabase;
    }
    if(!loaderPromise){
      loaderPromise = (async function(){
        for(var i = 0; i < SOURCES.length; i += 1){
          try{
            await loadScript(SOURCES[i]);
            if(hasSupabaseFactory()) break;
          }catch(error){
            console.warn('[GEES Supabase] CDN fallback failed:', SOURCES[i], error);
          }
        }
        window.GEESSupabase = createClient();
        return window.GEESSupabase;
      })();
    }
    return loaderPromise;
  }

  window.GEESSupabaseConfig = CONFIG;
  window.GEESSupabase = createClient();
  window.GEESWaitForSupabaseClient = ensureClient;
  if(!window.GEESSupabase) ensureClient();
})();
