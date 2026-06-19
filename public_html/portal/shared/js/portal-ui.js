(function(){
  'use strict';
  if(window.GEES_PORTAL_UI_REAL_READY) return;
  window.GEES_PORTAL_UI_REAL_READY = true;

  function ready(fn){ document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once:true }) : fn(); }

  function toast(message, type){
    var root = document.getElementById('gees-toast-root');
    if(!root){ root = document.createElement('div'); root.id = 'gees-toast-root'; root.className = 'gees-toast-root'; document.body.appendChild(root); }
    var item = document.createElement('div');
    item.className = 'gees-toast' + (type ? ' gees-toast-' + type : '');
    item.textContent = message;
    root.appendChild(item);
    setTimeout(function(){ item.remove(); }, 3200);
  }

  function client(){ return window.GEESSupabase || window.GEES_REAL_SUPABASE || null; }

  var COUNT_TABLES = {
    'admin-students': 'students',
    'students': 'students',
    'student-count': 'students',
    'admin-agents': 'agents',
    'agents': 'agents',
    'agent-count': 'agents',
    'admin-staff': 'staff_profiles',
    'staff': 'staff_profiles',
    'staff-count': 'staff_profiles',
    'applications': 'applications',
    'application-count': 'applications',
    'documents': 'documents',
    'document-count': 'documents',
    'leads': 'leads',
    'lead-count': 'leads',
    'tasks': 'gees_tasks',
    'task-count': 'gees_tasks'
  };

  function setCount(key, value){
    document.querySelectorAll('[data-stat="' + key + '"], [data-real-count="' + key + '"]').forEach(function(el){
      el.textContent = String(Number.isFinite(value) ? value : 0);
      el.dataset.realValue = String(Number.isFinite(value) ? value : 0);
    });
  }

  async function tableCount(table){
    var sb = client();
    if(!sb) return 0;
    try{
      var result = await sb.from(table).select('id', { count:'exact', head:true });
      if(result.error) return 0;
      return result.count || 0;
    }catch(error){ return 0; }
  }

  async function refreshCounts(){
    var keys = Array.from(new Set(Object.keys(COUNT_TABLES).filter(function(key){ return document.querySelector('[data-stat="' + key + '"], [data-real-count="' + key + '"]'); })));
    if(!keys.length) return;
    keys.forEach(function(key){ setCount(key, 0); });
    for(const key of keys){ setCount(key, await tableCount(COUNT_TABLES[key])); }
  }

  function cleanStaticHandlers(){
    document.querySelectorAll('[data-demo-action]').forEach(function(el){
      el.removeAttribute('data-demo-action');
      el.addEventListener('click', function(event){
        if(el.tagName === 'A' && el.getAttribute('href')) return;
        event.preventDefault();
        toast('This action now requires live Supabase data.', 'info');
      });
    });
    document.querySelectorAll('[data-demo-form]').forEach(function(form){
      form.removeAttribute('data-demo-form');
      form.addEventListener('submit', function(event){
        event.preventDefault();
        toast('This form now requires live Supabase data.', 'info');
      });
    });
  }

  function zeroEmptyStates(){
    document.querySelectorAll('[data-empty-state], .gees-empty-state').forEach(function(el){
      if(!el.textContent.trim()) el.textContent = 'No real records yet.';
    });
  }

  function init(){
    cleanStaticHandlers();
    zeroEmptyStates();
    refreshCounts();
    window.GEESToast = toast;
    window.GEESPortalRefreshCounts = refreshCounts;
  }

  ready(init);
  document.addEventListener('gees:page:ready', init);
})();
