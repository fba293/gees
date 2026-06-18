(function(){
  'use strict';

  var client = null;
  var session = null;
  function $(s,r){return (r||document).querySelector(s)}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
  function title(v){return String(v||'').replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})}
  function status(el,msg,type){el=typeof el==='string'?$(el):el;if(!el)return;el.textContent=msg||'';el.dataset.type=type||'info'}
  function toast(msg,type){if(window.GEESPortalUI&&window.GEESPortalUI.toast)window.GEESPortalUI.toast(msg,type||'success');else console.log(msg)}
  function fd(form){var o={};new FormData(form).forEach(function(v,k){o[k]=String(v||'').trim()});return o}
  function nil(v){return v?v:null}
  function live(){return session&&session.source==='supabase'}
  async function boot(){
    client=client||(window.GEESWaitForSupabaseClient?await window.GEESWaitForSupabaseClient():window.GEESSupabase);
    session=session||(window.GEESAuthService&&window.GEESAuthService.getPortalSession?await window.GEESAuthService.getPortalSession():window.GEESCurrentPortalSession);
    if(!client)throw new Error('Supabase client unavailable. Upload latest shared JS and hard refresh.');
    if(!session)throw new Error('Portal session unavailable. Login again.');
  }
  async function one(q){var r=await q.maybeSingle();if(r.error)throw new Error(r.error.message);return r.data}
  async function rows(q){var r=await q;if(r.error)throw new Error(r.error.message);return r.data||[]}
  async function profile(){await boot();return live()?one(client.from('profiles').select('*').eq('id',session.id)):null}
  async function student(){
    await boot();if(!live())return null;
    var s=await one(client.from('students').select('*').eq('user_id',session.id));
    if(s)return s;
    var r=await client.from('students').insert({user_id:session.id,lead_source:'portal_auto_create'}).select('*').maybeSingle();
    if(r.error)throw new Error(r.error.message);return r.data;
  }
  async function catalogue(){
    return {universities:await rows(client.from('universities').select('id,name,country,city').order('name',{ascending:true})),courses:await rows(client.from('courses').select('id,title,level,university_id').order('title',{ascending:true}))};
  }
  function opts(list,label){return '<option value="">'+esc(label||'Select')+'</option>'+(list||[]).map(function(x){return '<option value="'+esc(x.id)+'">'+esc(x.name||x.title||x.id)+'</option>'}).join('')}
  async function applications(studentId){return rows(client.from('applications').select('id,application_no,status,intake,created_at').eq('student_id',studentId).order('created_at',{ascending:false}))}
  async function documents(studentId){return rows(client.from('documents').select('id,document_type,file_name,status,created_at,application_id').eq('student_id',studentId).order('created_at',{ascending:false}))}
  function date(v){try{return v?new Date(v).toLocaleString():'—'}catch(e){return v||'—'}}
  function demo(root){root.innerHTML='<div class="gees-live-only-note">Demo accounts keep this page in safe UI mode. Login with a real Supabase account to create and update live records.</div>'}

  async function initApplication(){
    var root=$('[data-crud-page="student-application"]');if(!root)return;await boot();if(!live()){demo(root);return}
    var s=await student();var cat=await catalogue();$('[name="university_id"]',root).innerHTML=opts(cat.universities,'Select university');$('[name="course_id"]',root).innerHTML=opts(cat.courses,'Select course');
    async function refresh(){var list=await applications(s.id);$('[data-stat="applications"]',root).textContent=list.length;$('[data-crud-table="applications"]',root).innerHTML=list.length?list.map(function(a){return '<tr><td><strong>'+esc(a.application_no||a.id.slice(0,8))+'</strong><span class="gees-table-subtext">'+esc(date(a.created_at))+'</span></td><td><span class="gees-badge">'+esc(title(a.status))+'</span></td><td>'+esc(a.intake||'—')+'</td></tr>'}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No live applications yet.</div></td></tr>'}
    await refresh();
    $('[data-crud-form="application"]',root).addEventListener('submit',async function(e){e.preventDefault();var data=fd(e.currentTarget);var submit=e.submitter&&e.submitter.dataset.submitApplication==='true';status('[data-crud-status="application"]','Saving application...','loading');try{var payload={student_id:s.id,university_id:nil(data.university_id),course_id:nil(data.course_id),intake:nil(data.intake),status:submit?'submitted':'draft',submitted_at:submit?new Date().toISOString():null,application_no:'GEES-'+Date.now().toString(36).toUpperCase()};var r=await client.from('applications').insert(payload).select('*').maybeSingle();if(r.error)throw new Error(r.error.message);e.currentTarget.reset();await refresh();status('[data-crud-status="application"]',submit?'Application submitted.':'Draft saved.','success');toast(submit?'Application submitted.':'Draft saved.')}catch(err){status('[data-crud-status="application"]',err.message,'error');toast(err.message,'error')}})
  }

  async function initDocs(){
    var root=$('[data-crud-page="student-documents"]');if(!root)return;await boot();if(!live()){demo(root);return}
    var s=await student();var apps=await applications(s.id);$('[name="application_id"]',root).innerHTML='<option value="">No application link</option>'+apps.map(function(a){return '<option value="'+esc(a.id)+'">'+esc(a.application_no||a.id.slice(0,8))+'</option>'}).join('');
    async function refresh(){var list=await documents(s.id);$('[data-stat="documents"]',root).textContent=list.length;$('[data-crud-table="documents"]',root).innerHTML=list.length?list.map(function(d){return '<tr><td><strong>'+esc(d.document_type)+'</strong><span class="gees-table-subtext">'+esc(d.file_name||'No filename')+'</span></td><td><span class="gees-badge">'+esc(title(d.status))+'</span></td><td>'+esc(date(d.created_at))+'</td></tr>'}).join(''):'<tr><td colspan="3"><div class="gees-record-empty">No document records yet.</div></td></tr>'}
    await refresh();
    $('[data-crud-form="document"]',root).addEventListener('submit',async function(e){e.preventDefault();var data=fd(e.currentTarget);status('[data-crud-status="document"]','Saving document record...','loading');try{var r=await client.from('documents').insert({student_id:s.id,application_id:nil(data.application_id),document_type:data.document_type||'General Document',file_name:nil(data.file_name),status:'uploaded',uploaded_by:session.id}).select('*').maybeSingle();if(r.error)throw new Error(r.error.message);e.currentTarget.reset();await refresh();status('[data-crud-status="document"]','Document record saved.','success');toast('Document record saved.')}catch(err){status('[data-crud-status="document"]',err.message,'error');toast(err.message,'error')}})
  }

  async function initDetails(){
    var root=$('[data-crud-page="student-details"]');if(!root)return;await boot();if(!live()){demo(root);return}
    var p=await profile();var s=await student();['full_name','phone','email'].forEach(function(k){var el=$('[name="'+k+'"]',root);if(el)el.value=p&&p[k]?p[k]:''});['preferred_country','preferred_level','preferred_intake','notes'].forEach(function(k){var el=$('[name="'+k+'"]',root);if(el)el.value=s&&s[k]?s[k]:''});
    $('[data-crud-form="profile"]',root).addEventListener('submit',async function(e){e.preventDefault();var data=fd(e.currentTarget);status('[data-crud-status="profile"]','Updating profile...','loading');try{var pr=await client.from('profiles').update({full_name:nil(data.full_name),phone:nil(data.phone),updated_at:new Date().toISOString()}).eq('id',session.id).select('id').maybeSingle();if(pr.error)throw new Error(pr.error.message);var sr=await client.from('students').update({preferred_country:nil(data.preferred_country),preferred_level:nil(data.preferred_level),preferred_intake:nil(data.preferred_intake),notes:nil(data.notes),updated_at:new Date().toISOString()}).eq('id',s.id).select('id').maybeSingle();if(sr.error)throw new Error(sr.error.message);status('[data-crud-status="profile"]','Profile updated.','success');toast('Profile updated.')}catch(err){status('[data-crud-status="profile"]',err.message,'error');toast(err.message,'error')}});
    $('[data-crud-form="support"]',root).addEventListener('submit',async function(e){e.preventDefault();var data=fd(e.currentTarget);status('[data-crud-status="support"]','Creating support ticket...','loading');try{var r=await client.from('support_tickets').insert({opened_by:session.id,subject:data.subject||'GEES support request',priority:data.priority||'normal',status:'open'}).select('id').maybeSingle();if(r.error)throw new Error(r.error.message);e.currentTarget.reset();status('[data-crud-status="support"]','Support ticket created.','success');toast('Support ticket created.')}catch(err){status('[data-crud-status="support"]',err.message,'error');toast(err.message,'error')}});
  }

  async function start(){try{await initApplication();await initDocs();await initDetails()}catch(err){console.error('[GEES CRUD]',err);status('[data-crud-status]',err.message||'Real CRUD failed.','error')}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
