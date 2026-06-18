(function(){
  'use strict';

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function setStatus(form, message, type){
    var box = form.querySelector('[data-auth-error], [data-auth-status]');
    if(!box) return;
    box.textContent = message || '';
    box.classList.toggle('show', !!message);
    box.dataset.statusType = type || 'info';
  }

  function setBusy(form, busy){
    var button = form.querySelector('button[type="submit"]');
    if(!button) return;
    button.disabled = !!busy;
    if(!button.dataset.originalText) button.dataset.originalText = button.innerHTML;
    button.innerHTML = busy ? '<i class="fa-solid fa-spinner fa-spin"></i> Please wait...' : button.dataset.originalText;
  }

  function value(form, name){
    var input = form.querySelector('[name="' + name + '"]');
    return input ? input.value : '';
  }

  function collectMetadata(form){
    var metadata = {};
    form.querySelectorAll('input, select, textarea').forEach(function(field){
      if(!field.name || ['email','password','confirm_password','full_name','phone'].indexOf(field.name) !== -1) return;
      if((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
      metadata[field.name] = field.value;
    });
    return metadata;
  }

  ready(function(){
    document.querySelectorAll('[data-login-role]').forEach(function(form){
      form.addEventListener('submit', async function(event){
        event.preventDefault();
        setStatus(form, '', 'info');
        setBusy(form, true);
        try{
          var result = await window.GEESAuthService.login({
            email: value(form, 'email'),
            password: value(form, 'password'),
            role: form.dataset.loginRole,
            next: new URLSearchParams(location.search).get('next')
          });
          setStatus(form, result.mode === 'demo' ? 'Demo login successful. Redirecting...' : 'Supabase login successful. Redirecting...', 'success');
          location.href = result.next;
        }catch(error){
          setStatus(form, error.message || 'Login failed. Please try again.', 'error');
        }finally{
          setBusy(form, false);
        }
      });
    });

    document.querySelectorAll('[data-signup-role]').forEach(function(form){
      form.addEventListener('submit', async function(event){
        event.preventDefault();
        setStatus(form, '', 'info');
        setBusy(form, true);
        try{
          var password = value(form, 'password');
          var confirmPassword = value(form, 'confirm_password');
          if(confirmPassword && password !== confirmPassword) throw new Error('Passwords do not match.');
          var result = await window.GEESAuthService.signup({
            role: form.dataset.signupRole,
            email: value(form, 'email'),
            password: password,
            fullName: value(form, 'full_name'),
            phone: value(form, 'phone'),
            teamId: value(form, 'team_id'),
            metadata: collectMetadata(form)
          });
          setStatus(form, result.message || 'Signup submitted successfully.', 'success');
          form.reset();
        }catch(error){
          setStatus(form, error.message || 'Signup failed. Please try again.', 'error');
        }finally{
          setBusy(form, false);
        }
      });
    });
  });
})();
