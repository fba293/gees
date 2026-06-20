/* GEES Homepage Search — resilient live/fallback search */
(function () {
  'use strict';

  if (window.GEES_INDEX_SEARCH_READY) return;
  window.GEES_INDEX_SEARCH_READY = true;

  const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxZchpNE9gS2Z8nVKJoGBq4Uip8i1rN2MN4usum0QBYD6pCUvGToSe4jo0L5aVg4Vpg/exec';
  const CACHE_KEY = 'gees_home_live_search_cache_v3';
  const CACHE_MS = 1000 * 60 * 60 * 12;
  const POPULAR_KEY = 'gees_home_popular_searches_v2';

  const staticItems = [
    ['course', 'Bachelor of Computer Science', 'Popular bachelor pathway', 'Bachelor', 'Malaysia', '/courses?search=Bachelor%20of%20Computer%20Science&q=Bachelor%20of%20Computer%20Science'],
    ['course', 'Bachelor of Business Administration', 'Business and management pathway', 'Bachelor', 'Malaysia', '/courses?search=Bachelor%20of%20Business%20Administration&q=Bachelor%20of%20Business%20Administration'],
    ['course', 'Bachelor of Engineering', 'Engineering pathway', 'Bachelor', 'Malaysia', '/courses?search=Bachelor%20of%20Engineering&q=Bachelor%20of%20Engineering'],
    ['course', 'Master of Data Science', 'Postgraduate technology pathway', 'Master', 'Malaysia', '/courses?search=Master%20of%20Data%20Science&q=Master%20of%20Data%20Science'],
    ['course', 'Master of Business Administration MBA', 'Postgraduate business pathway', 'Master', 'Malaysia', '/courses?search=MBA&q=MBA'],
    ['university', 'Asia Pacific University (APU)', 'Technology, business and innovation programs', 'University', 'Malaysia', '/universities?partner=Asia%20Pacific%20University%20(APU)'],
    ['university', "Taylor's University", 'Business, hospitality, computing and design', 'University', 'Malaysia', '/universities?partner=Taylor%27s%20University'],
    ['university', 'Sunway University', 'Business, science and technology programs', 'University', 'Malaysia', '/universities?partner=Sunway%20University'],
    ['destination', 'Study in Malaysia', 'Affordable, multicultural study destination', 'Destination', 'Malaysia', '/destinations.html?country=malaysia'],
    ['destination', 'Study in Canada', 'Post-study work and global university pathways', 'Destination', 'Canada', '/destinations.html?country=canada'],
    ['destination', 'Study in United Kingdom', 'Historic universities and global recognition', 'Destination', 'United Kingdom', '/destinations.html?country=united-kingdom'],
    ['destination', 'Study in Australia', 'Leading universities and student pathways', 'Destination', 'Australia', '/destinations.html?country=australia'],
    ['service', 'Student Visa Guidance', 'Document checklist and application guidance', 'Service', 'Global', '/services/visa-assistance'],
    ['service', 'Admission Support', 'University application and offer letter support', 'Service', 'Global', '/services/admission-support'],
    ['service', 'Student Accommodation', 'Housing and move-in support', 'Service', 'Malaysia', '/services/student-accommodation'],
    ['service', 'Flight Ticketing', 'Student and family ticketing support', 'Service', 'Global', '/services/flight-ticketing'],
    ['service', 'Airport Pickup', 'KLIA and campus arrival support', 'Service', 'Malaysia', '/services/airport-pickup-public-university-students'],
    ['service', 'Free Counselling', 'Talk to GEES counselors', 'Service', 'Bangladesh + Malaysia', '/contact-us']
  ].map(([type, title, subtitle, category, country, href]) => ({ type, title, subtitle, category, country, href, source: 'static' }));

  const typoMap = {
    malasiya: 'malaysia', malasya: 'malaysia', malaysiaa: 'malaysia',
    bachelar: 'bachelor', bachelors: 'bachelor', mastar: 'master', masters: 'master',
    computar: 'computer', compuer: 'computer', bussiness: 'business', buisness: 'business',
    univesity: 'university', universty: 'university', collage: 'college',
    engenearing: 'engineering', enginering: 'engineering', hospitallity: 'hospitality', managment: 'management'
  };

  function $ (selector, root) { return (root || document).querySelector(selector); }
  function $$ (selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
  function escapeHTML(value) { return String(value || '').replace(/[&<>\"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[char])); }
  function normalize(value) { return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function canonical(value) { return normalize(value).split(/\s+/).map(word => typoMap[word] || word).join(' ').trim(); }
  function icon(type) { return type === 'university' ? 'fa-building-columns' : type === 'destination' ? 'fa-earth-asia' : type === 'service' ? 'fa-headset' : 'fa-graduation-cap'; }

  function loadScript(src, key) {
    if (window[key] || document.querySelector(`script[src*="${src.split('?')[0]}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  }

  function getCached() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Array.isArray(cached.items) && Date.now() - cached.at < CACHE_MS) return cached.items;
    } catch (_) {}
    return null;
  }

  function setCached(items) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items })); } catch (_) {}
  }

  function rowValue(row, names) {
    const lower = Object.keys(row || {}).reduce((out, key) => { out[String(key).toLowerCase()] = row[key]; return out; }, {});
    for (const name of names) {
      const value = row && (row[name] ?? lower[String(name).toLowerCase()]);
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
  }

  function mapLiveRows(rows) {
    const items = [];
    (rows || []).forEach((row) => {
      const title = rowValue(row, ['program', 'course', 'course name', 'programme', 'programme name', 'name', 'subject']);
      const university = rowValue(row, ['university', 'institute', 'institution', 'college']);
      if (!title && !university) return;
      const level = rowValue(row, ['level', 'study level', 'degree']) || 'Course';
      const country = rowValue(row, ['country', 'destination']) || 'Global';
      const display = title || university;
      items.push({
        type: 'course', title: display, subtitle: [university, level, country].filter(Boolean).join(' · '),
        category: level, country, href: `/courses?search=${encodeURIComponent(display)}&q=${encodeURIComponent(display)}`,
        source: 'live'
      });
    });
    return items;
  }

  async function loadItems() {
    const cached = getCached();
    if (cached && cached.length) return cached.concat(staticItems);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(SHEET_API_URL, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Live search unavailable');
      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload : (Array.isArray(payload.courses) ? payload.courses : (Array.isArray(payload.data) ? payload.data : []));
      const live = mapLiveRows(rows);
      if (live.length) {
        setCached(live);
        return live.concat(staticItems);
      }
    } catch (_) {
      // The local data below keeps search useful when the sheet is unavailable.
    } finally {
      window.clearTimeout(timer);
    }
    return staticItems;
  }

  function score(item, query) {
    const q = canonical(query);
    if (!q) return 0;
    const haystack = canonical([item.title, item.subtitle, item.category, item.country].filter(Boolean).join(' '));
    const title = canonical(item.title);
    let total = 0;
    if (title === q) total += 100;
    if (title.startsWith(q)) total += 70;
    if (title.includes(q)) total += 55;
    if (haystack.includes(q)) total += 35;
    q.split(/\s+/).filter(Boolean).forEach((word) => {
      if (title.includes(word)) total += 18;
      if (haystack.includes(word)) total += 8;
    });
    return total + (item.source === 'live' ? 2 : 0);
  }

  function recordSearch(query) {
    const q = canonical(query);
    if (!q) return;
    try {
      const data = JSON.parse(localStorage.getItem(POPULAR_KEY) || '{}');
      data[q] = Number(data[q] || 0) + 1;
      localStorage.setItem(POPULAR_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function init() {
    registerServiceWorker();
    loadScript('/homepage-counter-fallback.js?v=15.4.0', 'GEES_HOMEPAGE_RUNTIME_REPAIR_V2');
    loadScript('/public-link-normalizer.js?v=15.4.0', 'GEES_PUBLIC_LINK_NORMALIZER_V1');

    const input = $('#mainSearchInput');
    const panel = $('#homeSearchSuggestions');
    const searchIcon = $('#searchIcon');
    const shell = input && input.closest('.command-bar');
    if (!input || !panel || !shell) return;

    let items = staticItems.slice();
    let results = [];
    let activeIndex = -1;

    function close() {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      activeIndex = -1;
    }

    function find(query) {
      const q = canonical(query);
      if (!q) return staticItems.slice(0, 7);
      return items.map((item) => ({ ...item, _score: score(item, q) }))
        .filter((item) => item._score > 0)
        .sort((a, b) => b._score - a._score || a.title.localeCompare(b.title))
        .slice(0, 9);
    }

    function render(query) {
      results = find(query);
      activeIndex = -1;
      input.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      const headline = query.trim() ? 'Search suggestions' : 'Popular searches';
      const source = items.some((item) => item.source === 'live') ? 'Live course data' : 'Smart suggestions';
      panel.innerHTML = `<div class="home-search-topline"><span>${headline}</span><small>${source}</small></div>${results.length ? results.map((item, index) => `<a class="home-search-item" role="option" id="home-search-option-${index}" data-index="${index}" href="${escapeHTML(item.href)}"><span class="home-search-icon"><i class="fas ${icon(item.type)}" aria-hidden="true"></i></span><span class="home-search-copy"><strong>${escapeHTML(item.title)}</strong><em>${escapeHTML(item.subtitle || item.country || item.category)}</em></span><span class="home-search-badge">${escapeHTML(item.category || item.type)}</span></a>`).join('') : `<div class="home-search-empty"><strong>No exact match found</strong><span>Try “Bachelor”, “MBA”, “Computer Science”, or “Malaysia”.</span><a href="/contact-us.html">Talk to a counselor</a></div>`}<div class="home-search-footer"><a href="/courses?search=${encodeURIComponent(query.trim())}&q=${encodeURIComponent(query.trim())}">View all matching courses</a></div>`;
    }

    function choose(query) {
      const q = query.trim();
      if (!q) { render(''); return; }
      recordSearch(q);
      const item = results[activeIndex] || results[0];
      window.location.href = item ? item.href : `/courses?search=${encodeURIComponent(q)}&q=${encodeURIComponent(q)}`;
    }

    function setActive(next) {
      const nodes = $$('.home-search-item', panel);
      if (!nodes.length) return;
      activeIndex = (next + nodes.length) % nodes.length;
      nodes.forEach((node, index) => node.classList.toggle('is-active', index === activeIndex));
      input.setAttribute('aria-activedescendant', `home-search-option-${activeIndex}`);
    }

    input.addEventListener('focus', () => render(input.value));
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); if (panel.hidden) render(input.value); setActive(activeIndex + 1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(activeIndex - 1); }
      else if (event.key === 'Escape') close();
      else if (event.key === 'Enter') { event.preventDefault(); choose(input.value); }
    });
    searchIcon && searchIcon.addEventListener('click', () => choose(input.value));
    panel.addEventListener('mousedown', (event) => {
      const link = event.target.closest('a.home-search-item');
      if (link) recordSearch(input.value || link.textContent || '');
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.command-bar') && !event.target.closest('#homeSearchSuggestions')) close();
    });

    loadItems().then((loaded) => {
      const seen = new Set();
      items = loaded.filter((item) => {
        const key = canonical(`${item.type} ${item.title} ${item.subtitle}`);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      if (document.activeElement === input && input.value.trim()) render(input.value);
    }).catch(() => { items = staticItems.slice(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
