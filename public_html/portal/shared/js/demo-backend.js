
(function(){
  const STORAGE={session:'gees_portal_session',legacy:'gees_demo_session',notifications:'gees_demo_notifications',audit:'gees_demo_audit'};
  const USERS=[
    {id:'student-demo',name:'Demo Student',email:'student@gees.demo',password:'Student@123',role:'student',teamId:'student',dashboard:'/portal/student/dashboard.html',permissions:['student.dashboard','student.application','student.document-vault','student.pipeline','student.details']},
    {id:'agent-demo',name:'Demo Agent',email:'agent@gees.demo',password:'Agent@123',role:'agent',teamId:'agent',dashboard:'/portal/agent/dashboard.html',permissions:['agent.dashboard','agent.students','agent.commissions','agent.universities','agent.scholarships','agent.support']},
    {id:'staff-demo',name:'Demo Staff',email:'staff@gees.demo',password:'Staff@123',role:'staff',teamId:'staff',dashboard:'/portal/staff/dashboard.html',permissions:['staff.dashboard']},
    {id:'ekhlas-staff',name:'Ekhlasur Rahman',email:'ekhlas@gees.demo',password:'Staff@123',role:'staff',teamId:'ekhlas',dashboard:'/portal/staff/ekhlas/dashboard.html',permissions:['staff.ekhlas.dashboard','staff.ekhlas.india-outreach','staff.ekhlas.community-auditor','staff.ekhlas.training']},
    {id:'maanisha-staff',name:'Maanisha',email:'maanisha@gees.demo',password:'Staff@123',role:'staff',teamId:'maanisha',dashboard:'/portal/staff/maanisha/dashboard.html',permissions:['staff.maanisha.dashboard','staff.maanisha.inti-benchmarks','staff.maanisha.revenue-forecast','staff.maanisha.university-vault']},
    {id:'rafshan-staff',name:'Rafshan',email:'rafshan@gees.demo',password:'Staff@123',role:'staff',teamId:'rafshan',dashboard:'/portal/staff/rafshan/dashboard.html',permissions:['staff.rafshan.dashboard','staff.rafshan.community-manager','staff.rafshan.reels-library','staff.rafshan.strategy-calendar']},
    {id:'seo-staff',name:'SEO Staff',email:'seo@gees.demo',password:'Staff@123',role:'staff',teamId:'seo',dashboard:'/portal/staff/seo/dashboard.html',permissions:['staff.seo.dashboard']},
    {id:'admin-demo',name:'Demo Admin',email:'admin@gees.demo',password:'Admin@123',role:'admin',teamId:'admin',dashboard:'/portal/admin/dashboard.html',permissions:['admin.dashboard','admin.reports','admin.help','admin.wiki','admin.analytics','admin.crm','admin.agreements','admin.students']},
    {id:'super-demo',name:'Super Admin',email:'super@gees.demo',password:'Super@123',role:'super_admin',teamId:'super_admin',dashboard:'/portal/super-admin/dashboard.html',permissions:['*']}
  ];
  const DATA={
    students:[{id:101,name:'Ayesha Siddiqua',country:'Malaysia',stage:'Offer Received'},{id:102,name:'Rakib Hasan',country:'Canada',stage:'Document Review'},{id:103,name:'Farhan Ahmed',country:'Malaysia',stage:'Visa Prep'}],
    applications:[{id:'APP-1001',student:'Ayesha Siddiqua',status:'Offer Processing',progress:68},{id:'APP-1002',student:'Rakib Hasan',status:'Document Review',progress:42}],
    documents:[{name:'Passport',status:'Verified'},{name:'Transcript',status:'In Review'},{name:'Bank Statement',status:'Pending'}],
    commissions:[{student:'Ayesha Siddiqua',amount:'RM 2,800',status:'Pending'},{student:'Rakib Hasan',amount:'RM 3,200',status:'Paid'}],
    approvals:[{type:'Role upgrade',status:'Pending',risk:'Medium'},{type:'University edit',status:'Approved',risk:'Low'}],
    auditLogs:[{user:'admin-demo',action:'login',time:'Today'},{user:'super-demo',action:'approval.review',time:'Today'}],
    notifications:[{title:'Offer update',body:'Taylor’s application moved to review.'},{title:'Document reminder',body:'Bank statement is still pending.'}]
  };
  function norm(role){return String(role||'').toLowerCase().replace(/-/g,'_').replace(/\s+/g,'_')}
  function read(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}
  function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function publicUser(u){return {id:u.id,name:u.name,email:u.email,role:u.role,teamId:u.teamId,dashboard:u.dashboard,permissions:u.permissions||[],loginAt:new Date().toISOString()}}
  function session(){return read(STORAGE.session,null)||read(STORAGE.legacy,null)}
  function setSession(u){const s=publicUser(u);write(STORAGE.session,s);write(STORAGE.legacy,s);audit('login',s.email);return s}
  function login(email,password,portal){email=String(email||'').trim().toLowerCase();let u=USERS.find(x=>x.email.toLowerCase()===email&&x.password===password);if(!u)throw new Error('Incorrect demo email or password.');portal=norm(portal);if(portal==='admin'&&!['admin','super_admin'].includes(u.role))throw new Error('This is not an admin account.');if(portal&&portal!=='admin'&&u.role!==portal)throw new Error('This account is not allowed for the selected portal.');return setSession(u)}
  function logout(){audit('logout',(session()||{}).email||'guest');localStorage.removeItem(STORAGE.session);localStorage.removeItem(STORAGE.legacy)}
  function hasPermission(s,perm){if(!perm||!s)return true;if(s.role==='super_admin')return true;const perms=s.permissions||[];return perms.includes('*')||perms.includes(perm)}
  function canAccess(cfg,s){if(cfg&&cfg.allowGuest)return true;if(!s)return false;const roles=(cfg.requiredRoles||[]).map(norm);if(s.role==='super_admin')return true;if(roles.length&&!roles.includes(norm(s.role)))return false;if(cfg.requiredTeam&&s.role==='staff'&&s.teamId!==cfg.requiredTeam)return false;if(cfg.requiredPermission&&!hasPermission(s,cfg.requiredPermission))return false;return true}
  function collection(name){return DATA[name]||read('gees_demo_'+name,[])}
  function audit(action,target){const logs=read(STORAGE.audit,[]);logs.unshift({action,target,time:new Date().toISOString()});write(STORAGE.audit,logs.slice(0,50))}
  function notify(title,body){const n=read(STORAGE.notifications,DATA.notifications);n.unshift({title,body,createdAt:new Date().toISOString()});write(STORAGE.notifications,n.slice(0,30));audit('notification',title);return n}
  window.GEESDemoBackend={users:USERS,data:DATA,normaliseRole:norm,session,setSession,login,logout,canAccess,hasPermission,collection,audit,notify,storage:STORAGE};
})();
