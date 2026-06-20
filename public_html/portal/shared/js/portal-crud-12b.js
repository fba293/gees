(function(){
  'use strict';
  if(window.GEES_PORTAL_CRUD_12B_V15)return;
  window.GEES_PORTAL_CRUD_12B_V15=true;

  var client=null,session=null;
  function $(selector,root){return (root||document).querySelector(selector);}
  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char];});}
  function title(value){return String(value||'').replace(/_/g,' ').replace(/\b\w/g,function(char){return char.toUpperCase();});}
  function status(target,message,type){var node=typeof target==='string'?$(target):target;if(!node)return;node.textContent=message||'';node.dataset.type=type||'info';}
  function toast(message,type){if(window.GEESToast)window.GEESToast(message,type||'info');else console.log('[GEES]',message);}
  function data(form){var output={};new FormData(form).forEach(function(value,key){if(!(value instanceof File))output[key]=String(value||'').trim();});return output;}
  function friendly(error,fallback){var raw=String((error&&error.message)||error||'').toLowerCase();if(/permission|not authorized|access denied|row-level/.test(raw))return 'You do not have permission for this action.';if(/session|token|login/.test(raw))return 'Your session has expired. Please sign in again.';if(/network|fetch|offline|timeout/.test(raw))return 'Connection issue. Please check your internet and try again.';if(/duplicate|unique/.test(raw))return 'This record already exists or was already updated.';return fallback||'We could not save your changes. Please try again.';}
  function setBusy(control,busy,label){if(!control)return;if(!control.dataset.geesLabel)control.dataset.geesLabel=control.tagName==='SELECT'?'':(control.tagName==='INPUT'?control.value:control.innerHTML);control.disabled=!!busy;control.setAttribute('aria-busy',String(!!busy));if(control.tagName==='BUTTON')control.innerHTML=busy?'<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> '+(label||'Saving…'):control.dataset.geesLabel;}
  function complete(kind){try{document.dispatchEvent(new CustomEvent('gees:crud-complete',{detail:{kind:kind}}));}catch(e){}if(window.GEESPortalRefreshCounts)window.GEESPortalRefreshCounts();}
  async function boot(){client=client||(window.GEESWaitForSupabaseClient?await window.GEESWaitForSupabaseClient():window.GEESSupabase);session=session||(window.GEESAuthService&&window.GEESAuthService.getPortalSession?await window.GEESAuthService.getPortalSession():window.GEESCurrentPortalSession);if(!client)throw new Error('Supabase client unavailable.');if(!session||session.source!=='supabase')throw new Error('Portal session unavailable.');}
  async function one(query){var result=await query.maybeSingle();if(result.error)throw new Error(result.error.message);return result.data;}
  async function rows(query){var result=await query;if(result.error)throw new Error(result.error.message);return result.data||[];}
  function unavailable(root){root.innerHTML='<div class="gees-live-only-note">This page needs an active GEES account. Please sign in again.</div>';}
  function date(value){try{return value?new Date(value).toLocaleString():'—';}catch(e){return value||'—';}}
  async function profiles(){return rows(client.from('profiles').select('id,email,full_name,phone,role,status,team_id').order('created_at',{ascending:false}));}
  async function allStudents(){return rows(client.from('students').select('id,user_id,preferred_country,preferred_level,preferred_intake,assigned_agent_id,assigned_staff_id,created_at').order('created_at',{ascending:false}));}
  async function allAgents(){return rows(client.from('agents').select('id,user_id,agency_name,country,city,approval_status').order('created_at',{ascending:false}));}
  async function allStaff(){return rows(client.from('staff_profiles').select('id,user_id,team_id,title,department').order('created_at',{ascending:false}));}
  function profileMap(list){var map={};(list||[]).forEach(function(profile){map[profile.id]=profile;});return map;}
  function options(list,map,label){return '<option value="">'+esc(label||'None')+'</option>'+(list||[]).map(function(item){var profile=map[item.user_id]||{};var name=profile.full_name||profile.email||item.agency_name||item.team_id||item.id;return '<option value="'+esc(item.id)+'">'+esc(name)+'</option>';}).join('');}

  async function initAdminStudents(){
    var root=$('[data-crud-page="admin-students"]');if(!root)return;await boot();
    async function refresh(){
      var profilesList=await profiles(),map=profileMap(profilesList),students=await allStudents(),agents=await allAgents(),staff=await allStaff();
      var studentsStat=$('[data-stat="admin-students"]',root),agentsStat=$('[data-stat="admin-agents"]',root),staffStat=$('[data-stat="admin-staff"]',root);
      if(studentsStat)studentsStat.textContent=students.length;if(agentsStat)agentsStat.textContent=agents.length;if(staffStat)staffStat.textContent=staff.length;
      var agentOptions=options(agents,map,'No agent'),staffOptions=options(staff,map,'No staff'),body=$('[data-crud-table="admin-students"]',root);
      if(!body)return;
      body.innerHTML=students.length?students.map(function(student){var profile=map[student.user_id]||{};return '<tr data-student="'+esc(student.id)+'"><td><strong>'+esc(profile.full_name||profile.email||'Student')+'</strong><span class="gees-table-subtext">'+esc(profile.email||student.user_id)+'</span></td><td>'+esc(student.preferred_country||'—')+'<span class="gees-table-subtext">'+esc(student.preferred_level||'')+'</span></td><td><select data-agent-select aria-label="Assign agent">'+agentOptions+'</select></td><td><select data-staff-select aria-label="Assign staff">'+staffOptions+'</select></td><td><button class="gees-btn gees-btn-sm gees-btn-primary" type="button" data-save-assignment>Save</button></td></tr>';}).join(''):'<tr><td colspan="5"><div class="gees-record-empty">No students yet.</div></td></tr>';
      students.forEach(function(student){var row=$('[data-student="'+student.id+'"]',root);if(row){var agent=$('[data-agent-select]',row),staffSelect=$('[data-staff-select]',row);if(agent)agent.value=student.assigned_agent_id||'';if(staffSelect)staffSelect.value=student.assigned_staff_id||'';}});
    }
    await refresh();
    root.addEventListener('click',async function(event){
      var button=event.target.closest('[data-save-assignment]');if(!button||button.dataset.geesBusy==='true')return;event.preventDefault();
      var row=button.closest('[data-student]');if(!row)return;
      var studentId=row.dataset.student,agentId=$('[data-agent-select]',row).value||null,staffId=$('[data-staff-select]',row).value||null;
      setBusy(button,true,'Saving…');status('[data-crud-status="admin-students"]','Saving assignment…','loading');
      try{
        var studentResult=await client.from('students').update({assigned_agent_id:agentId,assigned_staff_id:staffId,updated_at:new Date().toISOString()}).eq('id',studentId).select('id').maybeSingle();if(studentResult.error)throw new Error(studentResult.error.message);
        var applicationsResult=await client.from('applications').update({agent_id:agentId,staff_id:staffId,updated_at:new Date().toISOString()}).eq('student_id',studentId);if(applicationsResult.error)throw new Error(applicationsResult.error.message);
        status('[data-crud-status="admin-students"]','Assignment saved and synced to applications.','success');toast('Assignment saved.','success');complete('assignment');await refresh();
      }catch(error){var message=friendly(error);status('[data-crud-status="admin-students"]',message,'error');toast(message,'error');}
      finally{button.dataset.geesBusy='';setBusy(button,false);}
    });
  }

  async function initAgentStudents(){
    var root=$('[data-crud-page="agent-students"]');if(!root)return;await boot();
    var agent=await one(client.from('agents').select('id,user_id,agency_name').eq('user_id',session.id));
    if(!agent){unavailable(root);return;}
    async function refresh(){
      var students=await rows(client.from('students').select('id,user_id,preferred_country,preferred_level,preferred_intake,created_at').eq('assigned_agent_id',agent.id).order('created_at',{ascending:false}));
      var ids=students.map(function(student){return student.user_id;}),profilesList=ids.length?await rows(client.from('profiles').select('id,email,full_name,phone,status').in('id',ids)):[],map=profileMap(profilesList),stat=$('[data-stat="agent-students"]',root),body=$('[data-crud-table="agent-students"]',root);
      if(stat)stat.textContent=students.length;if(!body)return;
      body.innerHTML=students.length?students.map(function(student){var profile=map[student.user_id]||{};return '<tr><td><strong>'+esc(profile.full_name||profile.email||'Student')+'</strong><span class="gees-table-subtext">'+esc(profile.email||'')+'</span></td><td>'+esc(student.preferred_country||'—')+'</td><td><span class="gees-badge">'+esc(student.preferred_level||'Lead')+'</span></td></tr>';}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No assigned students yet. An administrator can assign students to this agent.</div></td></tr>';
    }
    await refresh();
    var form=$('[data-crud-form="agent-referral"]',root);if(form)form.addEventListener('submit',async function(event){
      event.preventDefault();if(form.dataset.geesBusy==='true')return;var values=data(form);if(!values.student_name||values.student_name.length<2){status('[data-crud-status="agent-referral"]','Enter the student name before creating a referral request.','error');return;}
      var button=form.querySelector('button[type="submit"]');form.dataset.geesBusy='true';setBusy(button,true,'Sending…');status('[data-crud-status="agent-referral"]','Creating referral request…','loading');
      try{
        var subject='Referral request: '+values.student_name,created=await client.from('support_tickets').insert({opened_by:session.id,subject:subject,priority:values.priority||'normal',status:'open'}).select('id').maybeSingle();if(created.error)throw new Error(created.error.message);
        form.reset();status('[data-crud-status="agent-referral"]','Referral request created.','success');toast('Referral request created.','success');complete('referral');
      }catch(error){var message=friendly(error);status('[data-crud-status="agent-referral"]',message,'error');toast(message,'error');}
      finally{form.dataset.geesBusy='';setBusy(button,false);}
    });
  }

  async function initStaffApplications(){
    var root=$('[data-crud-page="staff-applications"]');if(!root)return;await boot();
    var staff=await one(client.from('staff_profiles').select('id,user_id,team_id,title').eq('user_id',session.id));
    if(!staff){unavailable(root);return;}
    async function refresh(){
      var apps=await rows(client.from('applications').select('id,application_no,status,intake,student_id,updated_at,created_at').eq('staff_id',staff.id).order('updated_at',{ascending:false})),body=$('[data-crud-table="staff-applications"]',root),stat=$('[data-stat="staff-applications"]',root);
      if(stat)stat.textContent=apps.length;if(!body)return;
      body.innerHTML=apps.length?apps.map(function(app){var current=app.status||'under_review';return '<tr data-application-id="'+esc(app.id)+'" data-application-status="'+esc(current)+'"><td><strong>'+esc(app.application_no||app.id.slice(0,8))+'</strong><span class="gees-table-subtext">'+esc(date(app.updated_at||app.created_at))+'</span></td><td><span class="gees-badge">'+esc(title(current))+'</span></td><td><select data-status-select aria-label="Application status"><option value="under_review">Under Review</option><option value="documents_required">Documents Required</option><option value="offer_received">Offer Received</option><option value="visa_processing">Visa Processing</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></td></tr>';}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No applications assigned yet. An administrator can assign applications to this staff profile.</div></td></tr>';
      apps.forEach(function(app){var select=$('[data-application-id="'+app.id+'"] [data-status-select]',root);if(select)select.value=app.status||'under_review';});
    }
    await refresh();
    root.addEventListener('change',async function(event){
      var select=event.target.closest('[data-status-select]');if(!select||select.dataset.geesBusy==='true')return;
      var row=select.closest('[data-application-id]'),next=select.value,current=row&&row.dataset.applicationStatus;if(!row||!next)return;
      if(next===current){return;}
      select.dataset.geesBusy='true';setBusy(select,true);status('[data-crud-status="staff-applications"]','Updating application status…','loading');
      try{
        var result=await client.rpc('update_gees_application_status',{p_application_id:row.dataset.applicationId,p_status:next,p_note:null});if(result.error)throw new Error(result.error.message);
        status('[data-crud-status="staff-applications"]','Application status updated.','success');toast('Application status updated.','success');complete('application-status');await refresh();
      }catch(error){select.value=current;var message=friendly(error);status('[data-crud-status="staff-applications"]',message,'error');toast(message,'error');}
      finally{select.dataset.geesBusy='';setBusy(select,false);}
    });
  }

  async function start(){try{await initAdminStudents();await initAgentStudents();await initStaffApplications();}catch(error){console.error('[GEES Portal]',error);status('[data-crud-status]',friendly(error,'This portal section could not load. Refresh and try again.'),'error');}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
