(function(){
  'use strict';

  var tbody;
  var statusEl;
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
      + '<td class="gees-table-actions">'
      + '<button class="gees-btn gees-btn-primary gees-btn-sm" data-approve-user="'+escapeHTML(row.profile_id)+'"><i class="fa-solid fa-check"></i> Approve</button>'
      + '<button class="gees-btn gees-btn-outline gees-btn-sm" data-reject-user="'+escapeHTML(row.profile_id)+'"><i class="fa-solid fa-xmark"></i> Reject</button>'
      + '</td></tr>';
  }

  function render(rows){
    lastRows = rows || [];
    if(!tbody) return;
    if(!lastRows.length){
      tbody.innerHTML = '<tr><td colspan="4"><div class="gees-empty-state"><i class="fa-solid fa-circle-check"></i><strong>No pending approvals</strong><span>New agent and staff signups will appear here after they register.</span></div></td></tr>';
      return;
    }
    tbody.innerHTML = lastRows.map(rowHTML).join('');
  }

  async function loadApprovals(){
    if(!window.GEESAuthService || typeof window.GEESAuthService.listPendingUserApprovals !== 'function'){
      setStatus('Approval service is not loaded.', 'error');
      render([]);
      return;
    }
    setStatus('Loading pending Supabase approvals...', 'loading');
    try{
      var rows = await window.GEESAuthService.listPendingUserApprovals();
      render(rows || []);
      setStatus((rows || []).length + ' pending approval request(s) found.', 'success');
    }catch(error){
      console.error(error);
      setStatus(error.message || 'Unable to load approvals.', 'error');
      render([]);
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
      console.error(error);
      setStatus(error.message || 'Action failed.', 'error');
      toast(error.message || 'Action failed.', 'error');
    }
  }

  ready(function(){
    tbody = document.querySelector('[data-approval-table-body]');
    statusEl = document.querySelector('[data-approval-status]');
    document.addEventListener('click', function(event){
      var approve = event.target.closest('[data-approve-user]');
      var reject = event.target.closest('[data-reject-user]');
      var refresh = event.target.closest('[data-refresh-approvals]');
      if(approve){ event.preventDefault(); runAction(approve.dataset.approveUser, 'approve'); }
      if(reject){ event.preventDefault(); runAction(reject.dataset.rejectUser, 'reject'); }
      if(refresh){ event.preventDefault(); loadApprovals(); }
    });
    document.addEventListener('gees:portal-session-ready', function(){ loadApprovals(); }, { once:true });
    setTimeout(function(){ if(!lastRows.length) loadApprovals(); }, 1400);
  });
})();
