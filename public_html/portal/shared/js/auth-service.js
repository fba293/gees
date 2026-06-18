(function(){
  'use strict';
  var DEMO={
    'student@gees.demo':{password:'Student@123',role:'student',status:'active',full_name:'Demo Student'},
    'agent@gees.demo':{password:'Agent@123',role:'agent',status:'active',full_name:'Demo Agent',isDemo:true},
    'staff@gees.demo':{password:'Staff@123',role:'staff',status:'active',full_name:'Demo Staff',isDemo:true},
    'admin@gees.demo':{password:'Admin@123',role:'admin',status:'active',full_name:'Demo Admin',isDemo:true},
    'super@gees.demo':{password:'Super@123',role:'super_admin',status:'active',full_name:'Demo Super Admin',isDemo:true}
  };
  var SESSION_KEY='gees_portal_session';
  function client(){return window.GEESSupabase||null;}
  function dash(role){return role==='student'?'/portal/student/dashboard.html':role==='agent'?'/portal/agent/dashboard.html':role==='staff'?'/portal/staff/dashboard.html':role==='super_admin'?'/portal/super-admin/dashboard.html':'/portal/admin/dashboard.html';}
  function cleanEmail(email){return String(email||'').trim().toLowerCase();}
  function normalizeError(error){
    var raw=String((error&&error.message)||error||'Something went wrong.');
    var msg=raw.toLowerCase();
    if(msg.includes('email rate limit')||msg.includes('rate limit exceeded')) return 'Signup email limit reached. For GEES testing, turn OFF Confirm email in Supabase Authentication → Providers → Email, or wait before trying again.';
    if(msg.includes('signups not allowed')) return 'Supabase signup is currently disabled. Turn ON Authentication → Providers → Email → Allow new users to sign up, then save and try again.';
    if(msg.includes('already registered')||msg.includes('already exists')) return 'This email is already registered. Try logging in instead.';
    if(msg.includes('invalid login')||msg.includes('invalid credentials')) return 'Incorrect email or password.';
    if(msg.includes('email not confirmed')) return 'Email confirmation is still ON. For testing, confirm the email first or temporarily turn OFF Confirm email in Supabase.';
    if(msg.includes('admin access required')) return 'This action needs a real Supabase admin/super_admin account. Demo admin cannot view real approvals.';
    return raw;
  }
  function saveSession(profile, authUser){
    var session={id:profile.id||(authUser&&authUser.id)||'',email:profile.email||(authUser&&authUser.email)||'',role:profile.role,status:profile.status,team_id:profile.team_id||'',full_name:profile.full_name||profile.email||'',isDemo:!!profile.isDemo,created_at:new Date().toISOString()};
    localStorage.setItem(SESSION_KEY,JSON.stringify(session));
    window.GEESCurrentPortalSession=session;
    return session;
  }
  async function getProfile(userId){
    var sb=client();
    if(!sb||!userId) return null;
    var res=await sb.from('profiles').select('id,email,full_name,phone,role,status,team_id').eq('id',userId).single();
    if(res.error) throw res.error;
    return res.data;
  }
  async function getPortalSession(){
    var sb=client();
    if(sb){
      var sess=await sb.auth.getSession();
      var user=sess&&sess.data&&sess.data.session&&sess.data.session.user;
      if(user){
        var profile=await getProfile(user.id);
        if(profile) return saveSession(profile,user);
      }
    }
    try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null');}catch(e){return null;}
  }
  async function signIn(expectedRole,email,password){
    email=cleanEmail(email);
    if(DEMO[email]){
      var d=DEMO[email];
      if(password!==d.password) throw new Error('Incorrect email or password.');
      if(expectedRole&&expectedRole!=='admin'&&d.role!==expectedRole) throw new Error('This account does not match the selected portal role.');
      if(expectedRole==='admin'&&!(d.role==='admin'||d.role==='super_admin')) throw new Error('This account does not match the admin portal.');
      var demoSession=saveSession({id:'demo-'+d.role,email:email,role:d.role,status:d.status,full_name:d.full_name,isDemo:true},null);
      return {session:demoSession,redirectTo:dash(d.role),message:'Demo login successful. Real Supabase approval data needs a real admin account.'};
    }
    var sb=client();
    if(!sb) throw new Error('Supabase client is not loaded. Check internet/CDN and supabase-client.js.');
    var auth=await sb.auth.signInWithPassword({email:email,password:password});
    if(auth.error) throw new Error(normalizeError(auth.error));
    var profile=await getProfile(auth.data.user.id);
    if(!profile) throw new Error('Profile was not created. Check the Supabase auth trigger.');
    if(profile.status!=='active') throw new Error('Your GEES account is '+profile.status+'. Agent/staff accounts need GEES admin approval before dashboard access.');
    if(expectedRole&&expectedRole!=='admin'&&profile.role!==expectedRole) throw new Error('This account belongs to '+profile.role+', not '+expectedRole+'.');
    if(expectedRole==='admin'&&!(profile.role==='admin'||profile.role==='super_admin')) throw new Error('This is not an admin/super_admin account.');
    var session=saveSession(profile,auth.data.user);
    return {session:session,redirectTo:dash(profile.role),message:'Login successful.'};
  }
  async function signUp(role,data){
    if(role==='admin'||role==='super_admin') throw new Error('Admin signup is intentionally disabled. Create a normal user first, then run first-admin bootstrap SQL.');
    var sb=client();
    if(!sb) throw new Error('Supabase client is not loaded.');
    var email=cleanEmail(data.email);
    var payload={email:email,password:data.password,options:{data:{role:role,full_name:data.full_name||'',phone:data.phone||'',team_id:data.team_id||role,agency_name:data.agency_name||'',country:data.country||'',department:data.department||'',title:data.title||''}}};
    var res=await sb.auth.signUp(payload);
    if(res.error) throw new Error(normalizeError(res.error));
    var msg=role==='student'?'Student signup successful. You can now login.':role.charAt(0).toUpperCase()+role.slice(1)+' signup submitted. Your account is pending GEES admin approval.';
    return {message:msg,user:res.data&&res.data.user};
  }
  async function logout(){
    localStorage.removeItem(SESSION_KEY);
    window.GEESCurrentPortalSession=null;
    var sb=client();
    if(sb) await sb.auth.signOut().catch(function(){});
    location.href='/portal/auth/student-login.html';
  }
  async function pendingApprovals(){
    var session=await getPortalSession();
    if(!session) throw new Error('Login required. Use a real Supabase admin/super_admin account.');
    if(session.isDemo) throw new Error('Demo admin cannot view real Supabase approvals. Bootstrap and login with a real admin/super_admin account.');
    if(!(session.role==='admin'||session.role==='super_admin')) throw new Error('Admin access required.');
    var sb=client();
    var res=await sb.rpc('get_pending_gees_user_approvals');
    if(res.error) throw new Error(normalizeError(res.error));
    return res.data||[];
  }
  async function approveUser(id,note){var sb=client();var res=await sb.rpc('approve_gees_user',{p_user_id:id,p_note:note||'Approved from GEES admin portal'});if(res.error) throw new Error(normalizeError(res.error));return res.data;}
  async function rejectUser(id,note){var sb=client();var res=await sb.rpc('reject_gees_user',{p_user_id:id,p_note:note||'Rejected from GEES admin portal'});if(res.error) throw new Error(normalizeError(res.error));return res.data;}
  window.GEESAuthService={signIn:signIn,signUp:signUp,logout:logout,getPortalSession:getPortalSession,getPendingApprovals:pendingApprovals,approveUser:approveUser,rejectUser:rejectUser,normalizeError:normalizeError,dashboardForRole:dash};
})();
