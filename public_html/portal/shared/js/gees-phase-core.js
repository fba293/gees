window.GEESPhaseCore = (function(){
  'use strict';
  function $(s,r){return (r||document).querySelector(s)}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
  function nice(v){return String(v||'').replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})}
  function set(s,m,t){var el=typeof s==='string'?$(s):s;if(el){el.textContent=m||'';el.dataset.type=t||'info'}}
  function toast(msg,type){if(window.GEESPortalUI&&window.GEESPortalUI.toast)window.GEESPortalUI.toast(msg,type||'success')}
  function formData(form){var o={};new FormData(form).forEach(function(v,k){o[k]=String(v||'').trim()});return o}
  function nil(v){return v?v:null}
  async function boot(roles){
    var client = window.GEESSupabase;
    if(window.GEESWaitForSupabaseClient) client = await window.GEESWaitForSupabaseClient();
    var session = window.GEESCurrentPortalSession;
    if(window.GEESAuthService && window.GEESAuthService.getPortalSession) session = await window.GEESAuthService.getPortalSession();
    if(!client) throw new Error('Supabase client unavailable.');
    if(!session || session.source !== 'supabase') throw new Error('Real Supabase login required.');
    if(roles && roles.length && roles.indexOf(session.role) === -1) throw new Error('You do not have access to this page.');
    return { client:client, session:session };
  }
  async function rows(req){var r=await req;if(r.error)throw new Error(r.error.message);return r.data||[]}
  async function one(req){var r=await req.maybeSingle();if(r.error)throw new Error(r.error.message);return r.data}
  function renderEmpty(cols,msg){return '<tr><td colspan="'+cols+'"><div class="gees-record-empty">'+esc(msg||'No records found.')+'</div></td></tr>'}
  function attachError(root,err){if(root)root.innerHTML='<div class="gees-live-only-note">'+esc(err.message||err)+'</div>'}
  return { $:$, esc:esc, nice:nice, set:set, toast:toast, formData:formData, nil:nil, boot:boot, rows:rows, one:one, renderEmpty:renderEmpty, attachError:attachError };
})();
