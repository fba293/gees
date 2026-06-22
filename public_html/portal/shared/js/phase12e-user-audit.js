(function(){
  'use strict';

  var core = window.GEESPhaseCore;
  var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function formatDate(value){
    if(!value) return '—';
    var date = new Date(value);
    if(Number.isNaN(date.getTime())) return String(value);
    try{
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
      }).format(date);
    }catch(error){
      return date.toLocaleString();
    }
  }

  function entityLabel(audit, viewedUserId){
    var table = audit.entity_table || 'profile';
    if(audit.entity_id === viewedUserId) return 'Profile';
    if(audit.actor_id === viewedUserId) return 'Performed by this user · ' + core.nice(table);
    return core.nice(table);
  }

  async function getAuditRows(client, userId, limit){
    return core.rows(
      client
        .from('audit_logs')
        .select('id,actor_id,action,entity_table,entity_id,created_at')
        .or('entity_id.eq.' + userId + ',actor_id.eq.' + userId)
        .order('created_at', { ascending: false })
        .limit(limit || 25)
    );
  }

  async function initDetails(){
    var root = core.$('[data-phase-page="user-details"]');
    if(!root) return;

    try{
      var ctx = await core.boot(['admin','super_admin']);
      var requestedId = new URLSearchParams(location.search).get('id');
      var userId = UUID_RE.test(String(requestedId || '')) ? requestedId : ctx.session.id;
      var profile = await core.one(
        ctx.client
          .from('profiles')
          .select('id,email,full_name,phone,role,status,team_id,created_at,updated_at')
          .eq('id', userId)
      );

      if(!profile) throw new Error('User profile was not found or is no longer available.');

      core.$('[data-user-title]', root).textContent = profile.full_name || profile.email || profile.id;
      core.$('[data-user-meta]', root).textContent = core.nice(profile.role) + ' · ' + core.nice(profile.status);
      core.$('[data-user-profile]', root).innerHTML =
        '<tr><td>Email</td><td>' + core.esc(profile.email || '—') + '</td></tr>' +
        '<tr><td>Phone</td><td>' + core.esc(profile.phone || '—') + '</td></tr>' +
        '<tr><td>Role</td><td>' + core.esc(core.nice(profile.role)) + '</td></tr>' +
        '<tr><td>Status</td><td>' + core.esc(core.nice(profile.status)) + '</td></tr>' +
        '<tr><td>Team</td><td>' + core.esc(profile.team_id || '—') + '</td></tr>' +
        '<tr><td>Created</td><td>' + core.esc(formatDate(profile.created_at)) + '</td></tr>' +
        '<tr><td>Last updated</td><td>' + core.esc(formatDate(profile.updated_at)) + '</td></tr>';

      var audits = await getAuditRows(ctx.client, userId, 50);
      core.$('[data-user-audits]', root).innerHTML = audits.length ? audits.map(function(audit){
        return '<tr><td><strong>' + core.esc(core.nice(audit.action)) + '</strong>' +
          '<span class="gees-table-subtext">' + core.esc(entityLabel(audit, userId)) + '</span></td>' +
          '<td>' + core.esc(formatDate(audit.created_at)) + '</td></tr>';
      }).join('') : core.renderEmpty(2, 'No audit history has been recorded for this user yet.');
    }catch(error){
      core.attachError(root, error);
    }
  }

  async function initAudit(){
    var root = core.$('[data-phase-page="audit-log"]');
    if(!root) return;

    try{
      var ctx = await core.boot(['admin','super_admin']);
      var logs = await core.rows(
        ctx.client
          .from('audit_logs')
          .select('id,actor_id,action,entity_table,entity_id,created_at')
          .order('created_at', { ascending: false })
          .limit(100)
      );

      core.$('[data-audit-table]', root).innerHTML = logs.length ? logs.map(function(audit){
        return '<tr><td><strong>' + core.esc(core.nice(audit.action)) + '</strong>' +
          '<span class="gees-table-subtext">' + core.esc(core.nice(audit.entity_table || 'record')) + '</span></td>' +
          '<td>' + core.esc(audit.entity_id || audit.actor_id || '—') + '</td>' +
          '<td>' + core.esc(formatDate(audit.created_at)) + '</td></tr>';
      }).join('') : core.renderEmpty(3, 'No audit logs have been recorded yet.');
    }catch(error){
      core.attachError(root, error);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ initDetails(); initAudit(); }, { once: true });
  }else{
    initDetails();
    initAudit();
  }
})();
