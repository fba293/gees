(function(){
  'use strict';
  if(window.GEES_WORKFLOW_V15) return;
  window.GEES_WORKFLOW_V15 = true;

  var STATUSES=['submitted','under_review','documents_required','offer_received','visa_processing','approved','rejected','withdrawn'];
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();}
  function sb(){return window.GEESSupabase||window.GEES_REAL_SUPABASE||null;}
  function toast(msg,type){if(window.GEESToast)window.GEESToast(msg,type||'info');else console.log(msg);}
  function statusLabel(value){return String(value||'').replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});}
  function options(current){return STATUSES.map(function(s){return '<option value="'+s+'" '+(s===current?'selected':'')+'>'+statusLabel(s)+'</option>';}).join('');}
  function friendly(error){var raw=String((error&&error.message)||error||'').toLowerCase();if(/permission|not authorized|access denied|row-level/.test(raw))return 'You do not have permission to update this application.';if(/session|token|login/.test(raw))return 'Your session has expired. Please sign in again.';if(/network|fetch|offline|timeout/.test(raw))return 'Connection issue. Please try again.';return 'We could not update this application status. Please try again.';}
  function completed(){try{document.dispatchEvent(new CustomEvent('gees:crud-complete',{detail:{kind:'application-status'}}));}catch(e){}if(window.GEESPortalRefreshCounts)window.GEESPortalRefreshCounts();}

  function enhanceTable(){
    document.querySelectorAll('[data-application-id]:not([data-workflow-bound])').forEach(function(row){
      row.dataset.workflowBound='true';
      var id=row.getAttribute('data-application-id'),current=row.getAttribute('data-application-status')||'submitted',cell=row.querySelector('[data-workflow-cell]')||row.lastElementChild;
      if(!cell||!id)return;
      cell.innerHTML='<div class="gees-workflow-inline"><select data-workflow-status aria-label="Application status">'+options(current)+'</select><input data-workflow-note maxlength="500" placeholder="Optional note" aria-label="Status note"><button class="gees-btn gees-btn-primary" type="button" data-workflow-save>Update</button></div>';
      var btn=row.querySelector('[data-workflow-save]');
      btn.addEventListener('click',async function(event){
        event.preventDefault();if(btn.dataset.geesBusy==='true')return;
        var client=sb();if(!client){toast('Supabase is still loading. Refresh and try again.','error');return;}
        var next=row.querySelector('[data-workflow-status]').value,note=row.querySelector('[data-workflow-note]').value.trim();
        if(STATUSES.indexOf(next)===-1){toast('Choose a valid application status.','error');return;}
        if(next===current&&!note){toast('Choose a new status or add a note before updating.','info');return;}
        btn.dataset.geesBusy='true';btn.disabled=true;btn.setAttribute('aria-busy','true');btn.innerHTML='<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Updating…';
        try{
          var res=await client.rpc('update_gees_application_status',{p_application_id:id,p_status:next,p_note:note||null});
          if(res.error)throw new Error(res.error.message);
          row.setAttribute('data-application-status',next);current=next;toast('Application status updated.','success');completed();
        }catch(error){toast(friendly(error),'error');}
        finally{btn.dataset.geesBusy='false';btn.disabled=false;btn.setAttribute('aria-busy','false');btn.textContent='Update';}
      });
    });
  }
  ready(enhanceTable);document.addEventListener('gees:page:ready',enhanceTable);document.addEventListener('gees:portal-session-ready',enhanceTable);window.GEESWorkflowEnhance=enhanceTable;
})();
