/* =========================================================
   GEES BALANCED SPOTLIGHT — VISIBLE BUT NOT OVERPOWERING
   ========================================================= */

(function () {
  'use strict';

  if (window.GEES_BALANCED_SPOTLIGHT_LOADED) return;
  window.GEES_BALANCED_SPOTLIGHT_LOADED = true;

  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isTouch = window.matchMedia &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (reduceMotion || isTouch) return;

  const TARGET_SELECTOR = [
    '.yu-hero-panel',
    '.command-bar',
    '.hero-pill',
    '.yu-stats-grid > *',
    '.process-card',
    '.expert-card',
    '.review-card',
    '.gees-testimonial-glass',
    '.journey-full-card',
    '.home-consultation-card',
    '.country-item',
    '.result-card',
    '.article-card',
    '.logo-card',
    '.home-blogs-section article',
    '.why-gees-section .bg-white',
    '.gees-services-topline',
    '.gees-services-rail',
    '.gees-service-slide',
    '.brand-panel',
    '.login-card',
    '.gees-footer__social-link',
    '.process-cta',
    '.expert-btn',
    '.modal-btn',
    '.apply-btn',
    '.login-btn',
    '.home-consultation-primary',
    'a.inline-flex',
    'button'
  ].join(',');

  const GROUP_SELECTOR = [
    '.yu-hero-panel',
    '.hero-action-row',
    '.process-grid',
    '.expert-grid',
    '.slider-track',
    '.logo-track',
    '.login-grid',
    '.grid',
    '.home-section-inner',
    'section'
  ].join(',');

  let latestEvent = null;
  let frame = null;
  let activeGroup = null;
  let groupTargets = [];

  function enhanceTargets(root) {
    const scope = root || document;
    if (scope.nodeType !== 1 && scope.nodeType !== 9) return;
    const nodes = [];
    if (scope.matches && scope.matches(TARGET_SELECTOR)) nodes.push(scope);
    if (scope.querySelectorAll) scope.querySelectorAll(TARGET_SELECTOR).forEach((el) => nodes.push(el));
    nodes.forEach((el) => {
      if (!el || el.classList.contains('gees-final-spotlight-target')) return;
      if (el.classList.contains('gees-no-spotlight')) return;
      if (el.closest('.gees-header')) return;
      el.classList.add('gees-final-spotlight-target');
      const group = el.closest(GROUP_SELECTOR) || el.parentElement;
      if (group && !group.classList.contains('gees-header')) group.classList.add('gees-final-spotlight-group');
    });
  }

  function getTargetsForEvent(target) {
    const group = target.closest('.gees-final-spotlight-group');
    if (!group) return [target];
    if (group !== activeGroup) {
      activeGroup = group;
      groupTargets = Array.from(group.querySelectorAll('.gees-final-spotlight-target')).slice(0, 40);
    }
    return groupTargets.length ? groupTargets : [target];
  }

  function setLocalVars(el, event) {
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gees-card-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--gees-card-y', `${event.clientY - rect.top}px`);
  }

  function update() {
    frame = null;
    if (!latestEvent) return;
    const event = latestEvent;
    const hovered = document.elementFromPoint(event.clientX, event.clientY);
    const target = hovered && hovered.closest ? hovered.closest('.gees-final-spotlight-target') : null;
    document.querySelectorAll('.gees-spotlight-active').forEach((el) => el.classList.remove('gees-spotlight-active'));
    if (!target) return;
    target.classList.add('gees-spotlight-active');
    const targets = getTargetsForEvent(target);
    for (const item of targets) setLocalVars(item, event);
  }

  function onMove(event) {
    latestEvent = event;
    if (!frame) frame = requestAnimationFrame(update);
  }

  function reset() {
    latestEvent = null;
    activeGroup = null;
    groupTargets = [];
    document.querySelectorAll('.gees-spotlight-active').forEach((el) => el.classList.remove('gees-spotlight-active'));
  }

  function observeNewContent() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) enhanceTargets(node);
        });
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() {
    enhanceTargets(document);
    observeNewContent();
    const moveEvent = 'onpointerrawupdate' in window ? 'pointerrawupdate' : 'pointermove';
    window.addEventListener(moveEvent, onMove, { passive: true });
    if (moveEvent !== 'pointermove') window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', reset, { passive: true });
    window.addEventListener('blur', reset, { passive: true });
    document.addEventListener('mouseleave', reset, { passive: true });
  }

  window.GEESRefreshSpotlight = function GEESRefreshSpotlight(root) { enhanceTargets(root || document); };
  document.addEventListener('gees:page:ready', function (event) { enhanceTargets((event.detail && event.detail.main) || document); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

/* =========================================================
   GEES True PJAX Page Runtime v11.0.0
   ========================================================= */
(function(){
  'use strict';
  if(window.GEES_PAGE_RUNTIME_READY) return;
  window.GEES_PAGE_RUNTIME_READY = true;
  const runtime = { cleanups: [], currentPage: null };
  runtime.addCleanup = function(fn){ if(typeof fn==='function') runtime.cleanups.push(fn); };
  runtime.destroy = function(){
    while(runtime.cleanups.length){ try{ runtime.cleanups.pop()(); }catch(e){} }
    document.documentElement.classList.remove('gees-page-busy');
  };
  function refreshShared(root){
    try{ window.GEESRefreshSpotlight && window.GEESRefreshSpotlight(root||document); }catch(e){}
    try{ window.GEESFooterRefresh && window.GEESFooterRefresh(); }catch(e){}
    document.querySelectorAll('img:not([loading])').forEach(function(img){ img.loading='lazy'; });
    document.querySelectorAll('img:not([decoding])').forEach(function(img){ img.decoding='async'; });
  }
  window.initHome = function(root){ refreshShared(root); document.body.classList.add('gees-home-page'); };
  window.initServices = function(root){ refreshShared(root); };
  window.initCourses = function(root){ refreshShared(root); };
  window.initContact = function(root){ refreshShared(root); };
  window.initUniversity = function(root){ refreshShared(root); };
  window.initBlog = function(root){ refreshShared(root); };
  window.initDestinations = function(root){ refreshShared(root); };
  window.initThankYou = function(root){ refreshShared(root); };
  window.initError404 = function(root){ refreshShared(root); };
  function toFnName(page){
    if(page==='thank-you') return 'initThankYou';
    if(page==='404') return 'initError404';
    return 'init' + String(page||'page').split(/[^a-z0-9]+/i).filter(Boolean).map(function(part){return part.charAt(0).toUpperCase()+part.slice(1)}).join('');
  }
  window.GEESPageRuntime = runtime;
  window.GEESRunPageInit = function(page, root){
    runtime.currentPage = page || (root && root.dataset && root.dataset.page) || document.body.dataset.page || 'page';
    const fn = window[toFnName(runtime.currentPage)];
    if(typeof fn === 'function'){ try{ fn(root || document.getElementById('gees-pjax-root') || document); }catch(e){ console.warn('[GEES init]', runtime.currentPage, e); } }
    refreshShared(root || document);
  };
  document.addEventListener('gees:page:before-leave', function(){ runtime.destroy(); });
  document.addEventListener('gees:page:ready', function(e){ window.GEESRunPageInit((e.detail&&e.detail.page)||document.body.dataset.page, (e.detail&&e.detail.root)||(e.detail&&e.detail.main)); });
})();

/* GEES TRUE PJAX V12.8 INIT BRIDGE */
(function(){
  'use strict';
  if(window.GEES_PJAX_INIT_BRIDGE_V128) return;
  window.GEES_PJAX_INIT_BRIDGE_V128 = true;
  function root(){ return document.getElementById('gees-pjax-root') || document; }
  const oldInitHome = window.initHome;
  window.initHome = function(r){
    try{ if(typeof oldInitHome === 'function') oldInitHome(r || root()); }catch(e){}
    document.body.classList.add('gees-home-page');
    try{ window.GEESHomeV125 && typeof window.GEESHomeV125.init === 'function' && window.GEESHomeV125.init(); }catch(e){}
    try{ window.dispatchEvent(new Event('gees:pjax-navigated')); }catch(e){}
  };
  document.addEventListener('gees:page:before-leave', function(){ document.body.classList.remove('gees-home-page'); });
})();

/* GEES BATCH 1B RUNTIME SAFETY LAYER
   Makes old public HTML pages behave like the v12.8 PJAX structure until every large static file is fully synced. */
(function(){
  'use strict';
  if(window.GEES_BATCH_1B_RUNTIME_SAFETY) return;
  window.GEES_BATCH_1B_RUNTIME_SAFETY = true;

  function inferPage(){
    const path = location.pathname.replace(/\/index\.html$/i,'/').replace(/\.html$/i,'').replace(/^\/+|\/+$/g,'');
    if(!path) return 'home';
    if(path === 'contact-us' || path === 'contact') return 'contact';
    if(path === '404') return '404';
    return path.split('/')[0] || 'page';
  }

  function ensurePjaxRoot(){
    let root = document.getElementById('gees-pjax-root');
    if(!root){
      root = document.getElementById('main-content') || document.querySelector('main');
      if(root) root.id = 'gees-pjax-root';
    }
    if(root){
      root.dataset.geesPjaxView = 'true';
      if(!root.dataset.page) root.dataset.page = document.body.dataset.page || inferPage();
      document.body.dataset.page = root.dataset.page;
      if(root.getAttribute('aria-label') === 'main content') root.removeAttribute('aria-label');
    }
    return root;
  }

  function removeSkipLinks(){
    document.querySelectorAll('a[href="#main-content"], a[href="#gees-pjax-root"], .skip-link, [class*="skip-link"], [data-skip-link]').forEach(function(el){
      const txt = (el.textContent || '').toLowerCase();
      if(txt.includes('skip') || el.className.toString().toLowerCase().includes('skip')) el.remove();
    });
  }

  function ensureRouter(){
    if(window.GEES_ROUTER_READY || document.querySelector('script[src*="gees-router.js"]')) return;
    const s = document.createElement('script');
    s.src = '/gees-router.js?v=12.8.0';
    s.defer = true;
    document.body.appendChild(s);
  }

  function installStyle(){
    if(document.getElementById('gees-batch-1b-runtime-style')) return;
    const style = document.createElement('style');
    style.id = 'gees-batch-1b-runtime-style';
    style.textContent = `
      a[href="#main-content"], a[href="#gees-pjax-root"], .skip-link, [class*="skip-link"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}
      #gees-pjax-root{display:block;min-height:40vh;}
      body:not(.gees-home-page):not([data-page="home"]) #gees-pjax-root{padding-top:calc(var(--gees-header-safe,80px) + 10px);}
      body.gees-home-page #gees-pjax-root, body[data-page="home"] #gees-pjax-root{padding-top:0!important;margin-top:0!important;}
    `;
    document.head.appendChild(style);
  }

  function run(){
    installStyle();
    const root = ensurePjaxRoot();
    removeSkipLinks();
    ensureRouter();
    try{ document.dispatchEvent(new CustomEvent('gees:page:ready',{detail:{page:(root&&root.dataset&&root.dataset.page)||inferPage(),root:root,main:root,url:location.href}})); }catch(e){}
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();

  const mo = new MutationObserver(function(){ removeSkipLinks(); ensurePjaxRoot(); });
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();
