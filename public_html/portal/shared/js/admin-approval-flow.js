(function(){
  'use strict';
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function diag(msg,type){var el=document.getElementById('gees-approval-diagnostics');if(!el)return;el.hidden=false;el.className='gees-status '+(type?'is-'+type:'');el.textContent=msg;}
  function listEl(){return document.getElementById('gees-approval-list');}
  function card(item){
    var role=esc(item.role), name=esc(item.full_name||item.email), email=esc(item.email);
    var meta=role==='agent'?(esc(item.agency_name||'Agency not added')+' · '+esc(item.agent_country||'Country not added')):(esc(item.staff_department||'Department not added')+' · '+esc(item.staff_title||'Title not added'));
    return '<article class="gees-approval-card" data-profile-id="'+esc(item.profile_id)+'"><strong>'+name+'</strong><div class="gees-muted">'+email+'</div><span class="gees-chip">'+role+'</span><span class="gees-chip">'+esc(item.status)+'</span><p class="gees-muted">'+meta+'</p><div class="gees-actions"><button class="gees-btn" data-approve="'+esc(item.profile_id)+'">Approve</button><button class="gees-btn danger" data-reject="'+esc(item.profile_id)+'">Reject</button></div></article>';
  }
  async function load(){
    var root=listEl(); if(!root) return;
    root.innerHTML='<div class="gees-status is-warn">Loading approval diagnostics...</div>';
    try{
      var session=await window.GEESAuthService.getPortalSession();
      if(!session){root.innerHTML='';diag('Login required. Use a real Supabase admin/super_admin account, not demo admin.','warn');return;}
      if(session.isDemo){root.innerHTML='';diag('Demo admin is only for UI preview. Real pending agent/staff approvals are visible only after first-admin bootstrap and real Supabase admin login.','warn');return;}
      if(!(session.role==='admin'||session.role==='super_admin')){root.innerHTML='';diag('This page requires admin or super_admin role. Current role: '+session.role,'error');return;}
      diag('Connected as real '+session.role+'. Reading pending Supabase approvals...','success');
      var rows=await window.GEESAuthService.getPendingApprovals();
      if(!rows.length){root.innerHTML='<div class="gees-status is-warn">No pending approvals found. If an agent just signed up, check Supabase Table Editor → profiles and approvals, then refresh.</div>';return;}
      root.innerHTML=rows.map(card).join('');
    }catch(err){root.innerHTML='';diag(window.GEESAuthService.normalizeError(err),'error');}
  }
  document.addEventListener('click',async function(e){
    var approve=e.target.closest('[data-approve]'); var reject=e.target.closest('[data-reject]');
    if(!approve&&!reject) return;
    var id=(approve&&approve.dataset.approve)||(reject&&reject.dataset.reject);
    var note=approve?'Approved from GEES admin portal':'Rejected from GEES admin portal';
    e.target.disabled=true;
    try{ if(approve) await window.GEESAuthService.approveUser(id,note); else await window.GEESAuthService.rejectUser(id,note); diag('Action completed. Refreshing approvals...','success'); await load(); }
    catch(err){diag(window.GEESAuthService.normalizeError(err),'error');}
    finally{e.target.disabled=false;}
  });
  document.addEventListener('DOMContentLoaded',load);
})();
