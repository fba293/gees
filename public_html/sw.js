/* GEES Service Worker — Phase 8 Live Upload Ready */
const GEES_CACHE_VERSION = 'gees-phase8-8.0.0';
const GEES_STATIC_CACHE = GEES_CACHE_VERSION + '-static';
const GEES_CORE_ASSETS = [
  '/',
  '/index.html',
  '/global.css',
  '/header.js',
  '/footer.js',
  '/offline.html',
  '/portal/shared/css/portal.css?v=8.0.0',
  '/portal/shared/js/demo-backend.js?v=8.0.0',
  '/portal/shared/js/role-guard.js?v=8.0.0',
  '/portal/shared/js/portal-shell.js?v=8.0.0',
  '/portal/shared/js/portal-ui.js?v=8.0.0'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(GEES_STATIC_CACHE).then(cache => cache.addAll(GEES_CORE_ASSETS.map(url => new Request(url, { cache: 'reload' }))).catch(() => undefined)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.indexOf('gees-') === 0 && key !== GEES_STATIC_CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

function isPortalHtml(url, request) {
  return url.origin === location.origin && url.pathname.startsWith('/portal/') && (request.mode === 'navigate' || request.destination === 'document' || url.pathname.endsWith('.html'));
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Portal/auth documents must be fresh so role guards and redirects do not get stuck in old cache.
  if (isPortalHtml(url, request)) {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html').then(r => r || new Response('GEES portal is offline. Please reconnect and refresh.', { status: 503, headers: { 'Content-Type': 'text/plain' } }))));
    return;
  }

  // Public documents: network first, offline fallback.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(GEES_STATIC_CACHE).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(r => r || caches.match('/offline.html'))));
    return;
  }

  // Static same-origin assets: stale-while-revalidate.
  if (/\.(css|js|png|jpg|jpeg|webp|svg|ico|json|woff2?)$/i.test(url.pathname)) {
    event.respondWith(caches.match(request).then(cached => {
      const fresh = fetch(request).then(response => {
        if (response && response.ok) caches.open(GEES_STATIC_CACHE).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => cached);
      return cached || fresh;
    }));
  }
});
