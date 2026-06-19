(function(){
'use strict';
var core = window.GEESPhaseCore;
async function start(){
  var root = core.$('[data-phase-page="application-workflow"]'); if(!root) return;
  try{
    var ctx = await core.boot(['student','staff','admin','super_admin']);
    var appId = new URLSearchParams(location.search).get('application_id');
    if(!appId) throw new Error('Missing application_id in URL.');
    async function refresh(){
      var app = await core.one(ctx.client.from('applications').select('id,application_no,status,intake,updated_at').eq('id',appId));
      core.$('[data-app-title]',root).textContent = app.application_no || app.id;
      core.$('[data-app-status]',root).textContent = core.nice(app.status);
      var history = await core.rows(ctx.client.from('application_status_history').select('id,old_status,new_status,note,created_at,changed_by').eq('application_id',appId).order('created_at',{ascending:false}));
      core.$('[data-workflow-history]',root).innerHTML = history.length ? history.map(function(h){
        return '<div class="gees-timeline-item"><div class="gees-timeline-dot"><i class="fa-solid fa-check"></i></div><div><strong>'+core.esc(core.nice(h.new_status))+'</strong><p>'+core.esc(h.note||'Status updated')+'</p><span class="gees-table-subtext">'+core.esc(h.created_at||'')+'</span></div></div>';
      }).join('') : '<div class="gees-record-empty">No workflow history yet.</div>';
    }
    await refresh();
    var form = core.$('[data-form="workflow-status"]',root);
    if(form) form.addEventListener('submit',async function(ev){
      ev.preventDefault();
      var data = core.formData(ev.currentTarget);
      core.set('[data-status="workflow"]','Updating workflow...','loading');
      var current = await core.one(ctx.client.from('applications').select('status').eq('id',appId));
      var upd = await ctx.client.from('applications').update({status:data.status,updated_at:new Date().toISOString()}).eq('id',appId).select('id').maybeSingle();
      if(upd.error) throw new Error(upd.error.message);
      var hist = await ctx.client.from('application_status_history').insert({application_id:appId,old_status:current.status,new_status:data.status,note:data.note,changed_by:ctx.session.id}).select('id').maybeSingle();
      if(hist.error) throw new Error(hist.error.message);
      await refresh();
      core.set('[data-status="workflow"]','Workflow updated.','success');
    });
  }catch(err){ core.attachError(root,err); }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
