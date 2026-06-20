(function () {
  'use strict';

  if (window.GEES_HOMEPAGE_COUNTER_FALLBACK_V1) return;
  window.GEES_HOMEPAGE_COUNTER_FALLBACK_V1 = true;

  const selector = '.count-up[data-count]';

  function animateCounter(element) {
    if (!element || element.dataset.geesCounterFallbackDone === '1') return;

    const target = Number(element.dataset.count);
    if (!Number.isFinite(target) || target < 0) return;

    const suffix = element.dataset.suffix || '';
    const duration = Math.max(400, Number(element.dataset.duration || 900));
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    element.dataset.geesCounterFallbackDone = '1';
    element.setAttribute('aria-label', `${target.toLocaleString()}${suffix}`);

    if (reduceMotion) {
      element.textContent = `${target.toLocaleString()}${suffix}`;
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  function init() {
    const counters = Array.from(document.querySelectorAll(selector));
    if (!counters.length) return;

    const run = () => counters.forEach(animateCounter);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.15 });

      counters.forEach((counter) => observer.observe(counter));
      window.setTimeout(run, 1400);
    } else {
      run();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
