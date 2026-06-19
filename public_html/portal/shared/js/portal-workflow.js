(function(){
  'use strict';
  if(window.GEES_WORKFLOW_V14) return;
  window.GEES_WORKFLOW_V14 = true;

  var STATUSES = ['submitted','under_review','documents_required','offer_received','visa_processing','approved','rejected','withdrawn'];
  function ready(fn){ document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once:true }) : fn(); }
  function sb(){ return window.GEESSupabase || window.GEES_REAL_SUPABASE || null; }
  function toast(msg,type){ if(window.GEESToast) window.GEESToast(msg,type||'info'); else console.log(msg); }
  function statusLabel(value){ return String(value || '').replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}); }
  function options(current){ return STATUSES.map(function(s){ return '<option value="'+s+'" '+(s===current?'selected':'')+'>'+statusLabel(s)+'</option>'; }).join(''); }

  function enhanceTable(){
    document.querySelectorAll('[data-application-id]:not([data-workflow-bound])').forEach(function(row){
      row.dataset.workflowBound = 'true';
      var id = row.getAttribute('data-application-id');
      var current = row.getAttribute('data-application-status') || 'submitted';
      var cell = row.querySelector('[data-workflow-cell]') || row.lastElementChild;
      if(!cell || !id) return;
      cell.innerHTML = '<div class="gees-workflow-inline"><select data-workflow-status>'+options(current)+'</select><input data-workflow-note placeholder="Optional note"><button class="gees-btn gees-btn-primary" data-workflow-save>Update</button></div>';
      var btn = row.querySelector('[data-workflow-save]');
      btn.addEventListener('click', async function(event){
        event.preventDefault();
        var client = sb();
        if(!client){ toast('Supabase client is not loaded.','error'); return; }
        var next = row.querySelector('[data-workflow-status]').value;
        var note = row.querySelector('[data-workflow-note]').value || null;
        btn.disabled = true;
        btn.textContent = 'Updating...';
        try{
          var res = await client.rpc('update_gees_application_status', { p_application_id:id, p_status:next, p_note:note });
          if(res.error) throw new Error(res.error.message);
          row.setAttribute('data-application-status', next);
          toast('Application status updated.','success');
          if(window.GEESPortalRefreshCounts) window.GEESPortalRefreshCounts();
        }catch(error){
          toast(error.message || 'Workflow update failed.','error');
        }finally{
          btn.disabled = false;
          btn.textContent = 'Update';
        }
      });
    });
  }

  ready(enhanceTable);
  document.addEventListener('gees:page:ready', enhanceTable);
  document.addEventListener('gees:portal-session-ready', enhanceTable);
  window.GEESWorkflowEnhance = enhanceTable;
})();
