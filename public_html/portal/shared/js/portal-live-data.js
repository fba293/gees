(function(){
  'use strict';
  if(window.GEES_PORTAL_LIVE_DATA_V14) return;
  window.GEES_PORTAL_LIVE_DATA_V14 = true;

  function ready(fn){ document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once:true }) : fn(); }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];}); }
  function sb(){ return window.GEESSupabase || window.GEES_REAL_SUPABASE || null; }
  function role(s){ return String((s && s.role) || '').toLowerCase().replace(/-/g,'_'); }
  function n(v){ return Number(v || 0).toLocaleString(); }

  async function current(){
    if(window.GEESAuthService && window.GEESAuthService.getPortalSession){
      try{ return await window.GEESAuthService.getPortalSession(); }catch(e){ return null; }
    }
    return null;
  }

  async function count(table){
    var c = sb();
    if(!c) return 0;
    try{
      var r = await c.from(table).select('id',{count:'exact',head:true});
      return r && !r.error ? (r.count || 0) : 0;
    }catch(e){ return 0; }
  }

  async function list(table, cols){
    var c = sb();
    if(!c) return [];
    try{
      var q = c.from(table).select(cols || '*').limit(6);
      var r = await q;
      return r && !r.error ? (r.data || []) : [];
    }catch(e){ return []; }
  }

  function card(icon, value, label){
    return '<article class="gees-stat-card gees-live-card"><div class="gees-stat-icon"><i class="fa-solid '+esc(icon)+'"></i></div><div><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div></article>';
  }

  function setStats(items){
    var grid = document.querySelector('.gees-stats-grid');
    if(grid) grid.innerHTML = items.join('');
  }

  function statusBox(){
    var box = document.querySelector('[data-gees-live-panel]');
    if(box) return box;
    var hero = document.querySelector('.gees-page-hero');
    box = document.createElement('section');
    box.className = 'gees-panel gees-live-panel';
    box.setAttribute('data-gees-live-panel','true');
    box.innerHTML = '<div class="gees-panel-head"><div><h2><span class="gees-live-dot"></span> Live Supabase dashboard</h2><p data-gees-live-status>Preparing live data...</p></div><button class="gees-btn gees-btn-outline" data-gees-live-refresh><i class="fa-solid fa-rotate"></i> Refresh live data</button></div><div class="gees-live-meta" data-gees-live-meta></div>';
    if(hero && hero.parentNode) hero.parentNode.insertBefore(box, hero.nextSibling);
    return box;
  }

  function setStatus(msg,state,meta){
    var box = statusBox();
    box.dataset.liveState = state || 'info';
    var p = box.querySelector('[data-gees-live-status]');
    var m = box.querySelector('[data-gees-live-meta]');
    if(p) p.textContent = msg || '';
    if(m) m.innerHTML = (meta || []).map(function(x){ return '<span>'+esc(x)+'</span>'; }).join('');
  }

  function setRecords(title, rows){
    var panel = Array.prototype.slice.call(document.querySelectorAll('.gees-panel')).find(function(p){ return /Recent|records|applications/i.test(p.textContent || ''); });
    if(!panel) return;
    var h = panel.querySelector('h2');
    if(h) h.textContent = title || 'Recent live records';
    var wrap = panel.querySelector('.gees-table-wrap') || panel;
    if(!rows || !rows.length){ wrap.innerHTML = '<div class="gees-empty-state gees-live-empty" data-empty-state><i class="fa-solid fa-database"></i><strong>No real records yet</strong><span>Live Supabase records will appear here when available.</span></div>'; return; }
    wrap.innerHTML = '<table class="gees-table"><thead><tr><th>Name</th><th>Status</th><th>Note</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td><strong>'+esc(r.name)+'</strong><span class="gees-table-subtext">'+esc(r.sub||'')+'</span></td><td><span class="gees-badge">'+esc(r.status||'Live')+'</span></td><td>'+esc(r.note||'')+'</td></tr>';}).join('')+'</tbody></table>';
  }

  function rowsFrom(items,type){
    return (items || []).map(function(r){
      if(type === 'profile') return {name:r.full_name || r.email || 'GEES user', sub:r.email || '', status:(r.role || 'user') + ' · ' + (r.status || 'pending'), note:r.team_id || 'Profile'};
      return {name:'Application ' + String(r.id || '').slice(0,8).toUpperCase(), sub:r.created_at || '', status:r.status || 'draft', note:r.application_no || r.intake || 'Application'};
    });
  }

  async function refresh(){
    setStatus('Refreshing live Supabase data...','loading');
    var c = sb();
    var s = await current();
    if(!c){ setStatus('Supabase client is not loaded yet. Refresh again after the page loads.','warning',['No client']); return; }
    if(!s){ setStatus('No real GEES login found. Please sign in first.','warning',['Waiting for login']); return; }
    var r = role(s);
    if(r === 'student'){
      setStats([card('fa-file-signature',n(await count('applications')),'My Applications'),card('fa-folder-open',n(await count('documents')),'My Documents'),card('fa-bell','0','Unread Notifications'),card('fa-user-check',s.status || 'active','Account Status')]);
      setRecords('Recent live applications', rowsFrom(await list('applications','id,status,created_at,intake,application_no'),'application'));
    } else if(r === 'agent'){
      setStats([card('fa-users',n(await count('students')),'My Students'),card('fa-file-circle-check',n(await count('applications')),'Applications'),card('fa-wallet',n(await count('commissions')),'Commissions'),card('fa-headset',n(await count('support_tickets')),'Support Tickets')]);
      setRecords('Recent referred applications', rowsFrom(await list('applications','id,status,created_at,intake,application_no'),'application'));
    } else if(r === 'staff'){
      setStats([card('fa-list-check',n(await count('applications')),'Assigned Applications'),card('fa-folder-open',n(await count('documents')),'Documents'),card('fa-headset',n(await count('support_tickets')),'Support Tickets'),card('fa-pen-to-square','Live','Status Update')]);
      setRecords('Recent assigned work', rowsFrom(await list('applications','id,status,created_at,intake,application_no'),'application'));
    } else {
      setStats([card('fa-file-signature',n(await count('applications')),'Applications'),card('fa-users-gear',n(await count('profiles')),'Portal Users'),card('fa-user-clock','0','Pending Approvals'),card('fa-clipboard-list',n(await count('audit_logs')),'Audit Logs')]);
      setRecords('Recent portal users', rowsFrom(await list('profiles','id,email,full_name,role,status,team_id'),'profile'));
    }
    setStatus('Connected to live Supabase data.','success',['Role: '+r,'Source: Supabase']);
  }

  ready(function(){
    statusBox();
    document.addEventListener('click',function(e){ var b=e.target.closest('[data-gees-live-refresh]'); if(b){ e.preventDefault(); refresh(); } });
    document.addEventListener('gees:portal-session-ready',refresh);
    setTimeout(refresh,500);
  });
})();
