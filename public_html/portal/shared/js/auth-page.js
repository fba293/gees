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

  function friendlyAuthMessage(error, context){
    if(window.GEESAuthService && typeof window.GEESAuthService.explainAuthError === 'function'){
      return window.GEESAuthService.explainAuthError(error, context).message;
    }
    var raw = String((error && error.message) || error || '');
    var text = raw.toLowerCase();
    if(text.indexOf('email rate limit') !== -1 || text.indexOf('rate limit exceeded') !== -1 || text.indexOf('too many requests') !== -1){
      return 'Supabase email rate limit reached. For GEES testing, go to Supabase Authentication → Providers → Email, keep Email provider ON, keep Allow new users ON, and turn Confirm email OFF temporarily. Then wait a few minutes and try again.';
    }
    if(text.indexOf('signups not allowed') !== -1 || text.indexOf('signup is disabled') !== -1 || text.indexOf('new signups are disabled') !== -1){
      return 'Supabase signup is currently disabled. Go to Supabase Authentication → Providers → Email and turn ON “Allow new users to sign up”. Keep Confirm email OFF only for development testing.';
    }
    if(text.indexOf('email not confirmed') !== -1){
      return 'This email is not confirmed yet. For GEES testing, confirm the email from inbox or turn OFF Confirm email in Supabase Authentication → Providers → Email.';
    }
    if(text.indexOf('already registered') !== -1 || text.indexOf('already exists') !== -1){
      return 'This email already has a GEES account. Try logging in, use a different email, or remove/reset the user from Supabase Authentication → Users during testing.';
    }
    if(context === 'signup' && text.indexOf('admin') !== -1){
      return 'Admin signup is intentionally closed. Create a normal user first, then promote it using the first-admin bootstrap SQL.';
    }
    return raw || 'Request failed. Please try again.';
  }

  function addDevHint(form){
    if(form.dataset.hintAdded) return;
    form.dataset.hintAdded = 'true';
    var role = form.dataset.signupRole;
    if(!role) return;
    var hint = document.createElement('p');
    hint.className = 'gees-auth-mini gees-auth-dev-hint';
    hint.textContent = role === 'agent' || role === 'staff'
      ? 'Testing note: Email provider ON, Allow new users ON, Confirm email OFF temporarily. Agent/staff accounts stay pending until real admin approval.'
      : 'Testing note: if Supabase email limit appears, turn Confirm email OFF temporarily in Supabase Auth settings.';
    form.appendChild(hint);
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
          setStatus(form, friendlyAuthMessage(error, 'login'), 'error');
        }finally{
          setBusy(form, false);
        }
      });
    });

    document.querySelectorAll('[data-signup-role]').forEach(function(form){
      addDevHint(form);
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
          setStatus(form, friendlyAuthMessage(error, 'signup'), 'error');
        }finally{
          setBusy(form, false);
        }
      });
    });
  });
})();
