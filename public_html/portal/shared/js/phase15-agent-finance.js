(function(){
'use strict';
var core = window.GEESPhaseCore;
async function start(){
  var root = core.$('[data-phase-page="agent-finance"]'); if(!root) return;
  try{
    var ctx = await core.boot(['agent','admin','super_admin']);
    var query = ctx.client.from('commissions').select('id,agent_id,application_id,amount,currency,status,created_at').order('created_at',{ascending:false});
    if(ctx.session.role==='agent'){
      var agent = await core.one(ctx.client.from('agents').select('id').eq('user_id',ctx.session.id));
      query = query.eq('agent_id',agent.id);
    }
    var rows = await core.rows(query);
    core.$('[data-stat="commissions"]',root).textContent = rows.length;
    core.$('[data-table="commissions"]',root).innerHTML = rows.length ? rows.map(function(r){
      return '<tr><td><strong>'+core.esc((r.currency||'MYR')+' '+(r.amount||0))+'</strong><span class="gees-table-subtext">'+core.esc(r.application_id||'No application')+'</span></td><td><span class="gees-badge">'+core.esc(core.nice(r.status))+'</span></td><td>'+core.esc(r.created_at||'—')+'</td></tr>';
    }).join('') : core.renderEmpty(3,'No commission records yet.');
  }catch(err){ core.attachError(root,err); }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
