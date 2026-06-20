import fs from 'node:fs';
import path from 'node:path';

const required = [
  'public_html/global.js',
  'public_html/gees-leads.js',
  'public_html/sw.js',
  'public_html/portal/shared/css/portal.css',
  'public_html/portal/shared/css/portal-mobile.css',
  'public_html/portal/shared/js/auth-service.js',
  'public_html/portal/shared/js/role-guard.js',
  'public_html/portal/shared/js/portal-shell.js',
  'public_html/portal/shared/js/portal-document-upload.js',
  'public_html/portal/shared/js/portal-live-data.js',
  'public_html/portal/shared/js/portal-workflow.js',
  'public_html/portal/shared/js/portal-commissions.js',
  'public_html/portal/shared/js/portal-work-items.js',
  'public_html/portal/shared/js/portal-reports.js',
  'public_html/portal/student/dashboard.html',
  'public_html/portal/student/document-vault.html',
  'public_html/portal/agent/dashboard.html',
  'public_html/portal/agent/commissions.html',
  'public_html/portal/admin/dashboard.html',
  'public_html/portal/admin/reports.html',
  'public_html/portal/staff/dashboard.html',
  'public_html/portal/staff/work-items.html',
  'supabase/sql/20260620_add_fk_lookup_indexes.sql',
  'supabase/sql/20260620_harden_public_lead_insert_policy.sql',
  'supabase/sql/20260620_optimize_core_rls_auth_uid.sql'
];

const errors = [];
for (const file of required) {
  if (!fs.existsSync(file)) errors.push(`Missing required production file: ${file}`);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

const globalFile = 'public_html/global.js';
if (fs.existsSync(globalFile)) {
  const source = read(globalFile);
  if (!source.includes('GEES PHASE 18 PUBLIC LEADS AUTO-LOADER')) errors.push('Missing public lead auto-loader.');
  if (!source.includes('/gees-leads.js')) errors.push('Public lead script is not loaded by global.js.');
}

const shellFile = 'public_html/portal/shared/js/portal-shell.js';
if (fs.existsSync(shellFile)) {
  const source = read(shellFile);
  if (!source.includes('/portal/shared/css/portal-mobile.css')) errors.push('Portal shell does not load the shared responsive stylesheet.');
  if (!source.includes('viewport-fit=cover')) errors.push('Portal shell does not ensure a safe mobile viewport.');
  if (!source.includes('gees-portal-menu-open')) errors.push('Portal shell does not lock the background while the mobile drawer is open.');
  if (!source.includes("event.key==='Escape'")) errors.push('Portal shell does not close the mobile drawer with Escape.');
}

const liveDataFile = 'public_html/portal/shared/js/portal-live-data.js';
if (fs.existsSync(liveDataFile)) {
  const source = read(liveDataFile);
  if (!source.includes("['admin','super_admin'].includes(role(s))")) errors.push('Live dashboard aggregate counts are not limited to admin roles.');
  if (!source.includes("await c.from(table).select('id',{count:'exact',head:true})")) errors.push('Live dashboard does not use RLS-scoped counts for non-admin roles.');
}

const uploadFile = 'public_html/portal/shared/js/portal-document-upload.js';
if (fs.existsSync(uploadFile)) {
  const source = read(uploadFile);
  if (!source.includes('gees-student-documents')) errors.push('Document upload bucket is not configured.');
  if (!source.includes('.storage.from(')) errors.push('Document upload does not use Supabase Storage.');
}

const responsiveFile = 'public_html/portal/shared/css/portal-mobile.css';
if (fs.existsSync(responsiveFile)) {
  const source = read(responsiveFile);
  for (const rule of ['max-width:1100px', 'max-width:760px', 'safe-area-inset-top', 'prefers-reduced-motion']) {
    if (!source.includes(rule)) errors.push(`Responsive portal stylesheet is missing ${rule}.`);
  }
}

const activePublicPages = [
  'public_html/index.html',
  'public_html/contact-us.html',
  'public_html/services.html',
  'public_html/courses.html',
  'public_html/destinations.html',
  'public_html/blog.html',
  'public_html/universities.html'
].filter(fs.existsSync);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const activePortalPages = walk('public_html/portal').filter(file => file.endsWith('.html'));
for (const file of [...activePublicPages, ...activePortalPages]) {
  const source = read(file);
  if (/skip to main content/i.test(source)) errors.push(`Forbidden skip-link text in active page: ${file}`);
  if (/data-demo-action|gees_demo_|demo\/static mode|Student@123|Agent@123|Staff@123|Demo@/i.test(source)) errors.push(`Legacy demo marker in active page: ${file}`);
  if (file.includes('/portal/auth/') && /demo-backend\.js/i.test(source)) errors.push(`Legacy auth backend loaded by active page: ${file}`);
}

if (errors.length) {
  errors.forEach(error => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(`GEES production validation passed (${activePublicPages.length} public pages, ${activePortalPages.length} portal pages).`);
