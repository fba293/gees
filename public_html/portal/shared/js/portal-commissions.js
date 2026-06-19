(function(){
  'use strict';
  if(window.GEES_COMMISSIONS_V14) return;
  window.GEES_COMMISSIONS_V14 = true;
  function ready(fn){ document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once:true }) : fn(); }
  function sb(){ return window.GEESSupabase || window.GEES_REAL_SUPABASE || null; }
  function money(amount,currency){ return (currency || 'MYR') + ' ' + Number(amount || 0).toLocaleString(); }
  function esc(v){ return String(v || '').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];}); }
  function toast(msg,type){ if(window.GEESToast) window.GEESToast(msg,type||'info'); else console.log(msg); }
  async function session(){ if(window.GEESAuthService && window.GEESAuthService.getPortalSession) return await window.GEESAuthService.getPortalSession(); return window.GEESCurrentPortalSession || null; }
  async function agentId(client, userId){ var r = await client.from('agents').select('id').eq('user_id', userId).maybeSingle(); if(r.error) return null; return r.data && r.data.id; }
  function stat(icon,value,label){ return '<article class="gees-stat-card"><div class="gees-stat-icon"><i class="fa-solid '+icon+'"></i></div><div><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div></article>'; }
  async function loadAgent(){
    var root = document.querySelector('[data-commissions-page]');
    if(!root) return;
    var client = sb(); var s = await session();
    if(!client || !s){ return; }
    var aid = await agentId(client, s.id);
    var query = client.from('commissions').select('id,amount,currency,status,due_at,paid_at,payout_reference,created_at').order('created_at',{ascending:false});
    if(aid) query = query.eq('agent_id', aid);
    var r = await query;
    var rows = r && !r.error ? (r.data || []) : [];
    var pending = rows.filter(x=>/pending|approved|processing/i.test(x.status||'')).reduce((sum,x)=>sum+Number(x.amount||0),0);
    var paid = rows.filter(x=>/paid/i.test(x.status||'')).reduce((sum,x)=>sum+Number(x.amount||0),0);
    var grid = document.querySelector('.gees-stats-grid');
    if(grid) grid.innerHTML = [stat('fa-clock',money(pending,'MYR'),'Pending'),stat('fa-circle-check',money(paid,'MYR'),'Paid'),stat('fa-list',rows.length,'Commission Records'),stat('fa-calendar','—','Next Payout')].join('');
    var body = document.querySelector('[data-commission-table]');
    if(body) body.innerHTML = rows.length ? rows.map(function(x){return '<tr><td>'+esc(x.id.slice(0,8).toUpperCase())+'</td><td><span class="gees-badge">'+esc(money(x.amount,x.currency))+'</span></td><td>'+esc(x.status||'pending')+'</td><td>'+esc(x.paid_at||x.due_at||'—')+'</td></tr>';}).join('') : '<tr><td colspan="4">No commission records yet.</td></tr>';
  }
  async function markPaid(id, reference){
    var client = sb(); if(!client) throw new Error('Supabase client unavailable.');
    var r = await client.rpc('mark_gees_commission_paid', { p_commission_id:id, p_payout_reference:reference || null });
    if(r.error) throw new Error(r.error.message);
    toast('Commission marked paid.','success');
    await loadAgent();
  }
  ready(loadAgent);
  document.addEventListener('gees:portal-session-ready', loadAgent);
  window.GEESCommissions = { refresh:loadAgent, markPaid:markPaid };
})();
