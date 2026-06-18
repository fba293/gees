(function(){
  'use strict';
  var VERSION = '11.1.0';
  var mounted = false;

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[ch];
    });
  }

  function client(){ return window.GEESSupabase || null; }

  function toast(message, type){
    if(window.GEESPortalUI && typeof window.GEESPortalUI.toast === 'function'){
      window.GEESPortalUI.toast(message, type || 'info');
    }
  }

  async function getSession(){
    if(window.GEESAuthService && typeof window.GEESAuthService.getPortalSession === 'function'){
      try{ return await window.GEESAuthService.getPortalSession(); }catch(error){ return null; }
    }
    try{ return JSON.parse(localStorage.getItem('gees_portal_session') || 'null'); }catch(error){ return null; }
  }

  function isReal(session){ return !!(session && session.id && session.source === 'supabase'); }
  function normalRole(role){ return String(role || '').toLowerCase().replace(/-/g, '_').replace(/\s+/g, '_'); }
  function displayCount(value, fallback){ return value === null || value === undefined || isNaN(value) ? (fallback || '0') : Number(value).toLocaleString(); }
  function shortId(id){ return id ? String(id).slice(0, 8).toUpperCase() : 'LIVE'; }
  function niceDate(value){ if(!value) return 'Recently'; try{ return new Date(value).toLocaleString(); }catch(error){ return 'Recently'; } }

  function applyFilters(query, filters){
    (filters || []).forEach(function(filter){
      if(!filter || !filter.key) return;
      if(filter.op === 'eq') query = query.eq(filter.key, filter.value);
      else if(filter.op === 'neq') query = query.neq(filter.key, filter.value);
      else if(filter.op === 'in') query = query.in(filter.key, filter.value || []);
      else if(filter.op === 'is') query = query.is(filter.key, filter.value);
      else if(filter.op === 'gte') query = query.gte(filter.key, filter.value);
      else if(filter.op === 'lte') query = query.lte(filter.key, filter.value);
    });
    return query;
  }

  async function countRows(table, filters){
    var c = client();
    if(!c) return null;
    try{
      var query = c.from(table).select('id', { count:'exact', head:true });
      query = applyFilters(query, filters);
      var response = await query;
      if(response.error){ console.warn('[GEES Live] Count failed for ' + table, response.error); return null; }
      return response.count || 0;
    }catch(error){ console.warn('[GEES Live] Count exception for ' + table, error); return null; }
  }

  async function listRows(table, columns, filters, orderKey, limit){
    var c = client();
    if(!c) return [];
    try{
      var query = c.from(table).select(columns || '*');
      query = applyFilters(query, filters);
      if(orderKey) query = query.order(orderKey, { ascending:false, nullsFirst:false });
      if(limit) query = query.limit(limit);
      var response = await query;
      if(response.error){ console.warn('[GEES Live] List failed for ' + table, response.error); return []; }
      return response.data || [];
    }catch(error){ console.warn('[GEES Live] List exception for ' + table, error); return []; }
  }

  async function pendingApprovals(){
    var c = client();
    if(!c) return { count:null, rows:[] };
    try{
      var response = await c.rpc('get_pending_gees_user_approvals');
      if(response.error) return { count:null, rows:[] };
      return { count:(response.data || []).length, rows:response.data || [] };
    }catch(error){ return { count:null, rows:[] }; }
  }

  function card(icon, value, label){
    return '<article class="gees-stat-card gees-live-card"><div class="gees-stat-icon"><i class="fa-solid '+esc(icon)+'"></i></div><div><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div></article>';
  }

  function setStats(items){
    var grid = document.querySelector('.gees-stats-grid');
    if(grid) grid.innerHTML = items.join('');
  }

  function findRecordsPanel(){
    var panels = Array.prototype.slice.call(document.querySelectorAll('.gees-panel'));
    return panels.find(function(panel){ return /Demo records|Live Supabase records|Recent live records/i.test(panel.textContent || ''); }) || panels[0];
  }

  function setRecords(title, rows){
    var panel = findRecordsPanel();
    if(!panel) return;
    var h2 = panel.querySelector('h2');
    if(h2) h2.textContent = title || 'Live Supabase records';
    var wrap = panel.querySelector('.gees-table-wrap');
    if(!wrap){ wrap = document.createElement('div'); wrap.className = 'gees-table-wrap'; panel.appendChild(wrap); }
    if(!rows || !rows.length){
      wrap.innerHTML = '<div class="gees-empty-state gees-live-empty"><i class="fa-solid fa-database"></i><strong>No live records yet</strong><span>Your Supabase connection is active. Run the Phase 11B seed SQL after creating real test accounts, then refresh this dashboard.</span></div>';
      return;
    }
    wrap.innerHTML = '<table class="gees-table"><thead><tr><th>Name</th><th>Status</th><th>Note</th></tr></thead><tbody>' + rows.map(function(row){
      return '<tr><td><strong>'+esc(row.name)+'</strong><span class="gees-table-subtext">'+esc(row.sub || '')+'</span></td><td><span class="gees-badge">'+esc(row.status || 'Live')+'</span></td><td>'+esc(row.note || '')+'</td></tr>';
    }).join('') + '</tbody></table>';
  }

  function livePanel(){
    var panel = document.querySelector('[data-gees-live-panel]');
    if(panel) return panel;
    var hero = document.querySelector('.gees-page-hero');
    panel = document.createElement('section');
    panel.className = 'gees-panel gees-live-panel';
    panel.setAttribute('data-gees-live-panel', 'true');
    panel.innerHTML = '<div class="gees-panel-head"><div><h2><span class="gees-live-dot"></span> Live Supabase dashboard</h2><p data-gees-live-status>Preparing live data connection...</p></div><button class="gees-btn gees-btn-outline" data-gees-live-refresh><i class="fa-solid fa-rotate"></i> Refresh live data</button></div><div class="gees-live-meta" data-gees-live-meta></div>';
    if(hero && hero.parentNode) hero.parentNode.insertBefore(panel, hero.nextSibling);
    else document.querySelector('.gees-portal-content').prepend(panel);
    return panel;
  }

  function setLiveStatus(message, type, meta){
    var panel = livePanel();
    var status = panel.querySelector('[data-gees-live-status]');
    var metaBox = panel.querySelector('[data-gees-live-meta]');
    panel.dataset.liveState = type || 'info';
    if(status) status.textContent = message || '';
    if(metaBox) metaBox.innerHTML = (meta || []).map(function(item){ return '<span>'+esc(item)+'</span>'; }).join('');
  }

  function rowsFromApplications(items){
    return (items || []).map(function(row){
      var note = row.application_no || row.intake || 'Live application record';
      return { name:'Application #' + shortId(row.id), sub:niceDate(row.updated_at || row.created_at), status:row.status || 'draft', note:note };
    });
  }

  function rowsFromProfiles(items){
    return (items || []).map(function(row){
      return { name:row.full_name || row.email || 'GEES user', sub:row.email || shortId(row.id), status:(row.role || 'user') + ' · ' + (row.status || 'pending'), note:row.team_id || 'Live profile' };
    });
  }

  function rowsFromApprovals(items){
    return (items || []).map(function(row){
      return { name:row.full_name || row.email || 'Pending user', sub:row.email || shortId(row.profile_id), status:row.role || 'pending', note:'Requested ' + niceDate(row.requested_at) };
    });
  }

  async function renderStudent(session){
    var apps = await countRows('applications');
    var docs = await countRows('documents');
    var unread = await countRows('notifications', [{op:'eq', key:'recipient_id', value:session.id},{op:'eq', key:'is_read', value:false}]);
    var latest = await listRows('applications', 'id,status,created_at,updated_at,intake,application_no', [], 'updated_at', 6);
    setStats([card('fa-file-signature', displayCount(apps), 'My Applications'), card('fa-folder-open', displayCount(docs), 'My Documents'), card('fa-bell', displayCount(unread), 'Unread Notifications'), card('fa-user-check', session.status || 'active', 'Account Status')]);
    setRecords('Recent live applications', rowsFromApplications(latest));
  }

  async function renderAgent(session){
    var students = await countRows('students');
    var apps = await countRows('applications');
    var commissions = await listRows('commissions', 'id,amount,currency,status,created_at', [], 'created_at', 12);
    var pendingCommissionCount = commissions.filter(function(row){ return /pending|processing|unpaid/i.test(row.status || ''); }).length;
    var tickets = await countRows('support_tickets');
    var latest = await listRows('applications', 'id,status,created_at,updated_at,intake,application_no', [], 'updated_at', 6);
    setStats([card('fa-users', displayCount(students), 'My Students'), card('fa-file-circle-check', displayCount(apps), 'Student Applications'), card('fa-wallet', displayCount(pendingCommissionCount), 'Pending Commissions'), card('fa-headset', displayCount(tickets), 'Support Tickets')]);
    setRecords('Recent referred applications', rowsFromApplications(latest));
  }

  async function renderStaff(session){
    var apps = await countRows('applications');
    var docs = await countRows('documents');
    var tickets = await countRows('support_tickets');
    var unread = await countRows('notifications', [{op:'eq', key:'recipient_id', value:session.id},{op:'eq', key:'is_read', value:false}]);
    var latest = await listRows('applications', 'id,status,created_at,updated_at,intake,application_no', [], 'updated_at', 6);
    setStats([card('fa-list-check', displayCount(apps), 'Assigned Applications'), card('fa-folder-open', displayCount(docs), 'Documents To Review'), card('fa-headset', displayCount(tickets), 'Support Tickets'), card('fa-bell', displayCount(unread), 'Unread Notifications')]);
    setRecords('Recent assigned work', rowsFromApplications(latest));
  }

  async function renderAdmin(session, isSuper){
    var apps = await countRows('applications');
    var profiles = await countRows('profiles');
    var approvals = await pendingApprovals();
    var audit = await countRows('audit_logs');
    var latestApprovals = approvals.rows && approvals.rows.length ? rowsFromApprovals(approvals.rows) : [];
    var latestProfiles = latestApprovals.length ? [] : rowsFromProfiles(await listRows('profiles', 'id,email,full_name,role,status,team_id,created_at', [], 'created_at', 6));
    setStats([card('fa-file-signature', displayCount(apps), 'Total Applications'), card('fa-users-gear', displayCount(profiles), 'Portal Users'), card('fa-user-clock', displayCount(approvals.count), 'Pending Approvals'), card(isSuper ? 'fa-shield-halved' : 'fa-clipboard-list', displayCount(audit), isSuper ? 'Audit Events' : 'Audit Logs')]);
    setRecords(latestApprovals.length ? 'Pending live approvals' : 'Recent live users', latestApprovals.length ? latestApprovals : latestProfiles);
  }

  async function renderCatalogue(){
    var universities = await countRows('universities');
    var courses = await countRows('courses');
    return ['Universities: ' + displayCount(universities), 'Courses: ' + displayCount(courses)];
  }

  async function refresh(){
    if(mounted) setLiveStatus('Refreshing live Supabase data...', 'loading');
    mounted = true;
    var c = client();
    var session = await getSession();
    if(!c){ setLiveStatus('Supabase client is not loaded. Dashboard is staying in demo/static mode.', 'warning', ['Phase 11B', 'No client']); return; }
    if(!session){ setLiveStatus('No portal session found yet. Login first to load live dashboard data.', 'warning', ['Phase 11B', 'Waiting for session']); return; }
    if(!isReal(session)){ setLiveStatus('Demo dashboard mode is active. Live Supabase data loads only after login with a real GEES account.', 'demo', ['Session: demo', 'Role: ' + (session.role || 'unknown')]); return; }
    try{
      var path = location.pathname;
      var role = normalRole(session.role);
      var isSuperPage = path.indexOf('/super-admin/') !== -1 || role === 'super_admin';
      if(role === 'student') await renderStudent(session);
      else if(role === 'agent') await renderAgent(session);
      else if(role === 'staff') await renderStaff(session);
      else if(role === 'admin' || role === 'super_admin') await renderAdmin(session, isSuperPage);
      else await renderStudent(session);
      var catalogue = await renderCatalogue();
      setLiveStatus('Connected to live Supabase data for ' + (session.email || session.name || 'GEES user') + '.', 'success', ['Phase 11B', 'Role: ' + role, 'Source: Supabase'].concat(catalogue));
      toast('Live dashboard data refreshed.', 'success');
    }catch(error){
      console.error('[GEES Phase 11B] Live dashboard failed', error);
      setLiveStatus('Live data connection failed: ' + (error.message || error), 'error', ['Phase 11B', 'Check RLS/session']);
    }
  }

  ready(function(){
    livePanel();
    document.addEventListener('click', function(event){
      var btn = event.target.closest('[data-gees-live-refresh]');
      if(btn){ event.preventDefault(); refresh(); }
    });
    document.addEventListener('gees:portal-session-ready', function(){ refresh(); }, { once:true });
    setTimeout(refresh, 1200);
  });

  window.GEESLiveDashboard = { version:VERSION, refresh:refresh };
})();
