import fs from 'node:fs';
import path from 'node:path';

const required = [
  'public_html/global.js',
  'public_html/gees-leads.js',
  'public_html/portal/shared/js/auth-service.js',
  'public_html/portal/shared/js/role-guard.js',
  'public_html/portal/shared/js/portal-document-upload.js',
  'public_html/portal/shared/js/portal-live-data.js',
  'public_html/portal/shared/js/portal-workflow.js',
  'public_html/portal/shared/js/portal-commissions.js',
  'public_html/portal/shared/js/portal-work-items.js',
  'public_html/portal/shared/js/portal-reports.js',
  'public_html/portal/student/document-vault.html',
  'public_html/portal/agent/commissions.html',
  'public_html/portal/admin/reports.html',
  'public_html/portal/staff/work-items.html',
  'supabase/sql/20260620_add_fk_lookup_indexes.sql'
];

const errors = [];
for (const file of required) {
  if (!fs.existsSync(file)) errors.push(`Missing required file: ${file}`);
}

const globalFile = 'public_html/global.js';
if (fs.existsSync(globalFile)) {
  const source = fs.readFileSync(globalFile, 'utf8');
  if (!source.includes('GEES PHASE 18 PUBLIC LEADS AUTO-LOADER')) errors.push('Missing public lead auto-loader.');
  if (!source.includes('/gees-leads.js')) errors.push('Public lead script is not loaded by global.js.');
}

const uploadFile = 'public_html/portal/shared/js/portal-document-upload.js';
if (fs.existsSync(uploadFile)) {
  const source = fs.readFileSync(uploadFile, 'utf8');
  if (!source.includes('gees-student-documents')) errors.push('Document upload bucket is not configured.');
  if (!source.includes('.storage.from(')) errors.push('Document upload does not use Supabase Storage.');
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk('public_html').filter(file => file.endsWith('.html'))) {
  const source = fs.readFileSync(file, 'utf8');
  if (/skip to main content/i.test(source)) errors.push(`Forbidden skip-link text: ${file}`);
  if (/data-demo-action|gees_demo_|demo\/static mode|Student@123|Demo@/i.test(source)) errors.push(`Legacy demo marker: ${file}`);
}

if (errors.length) {
  errors.forEach(error => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log('GEES production file checks passed.');
