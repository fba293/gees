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

    if (scope.matches && scope.matches(TARGET_SELECTOR)) {
      nodes.push(scope);
    }

    if (scope.querySelectorAll) {
      scope.querySelectorAll(TARGET_SELECTOR).forEach((el) => nodes.push(el));
    }

    nodes.forEach((el) => {
      if (!el || el.classList.contains('gees-final-spotlight-target')) return;
      if (el.classList.contains('gees-no-spotlight')) return;
      if (el.closest('.gees-header')) return;

      el.classList.add('gees-final-spotlight-target');

      const group = el.closest(GROUP_SELECTOR) || el.parentElement;
      if (group && !group.classList.contains('gees-header')) {
        group.classList.add('gees-final-spotlight-group');
      }
    });
  }

  function getTargetsForEvent(target) {
    const group = target.closest('.gees-final-spotlight-group');

    if (!group) return [target];

    if (group !== activeGroup) {
      activeGroup = group;
      groupTargets = Array.from(
        group.querySelectorAll('.gees-final-spotlight-target')
      ).slice(0, 40);
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

    const target = hovered && hovered.closest
      ? hovered.closest('.gees-final-spotlight-target')
      : null;

    document.querySelectorAll('.gees-spotlight-active').forEach((el) => {
      el.classList.remove('gees-spotlight-active');
    });

    if (!target) return;

    target.classList.add('gees-spotlight-active');

    const targets = getTargetsForEvent(target);

    for (const item of targets) {
      setLocalVars(item, event);
    }
  }

  function onMove(event) {
    latestEvent = event;

    if (!frame) {
      frame = requestAnimationFrame(update);
    }
  }

  function reset() {
    latestEvent = null;
    activeGroup = null;
    groupTargets = [];

    document.querySelectorAll('.gees-spotlight-active').forEach((el) => {
      el.classList.remove('gees-spotlight-active');
    });
  }

  function observeNewContent() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) enhanceTargets(node);
        });
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    enhanceTargets(document);
    observeNewContent();

    const moveEvent = 'onpointerrawupdate' in window
      ? 'pointerrawupdate'
      : 'pointermove';

    window.addEventListener(moveEvent, onMove, { passive: true });

    if (moveEvent !== 'pointermove') {
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    window.addEventListener('pointerleave', reset, { passive: true });
    window.addEventListener('blur', reset, { passive: true });
    document.addEventListener('mouseleave', reset, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();