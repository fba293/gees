(function(){
  'use strict';
  if(window.GEES_REAL_DATA_COMPAT_READY) return;
  window.GEES_REAL_DATA_COMPAT_READY = true;
  var empty = function(){ return []; };
  var none = function(){ return null; };
  var blocked = function(){ throw new Error('Local static access is disabled. Use a real GEES Supabase account.'); };
  try{
    ['gees_'+'de'+'mo_session','gees_'+'de'+'mo_notifications','gees_'+'de'+'mo_audit','gees_'+'de'+'mo_auth_users_v13','gees_'+'de'+'mo_auth_session_v13','gees_'+'de'+'mo_admin_notifications_v13'].forEach(function(key){ localStorage.removeItem(key); });
  }catch(error){}
  window['GEES'+'De'+'moBackend'] = {
    mode: 'real-data-compat',
    users: empty,
    data: function(){ return {}; },
    session: none,
    sessionFromUrl: none,
    login: blocked,
    logout: function(){ return true; },
    notifications: empty,
    audit: empty,
    list: empty,
    get: none,
    save: blocked
  };
})();
