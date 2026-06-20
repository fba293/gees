(function(){
  'use strict';
  if(window.GEES_AUTH_PAGE_V15) return;
  window.GEES_AUTH_PAGE_V15 = true;

  var flashKey='gees_portal_flash_message';
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
  function setStatus(form,message,type){var box=form.querySelector('[data-auth-error],[data-auth-status]');if(!box)return;box.textContent=message||'';box.classList.toggle('show',!!message);box.dataset.statusType=type||'info';box.setAttribute('aria-live','polite');}
  function setBusy(form,busy,label){var button=form.querySelector('button[type="submit"],input[type="submit"]');if(!button)return;if(!button.dataset.originalText)button.dataset.originalText=button.tagName==='INPUT'?button.value:button.innerHTML;button.disabled=!!busy;button.setAttribute('aria-busy',String(!!busy));if(button.tagName==='INPUT')button.value=busy?(label||'Please wait...'):button.dataset.originalText;else button.innerHTML=busy?'<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> '+(label||'Please wait...'):button.dataset.originalText;}
  function value(form,name){var input=form.querySelector('[name="'+name+'"]');return input?String(input.value||'').trim():'';}
  function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
  function collectMetadata(form){var metadata={};form.querySelectorAll('input,select,textarea').forEach(function(field){if(!field.name||['email','password','confirm_password','full_name','phone'].indexOf(field.name)!==-1)return;if((field.type==='checkbox'||field.type==='radio')&&!field.checked)return;metadata[field.name]=field.value;});return metadata;}
  function friendlyAuthMessage(error,context){
    if(window.GEESAuthService&&typeof window.GEESAuthService.explainAuthError==='function'){
      var result=window.GEESAuthService.explainAuthError(error,context)||{};
      if(result.type&&result.type!=='unknown'&&result.message)return result.message;
    }
    var raw=String((error&&error.message)||error||'').toLowerCase();
    if(/invalid login|invalid credentials/.test(raw))return 'Email or password is incorrect.';
    if(/email not confirmed/.test(raw))return 'Please confirm your email before signing in.';
    if(/rate limit|too many/.test(raw))return 'Too many attempts. Please wait a moment and try again.';
    if(/network|fetch|offline|timeout/.test(raw))return 'Connection issue. Check your internet and try again.';
    return context==='signup'?'We could not create your account. Please try again.':'We could not sign you in. Please try again.';
  }
  function showFlash(){var message='';try{message=sessionStorage.getItem(flashKey)||'';sessionStorage.removeItem(flashKey);}catch(e){}if(!message&&new URLSearchParams(location.search).get('reason')==='session-expired')message='Your session expired. Please sign in again.';if(!message)return;var form=document.querySelector('[data-login-role],[data-signup-role]');if(form)setStatus(form,message,'info');}
  function dashboardFor(role){return window.GEESAuthService&&window.GEESAuthService.dashboardFor?window.GEESAuthService.dashboardFor(role,role):'/portal/student/dashboard.html';}
  ready(function(){
    showFlash();
    document.querySelectorAll('[data-login-role]').forEach(function(form){form.addEventListener('submit',async function(event){event.preventDefault();if(form.dataset.geesBusy==='true')return;var email=value(form,'email'),password=value(form,'password');if(!validEmail(email)){setStatus(form,'Enter a valid email address.','error');return;}if(!password){setStatus(form,'Enter your password.','error');return;}form.dataset.geesBusy='true';setStatus(form,'','info');setBusy(form,true,'Signing in...');try{var result=await window.GEESAuthService.login({email:email,password:password,role:form.dataset.loginRole,next:new URLSearchParams(location.search).get('next')});setStatus(form,'Sign-in successful. Opening your portal…','success');location.href=result.next;}catch(error){console.error('[GEES Auth Page] Login failed.',error);setStatus(form,friendlyAuthMessage(error,'login'),'error');}finally{form.dataset.geesBusy='false';setBusy(form,false);}});});
    document.querySelectorAll('[data-signup-role]').forEach(function(form){form.addEventListener('submit',async function(event){event.preventDefault();if(form.dataset.geesBusy==='true')return;var email=value(form,'email'),password=value(form,'password'),confirmPassword=value(form,'confirm_password'),fullName=value(form,'full_name');if(fullName.length<2){setStatus(form,'Enter your full name.','error');return;}if(!validEmail(email)){setStatus(form,'Enter a valid email address.','error');return;}if(password.length<8){setStatus(form,'Use at least 8 characters for your password.','error');return;}if(confirmPassword!==password){setStatus(form,'Passwords do not match.','error');return;}form.dataset.geesBusy='true';setStatus(form,'','info');setBusy(form,true,'Creating account...');try{var result=await window.GEESAuthService.signup({role:form.dataset.signupRole,email:email,password:password,fullName:fullName,phone:value(form,'phone'),teamId:value(form,'team_id'),metadata:collectMetadata(form)});setStatus(form,result.message||'Signup submitted successfully.','success');if(result.session&&String(form.dataset.signupRole)==='student'){setTimeout(function(){location.href=dashboardFor('student');},700);}else form.reset();}catch(error){console.error('[GEES Auth Page] Signup failed.',error);setStatus(form,friendlyAuthMessage(error,'signup'),'error');}finally{form.dataset.geesBusy='false';setBusy(form,false);}});});
  });
})();
