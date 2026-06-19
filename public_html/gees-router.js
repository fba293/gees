/* GEES True PJAX Router v12.8.0
   Purpose: keep universal header/footer mounted once and replace only page content on internal navigation.
   Install: <script defer src="/gees-router.js"></script>
   header.js can auto-load this file.
*/
(function () {
  'use strict';

  if (window.GEES_ROUTER_READY) return;
  window.GEES_ROUTER_READY = true;

  const CONFIG = {
    mainSelector: '#gees-pjax-root',
    headerPlaceholder: '#gees-header-placeholder',
    footerPlaceholder: '#gees-footer-placeholder',
    cacheLimit: 18,
    transitionMs: 120,
    prefetchDelay: 70,
    scrollTopOnNavigate: true,
    scriptBlocklist: /\/(header|footer|global|gees-router)\.js(?:[?#]|$)/i,
    assetBlocklist: /\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|png|jpe?g|gif|webp|avif|svg|mp4|mov|webm|mp3|wav)(?:[?#].*)?$/i
  };

  const state = {
    currentUrl: canonicalUrl(location.href),
    cache: new Map(),
    navigating: false,
    aborter: null,
    prefetched: new Set(),
    lastFocus: null
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function canonicalUrl(href) {
    const url = new URL(href, location.href);
    url.hash = '';
    // Normalize trailing index.html so / and /index.html share cache.
    url.pathname = url.pathname.replace(/\/index\.html$/i, '/');
    return url.href;
  }

  function isSamePageHashLink(url) {
    return url.origin === location.origin &&
      url.pathname.replace(/\/index\.html$/i, '/') === location.pathname.replace(/\/index\.html$/i, '/') &&
      url.search === location.search &&
      !!url.hash;
  }

  function isNavigableAnchor(anchor, event) {
    if (!anchor || !anchor.href) return false;
    if (event && (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;
    if (anchor.closest('[data-no-pjax], [data-gees-no-pjax]')) return false;
    const raw = anchor.getAttribute('href') || '';
    if (!raw || raw.startsWith('#')) return false;
    if (/^(?:mailto|tel|sms|whatsapp|javascript):/i.test(raw)) return false;
    let url;
    try { url = new URL(anchor.href, location.href); } catch (_) { return false; }
    if (url.origin !== location.origin) return false;
    if (isSamePageHashLink(url)) return false;
    if (CONFIG.assetBlocklist.test(url.pathname)) return false;
    return true;
  }

  function shouldKeepHeadNode(node) {
    if (!node || node.nodeType !== 1) return true;
    const tag = node.tagName.toLowerCase();
    if (tag === 'meta') {
      const charset = node.getAttribute('charset');
      const name = (node.getAttribute('name') || '').toLowerCase();
      return !!charset || name === 'viewport' || name === 'color-scheme';
    }
    if (tag === 'link') {
      const href = node.getAttribute('href') || '';
      const rel = (node.getAttribute('rel') || '').toLowerCase();
      if (rel === 'preconnect' || rel === 'dns-prefetch') return true;
      if (/\/global\.css(?:\?|$)/i.test(href)) return true;
      if (/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome/i.test(href)) return true;
      return false;
    }
    if (tag === 'script') {
      const src = node.getAttribute('src') || '';
      return CONFIG.scriptBlocklist.test(src);
    }
    if (tag === 'title') return false;
    if (tag === 'style') return false;
    return false;
  }

  function markInitialManagedHead() {
    Array.from(document.head.children).forEach(node => {
      if (!shouldKeepHeadNode(node) && !node.dataset.geesRouterManaged) {
        node.dataset.geesRouterManaged = 'initial';
      }
    });
  }

  function cloneNodeWithMarker(node, marker) {
    const clone = node.cloneNode(true);
    clone.dataset.geesRouterManaged = marker;
    return clone;
  }

  function updateHead(doc) {
    // Remove old page-specific head nodes first. Persistent global/header assets remain.
    $$('[data-gees-router-managed]', document.head).forEach(node => node.remove());

    if (doc.title) document.title = doc.title;

    const nodes = Array.from(doc.head.children).filter(node => !shouldKeepHeadNode(node));
    const fragment = document.createDocumentFragment();
    const seenStylesheets = new Set(
      $$('link[rel~="stylesheet"]', document.head).map(l => new URL(l.href, location.href).href)
    );

    nodes.forEach(node => {
      const tag = node.tagName.toLowerCase();
      if (tag === 'script') return; // scripts are executed separately after content swap
      if (tag === 'link') {
        const rel = (node.getAttribute('rel') || '').toLowerCase();
        const href = node.getAttribute('href');
        if (!href) return;
        const full = new URL(href, location.href).href;
        if (rel.includes('stylesheet')) {
          if (seenStylesheets.has(full)) return;
          seenStylesheets.add(full);
        }
      }
      fragment.appendChild(cloneNodeWithMarker(node, 'head'));
    });
    document.head.appendChild(fragment);
  }

  function syncHtmlAndBody(doc) {
    if (doc.documentElement) {
      Array.from(document.documentElement.attributes).forEach(attr => {
        if (attr.name.startsWith('data-page') || attr.name === 'lang') document.documentElement.removeAttribute(attr.name);
      });
      Array.from(doc.documentElement.attributes).forEach(attr => {
        if (attr.name === 'lang' || attr.name.startsWith('data-page')) document.documentElement.setAttribute(attr.name, attr.value);
      });
    }

    if (!doc.body) return;
    // Preserve router/header runtime classes; copy page classes/data from new body.
    const runtimeClasses = ['gees-menu-open', 'gees-search-open', 'gees-lock-scroll'];
    const preserved = runtimeClasses.filter(cls => document.body.classList.contains(cls));
    document.body.className = doc.body.className || '';
    preserved.forEach(cls => document.body.classList.add(cls));

    Array.from(document.body.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) document.body.removeAttribute(attr.name);
    });
    Array.from(doc.body.attributes).forEach(attr => {
      if (attr.name === 'class') return;
      if (attr.name.startsWith('data-')) document.body.setAttribute(attr.name, attr.value);
    });
  }

  function extractMain(doc) {
    return $('#gees-pjax-root', doc);
  }

  function cloneScript(script) {
    const clone = document.createElement('script');
    Array.from(script.attributes).forEach(attr => {
      if (attr.name === 'src') {
        clone.setAttribute('src', new URL(attr.value, location.href).href);
      } else {
        clone.setAttribute(attr.name, attr.value);
      }
    });
    clone.dataset.geesRouterManaged = 'script';
    clone.textContent = script.textContent;
    return clone;
  }

  function executePageScripts(doc) {
    $$('script[data-gees-router-managed="script"]', document.body).forEach(s => s.remove());
    const scripts = [
      ...Array.from(doc.head.querySelectorAll('script')),
      ...Array.from(doc.body.querySelectorAll('script'))
    ].filter(script => {
      const src = script.getAttribute('src') || '';
      if (CONFIG.scriptBlocklist.test(src)) return false;
      const type = (script.getAttribute('type') || '').trim().toLowerCase();
      if (type && type !== 'text/javascript' && type !== 'application/javascript' && type !== 'module') return false;
      return true;
    });
    scripts.forEach(script => document.body.appendChild(cloneScript(script)));
  }

  function setProgress(active) {
    document.documentElement.classList.toggle('gees-pjax-loading', !!active);
  }

  function closeHeaderSurfaces() {
    document.dispatchEvent(new CustomEvent('gees:router:before-swap'));
    document.dispatchEvent(new CustomEvent('gees:page:before-leave'));
    // Defensive close for current header class names in case listener is absent.
    document.body.classList.remove('gees-menu-open', 'gees-search-open');
    document.documentElement.classList.remove('gees-menu-open', 'gees-search-open');
  }

  function dispatch(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  async function getPage(url, options = {}) {
    const key = canonicalUrl(url.href || url);
    if (!options.force && state.cache.has(key)) return state.cache.get(key).cloneNode(true);

    if (state.aborter && !options.prefetch) state.aborter.abort();
    const aborter = new AbortController();
    if (!options.prefetch) state.aborter = aborter;

    const res = await fetch(key, {
      credentials: 'same-origin',
      signal: aborter.signal,
      headers: {
        'X-Requested-With': 'GEES-PJAX',
        'X-GEES-PJAX': 'true'
      }
    });
    if (!res.ok) throw new Error('GEES PJAX fetch failed: ' + res.status);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    state.cache.set(key, doc);
    if (state.cache.size > CONFIG.cacheLimit) {
      const first = state.cache.keys().next().value;
      state.cache.delete(first);
    }
    return doc.cloneNode(true);
  }

  function inferPageFromPath(pathname) {
    const clean = String(pathname || '/').replace(/\/index\.html$/i, '/').replace(/\.html$/i, '').replace(/^\/+|\/+$/g, '');
    if (!clean) return 'home';
    if (clean === 'contact-us' || clean === 'contact') return 'contact';
    if (clean === '404') return '404';
    if (clean.startsWith('universities/') || clean.includes('university')) return 'university';
    const first = clean.split('/')[0];
    return first || 'page';
  }

  async function navigate(href, opts = {}) {
    let url;
    try { url = new URL(href, location.href); } catch (_) { location.href = href; return; }
    const key = canonicalUrl(url.href);
    if (key === state.currentUrl && !opts.force) return;
    if (state.navigating) return;

    state.navigating = true;
    setProgress(true);
    closeHeaderSurfaces();
    dispatch('gees:router:before-navigate', { url: key });

    try {
      const doc = await getPage(url, { force: opts.force });
      const newMain = extractMain(doc);
      const currentMain = $('#gees-pjax-root');
      if (!newMain || !currentMain) throw new Error('GEES PJAX root #gees-pjax-root missing');

      syncHtmlAndBody(doc);
      updateHead(doc);

      const incomingMain = newMain.cloneNode(true);
      await swapMain(currentMain, incomingMain);
      executePageScripts(doc);

      const activeRoot = $('#gees-pjax-root');
      const page = (activeRoot && activeRoot.dataset && activeRoot.dataset.page) || doc.body?.dataset?.page || inferPageFromPath(url.pathname);
      document.body.dataset.page = page;
      dispatch('gees:page:ready', { url: key, page, root: activeRoot, main: activeRoot });

      if (!opts.replace) history.pushState({ geesPjax: true, url: key }, '', url.href);
      state.currentUrl = key;
      if (CONFIG.scrollTopOnNavigate && opts.scroll !== false) window.scrollTo(0, 0);

      dispatch('gees:router:navigated', { url: key });
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.warn('[GEES Router] Falling back to normal load:', err);
      location.href = url.href;
    } finally {
      state.navigating = false;
      setTimeout(() => setProgress(false), CONFIG.transitionMs);
    }
  }

  async function swapMain(currentMain, newMain) {
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await document.startViewTransition(() => currentMain.replaceWith(newMain)).finished.catch(() => {});
      return;
    }
    currentMain.style.opacity = '0';
    currentMain.style.transform = 'translate3d(0,4px,0)';
    currentMain.style.transition = `opacity ${CONFIG.transitionMs}ms linear, transform ${CONFIG.transitionMs}ms cubic-bezier(.16,1,.3,1)`;
    await new Promise(resolve => setTimeout(resolve, CONFIG.transitionMs));
    currentMain.replaceWith(newMain);
    newMain.style.opacity = '0';
    newMain.style.transform = 'translate3d(0,4px,0)';
    newMain.style.transition = `opacity ${CONFIG.transitionMs}ms linear, transform ${CONFIG.transitionMs}ms cubic-bezier(.16,1,.3,1)`;
    requestAnimationFrame(() => {
      newMain.style.opacity = '';
      newMain.style.transform = '';
      setTimeout(() => {
        newMain.style.transition = '';
      }, CONFIG.transitionMs + 20);
    });
  }

  function prefetch(anchor) {
    if (!isNavigableAnchor(anchor)) return;
    const key = canonicalUrl(anchor.href);
    if (state.prefetched.has(key) || state.cache.has(key) || key === state.currentUrl) return;
    state.prefetched.add(key);
    window.setTimeout(() => {
      getPage(anchor.href, { prefetch: true }).catch(() => {});
    }, CONFIG.prefetchDelay);
  }

  function bindEvents() {
    history.replaceState({ geesPjax: true, url: state.currentUrl }, '', location.href);

    document.addEventListener('click', event => {
      const anchor = event.target.closest && event.target.closest('a[href]');
      if (!isNavigableAnchor(anchor, event)) return;
      event.preventDefault();
      navigate(anchor.href);
    }, true);

    document.addEventListener('pointerenter', event => {
      const anchor = event.target.closest && event.target.closest('a[href]');
      if (anchor) prefetch(anchor);
    }, true);

    document.addEventListener('focusin', event => {
      const anchor = event.target.closest && event.target.closest('a[href]');
      if (anchor) prefetch(anchor);
    });

    window.addEventListener('popstate', () => {
      navigate(location.href, { replace: true });
    });
  }

  function injectStyles() {
    if ($('#gees-router-css')) return;
    const style = document.createElement('style');
    style.id = 'gees-router-css';
    style.textContent = `
      html.gees-pjax-loading #gees-pjax-root{pointer-events:none;}
      html.gees-pjax-loading .gees-header__inner{will-change:transform;}
      @media (prefers-reduced-motion: reduce){html.gees-pjax-loading #gees-pjax-root{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!history.pushState || !window.fetch || !window.DOMParser) return;
    markInitialManagedHead();
    injectStyles();
    bindEvents();
    dispatch('gees:router:ready', { url: state.currentUrl });
    const root = $('#gees-pjax-root');
    dispatch('gees:page:ready', { url: state.currentUrl, page: (root && root.dataset && root.dataset.page) || document.body.dataset.page || inferPageFromPath(location.pathname), root, main: root });
  }

  window.GEESRouter = {
    navigate,
    prefetch,
    refresh: () => dispatch('gees:router:navigated', { url: state.currentUrl }),
    cache: state.cache
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
