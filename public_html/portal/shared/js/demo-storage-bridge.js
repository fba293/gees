(function(){
  'use strict';

  var backend = window.GEESDemoBackend;
  if(!backend || !Array.isArray(backend.users)) return;

  var memoryStore = window.__GEESPortalMemoryStore || {};
  window.__GEESPortalMemoryStore = memoryStore;

  function storage(){
    if(window.GEESPortalStorage) return window.GEESPortalStorage;
    return {
      mode:'memory',
      persisted:false,
      getItem:function(key){ return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null; },
      setItem:function(key, value){ memoryStore[key] = String(value); },
      removeItem:function(key){ delete memoryStore[key]; }
    };
  }

  function norm(role){ return String(role||'').toLowerCase().replace(/-/g,'_').replace(/\s+/g,'_'); }
  function read(key, fallback){ try{ var v = storage().getItem(key); return v ? JSON.parse(v) : fallback; }catch(error){ return fallback; } }
  function write(key, value){ try{ storage().setItem(key, JSON.stringify(value)); return true; }catch(error){ memoryStore[key] = JSON.stringify(value); return false; } }
  function remove(key){ try{ storage().removeItem(key); }catch(error){ delete memoryStore[key]; } }

  function publicUser(user){
    return { id:user.id, name:user.name, email:user.email, role:user.role, teamId:user.teamId, dashboard:user.dashboard, permissions:user.permissions || [], source:'demo', status:'active', loginAt:new Date().toISOString() };
  }

  function audit(action, target){
    var key = backend.storage && backend.storage.audit ? backend.storage.audit : 'gees_demo_audit';
    var logs = read(key, []);
    logs.unshift({ action:action, target:target, time:new Date().toISOString() });
    write(key, logs.slice(0, 50));
  }

  function setSession(user){
    var session = publicUser(user);
    write('gees_portal_session', session);
    write('gees_demo_session', session);
    audit('login', session.email);
    return session;
  }

  function session(){ return read('gees_portal_session', null) || read('gees_demo_session', null); }
  function sessionById(id){ var user = backend.users.find(function(item){ return item.id === id; }); return user ? setSession(user) : null; }
  function sessionFromUrl(){
    try{
      var id = new URLSearchParams(location.search).get('gees_demo_session');
      return id ? sessionById(id) : null;
    }catch(error){ return null; }
  }

  function login(email, password, portal){
    email = String(email || '').trim().toLowerCase();
    var user = backend.users.find(function(item){ return String(item.email).toLowerCase() === email && item.password === password; });
    if(!user) throw new Error('Incorrect demo email or password.');
    portal = norm(portal);
    if(portal === 'admin' && ['admin','super_admin'].indexOf(user.role) === -1) throw new Error('This is not an admin account.');
    if(portal && portal !== 'admin' && user.role !== portal) throw new Error('This account is not allowed for the selected portal.');
    return setSession(user);
  }

  function logout(){
    var current = session() || {};
    audit('logout', current.email || 'guest');
    remove('gees_portal_session');
    remove('gees_demo_session');
  }

  backend.session = session;
  backend.setSession = setSession;
  backend.sessionById = sessionById;
  backend.sessionFromUrl = sessionFromUrl;
  backend.login = login;
  backend.logout = logout;
  backend.storageMode = storage().mode;
})();
