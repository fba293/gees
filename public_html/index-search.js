/* =========================================================
   GEES Home Search
   File: index-search.js
   Purpose: live Google Sheet search + fuzzy suggestions
   ========================================================= */
(function () {
  'use strict';

  if (window.GEES_INDEX_SEARCH_READY) return;
  window.GEES_INDEX_SEARCH_READY = true;

  const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxZchpNE9gS2Z8nVKJoGBq4Uip8i1rN2MN4usum0QBYD6pCUvGToSe4jo0L5aVg4Vpg/exec';
  const CACHE_KEY = 'gees_home_live_search_cache_v2';
  const CACHE_MS = 1000 * 60 * 60 * 12;
  const POPULAR_KEY = 'gees_home_popular_searches_v2';

  const staticItems = [
    { type: 'course', title: 'Bachelor of Computer Science', subtitle: 'Popular bachelor pathway', category: 'Bachelor', country: 'Malaysia', href: '/courses?search=Bachelor%20of%20Computer%20Science&q=Bachelor%20of%20Computer%20Science' },
    { type: 'course', title: 'Bachelor of Business Administration', subtitle: 'Business and management pathway', category: 'Bachelor', country: 'Malaysia', href: '/courses?search=Bachelor%20of%20Business%20Administration&q=Bachelor%20of%20Business%20Administration' },
    { type: 'course', title: 'Bachelor of Engineering', subtitle: 'Engineering pathway', category: 'Bachelor', country: 'Malaysia', href: '/courses?search=Bachelor%20of%20Engineering&q=Bachelor%20of%20Engineering' },
    { type: 'course', title: 'Master of Data Science', subtitle: 'Postgraduate technology pathway', category: 'Master', country: 'Malaysia', href: '/courses?search=Master%20of%20Data%20Science&q=Master%20of%20Data%20Science' },
    { type: 'course', title: 'Master of Business Administration MBA', subtitle: 'Postgraduate business pathway', category: 'Master', country: 'Malaysia', href: '/courses?search=MBA&q=MBA' },
    { type: 'course', title: 'Master of Finance', subtitle: 'Finance and business pathway', category: 'Master', country: 'Malaysia', href: '/courses?search=Master%20of%20Finance&q=Master%20of%20Finance' },
    { type: 'university', title: 'Asia Pacific University (APU)', subtitle: 'Technology, business and innovation programs', category: 'University', country: 'Malaysia', href: '/universities?partner=Asia%20Pacific%20University%20(APU)' },
    { type: 'university', title: "Taylor's University", subtitle: 'Business, hospitality, computing and design', category: 'University', country: 'Malaysia', href: '/universities?partner=Taylor%27s%20University' },
    { type: 'university', title: 'Sunway University', subtitle: 'Business, science and technology programs', category: 'University', country: 'Malaysia', href: '/universities?partner=Sunway%20University' },
    { type: 'destination', title: 'Study in Malaysia', subtitle: 'Affordable, multicultural study destination', category: 'Destination', country: 'Malaysia', href: '/destinations?country=malaysia' },
    { type: 'destination', title: 'Study in China', subtitle: 'Scholarships and growing global universities', category: 'Destination', country: 'China', href: '/destinations?country=china' },
    { type: 'destination', title: 'Study in United Kingdom', subtitle: 'Historic universities and global recognition', category: 'Destination', country: 'United Kingdom', href: '/destinations?country=united-kingdom' },
    { type: 'service', title: 'Student Visa Guidance', subtitle: 'Document checklist and application guidance', category: 'Service', country: 'Global', href: '/services/visa-assistance' },
    { type: 'service', title: 'Admission Support', subtitle: 'University application and offer letter support', category: 'Service', country: 'Global', href: '/services/admission-support' },
    { type: 'service', title: 'Student Accommodation', subtitle: 'Housing and move-in support', category: 'Service', country: 'Malaysia', href: '/services/student-accommodation' },
    { type: 'service', title: 'Flight Ticketing', subtitle: 'Student and family ticketing support', category: 'Service', country: 'Global', href: '/services/flight-ticketing' },
    { type: 'service', title: 'Courier Services', subtitle: 'Documents, parcels and cargo coordination', category: 'Service', country: 'Malaysia + Bangladesh', href: '/services/courier-services' },
    { type: 'service', title: 'Airport Pickup for Public University Students', subtitle: 'KLIA/KLIA2 pickup and campus drop-off planning', category: 'Service', country: 'Malaysia', href: '/services/airport-pickup-public-university-students' },
    { type: 'service', title: 'Tour Packages', subtitle: 'Travel itinerary and package planning', category: 'Service', country: 'Malaysia', href: '/services/tour-packages' },
    { type: 'service', title: 'Airbnb / Short-Stay Support', subtitle: 'Temporary accommodation guidance', category: 'Service', country: 'Malaysia', href: '/services/airbnb' },
    { type: 'service', title: 'Car Rental', subtitle: 'Private transport and chauffeur support', category: 'Service', country: 'Malaysia', href: '/services/car-rental' },
    { type: 'service', title: 'Money Transfer Guidance', subtitle: 'Tuition and living expense payment guidance', category: 'Service', country: 'Global', href: '/services/money-transfer' },
    { type: 'service', title: 'Linguaskill Preparation', subtitle: 'Cambridge Linguaskill preparation support', category: 'Service', country: 'Global', href: '/services/linguaskill-preparation' },
    { type: 'service', title: 'Free Counselling', subtitle: 'Talk to GEES counselors', category: 'Service', country: 'Bangladesh + Malaysia', href: '/contact-us' }
  ];

  const typoMap = new Map(Object.entries({
    malasiya: 'malaysia', malasya: 'malaysia', malaysiaa: 'malaysia',
    bachelar: 'bachelor', bachelors: 'bachelor', "bachelor's": 'bachelor',
    mastar: 'master', masters: 'master', "master's": 'master',
    computar: 'computer', compuer: 'computer', computeres: 'computer',
    bussiness: 'business', buisness: 'business', busines: 'business',
    univesity: 'university', universty: 'university', collage: 'college',
    engenearing: 'engineering', enginering: 'engineering', medicin: 'medicine',
    hospitallity: 'hospitality', managment: 'management', financ: 'finance'
  }));

  function $(selector, parent = document) { return parent.querySelector(selector); }
  function $all(selector, parent = document) { return Array.from(parent.querySelectorAll(selector)); }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function slugify(value) {
    return normalize(value).replace(/\s+/g, '-').replace(/^-|-$/g, '');
  }

  function canonicalQuery(query) {
    return normalize(query).split(/\s+/).map(token => typoMap.get(token) || token).join(' ').trim();
  }

  function fieldValue(row, names) {
    for (const name of names) {
      if (row && Object.prototype.hasOwnProperty.call(row, name) && row[name] !== '') return row[name];
    }
    const lowered = Object.keys(row || {}).reduce((acc, key) => { acc[key.toLowerCase().trim()] = row[key]; return acc; }, {});
    for (const name of names) {
      const value = lowered[name.toLowerCase().trim()];
      if (value !== undefined && value !== '') return value;
    }
    return '';
  }

  function courseFromRow(row, index) {
    const program = fieldValue(row, ['program', 'Program', 'Course', 'Course Name', 'Programme', 'Programme Name', 'Name', 'Subject']);
    const university = fieldValue(row, ['university', 'University', 'Institute', 'Institution', 'College']);
    if (!program && !university) return null;
    const level = fieldValue(row, ['level', 'Level', 'Study Level', 'Degree']);
    const country = fieldValue(row, ['country', 'Country', 'Destination']);
    const field = fieldValue(row, ['field', 'Field', 'Category', 'Discipline', 'Faculty']);
    const intake = fieldValue(row, ['intake', 'Intake']);
    const duration = fieldValue(row, ['duration', 'Duration']);
    const fee = fieldValue(row, ['fee', 'Fee', 'Tuition Fee', 'Tuition']);
    const title = program || university;
    return {
      type: 'course',
      title,
      subtitle: [university, field, level].filter(Boolean).join(' · ') || 'Course pathway',
      category: level || 'Course',
      country: country || 'Global',
      fee,
      intake,
      duration,
      href: '/courses?search=' + encodeURIComponent(title) + '&q=' + encodeURIComponent(title),
      searchText: [title, university, field, level, country, intake, duration].filter(Boolean).join(' '),
      source: 'live',
      index
    };
  }

  function liveItemsFromCourses(courses) {
    const items = [];
    const universities = new Map();
    const countries = new Map();
    courses.forEach((course, index) => {
      const c = courseFromRow(course, index);
      if (!c) return;
      items.push(c);
      const university = fieldValue(course, ['university', 'University', 'Institute', 'Institution', 'College']);
      const country = fieldValue(course, ['country', 'Country', 'Destination']);
      if (university && !universities.has(normalize(university))) {
        universities.set(normalize(university), {
          type: 'university', title: university, subtitle: [country, 'University partner'].filter(Boolean).join(' · '), category: 'University', country: country || 'Global', href: '/universities?partner=' + encodeURIComponent(university), searchText: [university, country].filter(Boolean).join(' '), source: 'live'
        });
      }
      if (country && !countries.has(normalize(country))) {
        countries.set(normalize(country), {
          type: 'destination', title: 'Study in ' + country, subtitle: 'Explore courses and universities', category: 'Destination', country, href: '/destinations?country=' + slugify(country), searchText: country + ' study destination university courses', source: 'live'
        });
      }
    });
    return items.concat(Array.from(universities.values()), Array.from(countries.values()));
  }

  function getCached() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.items && Date.now() - cached.at < CACHE_MS) return cached.items;
    } catch (_) {}
    return null;
  }

  function setCached(items) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items })); } catch (_) {}
  }

  async function fetchWithTimeout(url, timeout = 7000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try { return await fetch(url, { signal: controller.signal, cache: 'no-store' }); }
    finally { clearTimeout(timer); }
  }

  async function loadItems() {
    const cached = getCached();
    if (cached && cached.length) return cached.concat(staticItems);
    try {
      const response = await fetchWithTimeout(SHEET_API_URL, 7500);
      if (!response.ok) throw new Error('Sheet API unavailable');
      const data = await response.json();
      const rows = Array.isArray(data) ? data : (Array.isArray(data.courses) ? data.courses : (Array.isArray(data.data) ? data.data : []));
      const live = liveItemsFromCourses(rows);
      if (live.length) {
        setCached(live);
        return live.concat(staticItems);
      }
    } catch (_) {
      // Fall through to local search data.
    }
    try {
      const response = await fetch('search-data.json', { cache: 'force-cache' });
      if (response.ok) {
        const data = await response.json();
        const local = Array.isArray(data) ? data : Object.values(data).flat().filter(Boolean);
        const mapped = local.map((item) => ({
          type: item.type || item.category || 'course',
          title: item.title || item.program || item.name || item.course || 'GEES result',
          subtitle: item.subtitle || item.university || item.description || item.country || 'GEES pathway',
          category: item.category || item.level || 'Result',
          country: item.country || 'Global',
          href: item.href || item.url || '/courses?search=' + encodeURIComponent(item.title || item.program || item.name || ''),
          searchText: [item.title, item.program, item.name, item.university, item.country, item.level, item.field].filter(Boolean).join(' '),
          source: 'local'
        }));
        return mapped.concat(staticItems);
      }
    } catch (_) {}
    return staticItems;
  }

  function scoreItem(item, query) {
    const q = canonicalQuery(query);
    if (!q) return 0;
    const hay = normalize([item.title, item.subtitle, item.category, item.country, item.searchText].filter(Boolean).join(' '));
    const title = normalize(item.title);
    const terms = q.split(/\s+/).filter(Boolean);
    let score = 0;
    if (title === q) score += 120;
    if (title.startsWith(q)) score += 80;
    if (title.includes(q)) score += 60;
    if (hay.includes(q)) score += 40;
    for (const term of terms) {
      if (title.includes(term)) score += 20;
      if (hay.includes(term)) score += 10;
      if (fuzzyIncludes(hay, term)) score += 5;
    }
    if (/bachelor|undergraduate|honours|hons|bsc|ba|bba/i.test(q) && /bachelor|undergraduate|bsc|bba|honours/i.test(hay)) score += 24;
    if (/master|postgraduate|mba|msc|ma/i.test(q) && /master|postgraduate|mba|msc|ma/i.test(hay)) score += 24;
    if (item.source === 'live') score += 4;
    return score;
  }

  function fuzzyIncludes(hay, needle) {
    if (!needle || needle.length < 4) return false;
    let i = 0;
    for (const char of hay) {
      if (char === needle[i]) i += 1;
      if (i >= needle.length) return true;
    }
    return false;
  }

  function highlight(text, query) {
    const q = canonicalQuery(query);
    if (!q) return escapeHtml(text);
    let output = escapeHtml(text);
    q.split(/\s+/).filter(w => w.length > 1).slice(0, 4).forEach(word => {
      const re = new RegExp('(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      output = output.replace(re, '<mark>$1</mark>');
    });
    return output;
  }

  function trackPopular(query) {
    const clean = canonicalQuery(query);
    if (!clean) return;
    try {
      const data = JSON.parse(localStorage.getItem(POPULAR_KEY) || '{}');
      data[clean] = (data[clean] || 0) + 1;
      localStorage.setItem(POPULAR_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function iconFor(type) {
    if (type === 'university') return 'fa-building-columns';
    if (type === 'destination') return 'fa-earth-asia';
    if (type === 'service') return 'fa-headset';
    return 'fa-graduation-cap';
  }

  ready(async function initHomeSearch() {
    const input = $('#mainSearchInput');
    const icon = $('#searchIcon');
    const shell = input && input.closest('.command-bar');
    const panel = $('#homeSearchSuggestions');
    if (!input || !shell || !panel) return;

    shell.classList.add('is-search-ready');
    if (icon) icon.className = 'fa-solid fa-magnifying-glass';

    let allItems = staticItems;
    let activeIndex = -1;
    let lastResults = [];

    loadItems().then(items => { allItems = dedupe(items); if (document.activeElement === input && input.value.trim()) render(input.value); });

    function dedupe(items) {
      const seen = new Set();
      return items.filter(item => {
        const key = normalize(item.type + ' ' + item.title + ' ' + item.subtitle);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    function resultsFor(query) {
      const q = canonicalQuery(query);
      if (!q) return staticItems.slice(0, 7);
      return allItems.map(item => ({ ...item, _score: scoreItem(item, q) }))
        .filter(item => item._score > 0)
        .sort((a, b) => b._score - a._score || String(a.title).localeCompare(String(b.title)))
        .slice(0, 9);
    }

    function render(query) {
      lastResults = resultsFor(query);
      activeIndex = -1;
      input.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      panel.innerHTML = `
        <div class="home-search-topline">
          <span>${query.trim() ? 'Search suggestions' : 'Popular searches'}</span>
          <small>${allItems.some(item => item.source === 'live') ? 'Live course data' : 'Smart suggestions'}</small>
        </div>
        ${lastResults.length ? lastResults.map((item, index) => `
          <a class="home-search-item" role="option" id="home-search-option-${index}" data-index="${index}" href="${escapeHtml(item.href)}">
            <span class="home-search-icon"><i class="fas ${iconFor(item.type)}" aria-hidden="true"></i></span>
            <span class="home-search-copy"><strong>${highlight(item.title, query)}</strong><em>${highlight(item.subtitle || item.country || item.category || '', query)}</em></span>
            <span class="home-search-badge">${escapeHtml(item.category || item.type)}</span>
          </a>`).join('') : `
          <div class="home-search-empty">
            <strong>No exact match found</strong>
            <span>Try “Bachelor”, “MBA”, “Computer Science”, “Malaysia” or ask a GEES counselor.</span>
            <a href="/contact-us">Talk to counselor</a>
          </div>`}
        <div class="home-search-footer"><a href="/courses?search=${encodeURIComponent(query.trim())}&q=${encodeURIComponent(query.trim())}">View all matching courses</a></div>`;
    }

    function closePanel() {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
    }

    function submit(query) {
      const q = query.trim();
      if (!q) { render(''); return; }
      trackPopular(q);
      const first = lastResults[activeIndex] || lastResults[0];
      if (first && first.href) location.href = first.href;
      else location.href = '/courses?search=' + encodeURIComponent(q) + '&q=' + encodeURIComponent(q);
    }

    function updateActive(next) {
      const items = $all('.home-search-item', panel);
      if (!items.length) return;
      activeIndex = (next + items.length) % items.length;
      items.forEach((item, i) => item.classList.toggle('is-active', i === activeIndex));
      input.setAttribute('aria-activedescendant', 'home-search-option-' + activeIndex);
    }

    input.addEventListener('focus', () => render(input.value));
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); if (panel.hidden) render(input.value); updateActive(activeIndex + 1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); updateActive(activeIndex - 1); }
      else if (event.key === 'Escape') { closePanel(); }
      else if (event.key === 'Enter') { event.preventDefault(); submit(input.value); }
    });
    icon?.addEventListener('click', () => submit(input.value));
    shell.addEventListener('click', (event) => { if (event.target !== input) input.focus(); });
    panel.addEventListener('mousedown', (event) => {
      const link = event.target.closest('a.home-search-item');
      if (!link) return;
      const index = Number(link.dataset.index || 0);
      const item = lastResults[index];
      if (item) trackPopular(input.value || item.title);
    });
    document.addEventListener('click', (event) => {
      if (event.target.closest('.command-bar') || event.target.closest('#homeSearchSuggestions')) return;
      closePanel();
    });
  });
})();
