(function(){
'use strict';
window.GEESSecurityChecklist = {
  checks:[
    'No service role key in frontend',
    'Email provider configured',
    'Password reset redirect configured',
    'RLS enabled on private tables',
    'Public forms insert-only',
    'Storage files private with signed URLs',
    'Backups and rollback package ready'
  ]
};
})();
