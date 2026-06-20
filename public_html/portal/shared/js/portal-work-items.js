(function(){
'use strict';
if(window.GEES_WORK_ITEMS_V15)return;window.GEES_WORK_ITEMS_V15=true;
var STATUSES=['open','in_progress','blocked','done','cancelled'];
function ready(f){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f,{once:true}):f();}
function db(){return window.GEESSupabase||window.GEES_REAL_SUPABASE||null;}
function e(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function say(m,t){if(window.GEESToast)window.GEESToast(m,t||'info');else console.log(m);}
function label(v){return String(v||'').replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});}
function friendly(err){var raw=String((err&&err.message)||err||'').toLowerCase();if(/permission|access denied|row-level|not authorized/.test(raw))return 'You do not have permission to update this work item.';if(/session|token|login/.test(raw))return 'Your session has expired. Please sign in again.';if(/network|fetch|offline|timeout/.test(raw))return 'Connection issue. Please try again.';return 'We could not update this work item. Please try again.';}
async function sess(){if(window.GEESAuthService&&GEESAuthService.getPortalSession)return await GEESAuthService.getPortalSession();return window.GEESCurrentPortalSession||null;}
function opts(v){return STATUSES.map(function(x){return '<option value="'+x+'" '+(x===v?'selected':'')+'>'+label(x)+'</option>';}).join('');}
async function load(){
  var body=document.querySelector('[data-work-table]');if(!body)return;var c=db(),s=await sess();
  if(!c||!s){body.innerHTML='<tr><td colspan="5"><div class="gees-record-empty">Sign in to view work items.</div></td></tr>';return;}
  var q=c.from('gees_tasks').select('id,title,priority,status,due_date,assigned_to,created_at').order('created_at',{ascending:false});if(s.role==='staff')q=q.eq('assigned_to',s.id);
  var r=await q;if(r.error){body.innerHTML='<tr><td colspan="5"><div class="gees-record-empty">We could not load work items. Refresh and try again.</div></td></tr>';return;}
  var rows=r.data||[];body.innerHTML=rows.length?rows.map(function(x){return '<tr data-work-id="'+e(x.id)+'" data-work-status="'+e(x.status||'open')+'"><td><strong>'+e(x.title)+'</strong></td><td>'+e(label(x.priority||'normal'))+'</td><td>'+e(x.due_date||'—')+'</td><td><select data-work-status-select aria-label="Work item status">'+opts(x.status||'open')+'</select></td><td><button class="gees-btn gees-btn-primary" type="button" data-work-save>Update</button></td></tr>';}).join(''):'<tr><td colspan="5"><div class="gees-record-empty">No assigned work yet.</div></td></tr>';
}
async function save(row){var c=db();if(!c)throw new Error('Supabase unavailable.');var next=row.querySelector('[data-work-status-select]').value;if(STATUSES.indexOf(next)===-1)throw new Error('Invalid status.');var r=await c.rpc('update_gees_task_status',{p_task_id:row.getAttribute('data-work-id'),p_status:next});if(r.error)throw new Error(r.error.message);row.dataset.workStatus=next;}
ready(function(){document.addEventListener('click',async function(ev){var b=ev.target.closest('[data-work-save]');if(!b)return;ev.preventDefault();var row=b.closest('[data-work-id]');if(!row||b.dataset.geesBusy==='true')return;var next=row.querySelector('[data-work-status-select]').value;if(next===row.dataset.workStatus){say('Choose a new status before updating.','info');return;}b.dataset.geesBusy='true';b.disabled=true;b.setAttribute('aria-busy','true');b.innerHTML='<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Updating…';try{await save(row);say('Work item updated.','success');try{document.dispatchEvent(new CustomEvent('gees:crud-complete',{detail:{kind:'task'}}));}catch(e){}await load();}catch(err){say(friendly(err),'error');}finally{b.dataset.geesBusy='false';b.disabled=false;b.setAttribute('aria-busy','false');b.textContent='Update';}});load();});
document.addEventListener('gees:portal-session-ready',load);window.GEESWorkItems={refresh:load};
})();
