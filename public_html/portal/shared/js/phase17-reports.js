(function(){
'use strict';
var core = window.GEESPhaseCore;
async function start(){
  var root = core.$('[data-phase-page="reports"]'); if(!root) return;
  try{
    var ctx = await core.boot(['admin','super_admin']);
    var apps = await core.rows(ctx.client.from('applications').select('id,status,created_at,university_id,course_id'));
    var students = await core.rows(ctx.client.from('students').select('id,created_at,preferred_country'));
    var agents = await core.rows(ctx.client.from('agents').select('id,created_at,approval_status'));
    core.$('[data-stat="report-apps"]',root).textContent = apps.length;
    core.$('[data-stat="report-students"]',root).textContent = students.length;
    core.$('[data-stat="report-agents"]',root).textContent = agents.length;
    var statuses = {};
    apps.forEach(function(a){statuses[a.status]=(statuses[a.status]||0)+1});
    core.$('[data-table="report-status"]',root).innerHTML = Object.keys(statuses).map(function(k){return '<tr><td>'+core.esc(core.nice(k))+'</td><td>'+statuses[k]+'</td></tr>'}).join('') || core.renderEmpty(2,'No report data yet.');
  }catch(err){ core.attachError(root,err); }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
