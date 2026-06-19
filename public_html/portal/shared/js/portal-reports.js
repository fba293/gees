(function(){
'use strict';
if(window.GEES_REPORTS_V14)return;window.GEES_REPORTS_V14=true;
function ready(f){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f,{once:true}):f();}
function db(){return window.GEESSupabase||window.GEES_REAL_SUPABASE||null;}
function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function n(v){return Number(v||0).toLocaleString();}
function money(v){return 'MYR '+Number(v||0).toLocaleString();}
function card(label,value){return '<article class="gees-stat-card"><div><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div></article>';}
async function load(){var root=document.querySelector('[data-report-page]');if(!root)return;var c=db();if(!c)return;var r=await c.rpc('get_gees_admin_report_summary');if(r.error){root.innerHTML='<section class="gees-panel"><p>'+esc(r.error.message)+'</p></section>';return;}var d=r.data||{};var grid=document.querySelector('.gees-stats-grid');if(grid)grid.innerHTML=[card('Profiles',n(d.profiles)),card('Students',n(d.students)),card('Agents',n(d.agents)),card('Applications',n(d.applications_total)),card('Documents',n(d.documents_total)),card('Leads',n(d.leads_total)),card('Open Work',n(d.tasks_open)),card('Commission Paid',money(d.commissions_paid))].join('');var box=document.querySelector('[data-report-summary]');if(box)box.innerHTML='<table class="gees-table"><tbody>'+Object.keys(d).map(function(k){return '<tr><th>'+esc(k.replace(/_/g,' '))+'</th><td>'+esc(typeof d[k]==='number'?n(d[k]):d[k])+'</td></tr>';}).join('')+'</tbody></table>';}
ready(load);document.addEventListener('gees:portal-session-ready',load);window.GEESReports={refresh:load};
})();
