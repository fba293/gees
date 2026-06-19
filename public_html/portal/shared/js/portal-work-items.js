(function(){
'use strict';
if(window.GEES_WORK_ITEMS_V14)return;window.GEES_WORK_ITEMS_V14=true;
function ready(f){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',f,{once:true}):f();}
function db(){return window.GEESSupabase||window.GEES_REAL_SUPABASE||null;}
function e(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function say(m,t){if(window.GEESToast)window.GEESToast(m,t||'info');else console.log(m);}
async function sess(){if(window.GEESAuthService&&GEESAuthService.getPortalSession)return await GEESAuthService.getPortalSession();return window.GEESCurrentPortalSession||null;}
function opts(v){return ['open','in_progress','blocked','done','cancelled'].map(function(x){return '<option value="'+x+'" '+(x===v?'selected':'')+'>'+x.replace(/_/g,' ')+'</option>';}).join('');}
async function load(){var body=document.querySelector('[data-work-table]');if(!body)return;var c=db(),s=await sess();if(!c||!s){body.innerHTML='<tr><td colspan="5">Login required.</td></tr>';return;}var q=c.from('gees_tasks').select('id,title,priority,status,due_date,assigned_to,created_at').order('created_at',{ascending:false});if(s.role==='staff')q=q.eq('assigned_to',s.id);var r=await q;var rows=r&&!r.error?r.data||[]:[];body.innerHTML=rows.length?rows.map(function(x){return '<tr data-work-id="'+e(x.id)+'"><td><strong>'+e(x.title)+'</strong></td><td>'+e(x.priority||'normal')+'</td><td>'+e(x.due_date||'—')+'</td><td><select data-work-status>'+opts(x.status||'open')+'</select></td><td><button class="gees-btn gees-btn-primary" data-work-save>Update</button></td></tr>';}).join(''):'<tr><td colspan="5">No assigned work yet.</td></tr>';}
async function save(row){var c=db();if(!c)throw new Error('Supabase unavailable.');var r=await c.rpc('update_gees_task_status',{p_task_id:row.getAttribute('data-work-id'),p_status:row.querySelector('[data-work-status]').value});if(r.error)throw new Error(r.error.message);}
ready(function(){document.addEventListener('click',async function(ev){var b=ev.target.closest('[data-work-save]');if(!b)return;ev.preventDefault();var row=b.closest('[data-work-id]');b.disabled=true;b.textContent='Updating...';try{await save(row);say('Work item updated.','success');await load();}catch(err){say(err.message||'Update failed.','error');}finally{b.disabled=false;b.textContent='Update';}});load();});
document.addEventListener('gees:portal-session-ready',load);window.GEESWorkItems={refresh:load};
})();
