(function(){
'use strict';
var core = window.GEESPhaseCore;
async function start(){
  var root = core.$('[data-phase-page="tasks"]'); if(!root) return;
  try{
    var ctx = await core.boot(['staff','admin','super_admin']);
    async function refresh(){
      var req = ctx.client.from('tasks').select('id,title,priority,status,due_date,assigned_to,created_at').order('due_date',{ascending:true});
      if(ctx.session.role==='staff') req = req.eq('assigned_to',ctx.session.id);
      var tasks = await core.rows(req);
      core.$('[data-stat="tasks"]',root).textContent = tasks.length;
      core.$('[data-table="tasks"]',root).innerHTML = tasks.length ? tasks.map(function(t){
        return '<tr><td><strong>'+core.esc(t.title)+'</strong><span class="gees-table-subtext">'+core.esc(t.due_date||'No due date')+'</span></td><td>'+core.esc(core.nice(t.priority))+'</td><td><span class="gees-badge">'+core.esc(core.nice(t.status))+'</span></td></tr>';
      }).join('') : core.renderEmpty(3,'No tasks yet.');
    }
    await refresh();
    var form = core.$('[data-form="task"]',root);
    if(form) form.addEventListener('submit',async function(ev){
      ev.preventDefault();
      var data = core.formData(ev.currentTarget);
      var row = await ctx.client.from('tasks').insert({title:data.title,priority:data.priority||'normal',status:'open',due_date:core.nil(data.due_date),assigned_to:core.nil(data.assigned_to)||ctx.session.id,created_by:ctx.session.id}).select('id').maybeSingle();
      if(row.error) throw new Error(row.error.message);
      ev.currentTarget.reset();
      await refresh();
    });
  }catch(err){ core.attachError(root,err); }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
