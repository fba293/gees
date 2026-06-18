(function(){
  'use strict';
  function $(s,r){return (r||document).querySelector(s)}
  function setStatus(form,msg,type){var box=$('[data-auth-status]',form)||$('#gees-auth-status');if(!box)return;box.hidden=false;box.className='gees-status '+(type?'is-'+type:'');box.textContent=msg;}
  function data(form){var out={};Array.from(form.elements).forEach(function(el){if(el.name)out[el.name]=el.value;});return out;}
  document.addEventListener('submit',async function(e){
    var form=e.target;
    if(!form.matches('[data-login-role],[data-signup-role]')) return;
    e.preventDefault();
    var btn=form.querySelector('button[type="submit"]');
    if(btn) btn.disabled=true;
    try{
      var values=data(form);
      if(form.dataset.loginRole){
        setStatus(form,'Checking your account...','warn');
        var login=await window.GEESAuthService.signIn(form.dataset.loginRole,values.email,values.password);
        setStatus(form,login.message||'Login successful.','success');
        setTimeout(function(){location.href=login.redirectTo;},450);
      }else{
        setStatus(form,'Creating your account...','warn');
        var signup=await window.GEESAuthService.signUp(form.dataset.signupRole,values);
        setStatus(form,signup.message,'success');
        form.reset();
      }
    }catch(err){setStatus(form,window.GEESAuthService.normalizeError(err),'error');}
    finally{if(btn)btn.disabled=false;}
  });
})();
