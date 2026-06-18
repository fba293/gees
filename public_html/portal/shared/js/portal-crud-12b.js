(function(){
  'use strict';
  var client=null, session=null;
  function $(s,r){return (r||document).querySelector(s)}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
  function title(v){return String(v||'').replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})}
  function status(el,msg,type){el=typeof el==='string'?$(el):el;if(!el)return;el.textContent=msg||'';el.dataset.type=type||'info'}
  function toast(msg,type){if(window.GEESPortalUI&&window.GEESPortalUI.toast)window.GEESPortalUI.toast(msg,type||'success');else console.log('[GEES 12B]',msg)}
  function fd(form){var o={};new FormData(form).forEach(function(v,k){o[k]=String(v||'').trim()});return o}
  function nil(v){return v?v:null}
  function live(){return session&&session.source==='supabase'}
  async function boot(){client=client||(window.GEESWaitForSupabaseClient?await window.GEESWaitForSupabaseClient():window.GEESSupabase);session=session||(window.GEESAuthService&&window.GEESAuthService.getPortalSession?await window.GEESAuthService.getPortalSession():window.GEESCurrentPortalSession);if(!client)throw new Error('Supabase client unavailable. Upload latest shared JS and hard refresh.');if(!session)throw new Error('Portal session unavailable. Login again.')}
  async function one(q){var r=await q.maybeSingle();if(r.error)throw new Error(r.error.message);return r.data}
  async function rows(q){var r=await q;if(r.error)throw new Error(r.error.message);return r.data||[]}
  function demo(root){root.innerHTML='<div class="gees-live-only-note">Demo accounts show safe UI only. Login with a real Supabase account for live agent/staff actions.</div>'}
  function date(v){try{return v?new Date(v).toLocaleString():'—'}catch(e){return v||'—'}}
  async function profiles(){return rows(client.from('profiles').select('id,email,full_name,phone,role,status,team_id').order('created_at',{ascending:false}))}
  async function allStudents(){return rows(client.from('students').select('id,user_id,preferred_country,preferred_level,preferred_intake,assigned_agent_id,assigned_staff_id,created_at').order('created_at',{ascending:false}))}
  async function allAgents(){return rows(client.from('agents').select('id,user_id,agency_name,country,city,approval_status').order('created_at',{ascending:false}))}
  async function allStaff(){return rows(client.from('staff_profiles').select('id,user_id,team_id,title,department').order('created_at',{ascending:false}))}
  function pmap(list){var m={};(list||[]).forEach(function(p){m[p.id]=p});return m}
  function opt(list,map,label){return '<option value="">'+esc(label||'None')+'</option>'+(list||[]).map(function(x){var p=map[x.user_id]||{};var name=p.full_name||p.email||x.agency_name||x.team_id||x.id;return '<option value="'+esc(x.id)+'">'+esc(name)+'</option>'}).join('')}

  async function initAdminStudents(){
    var root=$('[data-crud-page="admin-students"]');if(!root)return;await boot();if(!live()){demo(root);return}
    async function refresh(){
      var ps=await profiles(), pm=pmap(ps), st=await allStudents(), ag=await allAgents(), sf=await allStaff();
      $('[data-stat="admin-students"]',root).textContent=st.length;
      $('[data-stat="admin-agents"]',root).textContent=ag.length;
      $('[data-stat="admin-staff"]',root).textContent=sf.length;
      var agentOpt=opt(ag,pm,'No agent');var staffOpt=opt(sf,pm,'No staff');
      $('[data-crud-table="admin-students"]',root).innerHTML=st.length?st.map(function(s){var p=pm[s.user_id]||{};return '<tr data-student="'+esc(s.id)+'"><td><strong>'+esc(p.full_name||p.email||'Student')+'</strong><span class="gees-table-subtext">'+esc(p.email||s.user_id)+'</span></td><td>'+esc(s.preferred_country||'—')+'<span class="gees-table-subtext">'+esc(s.preferred_level||'')+'</span></td><td><select data-agent-select>'+agentOpt+'</select></td><td><select data-staff-select>'+staffOpt+'</select></td><td><button class="gees-btn gees-btn-sm gees-btn-primary" data-save-assignment>Save</button></td></tr>'}).join(''):'<tr><td colspan="5"><div class="gees-record-empty">No students yet.</div></td></tr>';
      st.forEach(function(s){var tr=$('[data-student="'+s.id+'"]',root);if(tr){$('[data-agent-select]',tr).value=s.assigned_agent_id||'';$('[data-staff-select]',tr).value=s.assigned_staff_id||''}})
    }
    await refresh();
    root.addEventListener('click',async function(e){var btn=e.target.closest('[data-save-assignment]');if(!btn)return;e.preventDefault();var tr=e.target.closest('[data-student]');var studentId=tr.dataset.student;var agentId=$('[data-agent-select]',tr).value||null;var staffId=$('[data-staff-select]',tr).value||null;status('[data-crud-status="admin-students"]','Saving assignment...','loading');try{var s=await client.from('students').update({assigned_agent_id:agentId,assigned_staff_id:staffId,updated_at:new Date().toISOString()}).eq('id',studentId).select('id').maybeSingle();if(s.error)throw new Error(s.error.message);var app=await client.from('applications').update({agent_id:agentId,staff_id:staffId,updated_at:new Date().toISOString()}).eq('student_id',studentId);if(app.error)throw new Error(app.error.message);status('[data-crud-status="admin-students"]','Assignment saved and synced to applications.','success');toast('Assignment saved.');await refresh()}catch(err){status('[data-crud-status="admin-students"]',err.message,'error');toast(err.message,'error')}})
  }

  async function initAgentStudents(){
    var root=$('[data-crud-page="agent-students"]');if(!root)return;await boot();if(!live()){demo(root);return}
    var agent=await one(client.from('agents').select('id,user_id,agency_name').eq('user_id',session.id));
    async function refresh(){var st=agent?await rows(client.from('students').select('id,user_id,preferred_country,preferred_level,preferred_intake,created_at').eq('assigned_agent_id',agent.id).order('created_at',{ascending:false})):[];var ids=st.map(function(s){return s.user_id});var ps=ids.length?await rows(client.from('profiles').select('id,email,full_name,phone,status').in('id',ids)):[];var pm=pmap(ps);$('[data-stat="agent-students"]',root).textContent=st.length;$('[data-crud-table="agent-students"]',root).innerHTML=st.length?st.map(function(s){var p=pm[s.user_id]||{};return '<tr><td><strong>'+esc(p.full_name||p.email||'Student')+'</strong><span class="gees-table-subtext">'+esc(p.email||'')+'</span></td><td>'+esc(s.preferred_country||'—')+'</td><td><span class="gees-badge">'+esc(s.preferred_level||'Lead')+'</span></td></tr>'}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No assigned students yet. Admin can assign students to this agent.</div></td></tr>'}
    await refresh();
    var form=$('[data-crud-form="agent-referral"]',root);if(form)form.addEventListener('submit',async function(e){e.preventDefault();var d=fd(e.currentTarget);status('[data-crud-status="agent-referral"]','Creating referral request...','loading');try{var subj='Referral request: '+(d.student_name||'New student');var body='Preferred country: '+(d.preferred_country||'Not set')+' · Phone: '+(d.phone||'Not set');var r=await client.from('support_tickets').insert({opened_by:session.id,subject:subj,priority:d.priority||'normal',status:'open'}).select('id').maybeSingle();if(r.error)throw new Error(r.error.message);e.currentTarget.reset();status('[data-crud-status="agent-referral"]','Referral request created as support ticket.','success');toast('Referral request created.')}catch(err){status('[data-crud-status="agent-referral"]',err.message,'error');toast(err.message,'error')}})
  }

  async function initStaffApplications(){
    var root=$('[data-crud-page="staff-applications"]');if(!root)return;await boot();if(!live()){demo(root);return}
    var staff=await one(client.from('staff_profiles').select('id,user_id,team_id,title').eq('user_id',session.id));
    async function refresh(){var apps=staff?await rows(client.from('applications').select('id,application_no,status,intake,student_id,updated_at,created_at').eq('staff_id',staff.id).order('updated_at',{ascending:false})):[];$('[data-stat="staff-applications"]',root).textContent=apps.length;$('[data-crud-table="staff-applications"]',root).innerHTML=apps.length?apps.map(function(a){return '<tr><td><strong>'+esc(a.application_no||a.id.slice(0,8))+'</strong><span class="gees-table-subtext">'+esc(date(a.updated_at||a.created_at))+'</span></td><td><span class="gees-badge">'+esc(title(a.status))+'</span></td><td><select data-status="'+esc(a.id)+'"><option value="under_review">Under Review</option><option value="documents_required">Documents Required</option><option value="offer_received">Offer Received</option><option value="visa_processing">Visa Processing</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></td></tr>'}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No applications assigned yet. Admin can assign students/applications to this staff profile.</div></td></tr>';apps.forEach(function(a){var sel=$('[data-status="'+a.id+'"]',root);if(sel)sel.value=a.status})}
    await refresh();
    root.addEventListener('change',async function(e){var sel=e.target.closest('[data-status]');if(!sel)return;status('[data-crud-status="staff-applications"]','Updating status...','loading');try{var r=await client.from('applications').update({status:sel.value,updated_at:new Date().toISOString()}).eq('id',sel.dataset.status).select('id,status').maybeSingle();if(r.error)throw new Error(r.error.message);status('[data-crud-status="staff-applications"]','Application status updated.','success');toast('Application status updated.');await refresh()}catch(err){status('[data-crud-status="staff-applications"]',err.message,'error');toast(err.message,'error')}})
  }

  async function start(){try{await initAdminStudents();await initAgentStudents();await initStaffApplications()}catch(err){console.error('[GEES 12B]',err);status('[data-crud-status]',err.message||'Phase 12B failed.','error')}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
