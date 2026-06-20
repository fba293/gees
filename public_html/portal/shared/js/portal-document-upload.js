(function(){
  'use strict';
  if(window.GEES_DOCUMENT_UPLOAD_V15) return;
  window.GEES_DOCUMENT_UPLOAD_V15 = true;

  var BUCKET = 'gees-student-documents';
  var MAX_BYTES = 10 * 1024 * 1024;
  var ALLOWED_TYPES = ['application/pdf','image/png','image/jpeg','image/webp'];
  function ready(fn){ document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once:true }) : fn(); }
  function $(s,r){ return (r||document).querySelector(s); }
  function clean(v){ return String(v || '').trim(); }
  function toast(msg,type){ if(window.GEESToast) window.GEESToast(msg,type||'info'); else console.log(msg); }
  function status(form,msg,type){ var el = $('[data-crud-status="document"]', form.closest('[data-crud-page]') || document); if(el){ el.textContent = msg || ''; el.dataset.type = type || 'info'; } }
  function sb(){ return window.GEESSupabase || window.GEES_REAL_SUPABASE || null; }
  function friendly(error){
    var raw=String((error&&error.message)||error||'').toLowerCase();
    if(/permission|row-level|not authorized|access denied/.test(raw)) return 'You do not have permission to upload this document.';
    if(/network|fetch|offline|timeout/.test(raw)) return 'Connection issue. Keep this page open and try the upload again.';
    if(/session|jwt|token|login/.test(raw)) return 'Your session has expired. Please sign in again.';
    return 'Upload failed. Please try again.';
  }
  function setBusy(form,busy,label){
    var button=form.querySelector('button[type="submit"],input[type="submit"]');if(!button)return;
    if(!button.dataset.geesLabel)button.dataset.geesLabel=button.tagName==='INPUT'?button.value:button.innerHTML;
    form.dataset.geesUploadBusy=busy?'true':'false';button.disabled=!!busy;button.setAttribute('aria-busy',String(!!busy));
    if(button.tagName==='INPUT')button.value=busy?(label||'Uploading...'):button.dataset.geesLabel;
    else button.innerHTML=busy?'<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> '+(label||'Uploading...'):button.dataset.geesLabel;
  }
  async function session(){ if(window.GEESAuthService && window.GEESAuthService.getPortalSession) return await window.GEESAuthService.getPortalSession(); return window.GEESCurrentPortalSession || null; }
  async function studentId(client, userId){ var r = await client.from('students').select('id').eq('user_id', userId).maybeSingle(); if(r.error) throw new Error(r.error.message); if(r.data && r.data.id) return r.data.id; var ins = await client.from('students').insert({user_id:userId,lead_source:'portal_auto_create'}).select('id').maybeSingle(); if(ins.error) throw new Error(ins.error.message); return ins.data.id; }
  function safeName(name){ return clean(name).replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(0,120) || 'document'; }
  function ensureFileInput(form){ var existing = $('input[type="file"][name="document_file"]', form); if(existing) return existing; var grid = $('.gees-crud-form-grid', form) || form; var label = document.createElement('label'); label.innerHTML = 'Upload File<input name="document_file" type="file" accept="application/pdf,image/png,image/jpeg,image/webp">'; grid.appendChild(label); return $('input[type="file"][name="document_file"]', form); }
  function validate(file){
    if(!file) return 'Choose a PDF, PNG, JPG, or WEBP file.';
    if(ALLOWED_TYPES.indexOf(file.type) === -1) return 'Use a PDF, PNG, JPG, or WEBP file.';
    if(file.size <= 0) return 'The selected file is empty.';
    if(file.size > MAX_BYTES) return 'This file is larger than 10 MB. Choose a smaller file.';
    return '';
  }

  function bind(){
    var form = $('[data-crud-form="document"]');
    if(!form || form.dataset.realUploadBound === 'true') return;
    form.dataset.realUploadBound = 'true';
    var input=ensureFileInput(form);
    input.addEventListener('change',function(){
      var file=input.files&&input.files[0],message=validate(file);
      if(message){status(form,message,'error');return;}
      status(form,file.name+' selected ('+Math.ceil(file.size/1024)+' KB). Ready to upload.','info');
    });
    form.addEventListener('submit', async function(event){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(form.dataset.geesUploadBusy==='true') return;
      var fileInput = $('input[type="file"][name="document_file"]', form);
      var file = fileInput && fileInput.files && fileInput.files[0];
      var validation=validate(file);
      if(validation){status(form,validation,'error');toast(validation,'error');return;}
      var uploadedPath='';
      var client=null;
      setBusy(form,true,'Uploading...');
      try{
        status(form,'Uploading '+file.name+'…','loading');
        client = sb(); if(!client) throw new Error('Supabase client unavailable.');
        var s = await session(); if(!s || !s.id) throw new Error('Portal session unavailable.');
        var sid = await studentId(client, s.id);
        var typeEl = $('[name="document_type"]', form);
        var appEl = $('[name="application_id"]', form);
        uploadedPath = s.id + '/' + Date.now() + '-' + safeName(file.name);
        var up = await client.storage.from(BUCKET).upload(uploadedPath, file, { cacheControl:'3600', upsert:false, contentType:file.type });
        if(up.error) throw new Error(up.error.message);
        var payload = { student_id:sid, application_id: clean(appEl && appEl.value) || null, document_type: clean(typeEl && typeEl.value) || 'Document', file_name:file.name, storage_bucket:BUCKET, storage_path:uploadedPath, mime_type:file.type, size_bytes:file.size, status:'uploaded', uploaded_by:s.id };
        var rec = await client.from('documents').insert(payload).select('id').maybeSingle();
        if(rec.error) throw new Error(rec.error.message);
        form.reset();
        status(form,'Document uploaded and saved.','success');
        toast('Document uploaded successfully.','success');
        if(window.GEESPortalRefreshCounts) window.GEESPortalRefreshCounts();
        try{document.dispatchEvent(new CustomEvent('gees:document-uploaded',{detail:{id:rec.data&&rec.data.id,path:uploadedPath}}));}catch(e){}
      }catch(error){
        if(client && uploadedPath){try{await client.storage.from(BUCKET).remove([uploadedPath]);}catch(cleanupError){}}
        var message=friendly(error);status(form,message,'error');toast(message,'error');
      }finally{setBusy(form,false);}
    }, true);
  }

  ready(bind);
  document.addEventListener('gees:page:ready', bind);
})();
