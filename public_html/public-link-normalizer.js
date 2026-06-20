(function () {
  'use strict';
  if (window.GEES_PUBLIC_LINK_NORMALIZER_V1) return;
  window.GEES_PUBLIC_LINK_NORMALIZER_V1 = true;

  const links = {
    'study-in-australia.html': '/destinations.html?country=australia',
    'study-in-canada.html': '/destinations.html?country=canada',
    'study-in-malaysia.html': '/destinations.html?country=malaysia',
    'study-in-uk.html': '/destinations.html?country=united-kingdom',
    'study-in-usa.html': '/destinations.html?country=usa',
    'study-in-china.html': '/destinations.html?country=china',
    'study-in-germany.html': '/destinations.html?country=germany',
    'study-in-ireland.html': '/destinations.html?country=ireland',
    'study-in-france.html': '/destinations.html?country=france',
    'study-in-sweden.html': '/destinations.html?country=sweden',
    'study-in-netherlands.html': '/destinations.html?country=netherlands',
    'study-in-singapore.html': '/destinations.html?country=singapore',
    'study-in-japan.html': '/destinations.html?country=japan',
    'study-in-turkey.html': '/destinations.html?country=turkey',
    'study-in-newzealand.html': '/destinations.html?country=new-zealand'
  };

  function normalize(root) {
    const scope = root || document;
    scope.querySelectorAll('.skip-link').forEach((node) => node.remove());
    scope.querySelectorAll('a[href]').forEach((anchor) => {
      const href = String(anchor.getAttribute('href') || '');
      const key = href.split('?')[0].split('#')[0].replace(/^\//, '').toLowerCase();
      if (links[key]) anchor.setAttribute('href', links[key]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => normalize(document), { once: true });
  } else {
    normalize(document);
  }

  document.addEventListener('gees:page:ready', (event) => normalize((event.detail && (event.detail.root || event.detail.main)) || document));
})();
