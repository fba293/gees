/* GEES Service Worker — static cache + stale-while-revalidate */
const GEES_SW_VERSION = 'gees-sw-v15.1-portal-runtime';
const STATIC_CACHE = `${GEES_SW_VERSION}-static`;
const RUNTIME_CACHE = `${GEES_SW_VERSION}-runtime`;
const STATIC_ASSETS = [
  '/', '/index.html', '/global.css', '/index.css', '/header.js', '/footer.js', '/global.js', '/gees-router.js', '/index.js', '/index-search.js',
  '/portal/shared/css/portal.css', '/portal/shared/css/portal-mobile.css',
  '/portal/shared/js/supabase-client.js', '/portal/shared/js/auth-service.js', '/portal/shared/js/role-guard.js',
  '/portal/shared/js/portal-shell.js', '/portal/shared/js/portal-ui.js', '/portal/shared/js/portal-live-data.js'
];
const NETWORK_FIRST_PORTAL_ASSETS = new Set([
  '/portal/shared/css/portal.css',
  '/portal/shared/css/portal-mobile.css',
  '/portal/shared/js/supabase-client.js',
  '/portal/shared/js/auth-service.js',
  '/portal/shared/js/auth-page.js',
  '/portal/shared/js/role-guard.js',
  '/portal/shared/js/portal-shell.js',
  '/portal/shared/js/portal-ui.js',
  '/portal/shared/js/portal-live-data.js',
  '/portal/shared/js/portal-crud.js',
  '/portal/shared/js/portal-document-upload.js',
  '/portal/shared/js/portal-workflow.js',
  '/portal/shared/js/portal-commissions.js',
  '/portal/shared/js/portal-work-items.js',
  '/portal/shared/js/portal-reports.js'
]);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS.filter(Boolean))).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => !k.startsWith(GEES_SW_VERSION)).map(k => caches.delete(k)))));
  self.clients.claim();
});
function shouldCache(req) {
  const url = new URL(req.url);
  if (url.origin !== location.origin) return false;
  return ['document','style','script','image','font'].includes(req.destination) || /\.(html|css|js|webp|avif|png|jpg|jpeg|svg|woff2?)$/i.test(url.pathname);
}
function isNetworkFirst(req) {
  const url = new URL(req.url);
  return req.destination === 'document' || NETWORK_FIRST_PORTAL_ASSETS.has(url.pathname);
}
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !shouldCache(req)) return;
  event.respondWith((async () => {
    const cache = await caches.open(req.destination === 'document' ? RUNTIME_CACHE : STATIC_CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
    if (isNetworkFirst(req)) return network || cached;
    return cached || network;
  })());
});
