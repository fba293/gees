
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  function roleFromPage(){ return (document.body && (document.body.dataset.role || document.body.dataset.requiredRole)) || (location.pathname.includes('super')?'super-admin':location.pathname.includes('admin')?'admin':location.pathname.includes('agent')?'agent':location.pathname.includes('staff')?'staff':'student'); }
  function normaliseRole(role){ return (window.GEESDemoAuth&&GEESDemoAuth.normaliseRole)?GEESDemoAuth.normaliseRole(role):String(role||'').toLowerCase().replace(/\s+/g,'-'); }
  ready(function(){
    const forms=document.querySelectorAll('form[data-gees-auth], form.auth-form, form#loginForm, form#geesLoginForm');
    forms.forEach(form=>{
      form.addEventListener('submit',function(e){
        e.preventDefault();
        const btn=form.querySelector('button[type="submit"], .auth-submit'); const original=btn?btn.innerHTML:''; if(btn){btn.disabled=true;btn.innerHTML='Signing in...';}
        try{
          const id=(form.querySelector('input[type="email"], input[name="email"], input[name="username"], #email, #loginEmail')||{}).value || '';
          const pw=(form.querySelector('input[type="password"], input[name="password"], #password, #loginPassword')||{}).value || '';
          const role=normaliseRole(form.dataset.role || roleFromPage());
          if(!window.GEESDemoAuth) throw new Error('Demo auth file is missing.');
          const session=GEESDemoAuth.login(id.trim().toLowerCase(),pw,role);
          location.href=session.dashboard;
        }catch(err){
          alert(err.message || 'Login failed.');
          if(btn){btn.disabled=false;btn.innerHTML=original||'Sign in';}
        }
      });
    });
  });
})();
