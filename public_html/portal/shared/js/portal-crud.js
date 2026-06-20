(function(){
  'use strict';
  if(window.GEES_PORTAL_CRUD_V15) return;
  window.GEES_PORTAL_CRUD_V15 = true;

  var client = null;
  var session = null;
  function $(s,r){return (r||document).querySelector(s);}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function title(v){return String(v||'').replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});}
  function status(el,msg,type){el=typeof el==='string'?$(el):el;if(!el)return;el.textContent=msg||'';el.dataset.type=type||'info';}
  function toast(msg,type){if(window.GEESToast)window.GEESToast(msg,type||'success');else console.log(msg);}
  function fd(form){var o={};new FormData(form).forEach(function(v,k){if(!(v instanceof File))o[k]=String(v||'').trim();});return o;}
  function nil(v){return v?v:null;}
  function live(){return session&&session.source==='supabase';}
  function friendly(error,fallback){
    var raw=String((error&&error.message)||error||'').toLowerCase();
    if(/duplicate|unique constraint/.test(raw))return 'This record already exists. Refresh the page and check your records.';
    if(/permission|row-level|not authorized|access denied/.test(raw))return 'You do not have permission for this action.';
    if(/network|fetch|offline|timeout/.test(raw))return 'Connection issue. Check your internet and try again.';
    if(/session|jwt|token|login/.test(raw))return 'Your session has expired. Please sign in again.';
    return fallback||'We could not save your changes. Please try again.';
  }
  function submitButton(form){return form.querySelector('button[type="submit"],input[type="submit"]');}
  function setBusy(form,busy,label){
    var button=submitButton(form);if(!button)return;
    if(!button.dataset.geesLabel)button.dataset.geesLabel=button.tagName==='INPUT'?button.value:button.innerHTML;
    form.dataset.geesBusy=busy?'true':'false';button.disabled=!!busy;button.setAttribute('aria-busy',String(!!busy));
    if(button.tagName==='INPUT')button.value=busy?(label||'Saving...'):button.dataset.geesLabel;
    else button.innerHTML=busy?'<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> '+(label||'Saving...'):button.dataset.geesLabel;
  }
  function completed(kind){try{document.dispatchEvent(new CustomEvent('gees:crud-complete',{detail:{kind:kind}}));}catch(e){}if(window.GEESPortalRefreshCounts)window.GEESPortalRefreshCounts();}
  async function boot(){
    client=client||(window.GEESWaitForSupabaseClient?await window.GEESWaitForSupabaseClient():window.GEESSupabase);
    session=session||(window.GEESAuthService&&window.GEESAuthService.getPortalSession?await window.GEESAuthService.getPortalSession():window.GEESCurrentPortalSession);
    if(!client)throw new Error('Supabase client unavailable.');
    if(!session)throw new Error('Portal session unavailable.');
  }
  async function one(q){var r=await q.maybeSingle();if(r.error)throw new Error(r.error.message);return r.data;}
  async function rows(q){var r=await q;if(r.error)throw new Error(r.error.message);return r.data||[];}
  async function profile(){await boot();return live()?one(client.from('profiles').select('*').eq('id',session.id)):null;}
  async function student(){
    await boot();if(!live())return null;
    var s=await one(client.from('students').select('*').eq('user_id',session.id));
    if(s)return s;
    var r=await client.from('students').insert({user_id:session.id,lead_source:'portal_auto_create'}).select('*').maybeSingle();
    if(r.error)throw new Error(r.error.message);return r.data;
  }
  async function catalogue(){return {universities:await rows(client.from('universities').select('id,name,country,city').order('name',{ascending:true})),courses:await rows(client.from('courses').select('id,title,level,university_id').order('title',{ascending:true}))};}
  function opts(list,label){return '<option value="">'+esc(label||'Select')+'</option>'+(list||[]).map(function(x){return '<option value="'+esc(x.id)+'">'+esc(x.name||x.title||x.id)+'</option>';}).join('');}
  async function applications(studentId){return rows(client.from('applications').select('id,application_no,status,intake,created_at').eq('student_id',studentId).order('created_at',{ascending:false}));}
  async function documents(studentId){return rows(client.from('documents').select('id,document_type,file_name,status,created_at,application_id').eq('student_id',studentId).order('created_at',{ascending:false}));}
  function date(v){try{return v?new Date(v).toLocaleString():'—';}catch(e){return v||'—';}}
  function unavailable(root){root.innerHTML='<div class="gees-live-only-note">This page needs an active GEES account. Please sign in again.</div>';}

  async function initApplication(){
    var root=$('[data-crud-page="student-application"]');if(!root)return;await boot();if(!live()){unavailable(root);return;}
    var s=await student(),cat=await catalogue(),form=$('[data-crud-form="application"]',root);
    $('[name="university_id"]',root).innerHTML=opts(cat.universities,'Select university');
    $('[name="course_id"]',root).innerHTML=opts(cat.courses,'Select course');
    async function refresh(){var list=await applications(s.id);var stat=$('[data-stat="applications"]',root);if(stat)stat.textContent=list.length;$('[data-crud-table="applications"]',root).innerHTML=list.length?list.map(function(a){return '<tr><td><strong>'+esc(a.application_no||a.id.slice(0,8))+'</strong><span class="gees-table-subtext">'+esc(date(a.created_at))+'</span></td><td><span class="gees-badge">'+esc(title(a.status))+'</span></td><td>'+esc(a.intake||'—')+'</td></tr>';}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No live applications yet.</div></td></tr>';}
    await refresh();if(!form)return;
    form.addEventListener('submit',async function(e){
      e.preventDefault();if(form.dataset.geesBusy==='true')return;
      var data=fd(form),submit=e.submitter&&e.submitter.dataset.submitApplication==='true';
      if(!data.university_id||!data.course_id){status('[data-crud-status="application"]','Choose both a university and course before saving.','error');return;}
      if(submit&&!data.intake){status('[data-crud-status="application"]','Choose an intake before submitting your application.','error');return;}
      setBusy(form,true,submit?'Submitting...':'Saving draft...');status('[data-crud-status="application"]',submit?'Submitting application...':'Saving application draft...','loading');
      try{
        var payload={student_id:s.id,university_id:data.university_id,course_id:data.course_id,intake:nil(data.intake),status:submit?'submitted':'draft',submitted_at:submit?new Date().toISOString():null,application_no:'GEES-'+Date.now().toString(36).toUpperCase()};
        var r=await client.from('applications').insert(payload).select('*').maybeSingle();if(r.error)throw new Error(r.error.message);
        form.reset();await refresh();status('[data-crud-status="application"]',submit?'Application submitted.':'Draft saved.','success');toast(submit?'Application submitted.':'Draft saved.','success');completed('application');
      }catch(err){var message=friendly(err);status('[data-crud-status="application"]',message,'error');toast(message,'error');}
      finally{setBusy(form,false);}
    });
  }

  async function initDocs(){
    var root=$('[data-crud-page="student-documents"]');if(!root)return;await boot();if(!live()){unavailable(root);return;}
    var s=await student(),apps=await applications(s.id),form=$('[data-crud-form="document"]',root);
    $('[name="application_id"]',root).innerHTML='<option value="">No application link</option>'+apps.map(function(a){return '<option value="'+esc(a.id)+'">'+esc(a.application_no||a.id.slice(0,8))+'</option>';}).join('');
    async function refresh(){var list=await documents(s.id);var stat=$('[data-stat="documents"]',root);if(stat)stat.textContent=list.length;$('[data-crud-table="documents"]',root).innerHTML=list.length?list.map(function(d){return '<tr><td><strong>'+esc(d.document_type)+'</strong><span class="gees-table-subtext">'+esc(d.file_name||'No filename')+'</span></td><td><span class="gees-badge">'+esc(title(d.status))+'</span></td><td>'+esc(date(d.created_at))+'</td></tr>';}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No document records yet.</div></td></tr>';}
    await refresh();
    document.addEventListener('gees:document-uploaded',function(){refresh().catch(function(){});},{once:false});
    if(form)form.addEventListener('submit',function(e){
      var file=form.querySelector('input[type="file"][name="document_file"]');
      if(file&&file.files&&file.files[0])return;
      e.preventDefault();status('[data-crud-status="document"]','Choose a PDF, PNG, JPG, or WEBP file to upload.','error');
    });
  }

  async function initDetails(){
    var root=$('[data-crud-page="student-details"]');if(!root)return;await boot();if(!live()){unavailable(root);return;}
    var p=await profile(),s=await student(),profileForm=$('[data-crud-form="profile"]',root),supportForm=$('[data-crud-form="support"]',root);
    ['full_name','phone','email'].forEach(function(k){var el=$('[name="'+k+'"]',root);if(el)el.value=p&&p[k]?p[k]:'';});
    ['preferred_country','preferred_level','preferred_intake','notes'].forEach(function(k){var el=$('[name="'+k+'"]',root);if(el)el.value=s&&s[k]?s[k]:'';});
    if(profileForm)profileForm.addEventListener('submit',async function(e){
      e.preventDefault();if(profileForm.dataset.geesBusy==='true')return;var data=fd(profileForm);if(!data.full_name){status('[data-crud-status="profile"]','Your full name is required.','error');return;}
      setBusy(profileForm,true,'Updating...');status('[data-crud-status="profile"]','Updating profile...','loading');
      try{var pr=await client.from('profiles').update({full_name:data.full_name,phone:nil(data.phone),updated_at:new Date().toISOString()}).eq('id',session.id).select('id').maybeSingle();if(pr.error)throw new Error(pr.error.message);var sr=await client.from('students').update({preferred_country:nil(data.preferred_country),preferred_level:nil(data.preferred_level),preferred_intake:nil(data.preferred_intake),notes:nil(data.notes),updated_at:new Date().toISOString()}).eq('id',s.id).select('id').maybeSingle();if(sr.error)throw new Error(sr.error.message);status('[data-crud-status="profile"]','Profile updated.','success');toast('Profile updated.','success');completed('profile');}catch(err){var message=friendly(err);status('[data-crud-status="profile"]',message,'error');toast(message,'error');}finally{setBusy(profileForm,false);}
    });
    if(supportForm)supportForm.addEventListener('submit',async function(e){
      e.preventDefault();if(supportForm.dataset.geesBusy==='true')return;var data=fd(supportForm);if(!data.subject){status('[data-crud-status="support"]','Add a short subject for your support request.','error');return;}
      setBusy(supportForm,true,'Sending...');status('[data-crud-status="support"]','Creating support ticket...','loading');
      try{var r=await client.from('support_tickets').insert({opened_by:session.id,subject:data.subject,priority:data.priority||'normal',status:'open'}).select('id').maybeSingle();if(r.error)throw new Error(r.error.message);supportForm.reset();status('[data-crud-status="support"]','Support ticket created.','success');toast('Support ticket created.','success');completed('support');}catch(err){var message=friendly(err);status('[data-crud-status="support"]',message,'error');toast(message,'error');}finally{setBusy(supportForm,false);}
    });
  }

  async function start(){try{await initApplication();await initDocs();await initDetails();}catch(err){console.error('[GEES CRUD]',err);status('[data-crud-status]',friendly(err,'This page could not load. Refresh and try again.'),'error');}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
