(function(){
  'use strict';
  if(window.GEES_COMMISSIONS_V15) return;
  window.GEES_COMMISSIONS_V15 = true;
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();}
  function sb(){return window.GEESSupabase||window.GEES_REAL_SUPABASE||null;}
  function money(amount,currency){return (currency||'MYR')+' '+Number(amount||0).toLocaleString();}
  function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function toast(msg,type){if(window.GEESToast)window.GEESToast(msg,type||'info');else console.log(msg);}
  function friendly(error){var raw=String((error&&error.message)||error||'').toLowerCase();if(/permission|not authorized|access denied|row-level/.test(raw))return 'You do not have permission for this commission action.';if(/session|token|login/.test(raw))return 'Your session has expired. Please sign in again.';if(/network|fetch|offline|timeout/.test(raw))return 'Connection issue. Please try again.';return 'We could not load commission data. Please try again.';}
  async function session(){return window.GEESAuthService&&window.GEESAuthService.getPortalSession?await window.GEESAuthService.getPortalSession():window.GEESCurrentPortalSession||null;}
  async function agentId(client,userId){var r=await client.from('agents').select('id').eq('user_id',userId).maybeSingle();if(r.error)throw new Error(r.error.message);return r.data&&r.data.id;}
  function stat(icon,value,label){return '<article class="gees-stat-card"><div class="gees-stat-icon"><i class="fa-solid '+icon+'" aria-hidden="true"></i></div><div><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div></article>';}
  function total(rows,matcher){var filtered=rows.filter(function(x){return matcher.test(String(x.status||''));});var currencies=Array.from(new Set(filtered.map(function(x){return x.currency||'MYR';})));if(!filtered.length)return 'MYR 0';if(currencies.length!==1)return 'Multiple currencies';return money(filtered.reduce(function(sum,x){return sum+Number(x.amount||0);},0),currencies[0]);}
  function nextPayout(rows){var dates=rows.filter(function(x){return /pending|approved|processing/i.test(String(x.status||''))&&x.due_at;}).map(function(x){return x.due_at;}).sort();return dates.length?dates[0]:'—';}
  function setTable(body,rows,message){if(!body)return;body.innerHTML=rows.length?rows.map(function(x){return '<tr><td>'+esc(String(x.id||'').slice(0,8).toUpperCase())+'</td><td><span class="gees-badge">'+esc(money(x.amount,x.currency))+'</span></td><td>'+esc(String(x.status||'pending').replace(/_/g,' '))+'</td><td>'+esc(x.paid_at||x.due_at||'—')+'</td></tr>';}).join(''):'<tr><td colspan="4"><div class="gees-record-empty">'+esc(message||'No commission records yet.')+'</div></td></tr>';}
  async function loadAgent(){
    var root=document.querySelector('[data-commissions-page]');if(!root)return;
    var body=document.querySelector('[data-commission-table]'),grid=document.querySelector('.gees-stats-grid');
    try{
      var client=sb(),s=await session();if(!client||!s)throw new Error('Portal session unavailable.');
      if(String(s.role||'').toLowerCase()!=='agent'){setTable(body,[],'Commission records are available in the Agent Portal only.');return;}
      var aid=await agentId(client,s.id);
      if(!aid){setTable(body,[],'Your agent profile is not ready yet. Please contact GEES support.');if(grid)grid.innerHTML=[stat('fa-clock','MYR 0','Pending'),stat('fa-circle-check','MYR 0','Paid'),stat('fa-list','0','Commission Records'),stat('fa-calendar','—','Next Payout')].join('');return;}
      var r=await client.from('commissions').select('id,amount,currency,status,due_at,paid_at,payout_reference,created_at').eq('agent_id',aid).order('created_at',{ascending:false});if(r.error)throw new Error(r.error.message);
      var rows=r.data||[];
      if(grid)grid.innerHTML=[stat('fa-clock',total(rows,/pending|approved|processing/i),'Pending'),stat('fa-circle-check',total(rows,/paid/i),'Paid'),stat('fa-list',rows.length,'Commission Records'),stat('fa-calendar',nextPayout(rows),'Next Payout')].join('');
      setTable(body,rows);
    }catch(error){setTable(body,[],'We could not load commission records. Refresh and try again.');toast(friendly(error),'error');}
  }
  async function markPaid(id,reference){var client=sb();if(!client)throw new Error('Supabase unavailable.');var r=await client.rpc('mark_gees_commission_paid',{p_commission_id:id,p_payout_reference:reference||null});if(r.error)throw new Error(r.error.message);toast('Commission marked paid.','success');try{document.dispatchEvent(new CustomEvent('gees:crud-complete',{detail:{kind:'commission'}}));}catch(e){}await loadAgent();}
  ready(loadAgent);document.addEventListener('gees:portal-session-ready',loadAgent);window.GEESCommissions={refresh:loadAgent,markPaid:markPaid};
})();
