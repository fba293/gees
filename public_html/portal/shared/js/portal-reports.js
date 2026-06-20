(function(){
'use strict';
if(window.GEES_REPORTS_V15)return;window.GEES_REPORTS_V15=true;
var loading=false;
function ready(f){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f,{once:true}):f();}
function db(){return window.GEESSupabase||window.GEES_REAL_SUPABASE||null;}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function n(v){return Number(v||0).toLocaleString();}
function money(v){return 'MYR '+Number(v||0).toLocaleString();}
function niceDate(v){try{return v?new Date(v).toLocaleString():'—';}catch(e){return '—';}}
function card(label,value){return '<article class="gees-stat-card"><div><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div></article>';}
function friendly(error){var raw=String((error&&error.message)||error||'').toLowerCase();if(/permission|not authorized|access denied|row-level/.test(raw))return 'You do not have permission to view this report.';if(/session|token|login/.test(raw))return 'Your session has expired. Please sign in again.';if(/network|fetch|offline|timeout/.test(raw))return 'Connection issue. Please try again.';return 'We could not load the report. Please refresh and try again.';}
function setReportStatus(message,type){var box=document.querySelector('[data-report-summary]');if(!box)return;if(type==='error')box.innerHTML='<div class="gees-record-empty">'+esc(message)+'</div>';}
function setRefreshBusy(busy){var button=document.querySelector('[data-report-page] [onclick*="GEESReports"]');if(button){button.disabled=!!busy;button.setAttribute('aria-busy',String(!!busy));}}
async function load(){
  var root=document.querySelector('[data-report-page]');if(!root||loading)return;loading=true;setRefreshBusy(true);
  try{
    var c=db();if(!c)throw new Error('Supabase unavailable.');var r=await c.rpc('get_gees_admin_report_summary');if(r.error)throw new Error(r.error.message);
    var d=r.data||{},grid=document.querySelector('.gees-stats-grid');
    if(grid)grid.innerHTML=[card('Profiles',n(d.profiles)),card('Students',n(d.students)),card('Agents',n(d.agents)),card('Applications',n(d.applications_total)),card('Documents',n(d.documents_total)),card('Leads',n(d.leads_total)),card('Open Work',n(d.tasks_open)),card('Commission Paid',money(d.commissions_paid))].join('');
    var box=document.querySelector('[data-report-summary]');
    if(box){var rows=[['Applications submitted',n(d.applications_submitted)],['Applications approved',n(d.applications_approved)],['Documents uploaded',n(d.documents_uploaded)],['Open work items',n(d.tasks_open)],['Completed work items',n(d.tasks_done)],['Total commission',money(d.commissions_total)],['Commission paid',money(d.commissions_paid)],['Generated',niceDate(d.generated_at)]];box.innerHTML='<table class="gees-table"><tbody>'+rows.map(function(row){return '<tr><th>'+esc(row[0])+'</th><td>'+esc(row[1])+'</td></tr>';}).join('')+'</tbody></table>';}
  }catch(error){setReportStatus(friendly(error),'error');}
  finally{loading=false;setRefreshBusy(false);}
}
ready(load);document.addEventListener('gees:portal-session-ready',load);document.addEventListener('gees:crud-complete',load);window.GEESReports={refresh:load};
})();
