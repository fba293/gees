(function(){
  'use strict';
  if(window.GEES_DOCUMENT_UPLOAD_V14) return;
  window.GEES_DOCUMENT_UPLOAD_V14 = true;

  var BUCKET = 'gees-student-documents';
  function ready(fn){ document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once:true }) : fn(); }
  function $(s,r){ return (r||document).querySelector(s); }
  function clean(v){ return String(v || '').trim(); }
  function toast(msg,type){ if(window.GEESToast) window.GEESToast(msg,type||'info'); else console.log(msg); }
  function status(form,msg,type){ var el = $('[data-crud-status="document"]', form.closest('[data-crud-page]') || document); if(el){ el.textContent = msg || ''; el.dataset.type = type || 'info'; } }
  function sb(){ return window.GEESSupabase || window.GEES_REAL_SUPABASE || null; }
  async function session(){ if(window.GEESAuthService && window.GEESAuthService.getPortalSession) return await window.GEESAuthService.getPortalSession(); return window.GEESCurrentPortalSession || null; }
  async function studentId(client, userId){ var r = await client.from('students').select('id').eq('user_id', userId).maybeSingle(); if(r.error) throw new Error(r.error.message); if(r.data && r.data.id) return r.data.id; var ins = await client.from('students').insert({user_id:userId,lead_source:'portal_auto_create'}).select('id').maybeSingle(); if(ins.error) throw new Error(ins.error.message); return ins.data.id; }
  function safeName(name){ return clean(name).replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(0,120) || 'document'; }
  function ensureFileInput(form){ var existing = $('input[type="file"][name="document_file"]', form); if(existing) return existing; var grid = $('.gees-crud-form-grid', form) || form; var label = document.createElement('label'); label.innerHTML = 'Upload File<input name="document_file" type="file" accept="application/pdf,image/png,image/jpeg,image/webp">'; grid.appendChild(label); return $('input[type="file"][name="document_file"]', form); }

  function bind(){
    var form = $('[data-crud-form="document"]');
    if(!form || form.dataset.realUploadBound === 'true') return;
    form.dataset.realUploadBound = 'true';
    ensureFileInput(form);
    form.addEventListener('submit', async function(event){
      var fileInput = $('input[type="file"][name="document_file"]', form);
      var file = fileInput && fileInput.files && fileInput.files[0];
      if(!file) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      try{
        status(form,'Uploading document...','loading');
        var client = sb(); if(!client) throw new Error('Supabase client is not loaded.');
        var s = await session(); if(!s || !s.id) throw new Error('Please login with a real GEES student account.');
        var sid = await studentId(client, s.id);
        var typeEl = $('[name="document_type"]', form);
        var appEl = $('[name="application_id"]', form);
        var path = s.id + '/' + Date.now() + '-' + safeName(file.name);
        var up = await client.storage.from(BUCKET).upload(path, file, { cacheControl:'3600', upsert:false, contentType:file.type || undefined });
        if(up.error) throw new Error(up.error.message);
        var payload = { student_id:sid, application_id: clean(appEl && appEl.value) || null, document_type: clean(typeEl && typeEl.value) || 'Document', file_name:file.name, storage_bucket:BUCKET, storage_path:path, mime_type:file.type || null, size_bytes:file.size || null, status:'uploaded', uploaded_by:s.id };
        var rec = await client.from('documents').insert(payload).select('id').maybeSingle();
        if(rec.error) throw new Error(rec.error.message);
        form.reset();
        status(form,'Document uploaded and saved.','success');
        toast('Document uploaded successfully.','success');
        if(window.GEESPortalRefreshCounts) window.GEESPortalRefreshCounts();
      }catch(error){
        status(form,error.message || 'Upload failed.','error');
        toast(error.message || 'Upload failed.','error');
      }
    }, true);
  }

  ready(bind);
  document.addEventListener('gees:page:ready', bind);
})();
