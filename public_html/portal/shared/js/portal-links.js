/* GEES Portal Links — Phase 8
   Central route constants for public-to-portal integration. */
(function(){
  window.GEESPortalLinks = Object.freeze({
    version: '8.0.0',
    auth: {
      studentLogin: '/portal/auth/student-login.html',
      agentLogin: '/portal/auth/agent-login.html',
      staffLogin: '/portal/auth/staff-login.html',
      adminLogin: '/portal/auth/admin-login.html',
      studentSignup: '/portal/auth/student-signup.html',
      agentSignup: '/portal/auth/agent-signup.html',
      staffSignup: '/portal/auth/staff-signup.html'
    },
    dashboards: {
      student: '/portal/student/dashboard.html',
      agent: '/portal/agent/dashboard.html',
      staff: '/portal/staff/dashboard.html',
      admin: '/portal/admin/dashboard.html',
      superAdmin: '/portal/super-admin/dashboard.html'
    }
  });
})();
