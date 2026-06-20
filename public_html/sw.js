/* GEES Service Worker — static cache + stale-while-revalidate */
const GEES_SW_VERSION = 'gees-sw-v15.3-home-runtime-repair';
const STATIC_CACHE = `${GEES_SW_VERSION}-static`;
const RUNTIME_CACHE = `${GEES_SW_VERSION}-runtime`;
const STATIC_ASSETS = [
  '/', '/index.html', '/global.css', '/index.css', '/header.js', '/footer.js', '/global.js', '/gees-router.js', '/index.js', '/index-search.js', '/homepage-counter-fallback.js',
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
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS.filter(Boolean))).catch(() => {}));
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
function isHomepage(req) {
  const pathname = new URL(req.url).pathname;
  return pathname === '/' || pathname === '/index.html';
}
function repairedHeaders(sourceHeaders) {
  const headers = new Headers(sourceHeaders);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('content-type', 'text/html; charset=utf-8');
  return headers;
}
async function injectHomepageCounterFallback(response) {
  if (!response || !response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const headers = repairedHeaders(response.headers);
  if (html.includes('homepage-counter-fallback.js')) {
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
  }
  const script = '<script defer src="/homepage-counter-fallback.js?v=15.3.0"></script>';
  const patched = html.includes('</head>') ? html.replace('</head>', `${script}</head>`) : `${html}${script}`;
  return new Response(patched, { status: response.status, statusText: response.statusText, headers });
}
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !shouldCache(req)) return;
  event.respondWith((async () => {
    const cache = await caches.open(req.destination === 'document' ? RUNTIME_CACHE : STATIC_CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then(async res => {
      if (res && res.ok) await cache.put(req, res.clone());
      return res;
    }).catch(() => cached);
    const response = isNetworkFirst(req) ? await (network || cached) : await (cached || network);
    return isHomepage(req) ? injectHomepageCounterFallback(response) : response;
  })());
});
