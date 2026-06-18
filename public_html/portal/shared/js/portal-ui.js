
(function(){
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn()}
  function toast(msg){let root=document.getElementById('gees-toast-root');if(!root){root=document.createElement('div');root.id='gees-toast-root';root.className='gees-toast-root';document.body.appendChild(root)}const t=document.createElement('div');t.className='gees-toast';t.textContent=msg;root.appendChild(t);setTimeout(()=>t.remove(),2600)}
  ready(()=>{
    document.querySelectorAll('[data-demo-action]').forEach(el=>el.addEventListener('click',ev=>{ev.preventDefault();const name=el.getAttribute('data-demo-action')||'Demo action';if(window.GEESDemoBackend){window.GEESDemoBackend.notify(name,'Action completed in demo mode.');window.GEESDemoBackend.audit('demo-action',name)}toast(name+' completed in demo mode.')}));
    document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',ev=>{ev.preventDefault();toast('Form saved in demo mode.')}));
    window.GEESToast=toast;
  });
})();
