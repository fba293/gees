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
    'admin-students': 'students', 'students': 'students', 'student-count': 'students',
    'admin-agents': 'agents', 'agents': 'agents', 'agent-count': 'agents',
    'admin-staff': 'staff_profiles', 'staff': 'staff_profiles', 'staff-count': 'staff_profiles',
    'applications': 'applications', 'application-count': 'applications',
    'documents': 'documents', 'document-count': 'documents',
    'leads': 'leads', 'lead-count': 'leads',
    'tasks': 'gees_tasks', 'task-count': 'gees_tasks'
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

  function sanitizeVisibleCopy(){
    var replacements = [
      [/Demo view of your study abroad journey from profile setup to visa decision\./gi, 'Real view of your study abroad journey from profile setup to visa decision.'],
      [/Demo accounts continue to use demo\/static mode\./gi, 'Only real Supabase accounts are supported.'],
      [/demo\/static mode/gi, 'real data mode'],
      [/demo mode/gi, 'real data mode'],
      [/demo account/gi, 'real account'],
      [/demo accounts/gi, 'real accounts'],
      [/demo data/gi, 'real data'],
      [/static mode/gi, 'real data mode'],
      [/Waiting for live data/gi, 'No real records yet'],
      [/The Phase 11 live adapter will replace this table after Supabase session validation\./gi, 'Live Supabase records will appear here when available.']
    ];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode:function(node){
        if(!node.nodeValue || !/(demo|static mode|Waiting for live data|Phase 11 live adapter)/i.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        if(node.parentElement && ['SCRIPT','STYLE','TEXTAREA','INPUT'].indexOf(node.parentElement.tagName) !== -1) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var value = node.nodeValue;
      replacements.forEach(function(pair){ value = value.replace(pair[0], pair[1]); });
      node.nodeValue = value;
    });
    document.querySelectorAll('.gees-demo-panel, [class*="demo-panel"], [data-demo-panel]').forEach(function(el){
      el.classList.remove('gees-demo-panel');
      el.removeAttribute('data-demo-panel');
      if(/demo|static mode/i.test(el.textContent || '')) el.style.display = 'none';
    });
  }

  function zeroEmptyStates(){
    document.querySelectorAll('[data-empty-state], .gees-empty-state').forEach(function(el){
      if(!el.textContent.trim()) el.textContent = 'No real records yet.';
    });
  }

  function init(){
    cleanStaticHandlers();
    sanitizeVisibleCopy();
    zeroEmptyStates();
    refreshCounts();
    window.GEESToast = toast;
    window.GEESPortalRefreshCounts = refreshCounts;
    window.GEESPortalSanitizeRealDataCopy = sanitizeVisibleCopy;
  }

  ready(init);
  document.addEventListener('gees:page:ready', init);
  document.addEventListener('gees:portal-session-ready', init);
})();
