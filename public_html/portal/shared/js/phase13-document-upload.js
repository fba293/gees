(function(){
'use strict';
var core = window.GEESPhaseCore;
async function start(){
  var root = core.$('[data-phase-page="document-upload"]'); if(!root) return;
  try{
    var ctx = await core.boot(['student','admin','super_admin']);
    var student = await core.one(ctx.client.from('students').select('id,user_id').eq('user_id',ctx.session.id));
    async function refresh(){
      var docs = await core.rows(ctx.client.from('documents').select('id,document_type,file_name,status,storage_path,created_at').eq('student_id',student.id).order('created_at',{ascending:false}));
      core.$('[data-doc-table]',root).innerHTML = docs.length ? docs.map(function(d){
        return '<tr><td><strong>'+core.esc(d.document_type)+'</strong><span class="gees-table-subtext">'+core.esc(d.file_name||'—')+'</span></td><td><span class="gees-badge">'+core.esc(core.nice(d.status))+'</span></td><td>'+core.esc(d.created_at||'—')+'</td></tr>';
      }).join('') : core.renderEmpty(3,'No documents yet.');
    }
    await refresh();
    core.$('[data-form="document-upload"]',root).addEventListener('submit',async function(ev){
      ev.preventDefault();
      var file = core.$('[name="file"]',ev.currentTarget).files[0];
      var data = core.formData(ev.currentTarget);
      if(!file) throw new Error('Choose a file first.');
      core.set('[data-status="document-upload"]','Uploading...','loading');
      var path = ctx.session.id + '/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g,'-');
      var up = await ctx.client.storage.from('student-documents').upload(path,file,{upsert:false});
      if(up.error) throw new Error(up.error.message);
      var row = await ctx.client.from('documents').insert({student_id:student.id,document_type:data.document_type,file_name:file.name,storage_path:path,status:'uploaded',uploaded_by:ctx.session.id}).select('id').maybeSingle();
      if(row.error) throw new Error(row.error.message);
      ev.currentTarget.reset();
      await refresh();
      core.set('[data-status="document-upload"]','Document uploaded.','success');
      core.toast('Document uploaded.');
    });
  }catch(err){ core.attachError(root,err); }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
