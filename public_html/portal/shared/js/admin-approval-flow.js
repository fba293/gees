(function(){
  'use strict';

  var tbody;
  var statusEl;
  var diagnosticsEl;
  var lastRows = [];

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function escapeHTML(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[ch];
    });
  }

  function toast(message, type){
    if(window.GEESPortalUI && typeof window.GEESPortalUI.toast === 'function'){
      window.GEESPortalUI.toast(message, type || 'success');
      return;
    }
    console.log('[GEES Approval]', message);
  }

  function setStatus(message, type){
    if(!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.dataset.statusType = type || 'info';
  }

  function friendlyApprovalMessage(error){
    if(window.GEESAuthService && typeof window.GEESAuthService.explainAuthError === 'function'){
      return window.GEESAuthService.explainAuthError(error, 'approvals').message;
    }
    var raw = String((error && error.message) || error || '');
    var text = raw.toLowerCase();
    if(text.indexOf('admin access required') !== -1 || text.indexOf('approval list denied') !== -1){
      return 'Real Supabase admin access is required. Demo admin cannot view live Supabase approvals. Create one real user, run the first-admin bootstrap SQL to promote it to super_admin, then login through /portal/auth/admin-login.html.';
    }
    if(text.indexOf('jwt') !== -1 || text.indexOf('session') !== -1){
      return 'No valid real Supabase admin session found. Logout, then login again with a real admin/super_admin account.';
    }
    return raw || 'Unable to load approvals.';
  }

  function readStoredSession(){
    try{
      return JSON.parse(localStorage.getItem('gees_portal_session') || 'null');
    }catch(error){
      return null;
    }
  }

  async function runDiagnostics(){
    var stored = readStoredSession();
    var data = {
      hasSupabaseClient: !!window.GEESSupabase,
      hasSupabaseAuthSession: false,
      source: stored && stored.source ? stored.source : 'none',
      role: stored && stored.role ? stored.role : 'none',
      status: stored && stored.status ? stored.status : 'none',
      canRead: false,
      message: ''
    };
    if(window.GEESSupabase){
      try{
        var response = await window.GEESSupabase.auth.getSession();
        data.hasSupabaseAuthSession = !!(response && response.data && response.data.session);
      }catch(error){
        data.authError = error.message || String(error);
      }
    }
    data.canRead = data.hasSupabaseAuthSession && data.source === 'supabase' && data.status === 'active' && (data.role === 'admin' || data.role === 'super_admin');
    if(!data.hasSupabaseClient) data.message = 'Supabase client is not loaded.';
    else if(data.source === 'demo') data.message = 'You are logged in with demo admin. Demo admin cannot read live Supabase approvals.';
    else if(!data.hasSupabaseAuthSession) data.message = 'No real Supabase admin session found.';
    else if(!data.canRead) data.message = 'Current real Supabase user is not an active admin/super_admin.';
    else data.message = 'Real Supabase admin session ready.';
    return data;
  }

  function diagnosticItem(label, value){
    return '<div class="gees-diagnostic-item"><span>'+escapeHTML(label)+'</span><strong>'+escapeHTML(value)+'</strong></div>';
  }

  function renderDiagnostics(data){
    if(!diagnosticsEl) return;
    if(!data){ diagnosticsEl.innerHTML = '<p>Checking approval diagnostics...</p>'; return; }
    diagnosticsEl.innerHTML = '<div class="gees-diagnostic-grid">'
      + diagnosticItem('Supabase client', data.hasSupabaseClient ? 'Loaded' : 'Missing')
      + diagnosticItem('Real Supabase session', data.hasSupabaseAuthSession ? 'Yes' : 'No')
      + diagnosticItem('Portal session', data.source)
      + diagnosticItem('Role', data.role)
      + diagnosticItem('Status', data.status)
      + diagnosticItem('Can read approvals', data.canRead ? 'Yes' : 'No')
      + '</div><p class="gees-diagnostic-message">'+escapeHTML(data.message)+'</p>'
      + (data.canRead ? '' : '<ol class="gees-mini-steps"><li>Use a real Supabase admin/super_admin account, not demo admin.</li><li>If no admin exists, create one normal user and run the first-admin bootstrap SQL.</li><li>For signup testing: Email provider ON, Allow new users ON, Confirm email OFF temporarily.</li></ol>');
  }

  function rowHTML(row){
    var role = String(row.role || '').replace('_',' ');
    var name = row.full_name || row.email || 'Pending user';
    var detail = row.role === 'agent'
      ? (row.agency_name || 'Agent signup') + (row.agent_country ? ' · ' + row.agent_country : '')
      : (row.staff_department || row.team_id || 'Staff signup') + (row.staff_title ? ' · ' + row.staff_title : '');
    var date = row.requested_at ? new Date(row.requested_at).toLocaleString() : 'New request';
    return '<tr data-user-row="'+escapeHTML(row.profile_id)+'">'
      + '<td><strong>'+escapeHTML(name)+'</strong><span class="gees-table-subtext">'+escapeHTML(row.email || '')+'</span></td>'
      + '<td><span class="gees-badge gees-badge-warning">'+escapeHTML(role)+'</span><span class="gees-table-subtext">'+escapeHTML(detail)+'</span></td>'
      + '<td><span class="gees-badge">'+escapeHTML(row.status || 'pending')+'</span><span class="gees-table-subtext">'+escapeHTML(date)+'</span></td>'
      + '<td class="gees-table-actions"><button class="gees-btn gees-btn-primary gees-btn-sm" data-approve-user="'+escapeHTML(row.profile_id)+'"><i class="fa-solid fa-check"></i> Approve</button><button class="gees-btn gees-btn-outline gees-btn-sm" data-reject-user="'+escapeHTML(row.profile_id)+'"><i class="fa-solid fa-xmark"></i> Reject</button></td></tr>';
  }

  function render(rows, errorMessage){
    lastRows = rows || [];
    if(!tbody) return;
    if(errorMessage){
      tbody.innerHTML = '<tr><td colspan="4"><div class="gees-empty-state gees-empty-warning"><i class="fa-solid fa-triangle-exclamation"></i><strong>Approval diagnostics needed</strong><span>'+escapeHTML(errorMessage)+'</span></div></td></tr>';
      return;
    }
    if(!lastRows.length){
      tbody.innerHTML = '<tr><td colspan="4"><div class="gees-empty-state"><i class="fa-solid fa-circle-check"></i><strong>No pending approvals visible</strong><span>If you just signed up an agent/staff account, login with a real Supabase admin or super_admin account and refresh. Demo admin cannot see live approvals.</span></div></td></tr>';
      return;
    }
    tbody.innerHTML = lastRows.map(rowHTML).join('');
  }

  async function refreshDiagnostics(){
    var data = await runDiagnostics();
    renderDiagnostics(data);
    return data;
  }

  async function loadApprovals(){
    if(!window.GEESAuthService || typeof window.GEESAuthService.listPendingUserApprovals !== 'function'){
      setStatus('Approval service is not loaded.', 'error');
      render([], 'Approval service is not loaded.');
      return;
    }
    setStatus('Checking approval diagnostics...', 'loading');
    await refreshDiagnostics();
    setStatus('Loading pending Supabase approvals...', 'loading');
    try{
      var rows = await window.GEESAuthService.listPendingUserApprovals();
      render(rows || []);
      setStatus((rows || []).length + ' pending approval request(s) found.', 'success');
      await refreshDiagnostics();
    }catch(error){
      var message = friendlyApprovalMessage(error);
      console.error(error);
      setStatus(message, 'error');
      render([], message);
      await refreshDiagnostics();
    }
  }

  async function runAction(userId, action){
    var note = window.prompt(action === 'approve' ? 'Approval note (optional)' : 'Rejection reason');
    if(note === null) return;
    var service = window.GEESAuthService;
    if(!service) return;
    setStatus((action === 'approve' ? 'Approving' : 'Rejecting') + ' user...', 'loading');
    try{
      if(action === 'approve') await service.approveUser(userId, note || null);
      else await service.rejectUser(userId, note || 'Rejected by GEES admin.');
      toast(action === 'approve' ? 'User approved successfully.' : 'User rejected successfully.', action === 'approve' ? 'success' : 'warning');
      await loadApprovals();
    }catch(error){
      var message = friendlyApprovalMessage(error);
      console.error(error);
      setStatus(message, 'error');
      toast(message, 'error');
      await refreshDiagnostics();
    }
  }

  ready(function(){
    tbody = document.querySelector('[data-approval-table-body]');
    statusEl = document.querySelector('[data-approval-status]');
    diagnosticsEl = document.querySelector('[data-approval-diagnostics]');
    document.addEventListener('click', function(event){
      var approve = event.target.closest('[data-approve-user]');
      var reject = event.target.closest('[data-reject-user]');
      var refresh = event.target.closest('[data-refresh-approvals]');
      var diagnostic = event.target.closest('[data-refresh-approval-diagnostics]');
      if(approve){ event.preventDefault(); runAction(approve.dataset.approveUser, 'approve'); }
      if(reject){ event.preventDefault(); runAction(reject.dataset.rejectUser, 'reject'); }
      if(refresh){ event.preventDefault(); loadApprovals(); }
      if(diagnostic){ event.preventDefault(); refreshDiagnostics(); }
    });
    document.addEventListener('gees:portal-session-ready', function(){ loadApprovals(); }, { once:true });
    setTimeout(function(){ if(!lastRows.length) loadApprovals(); }, 1400);
  });
})();
