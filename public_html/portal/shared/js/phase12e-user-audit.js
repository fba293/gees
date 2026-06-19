(function(){
'use strict';
var core = window.GEESPhaseCore;
async function initDetails(){
  var root = core.$('[data-phase-page="user-details"]'); if(!root) return;
  try{
    var ctx = await core.boot(['admin','super_admin']);
    var userId = new URLSearchParams(location.search).get('id') || ctx.session.id;
    var profile = await core.one(ctx.client.from('profiles').select('id,email,full_name,phone,role,status,team_id,created_at,updated_at').eq('id',userId));
    core.$('[data-user-title]',root).textContent = profile.full_name || profile.email || profile.id;
    core.$('[data-user-meta]',root).textContent = core.nice(profile.role) + ' · ' + core.nice(profile.status);
    core.$('[data-user-profile]',root).innerHTML =
      '<tr><td>Email</td><td>'+core.esc(profile.email||'—')+'</td></tr>'+
      '<tr><td>Phone</td><td>'+core.esc(profile.phone||'—')+'</td></tr>'+
      '<tr><td>Team</td><td>'+core.esc(profile.team_id||'—')+'</td></tr>'+
      '<tr><td>Created</td><td>'+core.esc(profile.created_at||'—')+'</td></tr>';
    var audits = await core.rows(ctx.client.from('audit_logs').select('id,action,entity_type,entity_id,created_at,metadata').eq('entity_id',userId).order('created_at',{ascending:false}).limit(25));
    core.$('[data-user-audits]',root).innerHTML = audits.length ? audits.map(function(a){
      return '<tr><td><strong>'+core.esc(a.action)+'</strong><span class="gees-table-subtext">'+core.esc(a.entity_type||'profile')+'</span></td><td>'+core.esc(a.created_at||'—')+'</td></tr>';
    }).join('') : core.renderEmpty(2,'No audit history yet.');
  }catch(err){ core.attachError(root,err); }
}
async function initAudit(){
  var root = core.$('[data-phase-page="audit-log"]'); if(!root) return;
  try{
    var ctx = await core.boot(['admin','super_admin']);
    var logs = await core.rows(ctx.client.from('audit_logs').select('id,actor_id,action,entity_type,entity_id,created_at,metadata').order('created_at',{ascending:false}).limit(100));
    core.$('[data-audit-table]',root).innerHTML = logs.length ? logs.map(function(a){
      return '<tr><td><strong>'+core.esc(a.action)+'</strong><span class="gees-table-subtext">'+core.esc(a.entity_type||'—')+'</span></td><td>'+core.esc(a.entity_id||'—')+'</td><td>'+core.esc(a.created_at||'—')+'</td></tr>';
    }).join('') : core.renderEmpty(3,'No audit logs yet.');
  }catch(err){ core.attachError(root,err); }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){initDetails();initAudit();});else{initDetails();initAudit();}
})();
