/* GEES Universal Header — header.js
   Self-contained universal header. Add to any page:
   <script src="header.js" defer></script>
*/
(function () {
  'use strict';

  if (window.GEES_HEADER_LOADED) return;
  window.GEES_HEADER_LOADED = true;

  const CONFIG = {
    version: '8.0.0',
    placeholderId: 'gees-header-placeholder',
    themeKey: 'gees_theme',
    logoText: 'GEES',
    logoHref: 'index.html',
    applyUrl: 'contact-us.html',
    phoneDisplay: '+880 1805-529578',
    phoneHref: 'tel:+8801805529578',
    whatsappHref: 'https://wa.me/601112376224?text=Hello%20GEES%2C%20I%20need%20study%20abroad%20guidance.',

    nav: [
      { label: 'Universities', href: 'universities.html', match: ['universities.html'] },
      { label: 'Courses', href: 'courses.html', match: ['courses.html', 'course.html'] },
      { label: 'Country', href: 'destinations.html', dropdown: 'countries', matchPrefix: ['study-in-', 'destinations'] },
      { label: 'Service', href: 'services.html', dropdown: 'services', matchPrefix: ['admission-', 'school-admission', 'student-referral', 'visa-', 'dependent-', 'tourist-', 'mm2h-', 'student-accommodation', 'health-insurance', 'flight-ticketing', 'airport-pickup-', 'courier-', 'tour-packages', 'airbnb', 'car-rental', 'money-transfer', 'ielts-', 'pte-', 'linguaskill-', 'b2b-', 'services'] },
      { label: 'Blog', href: 'blog.html', match: ['blog.html'] },
      { label: 'Contact', href: 'contact-us.html', match: ['contact-us.html', 'contact.html'] }
    ],

    countries: [
      { group: 'Popular', items: [
        ['Australia', 'study-in-australia.html', '🇦🇺'],
        ['Canada', 'study-in-canada.html', '🇨🇦'],
        ['Malaysia', 'study-in-malaysia.html', '🇲🇾'],
        ['United Kingdom', 'study-in-uk.html', '🇬🇧'],
        ['USA', 'study-in-usa.html', '🇺🇸']
      ] },
      { group: 'Europe', items: [
        ['Germany', 'study-in-germany.html', '🇩🇪'],
        ['Ireland', 'study-in-ireland.html', '🇮🇪'],
        ['France', 'study-in-france.html', '🇫🇷'],
        ['Sweden', 'study-in-sweden.html', '🇸🇪'],
        ['Netherlands', 'study-in-netherlands.html', '🇳🇱']
      ] },
      { group: 'Asia & More', items: [
        ['China', 'study-in-china.html', '🇨🇳'],
        ['Singapore', 'study-in-singapore.html', '🇸🇬'],
        ['Japan', 'study-in-japan.html', '🇯🇵'],
        ['Turkey', 'study-in-turkey.html', '🇹🇷'],
        ['New Zealand', 'study-in-newzealand.html', '🇳🇿']
      ] }
    ],

    services: [
      { group: 'Admissions', items: [
        ['Admission Support', 'admission-support.html', '🎓'],
        ['School Admission', 'school-admission.html', '🏫'],
        ['Student Referral', 'student-referral.html', '🤝']
      ] },
      { group: 'Visa & Immigration', items: [
        ['Student Visa', 'visa-assistance.html', '🛂'],
        ['Dependent Visa', 'dependent-visa.html', '👨‍👩‍👧'],
        ['Tourist Visa', 'tourist-visa.html', '✈️'],
        ['MM2H Program', 'mm2h-program.html', '🏡']
      ] },
      { group: 'Arrival & Travel', items: [
        ['Accommodation', 'student-accommodation.html', '🛏️'],
        ['Health Insurance', 'health-insurance.html', '❤️'],
        ['Flight Ticketing', 'flight-ticketing.html', '🎫'],
        ['Airport Pickup', 'airport-pickup-public-university-students.html', '🚕'],
        ['Tour Packages', 'tour-packages.html', '🧳'],
        ['Car Rental', 'car-rental.html', '🚗']
      ] },
      { group: 'Living & Support', items: [
        ['Courier Services', 'courier-services.html', '📦'],
        ['Airbnb / Short Stay', 'airbnb.html', '🏠'],
        ['Money Transfer', 'money-transfer.html', '💸']
      ] },
      { group: 'Tests & Partners', items: [
        ['IELTS Preparation', 'ielts-preparation.html', '🎙️'],
        ['PTE Preparation', 'pte-preparation.html', '🗣️'],
        ['Linguaskill Prep', 'linguaskill-preparation.html', '📘'],
        ['B2B Partnership', 'b2b-partnership.html', '🏢']
      ] }
    ],

    portals: [
      { group: 'Student', items: [
        ['Student Login', '/portal/auth/student-login.html', '👤'],
        ['Create Account', '/portal/auth/student-signup.html', '✨']
      ] },
      { group: 'Agent / Staff', items: [
        ['Agent Login', '/portal/auth/agent-login.html', '🤝'],
        ['Staff Login', '/portal/auth/staff-login.html', '🛡️'],
        ['Admin Login', '/portal/auth/admin-login.html', '👑']
      ] }
    ],

    social: [
      ['Facebook', 'https://www.facebook.com/globaleduexpert', 'fab fa-facebook-f'],
      ['Instagram', 'https://www.instagram.com/global.eduexpert', 'fab fa-instagram'],
      ['LinkedIn', 'https://www.linkedin.com/company/globaleduexpert', 'fab fa-linkedin-in'],
      ['TikTok', 'https://www.tiktok.com/@globaleduexpert', 'fab fa-tiktok'],
      ['WhatsApp', 'https://wa.me/601112376224', 'fab fa-whatsapp'],
      ['Facebook Group', 'https://www.facebook.com/groups/bsim.official', 'fas fa-users'],
      ['Messenger', 'https://www.facebook.com/messages/t/globaleduexpert/', 'fab fa-facebook-messenger']
    ]
  };

  const SELECTORS = {
    header: '#geesUniversalHeader',
    drawer: '#geesMobileDrawer',
    overlay: '#geesDrawerOverlay',
    hamburger: '#geesHamburger',
    search: '#geesSearchPanel',
    searchInput: '#geesGlobalSearch',
    searchResults: '#geesSearchResults',
    drawerSearch: '#geesDrawerSearch',
    drawerResults: '#geesDrawerSearchResults',
    drawerDefault: '#geesDrawerDefaultMenu',
    live: '#geesLiveRegion'
  };

  const state = {
    initialized: false,
    lastFocus: null,
    previousOverflow: '',
    previousPaddingRight: '',
    cleanup: [],
    currentOpenDropdown: null,
    lastScrollY: 0,
    scrollTicking: false,
    hoverOpenTimer: null,
    hoverCloseTimer: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));
  }

  function on(target, type, handler, options) {
    if (!target) return;
    target.addEventListener(type, handler, options);
    state.cleanup.push(() => target.removeEventListener(type, handler, options));
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function announce(message) {
    const live = $(SELECTORS.live);
    if (!live) return;
    live.textContent = '';
    window.setTimeout(() => { live.textContent = message; }, 20);
  }

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function ensurePlaceholder() {
    let placeholder = document.getElementById(CONFIG.placeholderId);
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.id = CONFIG.placeholderId;
      document.body.insertAdjacentElement('afterbegin', placeholder);
    }
    return placeholder;
  }

  function ensureStylesheet(id, href) {
    if (document.getElementById(id) || document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.referrerPolicy = 'no-referrer';
    document.head.appendChild(link);
  }

  function ensureAssets() {
    ensureStylesheet('gees-fontawesome-css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
    ensureStylesheet('gees-header-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&family=Cormorant+Garamond:wght@600;700&display=swap');
  }

  function getInitialTheme() {
    const saved = storageGet(CONFIG.themeKey);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeIcon(theme) {
    const btn = $('[data-gees-theme-toggle]');
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.dataset.themeState = isDark ? 'dark' : 'light';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  function setTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.add('gees-theme-is-switching');
    document.documentElement.setAttribute('data-theme', next);
    storageSet(CONFIG.themeKey, next);
    updateThemeIcon(next);
    window.setTimeout(() => document.documentElement.classList.remove('gees-theme-is-switching'), 430);
    announce(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
    emit('gees:theme-change', { theme: next });
  }

  function iconChevron() {
    return '<svg class="gees-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.25 6 7.75l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function buildSearchIndex() {
    const rows = [];
    CONFIG.nav.forEach(item => rows.push({ label: item.label, href: item.href, group: 'Page', icon: 'fa-arrow-right' }));
    CONFIG.countries.forEach(group => group.items.forEach(([label, href, icon]) => rows.push({ label, href, group: 'Country', emoji: icon, icon: 'fa-globe' })));
    CONFIG.services.forEach(group => group.items.forEach(([label, href, icon]) => rows.push({ label, href, group: 'Service', emoji: icon, icon: 'fa-sparkles' })));
    CONFIG.portals.forEach(group => group.items.forEach(([label, href, icon]) => rows.push({ label, href, group: 'Portal', emoji: icon, icon: 'fa-circle-user' })));
    rows.push({ label: 'Apply Now', href: CONFIG.applyUrl, group: 'Application', icon: 'fa-paper-plane' });
    return rows;
  }

  const SEARCH_INDEX = buildSearchIndex();

  function dropdownGroups(groups, extraClass = '') {
    return `
      <div class="gees-menu__grid ${extraClass}">
        ${groups.map(group => `
          <section class="gees-menu__col">
            <h4>${escapeHTML(group.group)}</h4>
            ${group.items.map(([label, href, icon]) => `
              <a href="${escapeHTML(href)}" data-menu-search-item data-search-label="${escapeHTML(label.toLowerCase())}">
                <span><b>${escapeHTML(icon)}</b> ${escapeHTML(label)}</span>
                <i class="fas fa-arrow-right" aria-hidden="true"></i>
              </a>
            `).join('')}
          </section>
        `).join('')}
      </div>
    `;
  }

  function buildNav() {
    return CONFIG.nav.map(item => {
      const cls = 'gees-nav__link';
      if (!item.dropdown) {
        return `<a class="${cls}" href="${escapeHTML(item.href)}" data-nav-link="${escapeHTML(item.label)}">${escapeHTML(item.label)}</a>`;
      }

      const groups = item.dropdown === 'countries' ? CONFIG.countries : CONFIG.services;
      const gridClass = item.dropdown === 'services' ? 'gees-service-grid' : '';
      const footerText = item.dropdown === 'countries' ? 'Explore study destinations with profile-based guidance.' : 'From admission to arrival, all services in one place.';

      return `
        <div class="gees-dropdown" data-dropdown="${escapeHTML(item.dropdown)}">
          <a class="${cls} gees-trigger" href="${escapeHTML(item.href)}" aria-haspopup="true" aria-expanded="false" data-nav-link="${escapeHTML(item.label)}">
            ${escapeHTML(item.label)} ${iconChevron()}
          </a>
          <div class="gees-menu" role="menu" aria-label="${escapeHTML(item.label)} menu">
            <div class="gees-menu__panel">
              ${dropdownGroups(groups, gridClass)}
              <div class="gees-menu__footer">
                <span>${escapeHTML(footerText)}</span>
                <a href="${escapeHTML(item.href)}">View all →</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function buildPortalMenu() {
    return `
      <div class="gees-dropdown gees-portal" data-dropdown="portal">
        <button class="gees-portal-btn" type="button" aria-haspopup="true" aria-expanded="false" data-nav-link="Portal">
          <i class="fas fa-circle-user" aria-hidden="true"></i>
          <span>Portal</span>
          ${iconChevron()}
        </button>
        <div class="gees-menu gees-menu--portal" role="menu" aria-label="Portal menu">
          <div class="gees-menu__panel">
            ${dropdownGroups(CONFIG.portals, 'gees-portal-grid')}
          </div>
        </div>
      </div>
    `;
  }

  function buildSocialLinks() {
    return CONFIG.social.map(([label, href, icon]) => `
      <a class="gees-drawer__social" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(label)}">
        <i class="${escapeHTML(icon)}" aria-hidden="true"></i>
      </a>
    `).join('');
  }

  function drawerLink(label, href) {
    return `
      <a class="gees-drawer__link" href="${escapeHTML(href)}" data-drawer-menu-item data-search-label="${escapeHTML(label.toLowerCase())}">
        <span>${escapeHTML(label)}</span>
        <i class="fas fa-arrow-right" aria-hidden="true"></i>
      </a>
    `;
  }

  function drawerAccordion(title, groups) {
    return `
      <section class="gees-accordion" data-mobile-accordion data-drawer-menu-item data-search-label="${escapeHTML(title.toLowerCase())}">
        <button class="gees-accordion__button" type="button" aria-expanded="false">
          <span>${escapeHTML(title)}</span>${iconChevron()}
        </button>
        <div class="gees-accordion__panel">
          <div class="gees-accordion__inner">
            ${groups.map(group => `
              <div class="gees-drawer__group-title">${escapeHTML(group.group)}</div>
              ${group.items.map(([label, href, icon]) => `
                <a href="${escapeHTML(href)}" data-drawer-menu-item data-search-label="${escapeHTML(label.toLowerCase())}">${escapeHTML(icon)} ${escapeHTML(label)}</a>
              `).join('')}
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function buildDrawerMenu() {
    return `
      ${drawerLink('Universities', 'universities.html')}
      ${drawerAccordion('Country', CONFIG.countries)}
      ${drawerAccordion('Service', CONFIG.services)}
      ${drawerLink('Blog', 'blog.html')}
      ${drawerLink('Contact', 'contact-us.html')}
      ${drawerAccordion('Portal', CONFIG.portals)}
    `;
  }

  function renderResults(query, target, context = 'desktop') {
    const root = typeof target === 'string' ? $(target) : target;
    if (!root) return;

    const q = String(query || '').trim().toLowerCase();
    const data = !q
      ? SEARCH_INDEX.filter(item => ['Universities', 'Country', 'Service', 'Blog', 'Contact', 'Apply Now'].includes(item.label)).slice(0, 6)
      : SEARCH_INDEX.filter(item => `${item.label} ${item.group}`.toLowerCase().includes(q)).slice(0, 9);

    if (!data.length) {
      root.innerHTML = `<div class="gees-search-empty">No results found. Try “visa”, “Malaysia”, “IELTS”, or “universities”.</div>`;
      return;
    }

    root.innerHTML = data.map(item => `
      <a class="gees-search-result" href="${escapeHTML(item.href)}">
        <span class="gees-search-result__icon">${item.emoji ? escapeHTML(item.emoji) : `<i class="fas ${escapeHTML(item.icon)}" aria-hidden="true"></i>`}</span>
        <span class="gees-search-result__copy">
          <strong>${escapeHTML(item.label)}</strong>
          <small>${escapeHTML(item.group)}</small>
        </span>
        <i class="fas fa-arrow-right" aria-hidden="true"></i>
      </a>
    `).join('');
  }

  function styles() {
    return `
<style id="gees-universal-header-css">
@layer gees-header {
  :root {
    --gees-h: clamp(62px, 5.7vw, 74px);
    --gees-top: 0px;
    --gees-x: clamp(10px, 1.55vw, 26px);
    --gees-container: 1640px;
    --gees-logo-col: clamp(170px, 13vw, 235px);
    --gees-actions-col: max-content;
    --gees-logo-desktop: clamp(31px, 2.35vw, 44px);
    --gees-logo-mobile: clamp(34px, 9.8vw, 44px);
    --gees-mobile-action: 44px;
    --gees-mobile-gap: 7px;
    --gees-text: #0f172a;
    --gees-text-soft: #334155;
    --gees-muted: #7a8494;
    --gees-bg: rgba(255,255,255,.94);
    --gees-bg-solid: #ffffff;
    --gees-card: rgba(255,255,255,.96);
    --gees-border: rgba(15,23,42,.10);
    --gees-border-strong: rgba(15,23,42,.18);
    --gees-blue: #003366;
    --gees-blue-2: #1d4ed8;
    --gees-gold: #ffd21a;
    --gees-gold-2: #f5c542;
    --gees-red: #d82329;
    --gees-logo-a: #284c56;
    --gees-logo-b: #6e7d6c;
    --gees-logo-c: #c1ae63;
    --gees-shadow: 0 10px 28px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.78);
    --gees-shadow-pop: 0 24px 70px rgba(15,23,42,.14), inset 0 1px 0 rgba(255,255,255,.78);
    --gees-ease: cubic-bezier(.2,.8,.2,1);
    --gees-ease-snap: cubic-bezier(.16,1,.3,1);
    --gees-ease-press: cubic-bezier(.18,.89,.32,1.28);
    --gees-z-search: 9991;
    --gees-z-dropdown: 9992;
    --gees-z-overlay: 9993;
    --gees-z-drawer: 9994;
    --gees-z-header: 9995;
  }

  [data-theme="dark"] {
    --gees-text: #f8fafc;
    --gees-text-soft: #cbd5e1;
    --gees-muted: #94a3b8;
    --gees-bg: rgba(15,23,42,.92);
    --gees-bg-solid: #0f172a;
    --gees-card: rgba(15,23,42,.94);
    --gees-border: rgba(255,255,255,.12);
    --gees-border-strong: rgba(255,255,255,.20);
    --gees-logo-a: #e8f3f6;
    --gees-logo-b: #d8e3d5;
    --gees-logo-c: #ffd96a;
    --gees-shadow: 0 14px 36px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.07);
    --gees-shadow-pop: 0 28px 84px rgba(0,0,0,.46), inset 0 1px 0 rgba(255,255,255,.08);
  }

  html.gees-theme-is-switching,
  html.gees-theme-is-switching * {
    transition: background-color .42s var(--gees-ease), color .42s var(--gees-ease), border-color .42s var(--gees-ease), box-shadow .42s var(--gees-ease) !important;
  }

  .gees-sr-only,
  .sr-only {
    position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;
  }

  .skip-to-content {
    position:fixed;top:12px;left:12px;z-index:100000;transform:translate3d(0,-150%,0);padding:10px 15px;border-radius:999px;background:var(--gees-text);color:var(--gees-bg-solid);text-decoration:none;font:800 13px/1 Inter,system-ui,sans-serif;transition:transform .24s var(--gees-ease);
  }
  .skip-to-content:focus-visible { transform:translate3d(0,0,0); outline:3px solid var(--gees-gold); outline-offset:3px; }

  .gees-header { position:fixed; top:var(--gees-top); left:var(--gees-x); right:var(--gees-x); height:var(--gees-h); z-index:var(--gees-z-header); color:var(--gees-text); pointer-events:none; transform:translate3d(0,0,0); opacity:1; will-change:transform,opacity; transition:transform .28s var(--gees-ease), opacity .2s var(--gees-ease); }
  .gees-header.is-hidden { transform:translate3d(0,calc(-1 * (var(--gees-h) + 16px)),0); opacity:.99; }
  .gees-header.is-scrolled .gees-header__inner { box-shadow:var(--gees-shadow-pop); border-color:var(--gees-border-strong); }
  body[data-gees-header-transparent] .gees-header:not(.is-scrolled) .gees-header__inner { background:rgba(255,255,255,.58); box-shadow:none; }
  [data-theme="dark"] body[data-gees-header-transparent] .gees-header:not(.is-scrolled) .gees-header__inner { background:rgba(15,23,42,.54); }

  .gees-header__inner { position:relative; width:min(100%,var(--gees-container)); height:100%; margin:0 auto; padding:clamp(7px,.6vw,10px) clamp(10px,1vw,17px); display:grid; grid-template-columns:var(--gees-logo-col) minmax(0,1fr) var(--gees-actions-col); align-items:center; gap:clamp(16px,2vw,38px); border:1px solid var(--gees-border); border-radius:999px; background:var(--gees-bg); box-shadow:var(--gees-shadow); pointer-events:auto; backdrop-filter:blur(20px) saturate(150%); -webkit-backdrop-filter:blur(20px) saturate(150%); overflow:visible; }

  .gees-header__motion-pill { position:absolute; left:0; top:0; width:var(--gees-pill-w,0px); height:var(--gees-pill-h,0px); border-radius:999px; background:linear-gradient(135deg,rgba(255,210,26,.18),rgba(37,99,235,.08)); border:1px solid rgba(255,210,26,.25); box-shadow:0 10px 26px rgba(15,23,42,.07), inset 0 1px 0 rgba(255,255,255,.70); transform:translate3d(var(--gees-pill-x,0px),var(--gees-pill-y,0px),0) scale(.94); opacity:0; pointer-events:none; z-index:0; transition:transform .36s var(--gees-ease-snap), width .36s var(--gees-ease-snap), height .36s var(--gees-ease-snap), opacity .18s var(--gees-ease); }
  .gees-header__inner.has-dropdown-motion .gees-header__motion-pill { opacity:1; transform:translate3d(var(--gees-pill-x,0px),var(--gees-pill-y,0px),0) scale(1); }
  .gees-logo,.gees-nav,.gees-actions { position:relative; z-index:1; }
  [data-theme="dark"] .gees-header__motion-pill { background:linear-gradient(135deg,rgba(255,210,26,.16),rgba(96,165,250,.10)); border-color:rgba(255,210,26,.22); box-shadow:0 14px 32px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.08); }


  .gees-logo { display:inline-flex; align-items:center; justify-content:flex-start; height:50px; width:100%; min-width:0; padding:0 clamp(12px,1vw,18px); text-decoration:none; border-radius:999px; overflow:hidden; transform:translateZ(0); transition:transform .18s var(--gees-ease-press), opacity .18s var(--gees-ease); }
  .gees-logo:hover { transform:translate3d(0,-1px,0); }
  .gees-logo__word { display:inline-block; font-family:"Cormorant Garamond",Georgia,"Times New Roman",serif; font-weight:700; font-size:var(--gees-logo-desktop); line-height:.86; letter-spacing:.105em; background:linear-gradient(90deg,var(--gees-logo-a),var(--gees-logo-b) 33%,var(--gees-logo-c) 50%,var(--gees-logo-b) 68%,var(--gees-logo-a)); background-size:240% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; text-transform:uppercase; white-space:nowrap; animation:geesLogoShine 6.8s ease-in-out infinite; }
  @keyframes geesLogoShine { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .gees-nav { display:flex; align-items:center; justify-content:center; gap:clamp(8px,.75vw,16px); min-width:0; width:100%; }
  .gees-nav__link,.gees-trigger { position:relative; display:inline-flex; align-items:center; justify-content:center; gap:7px; height:clamp(36px,2.6vw,42px); padding:0 clamp(10px,.86vw,15px); border:1px solid transparent; border-radius:999px; color:var(--gees-text-soft); background:transparent; text-decoration:none; white-space:nowrap; font:650 clamp(13px,.82vw,15px)/1 Inter,system-ui,sans-serif; letter-spacing:-.012em; cursor:pointer; transform:translateZ(0); transition:transform .16s var(--gees-ease-press), color .2s var(--gees-ease), background-color .2s var(--gees-ease), border-color .2s var(--gees-ease); }
  .gees-nav__link:hover,.gees-trigger:hover { color:var(--gees-text); transform:translate3d(0,-1px,0); }
  .gees-nav__link:active,.gees-trigger:active { transform:translate3d(0,1px,0) scale(.982); }
  .gees-nav__link.is-active,.gees-trigger.is-active { color:var(--gees-blue); background:rgba(255,210,26,.14); border-color:rgba(212,161,62,.26); }
  [data-theme="dark"] .gees-nav__link.is-active,[data-theme="dark"] .gees-trigger.is-active { color:var(--gees-gold); }
  .gees-nav__link::after,.gees-trigger::after { content:""; position:absolute; left:14px; right:14px; bottom:4px; height:2px; border-radius:999px; background:linear-gradient(90deg,var(--gees-gold),var(--gees-gold-2)); transform:scaleX(0); transform-origin:right; transition:transform .26s var(--gees-ease); }
  @media(hover:hover){ .gees-nav__link:hover::after,.gees-trigger:hover::after{transform:scaleX(1);transform-origin:left;} }
  .gees-nav__link.is-active::after,.gees-trigger.is-active::after,.gees-dropdown.is-open>.gees-trigger::after { transform:scaleX(1); transform-origin:left; }
  .gees-chevron { flex:0 0 auto; transition:transform .24s var(--gees-ease); }
  .gees-dropdown.is-open>.gees-trigger .gees-chevron,.gees-dropdown:hover>.gees-trigger .gees-chevron,.gees-portal.is-open .gees-chevron { transform:rotate(180deg); }

  .gees-actions { display:flex; align-items:center; justify-content:flex-end; gap:clamp(8px,.75vw,12px); min-width:max-content; justify-self:end; }
  .gees-action,.gees-portal-btn,.gees-hamburger { position:relative; isolation:isolate; height:clamp(40px,3.2vw,46px); border:1px solid var(--gees-border); border-radius:999px; background:linear-gradient(145deg,rgba(255,255,255,.92),rgba(248,250,252,.72)); color:var(--gees-text); display:inline-flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; text-decoration:none; font:800 13px/1 Inter,system-ui,sans-serif; transform:translate3d(0,0,0); transition:transform .22s var(--gees-ease-press), background-color .22s var(--gees-ease), border-color .22s var(--gees-ease), color .22s var(--gees-ease), box-shadow .22s var(--gees-ease), filter .22s var(--gees-ease); will-change:transform; touch-action:manipulation; -webkit-tap-highlight-color:transparent; overflow:hidden; box-shadow:0 8px 20px rgba(15,23,42,.055), inset 0 1px 0 rgba(255,255,255,.78), inset 0 -1px 0 rgba(15,23,42,.045); }
  [data-theme="dark"] .gees-action,[data-theme="dark"] .gees-portal-btn,[data-theme="dark"] .gees-hamburger { background:linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.045)); box-shadow:0 12px 26px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.09); }
  .gees-action { width:clamp(40px,3.2vw,46px); }
  .gees-portal-btn { padding:0 clamp(13px,1vw,18px); color:var(--gees-text-soft); }
  .gees-action::before,.gees-portal-btn::before,.gees-hamburger::before { content:""; position:absolute; inset:4px; border-radius:inherit; background:radial-gradient(circle at 50% 36%,rgba(255,210,26,.30),rgba(37,99,235,.08) 42%,transparent 70%); opacity:0; transform:scale(.72); transition:opacity .20s var(--gees-ease), transform .28s var(--gees-ease-press); z-index:-1; }
  .gees-action::after,.gees-portal-btn::after,.gees-hamburger::after { content:""; position:absolute; inset:-55% auto -55% -80%; width:54%; transform:skewX(-18deg) translateX(0); background:linear-gradient(90deg,transparent,rgba(255,255,255,.48),transparent); opacity:0; pointer-events:none; }
  .gees-action:hover,.gees-portal-btn:hover,.gees-hamburger:hover { transform:translate3d(0,-2px,0) scale(1.012); background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(255,255,255,.80)); border-color:var(--gees-border-strong); box-shadow:0 16px 34px rgba(15,23,42,.10), inset 0 1px 0 rgba(255,255,255,.90); color:var(--gees-text); }
  .gees-action:hover::before,.gees-portal-btn:hover::before,.gees-hamburger:hover::before { opacity:1; transform:scale(1); }
  .gees-action:hover::after,.gees-portal-btn:hover::after,.gees-hamburger:hover::after { opacity:1; animation:geesControlSheen .74s var(--gees-ease) forwards; }
  .gees-action:active,.gees-portal-btn:active,.gees-hamburger:active { transform:translate3d(0,1px,0) scale(.955); transition-duration:90ms; filter:saturate(1.08); }
  @keyframes geesControlSheen { to { transform:skewX(-18deg) translateX(360%); } }

  /* Micro-fix: premium dark-mode visibility and 3D control depth */
  .gees-action>i,.gees-portal-btn>i,.gees-theme-icon { filter:drop-shadow(0 5px 9px rgba(15,23,42,.13)); }
  .gees-action:hover>i,.gees-portal-btn:hover>i { transform:translate3d(0,-1px,0) scale(1.08); filter:drop-shadow(0 8px 14px rgba(37,99,235,.22)); }
  [data-theme="dark"] .gees-action:hover,
  [data-theme="dark"] .gees-portal-btn:hover,
  [data-theme="dark"] .gees-hamburger:hover {
    color:#fff;
    background:linear-gradient(135deg,#003366,#1d4ed8 58%,#2563eb);
    border-color:rgba(96,165,250,.42);
    box-shadow:0 18px 42px rgba(37,99,235,.34),0 8px 22px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.22);
  }
  [data-theme="dark"] .gees-action:hover::before,
  [data-theme="dark"] .gees-portal-btn:hover::before,
  [data-theme="dark"] .gees-hamburger:hover::before {
    background:radial-gradient(circle at 50% 36%,rgba(255,210,26,.42),rgba(96,165,250,.24) 45%,transparent 72%);
  }
  [data-theme="dark"] .gees-action:hover>i,
  [data-theme="dark"] .gees-portal-btn:hover>i,
  [data-theme="dark"] .gees-portal-btn:hover span,
  [data-theme="dark"] .gees-portal-btn:hover .gees-chevron {
    color:#fff;
    filter:drop-shadow(0 8px 16px rgba(255,255,255,.18));
  }

  .gees-action--search i { transition:transform .28s var(--gees-ease-press), color .22s var(--gees-ease), filter .22s var(--gees-ease); }
  .gees-action--search:hover i,.gees-action--search.is-active i { color:var(--gees-blue-2); transform:scale(1.16) rotate(-10deg); filter:drop-shadow(0 6px 10px rgba(37,99,235,.20)); }
  [data-theme="dark"] .gees-action--search:hover i,[data-theme="dark"] .gees-action--search.is-active i { color:var(--gees-gold); filter:drop-shadow(0 6px 12px rgba(255,210,26,.22)); }

  .gees-action--theme { overflow:hidden; }
  .gees-action--theme .gees-theme-icon { position:relative; width:22px; height:22px; display:block; transform:translateZ(0); transition:transform .30s var(--gees-ease-snap), filter .22s var(--gees-ease); will-change:transform,filter; }
  .gees-action--theme .gees-theme-icon::before { content:""; position:absolute; inset:-12px; border-radius:999px; background:conic-gradient(from 45deg, rgba(255,210,26,0), rgba(255,210,26,.52), rgba(37,99,235,.22), rgba(255,210,26,0)); opacity:0; transform:scale(.48) rotate(-90deg); transition:opacity .20s var(--gees-ease), transform .38s var(--gees-ease-snap); pointer-events:none; }
  .gees-action--theme .gees-theme-icon::after { content:""; position:absolute; inset:2px; border-radius:999px; background:radial-gradient(circle, rgba(255,255,255,.36), transparent 68%); opacity:0; transform:scale(.55); transition:opacity .20s var(--gees-ease), transform .30s var(--gees-ease-snap); pointer-events:none; }
  .gees-action--theme:hover .gees-theme-icon { transform:rotate(-8deg) scale(1.08); filter:drop-shadow(0 9px 15px rgba(37,99,235,.15)); }
  .gees-action--theme:hover .gees-theme-icon::before, .gees-action--theme.is-switching .gees-theme-icon::before { opacity:1; transform:scale(1) rotate(180deg); }
  .gees-action--theme.is-switching .gees-theme-icon::after { opacity:1; transform:scale(1.18); }
  .gees-action--theme:active .gees-theme-icon { transform:rotate(10deg) scale(.90); transition-duration:82ms; }
  .gees-action--theme.is-switching { animation:geesThemeButtonPulse .40s var(--gees-ease-snap) both; }
  .gees-action--theme.is-switching .gees-theme-icon { animation:geesThemeIconOrbit .46s var(--gees-ease-snap) both; }
  .gees-theme-icon i { position:absolute; inset:0; display:grid; place-items:center; font-size:18px; transition:transform .36s var(--gees-ease-snap), opacity .20s var(--gees-ease), color .20s var(--gees-ease), filter .20s var(--gees-ease); will-change:transform,opacity; }
  .gees-theme-icon .fa-sun { color:var(--gees-gold); opacity:0; transform:translate3d(8px,-8px,0) rotate(-115deg) scale(.28); filter:drop-shadow(0 8px 16px rgba(255,210,26,.24)); }
  .gees-theme-icon .fa-moon { color:#1d4ed8; opacity:1; transform:translate3d(0,0,0) rotate(0deg) scale(1); filter:drop-shadow(0 8px 16px rgba(37,99,235,.18)); }
  [data-gees-theme-toggle][data-theme-state="dark"] .fa-sun { opacity:1; transform:translate3d(0,0,0) rotate(0deg) scale(1); }
  [data-gees-theme-toggle][data-theme-state="dark"] .fa-moon { opacity:0; transform:translate3d(-8px,8px,0) rotate(115deg) scale(.28); }
  @keyframes geesThemeButtonPulse { 0%{transform:scale(.94)} 42%{transform:scale(1.07)} 100%{transform:scale(1)} }
  @keyframes geesThemeIconOrbit { 0%{transform:rotate(-24deg) scale(.82)} 44%{transform:rotate(28deg) scale(1.22)} 100%{transform:rotate(0deg) scale(1)} }
  .gees-action--theme.is-switching { color:#061b3a; background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2)); border-color:rgba(212,161,62,.38); box-shadow:0 14px 34px rgba(212,161,62,.24), inset 0 1px 0 rgba(255,255,255,.65); }
  .gees-action--theme.is-switching .gees-theme-icon { filter:drop-shadow(0 8px 14px rgba(15,23,42,.18)); }
  .gees-action--theme.is-switching .gees-theme-icon i { color:#061b3a!important; filter:drop-shadow(0 4px 10px rgba(15,23,42,.16)); }
  [data-theme="dark"] .gees-action--theme.is-switching { color:#061b3a; background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2)); border-color:rgba(255,210,26,.45); box-shadow:0 16px 38px rgba(255,210,26,.18),0 8px 22px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.48); }
  [data-theme="dark"] .gees-action--theme.is-switching .gees-theme-icon { filter:drop-shadow(0 8px 14px rgba(15,23,42,.20)); }
  [data-theme="dark"] .gees-action--theme.is-switching .gees-theme-icon i { color:#061b3a!important; }
  [data-theme="dark"] .gees-action--theme:hover { background:linear-gradient(135deg,rgba(255,210,26,.92),rgba(255,224,76,.98)); color:#061b3a; border-color:rgba(255,210,26,.50); box-shadow:0 16px 38px rgba(255,210,26,.18),0 8px 22px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.48); }
  [data-theme="dark"] .gees-action--theme:hover .gees-theme-icon { filter:drop-shadow(0 8px 14px rgba(15,23,42,.18)); }
  [data-theme="dark"] .gees-action--theme:hover .gees-theme-icon i { color:#061b3a!important; }

  .gees-apply { position:relative; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; gap:10px; height:clamp(42px,3.4vw,50px); padding:0 clamp(18px,1.5vw,28px); border-radius:999px; color:#061b3a; background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2)); text-decoration:none; white-space:nowrap; font:900 clamp(13px,.88vw,15px)/1 Inter,system-ui,sans-serif; box-shadow:0 10px 22px rgba(212,161,62,.24), inset 0 1px 0 rgba(255,255,255,.55); transform:translateZ(0); transition:transform .18s var(--gees-ease-press), box-shadow .22s var(--gees-ease), filter .22s var(--gees-ease); }
  .gees-apply::before { content:""; position:absolute; inset:-60% auto -60% -80%; width:55%; transform:skewX(-18deg); background:linear-gradient(90deg,transparent,rgba(255,255,255,.56),transparent); opacity:0; }
  .gees-apply__circle { width:34px; height:34px; display:grid; place-items:center; margin-right:-12px; border-radius:999px; background:#061e8c; color:#fff; transition:transform .2s var(--gees-ease-press); }
  @media(hover:hover){ .gees-apply:hover{color:#fff!important;background:linear-gradient(135deg,#003366,#1d4ed8);transform:translate3d(0,-3px,0) scale(1.012);box-shadow:0 18px 40px rgba(0,51,102,.26), inset 0 1px 0 rgba(255,255,255,.22);} .gees-apply:hover>span:not(.gees-apply__circle){color:#fff!important;} .gees-apply:hover::before{opacity:1;animation:geesSheen .85s var(--gees-ease) forwards;} .gees-apply:hover .gees-apply__circle{background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2));color:#061b3a;transform:translateX(3px) scale(1.04);} }
  [data-theme="dark"] .gees-apply { color:#fff; background:linear-gradient(135deg,#003366,#1d4ed8 62%,#2563eb); box-shadow:0 16px 36px rgba(37,99,235,.30),0 8px 20px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.20); }
  [data-theme="dark"] .gees-apply__circle { background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2)); color:#061b3a; }
  [data-theme="dark"] .gees-apply:hover { color:#fff!important; background:linear-gradient(135deg,#00427f,#2563eb 64%,#3b82f6); box-shadow:0 20px 44px rgba(37,99,235,.38),0 10px 24px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.24); }
  .gees-apply:active { transform:translate3d(0,1px,0) scale(.97); }
  @keyframes geesSheen { to { transform:skewX(-18deg) translateX(360%); } }

  .gees-dropdown { position:relative; }
  .gees-menu { position:absolute; top:calc(100% + 14px); left:50%; width:min(760px,calc(100vw - 28px)); transform:translate3d(-50%,-12px,0) scale(.972); transform-origin:top center; opacity:0; visibility:hidden; pointer-events:none; z-index:var(--gees-z-dropdown); transition:opacity .26s var(--gees-ease), transform .40s var(--gees-ease-snap), visibility 0s linear .26s; will-change:transform,opacity; }
  .gees-menu::before { content:""; position:absolute; left:0; right:0; top:-22px; height:26px; }
  .gees-dropdown.is-open .gees-menu { opacity:1; visibility:visible; pointer-events:auto; transform:translate3d(-50%,0,0) scale(1); transition-delay:0s; }
  .gees-menu__panel { border:1px solid var(--gees-border); border-radius:30px; background:linear-gradient(135deg,var(--gees-card),rgba(255,255,255,.90)); box-shadow:0 30px 86px rgba(15,23,42,.15), inset 0 1px 0 rgba(255,255,255,.82); padding:22px; backdrop-filter:blur(24px) saturate(160%); -webkit-backdrop-filter:blur(24px) saturate(160%); transform:translateZ(0); }
  [data-theme="dark"] .gees-menu__panel { background:linear-gradient(135deg,var(--gees-card),rgba(15,23,42,.86)); box-shadow:0 34px 90px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.08); }
  .gees-menu__grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }
  .gees-service-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .gees-portal .gees-menu { left:auto; right:0; width:min(420px,calc(100vw - 28px)); transform:translate3d(0,-12px,0) scale(.972); transform-origin:top right; }
  .gees-portal.is-open .gees-menu { transform:translate3d(0,0,0) scale(1); }
  .gees-portal-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .gees-menu__col { opacity:.98; }
  .gees-menu__col h4 { margin:0 0 10px; color:var(--gees-muted); font:800 11px/1 Inter,system-ui,sans-serif; text-transform:uppercase; letter-spacing:.1em; }
  .gees-menu__col a { display:flex; align-items:center; justify-content:space-between; gap:10px; min-height:42px; padding:10px 12px; border-radius:16px; color:var(--gees-text-soft); text-decoration:none; font:700 13px/1.2 Inter,system-ui,sans-serif; transition:background-color .20s var(--gees-ease), color .20s var(--gees-ease), transform .22s var(--gees-ease-press), box-shadow .20s var(--gees-ease); }
  .gees-menu__col a b { font-weight:700; }
  .gees-menu__col a:hover,.gees-menu__col a:focus-visible,.gees-menu__col a.is-active { background:linear-gradient(135deg,rgba(255,210,26,.16),rgba(37,99,235,.06)); color:var(--gees-text); transform:translateX(4px); box-shadow:inset 3px 0 0 rgba(255,210,26,.88); }
  .gees-menu__footer { margin-top:18px; padding-top:15px; border-top:1px solid var(--gees-border); display:flex; align-items:center; justify-content:space-between; gap:16px; color:var(--gees-muted); font:700 12px/1.4 Inter,system-ui,sans-serif; }
  .gees-menu__footer a { color:var(--gees-blue); text-decoration:none; white-space:nowrap; }

  .gees-search-panel { position:fixed; top:calc(var(--gees-h) + 14px); left:50%; z-index:var(--gees-z-search); width:min(720px,calc(100vw - 28px)); transform:translate3d(-50%,-10px,0) scale(.985); opacity:0; visibility:hidden; pointer-events:none; transition:opacity .24s var(--gees-ease), transform .32s var(--gees-ease), visibility 0s linear .24s; }
  .gees-search-panel.is-open { opacity:1; visibility:visible; pointer-events:auto; transform:translate3d(-50%,0,0) scale(1); transition-delay:0s; }
  .gees-search-card { border:1px solid var(--gees-border); border-radius:28px; background:var(--gees-card); box-shadow:var(--gees-shadow-pop); padding:14px; backdrop-filter:blur(22px) saturate(145%); -webkit-backdrop-filter:blur(22px) saturate(145%); }
  .gees-search-box { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:11px; height:54px; padding:0 14px; border:1px solid var(--gees-border); border-radius:20px; background:rgba(248,250,252,.72); }
  [data-theme="dark"] .gees-search-box { background:rgba(255,255,255,.06); }
  .gees-search-box input { width:100%; min-width:0; border:0; outline:0; background:transparent; color:var(--gees-text); font:700 16px/1 Inter,system-ui,sans-serif; }
  .gees-search-box kbd { padding:5px 8px; border:1px solid var(--gees-border); border-radius:9px; color:var(--gees-muted); font:800 11px/1 Inter,system-ui,sans-serif; }
  .gees-search-results { display:grid; gap:8px; margin-top:12px; max-height:min(48vh,360px); overflow:auto; padding:2px; }
  .gees-search-result { display:grid; grid-template-columns:36px minmax(0,1fr) auto; align-items:center; gap:10px; min-height:48px; padding:8px 10px; border-radius:16px; color:var(--gees-text); text-decoration:none; transition:background-color .18s var(--gees-ease), transform .18s var(--gees-ease); }
  .gees-search-result:hover,.gees-search-result:focus-visible { background:rgba(255,210,26,.14); transform:translateX(3px); }
  .gees-search-result__icon { width:36px; height:36px; display:grid; place-items:center; border-radius:999px; background:rgba(37,99,235,.10); color:var(--gees-blue); }
  .gees-search-result__copy { min-width:0; display:grid; gap:3px; }
  .gees-search-result__copy strong { font:800 13.5px/1.1 Inter,system-ui,sans-serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .gees-search-result__copy small { color:var(--gees-muted); font:700 11px/1 Inter,system-ui,sans-serif; }
  .gees-search-empty { padding:16px; color:var(--gees-muted); font:700 13px/1.4 Inter,system-ui,sans-serif; }
  [data-theme="dark"] .gees-search-card { border-color:rgba(255,255,255,.14); background:linear-gradient(135deg,rgba(15,23,42,.98),rgba(15,23,42,.90)); box-shadow:0 28px 78px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.08); }
  [data-theme="dark"] .gees-search-box { background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.13); }
  [data-theme="dark"] .gees-search-box>i { color:var(--gees-gold); filter:drop-shadow(0 5px 12px rgba(255,210,26,.18)); }
  [data-theme="dark"] .gees-search-box input::placeholder { color:rgba(203,213,225,.68); }
  [data-theme="dark"] .gees-search-box kbd { color:#cbd5e1; background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.14); }
  [data-theme="dark"] .gees-search-result { color:#f8fafc; }
  [data-theme="dark"] .gees-search-result:hover,[data-theme="dark"] .gees-search-result:focus-visible { background:rgba(255,210,26,.12); }
  [data-theme="dark"] .gees-search-result__icon { color:#fff; background:linear-gradient(135deg,#003366,#1d4ed8); box-shadow:0 8px 18px rgba(37,99,235,.26), inset 0 1px 0 rgba(255,255,255,.18); }
  [data-theme="dark"] .gees-search-result>i { color:#f8fafc; }
  [data-theme="dark"] .gees-search-result:hover .gees-search-result__icon,[data-theme="dark"] .gees-search-result:focus-visible .gees-search-result__icon { color:#061b3a; background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2)); }

  .gees-drawer-overlay { position:fixed; inset:0; z-index:var(--gees-z-overlay); background:rgba(15,23,42,.42); opacity:0; visibility:hidden; pointer-events:none; transition:opacity .24s var(--gees-ease), visibility 0s linear .24s; }
  .gees-drawer-overlay.is-active { opacity:1; visibility:visible; pointer-events:auto; transition-delay:0s; }
  .gees-mobile-drawer { position:fixed; inset:0; z-index:var(--gees-z-drawer); padding:calc(var(--gees-h) + 12px) max(14px,env(safe-area-inset-right)) calc(14px + env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left)); background:rgba(255,255,255,.98); color:var(--gees-text); transform:translate3d(0,-10px,0) scale(.985); opacity:0; visibility:hidden; pointer-events:none; overflow:hidden; transition:opacity .24s var(--gees-ease), transform .38s var(--gees-ease), visibility 0s linear .24s; }
  [data-theme="dark"] .gees-mobile-drawer { background:rgba(15,23,42,.98); }
  .gees-mobile-drawer.is-open { opacity:1; visibility:visible; pointer-events:auto; transform:translate3d(0,0,0) scale(1); transition-delay:0s; }
  .gees-drawer__body { height:100%; width:min(100%,720px); margin:0 auto; display:flex; flex-direction:column; gap:clamp(12px,2.3vh,18px); overflow:hidden; }
  .gees-drawer__top { display:grid; gap:12px; padding-bottom:12px; border-bottom:1px solid var(--gees-border); }
  .gees-drawer__follow { display:grid; grid-template-columns:auto minmax(0,1fr); align-items:center; gap:8px; }
  .gees-drawer__follow strong { color:var(--gees-text-soft); font:800 clamp(13px,3.4vw,15px)/1 Inter,system-ui,sans-serif; white-space:nowrap; }
  .gees-drawer__socials { min-width:0; display:flex; align-items:center; justify-content:flex-end; gap:clamp(4px,1.1vw,8px); flex-wrap:nowrap; }
  .gees-drawer__social { width:clamp(29px,8.3vw,38px); height:clamp(29px,8.3vw,38px); flex:0 0 auto; display:grid; place-items:center; border:1px solid var(--gees-border); border-radius:999px; background:rgba(255,255,255,.82); color:var(--gees-text); text-decoration:none; box-shadow:0 8px 20px rgba(15,23,42,.05); transition:transform .14s var(--gees-ease-press), background-color .18s var(--gees-ease), border-color .18s var(--gees-ease); }
  [data-theme="dark"] .gees-drawer__social { background:rgba(255,255,255,.06); }
  .gees-drawer__social:active { transform:scale(.92); }
  .gees-drawer__phone { display:flex; justify-content:flex-end; align-items:center; gap:10px; width:100%; text-align:right; color:var(--gees-text); text-decoration:none; font:900 clamp(20px,6.2vw,30px)/1 Inter,system-ui,sans-serif; letter-spacing:-.04em; }
  .gees-drawer__phone i { color:var(--gees-red); font-size:.88em; }
  .gees-drawer-search { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:10px; min-height:50px; padding:0 11px 0 14px; border:1px solid var(--gees-border); border-radius:22px; background:rgba(248,250,252,.82); }
  [data-theme="dark"] .gees-drawer-search { background:rgba(255,255,255,.06); }
  .gees-drawer-search i { color:var(--gees-blue-2); }
  .gees-drawer-search input { width:100%; min-width:0; border:0; outline:0; background:transparent; color:var(--gees-text); font:700 16px/1 Inter,system-ui,sans-serif; }
  .gees-drawer-search button { width:38px; height:38px; display:grid; place-items:center; border:0; border-radius:999px; color:#061b3a; background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2)); cursor:pointer; transition:transform .14s var(--gees-ease-press); }
  .gees-drawer-search button:active { transform:scale(.92); }
  .gees-drawer__content { flex:1 1 auto; min-height:0; overflow:auto; padding-right:2px; scrollbar-width:thin; }
  .gees-drawer__menu { display:grid; gap:clamp(9px,1.6vh,12px); }
  .gees-mobile-drawer,.gees-drawer__body,.gees-drawer__content,.gees-drawer__menu { max-width:100%; overflow-x:hidden; }
  .gees-drawer__results { display:none; gap:8px; }
  .gees-drawer__results.is-searching { display:grid; }
  .gees-drawer__default.is-searching { display:none; }
  .gees-drawer__link,.gees-accordion { border:1px solid var(--gees-border); border-radius:21px; background:linear-gradient(135deg,rgba(255,255,255,.88),rgba(248,250,252,.72)); overflow:hidden; box-shadow:0 8px 18px rgba(15,23,42,.035), inset 0 1px 0 rgba(255,255,255,.78); }
  [data-theme="dark"] .gees-drawer__link,[data-theme="dark"] .gees-accordion { background:linear-gradient(135deg,rgba(255,255,255,.065),rgba(255,255,255,.035)); box-shadow:0 10px 22px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.06); }
  .gees-drawer__link,.gees-accordion__button { min-height:clamp(50px,7.5vh,58px); width:100%; max-width:100%; min-width:0; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:0 clamp(16px,4.5vw,22px); border:0; background:transparent; color:var(--gees-text-soft); text-decoration:none; font:650 clamp(17px,4.8vw,22px)/1 Inter,system-ui,sans-serif; letter-spacing:-.028em; cursor:pointer; transition:transform .16s var(--gees-ease-press), background-color .20s var(--gees-ease), color .20s var(--gees-ease), border-color .20s var(--gees-ease), box-shadow .20s var(--gees-ease); }
  .gees-drawer__link span,.gees-accordion__button span { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .gees-drawer__link>i,.gees-accordion__button .gees-chevron { flex:0 0 auto; }
  .gees-drawer__link:hover,.gees-accordion__button:hover,.gees-drawer__link.is-active { color:var(--gees-blue); background:rgba(37,99,235,.07); }
  .gees-drawer__link:active,.gees-accordion__button:active { transform:scale(.986); }
  .gees-accordion .gees-chevron { width:14px; height:14px; }
  .gees-accordion.is-open .gees-chevron { transform:rotate(180deg); }
  .gees-accordion__panel { height:0; overflow:hidden; opacity:0; transition:height .34s var(--gees-ease), opacity .24s var(--gees-ease); }
  .gees-accordion.is-open .gees-accordion__panel { opacity:1; }
  .gees-accordion__inner { display:grid; gap:7px; padding:0 16px 16px; }
  .gees-drawer__group-title { margin:8px 0 2px; color:var(--gees-muted); font:850 10px/1 Inter,system-ui,sans-serif; text-transform:uppercase; letter-spacing:.10em; }
  .gees-accordion__inner a { display:flex; align-items:center; min-height:38px; padding:9px 10px; border-radius:14px; color:var(--gees-text-soft); text-decoration:none; font:700 13px/1.25 Inter,system-ui,sans-serif; transition:background-color .18s var(--gees-ease), transform .18s var(--gees-ease); }
  .gees-accordion__inner a:hover,.gees-accordion__inner a:focus-visible { background:rgba(255,210,26,.14); transform:translateX(3px); }
  .gees-drawer__apply { flex:0 0 auto; min-height:50px; width:100%; display:flex; align-items:center; justify-content:center; gap:9px; border-radius:999px; }

  .gees-hamburger { --hamburger-button-size:44px; --hamburger-line-w:22px; --hamburger-line-w-mid:16px; --hamburger-line-h:2px; --hamburger-box-h:18px; --hamburger-y-1:3px; --hamburger-y-2:8px; --hamburger-y-3:13px; display:none; width:var(--hamburger-button-size); height:var(--hamburger-button-size); min-width:var(--hamburger-button-size); min-height:var(--hamburger-button-size); padding:0; perspective:700px; }
  .gees-hamburger__box { position:absolute; left:50%; top:50%; width:var(--hamburger-line-w); height:var(--hamburger-box-h); transform:translate(-50%,-50%) rotateX(0deg) rotateY(0deg); transition:transform .34s var(--gees-ease-press); transform-style:preserve-3d; }
  .gees-hamburger__box>span { position:absolute; left:0; width:var(--hamburger-line-w); height:var(--hamburger-line-h); border-radius:999px; background:linear-gradient(90deg,currentColor,rgba(15,23,42,.62)); box-shadow:0 1px 0 rgba(255,255,255,.52),0 5px 12px rgba(15,23,42,.16); transform-origin:center; transition:top .30s var(--gees-ease-snap), transform .34s var(--gees-ease-press), opacity .18s var(--gees-ease), width .28s var(--gees-ease-snap); }
  [data-theme="dark"] .gees-hamburger__box>span { background:linear-gradient(90deg,currentColor,rgba(248,250,252,.72)); box-shadow:0 5px 12px rgba(0,0,0,.32); }
  .gees-hamburger__box>span:nth-child(1){top:var(--hamburger-y-1)} .gees-hamburger__box>span:nth-child(2){top:var(--hamburger-y-2);width:var(--hamburger-line-w-mid)} .gees-hamburger__box>span:nth-child(3){top:var(--hamburger-y-3)}
  .gees-hamburger:hover .gees-hamburger__box{transform:translate(-50%,-50%) rotateX(7deg) rotateY(-8deg)}
  .gees-hamburger:hover .gees-hamburger__box>span:nth-child(2){width:var(--hamburger-line-w)}
  .gees-hamburger.is-open { color:#061b3a; background:linear-gradient(135deg,var(--gees-gold),var(--gees-gold-2)); border-color:rgba(212,161,62,.38); box-shadow:0 14px 34px rgba(212,161,62,.24), inset 0 1px 0 rgba(255,255,255,.65); }
  .gees-hamburger.is-open .gees-hamburger__box { transform:translate(-50%,-50%) rotateX(0deg) rotateY(0deg) rotate(90deg); }
  .gees-hamburger.is-open .gees-hamburger__box>span:nth-child(1){top:var(--hamburger-y-2);transform:rotate(45deg);width:var(--hamburger-line-w)}
  .gees-hamburger.is-open .gees-hamburger__box>span:nth-child(2){opacity:0;transform:scaleX(.2) translateZ(-8px)}
  .gees-hamburger.is-open .gees-hamburger__box>span:nth-child(3){top:var(--hamburger-y-2);transform:rotate(-45deg);width:var(--hamburger-line-w)}

  .gees-mobile-drawer .gees-drawer__top,.gees-mobile-drawer .gees-drawer-search,.gees-mobile-drawer .gees-drawer__link,.gees-mobile-drawer .gees-accordion,.gees-mobile-drawer .gees-drawer__apply { opacity:0; transform:translate3d(0,14px,0); transition:opacity .36s var(--gees-ease), transform .42s var(--gees-ease); }
  .gees-mobile-drawer.is-open .gees-drawer__top,.gees-mobile-drawer.is-open .gees-drawer-search,.gees-mobile-drawer.is-open .gees-drawer__link,.gees-mobile-drawer.is-open .gees-accordion,.gees-mobile-drawer.is-open .gees-drawer__apply { opacity:1; transform:translate3d(0,0,0); }
  .gees-mobile-drawer.is-open .gees-drawer__top{transition-delay:.04s}.gees-mobile-drawer.is-open .gees-drawer-search{transition-delay:.07s}.gees-mobile-drawer.is-open .gees-drawer__menu>*:nth-child(1){transition-delay:.10s}.gees-mobile-drawer.is-open .gees-drawer__menu>*:nth-child(2){transition-delay:.13s}.gees-mobile-drawer.is-open .gees-drawer__menu>*:nth-child(3){transition-delay:.16s}.gees-mobile-drawer.is-open .gees-drawer__menu>*:nth-child(4){transition-delay:.19s}.gees-mobile-drawer.is-open .gees-drawer__menu>*:nth-child(5){transition-delay:.22s}.gees-mobile-drawer.is-open .gees-drawer__menu>*:nth-child(6){transition-delay:.25s}.gees-mobile-drawer.is-open .gees-drawer__apply{transition-delay:.28s}

  .gees-logo:focus-visible,.gees-nav__link:focus-visible,.gees-trigger:focus-visible,.gees-action:focus-visible,.gees-portal-btn:focus-visible,.gees-hamburger:focus-visible,.gees-apply:focus-visible,.gees-mobile-drawer a:focus-visible,.gees-mobile-drawer button:focus-visible,.gees-search-box input:focus-visible { outline:3px solid rgba(255,210,26,.62); outline-offset:3px; }

  @media(max-width:1280px){
    :root{--gees-logo-col:clamp(138px,11vw,180px);--gees-logo-desktop:clamp(28px,2.05vw,36px)}
    .gees-header__inner{gap:clamp(10px,1.35vw,24px)}
    .gees-nav{gap:4px}.gees-nav__link,.gees-trigger{padding:0 8px;font-size:12.8px}.gees-portal-btn span{display:none}.gees-portal-btn{width:44px;padding:0}.gees-apply{padding:0 14px}.gees-apply__circle{margin-right:-9px;width:32px;height:32px}
  }

  @media(max-width:1080px){
    :root{--gees-h:64px;--gees-x:10px;--gees-logo-col:minmax(0,1fr)}
    .gees-header__inner{grid-template-columns:minmax(0,1fr) max-content;gap:10px;padding:7px 8px}
    .gees-nav,.gees-portal,.gees-apply:not(.gees-drawer__apply){display:none!important}
    .gees-actions{gap:var(--gees-mobile-gap)}
    .gees-action,.gees-hamburger{width:var(--gees-mobile-action);height:var(--gees-mobile-action);min-width:var(--gees-mobile-action);min-height:var(--gees-mobile-action)}
    .gees-hamburger{display:inline-flex;--hamburger-button-size:var(--gees-mobile-action);--hamburger-line-w:22px;--hamburger-line-w-mid:16px;--hamburger-box-h:18px;--hamburger-y-1:3px;--hamburger-y-2:8px;--hamburger-y-3:13px}
    .gees-logo{height:48px;padding:0 16px}.gees-logo__word{font-size:var(--gees-logo-mobile)}
    .gees-search-panel{top:calc(var(--gees-h) + 10px)}
  }

  @media(max-width:430px){
    :root{--gees-h:60px;--gees-x:7px;--gees-mobile-action:42px;--gees-mobile-gap:5px}
    .gees-header__inner{padding:7px;border-radius:999px}.gees-logo{height:44px;padding:0 12px}.gees-logo__word{font-size:clamp(30px,9.8vw,38px)}
    .gees-drawer__body{gap:12px}.gees-drawer__top{gap:10px}.gees-drawer__phone{font-size:clamp(20px,6.3vw,26px)}
    .gees-drawer__link,.gees-accordion__button{min-height:50px;font-size:clamp(17px,4.6vw,21px);border-radius:20px}
    .gees-drawer__apply{min-height:48px}.gees-drawer-search{min-height:48px;border-radius:20px}.gees-drawer__social{width:29px;height:29px;font-size:13px}.gees-drawer__follow strong{font-size:13px}
  }

  @media(max-width:360px){
    :root{--gees-mobile-action:39px;--gees-mobile-gap:4px;--gees-x:5px}
    .gees-logo{padding:0 9px}.gees-logo__word{font-size:28px}.gees-action,.gees-hamburger{width:39px;height:39px;min-width:39px;min-height:39px}.gees-hamburger{--hamburger-line-w:20px;--hamburger-line-w-mid:14px;--hamburger-box-h:16px;--hamburger-y-1:3px;--hamburger-y-2:7px;--hamburger-y-3:11px}
    .gees-mobile-drawer{padding-left:10px;padding-right:10px}.gees-drawer__social{width:27px;height:27px;font-size:12px}.gees-drawer__follow{gap:6px}.gees-drawer__follow strong{font-size:12px}.gees-drawer__link,.gees-accordion__button{font-size:16px;min-height:47px}.gees-drawer__phone{font-size:20px}
  }

  @media(max-width:940px) and (orientation:landscape){
    :root{--gees-h:56px}.gees-logo{height:40px}.gees-logo__word{font-size:28px}.gees-action,.gees-hamburger{width:40px;height:40px;min-width:40px;min-height:40px}.gees-mobile-drawer{padding-top:calc(var(--gees-h) + 8px)}.gees-drawer__body{gap:10px}.gees-drawer__top{grid-template-columns:1fr 1fr;align-items:center;gap:10px 16px}.gees-drawer-search{min-height:44px}.gees-drawer__phone{font-size:20px}.gees-drawer__link,.gees-accordion__button{min-height:40px;font-size:17px;border-radius:16px}.gees-drawer__menu{gap:7px}.gees-drawer__apply{min-height:42px}.gees-drawer__content{max-height:calc(100dvh - var(--gees-h) - 164px)}
  }

  @media(prefers-reduced-motion:reduce){
    .gees-header,.gees-header *,.gees-search-panel,.gees-mobile-drawer,.gees-drawer-overlay{transition:none!important;animation:none!important;scroll-behavior:auto!important}.gees-logo__word{animation:none!important}
  }
}
</style>`;
  }

  function template() {
    return `${styles()}
<a href="#main-content" class="skip-to-content">Skip to main content</a>
<div data-gees-header-root>
  <header class="gees-header" id="geesUniversalHeader" data-gees-header>
    <div class="gees-header__inner">
      <span class="gees-header__motion-pill" aria-hidden="true"></span>
      <a class="gees-logo" href="${escapeHTML(CONFIG.logoHref)}" aria-label="GEES home">
        <span class="gees-logo__word">${escapeHTML(CONFIG.logoText)}</span>
      </a>

      <nav class="gees-nav" aria-label="Main navigation">${buildNav()}</nav>

      <div class="gees-actions">
        <button class="gees-action gees-action--search" type="button" data-gees-search-toggle aria-label="Search">
          <i class="fas fa-search" aria-hidden="true"></i>
          <span class="gees-sr-only">Search</span>
        </button>

        <button class="gees-action gees-action--theme" type="button" data-gees-theme-toggle aria-label="Toggle theme">
          <span class="gees-theme-icon" aria-hidden="true"><i class="fas fa-sun"></i><i class="fas fa-moon"></i></span>
          <span class="gees-sr-only">Theme</span>
        </button>

        ${buildPortalMenu()}

        <a class="gees-apply" href="${escapeHTML(CONFIG.applyUrl)}">
          <span>Apply Now</span>
          <span class="gees-apply__circle"><i class="fas fa-chevron-right" aria-hidden="true"></i></span>
        </a>

        <button class="gees-hamburger" id="geesHamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="geesMobileDrawer">
          <span class="gees-hamburger__box"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="gees-search-panel" id="geesSearchPanel" aria-hidden="true">
    <div class="gees-search-card">
      <form class="gees-search-box" role="search" action="search.html">
        <i class="fas fa-search" aria-hidden="true"></i>
        <input id="geesGlobalSearch" name="q" type="search" placeholder="Search universities, countries, services…" autocomplete="off">
        <kbd>Esc</kbd>
      </form>
      <div class="gees-search-results" id="geesSearchResults" aria-live="polite"></div>
    </div>
  </div>

  <div class="gees-drawer-overlay" id="geesDrawerOverlay" aria-hidden="true"></div>

  <aside class="gees-mobile-drawer" id="geesMobileDrawer" aria-hidden="true" aria-label="Mobile menu" tabindex="-1">
    <div class="gees-drawer__body">
      <div class="gees-drawer__top">
        <div class="gees-drawer__follow">
          <strong>Follow us:</strong>
          <div class="gees-drawer__socials">${buildSocialLinks()}</div>
        </div>
        <a class="gees-drawer__phone" href="${escapeHTML(CONFIG.phoneHref)}"><i class="fas fa-phone-volume" aria-hidden="true"></i> ${escapeHTML(CONFIG.phoneDisplay)}</a>
      </div>

      <form class="gees-drawer-search" role="search" action="search.html">
        <i class="fas fa-search" aria-hidden="true"></i>
        <input id="geesDrawerSearch" name="q" type="search" placeholder="Search menu…" autocomplete="off" inputmode="search">
        <button type="submit" aria-label="Search"><i class="fas fa-arrow-right" aria-hidden="true"></i></button>
      </form>

      <div class="gees-drawer__content">
        <div class="gees-drawer__menu gees-drawer__default" id="geesDrawerDefaultMenu">${buildDrawerMenu()}</div>
        <div class="gees-drawer__results" id="geesDrawerSearchResults" aria-live="polite"></div>
      </div>

      <a class="gees-apply gees-drawer__apply" href="${escapeHTML(CONFIG.applyUrl)}"><i class="fas fa-paper-plane" aria-hidden="true"></i> Apply Now</a>
    </div>
  </aside>

  <div class="gees-sr-only" id="geesLiveRegion" aria-live="polite"></div>
</div>`;
  }

  function getFocusable(root) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
      .filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  }

  function lockScroll() {
    state.previousOverflow = document.body.style.overflow;
    state.previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.classList.add('gees-drawer-lock');
  }

  function unlockScroll() {
    document.body.style.overflow = state.previousOverflow;
    document.body.style.paddingRight = state.previousPaddingRight;
    document.documentElement.classList.remove('gees-drawer-lock');
  }

  function isHeaderBusy() {
    const drawer = $(SELECTORS.drawer);
    const search = $(SELECTORS.search);
    const header = $(SELECTORS.header);
    return !!((drawer && drawer.classList.contains('is-open')) || (search && search.classList.contains('is-open')) || state.currentOpenDropdown || (header && header.matches(':focus-within')));
  }

  function moveDropdownMotion(trigger) {
    const inner = $('.gees-header__inner');
    const pill = $('.gees-header__motion-pill');
    if (!inner || !pill || !trigger) return;
    const ir = inner.getBoundingClientRect();
    const tr = trigger.getBoundingClientRect();
    inner.style.setProperty('--gees-pill-x', `${Math.round(tr.left - ir.left)}px`);
    inner.style.setProperty('--gees-pill-y', `${Math.round(tr.top - ir.top)}px`);
    inner.style.setProperty('--gees-pill-w', `${Math.round(tr.width)}px`);
    inner.style.setProperty('--gees-pill-h', `${Math.round(tr.height)}px`);
    inner.classList.add('has-dropdown-motion');
  }

  function hideDropdownMotion() {
    const inner = $('.gees-header__inner');
    if (inner) inner.classList.remove('has-dropdown-motion');
  }

  function closeDropdowns(keepMotion = false) {
    clearTimeout(state.hoverOpenTimer);
    clearTimeout(state.hoverCloseTimer);
    if (!keepMotion) hideDropdownMotion();
    $$('[data-dropdown].is-open').forEach(drop => {
      drop.classList.remove('is-open');
      const trigger = $('.gees-trigger, .gees-portal-btn', drop);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      const menu = $('.gees-menu', drop);
      if (menu) menu.style.removeProperty('transform');
    });
    state.currentOpenDropdown = null;
  }

  function setAccordion(acc, open) {
    const btn = $('.gees-accordion__button', acc);
    const panel = $('.gees-accordion__panel', acc);
    if (!panel) return;
    acc.classList.toggle('is-open', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.style.height = `${panel.scrollHeight}px`;
    } else {
      panel.style.height = `${panel.scrollHeight}px`;
      panel.offsetHeight;
      panel.style.height = '0px';
    }
  }

  function resetDrawerSearch() {
    const input = $(SELECTORS.drawerSearch);
    const results = $(SELECTORS.drawerResults);
    const defaults = $(SELECTORS.drawerDefault);
    if (input) input.value = '';
    if (results) {
      results.classList.remove('is-searching');
      results.innerHTML = '';
    }
    if (defaults) defaults.classList.remove('is-searching');
    $$('[data-mobile-accordion]').forEach(acc => setAccordion(acc, false));
  }

  function openDrawer() {
    const drawer = $(SELECTORS.drawer);
    const overlay = $(SELECTORS.overlay);
    const hamburger = $(SELECTORS.hamburger);
    const header = $(SELECTORS.header);
    if (!drawer || !overlay || !hamburger) return;
    closeSearch();
    closeDropdowns();
    if (header) header.classList.remove('is-hidden');
    state.lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    overlay.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    lockScroll();
    setTimeout(() => hamburger.focus({ preventScroll: true }), 30);
    announce('Menu opened');
    emit('gees:drawer-open');
  }

  function closeDrawer() {
    const drawer = $(SELECTORS.drawer);
    const overlay = $(SELECTORS.overlay);
    const hamburger = $(SELECTORS.hamburger);
    if (!drawer || !overlay || !hamburger) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    resetDrawerSearch();
    unlockScroll();
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus({ preventScroll: true });
    announce('Menu closed');
    emit('gees:drawer-close');
  }

  function openSearch() {
    const panel = $(SELECTORS.search);
    const input = $(SELECTORS.searchInput);
    const header = $(SELECTORS.header);
    if (!panel) return;

    if (window.matchMedia('(max-width:1080px)').matches) {
      openDrawer();
      setTimeout(() => {
        const drawerInput = $(SELECTORS.drawerSearch);
        if (drawerInput) drawerInput.focus({ preventScroll: true });
      }, 260);
      return;
    }

    closeDrawer();
    closeDropdowns();
    if (header) header.classList.remove('is-hidden');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    const searchBtn = $('.gees-action--search');
    if (searchBtn) searchBtn.classList.add('is-active');
    renderResults(input ? input.value : '', SELECTORS.searchResults, 'desktop');
    setTimeout(() => input && input.focus({ preventScroll: true }), 40);
    announce('Search opened');
    emit('gees:search-open');
  }

  function closeSearch() {
    const panel = $(SELECTORS.search);
    if (!panel || !panel.classList.contains('is-open')) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    const searchBtn = $('.gees-action--search');
    if (searchBtn) searchBtn.classList.remove('is-active');
    announce('Search closed');
    emit('gees:search-close');
  }

  function keepDropdownInViewport(drop) {
    const menu = $('.gees-menu', drop);
    if (!menu) return;
    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();
      let shift = 0;
      const pad = 12;
      if (rect.left < pad) shift = pad - rect.left;
      if (rect.right > window.innerWidth - pad) shift = (window.innerWidth - pad) - rect.right;
      if (shift && !menu.classList.contains('gees-menu--portal')) {
        menu.style.transform = `translate3d(calc(-50% + ${shift}px), 0, 0) scale(1)`;
      }
    });
  }

  function openDropdown(drop) {
    if (!drop) return;
    closeDropdowns(true);
    const trigger = $('.gees-trigger, .gees-portal-btn', drop);
    if (drop.classList.contains('gees-portal')) {
      hideDropdownMotion();
    } else {
      moveDropdownMotion(trigger);
    }
    drop.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    state.currentOpenDropdown = drop;
    keepDropdownInViewport(drop);
  }

  function bindDropdowns() {
    $$('[data-dropdown]').forEach(drop => {
      const trigger = $('.gees-trigger, .gees-portal-btn', drop);
      if (!trigger) return;

      on(drop, 'mouseenter', () => {
        if (window.innerWidth <= 1080) return;
        clearTimeout(state.hoverCloseTimer);
        state.hoverOpenTimer = setTimeout(() => openDropdown(drop), 75);
      });

      on(drop, 'mouseleave', () => {
        if (window.innerWidth <= 1080) return;
        clearTimeout(state.hoverOpenTimer);
        state.hoverCloseTimer = setTimeout(() => closeDropdowns(), 160);
      });

      on(trigger, 'click', event => {
        const isTouchish = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        const isAnchor = trigger.tagName === 'A';
        if (window.innerWidth > 1080 && isAnchor && !isTouchish) return;
        event.preventDefault();
        drop.classList.contains('is-open') ? closeDropdowns() : openDropdown(drop);
      });

      on(trigger, 'keydown', event => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDropdown(drop);
          const first = $('.gees-menu a', drop);
          if (first) first.focus();
        }
      });
    });

    on(document, 'click', event => {
      if (!event.target.closest('[data-dropdown]')) closeDropdowns();
      if (!event.target.closest('#geesSearchPanel, [data-gees-search-toggle]')) closeSearch();
    });
  }

  function bindAccordions() {
    $$('[data-mobile-accordion]').forEach(acc => {
      const btn = $('.gees-accordion__button', acc);
      const panel = $('.gees-accordion__panel', acc);
      if (!btn || !panel) return;
      panel.style.height = '0px';
      on(btn, 'click', () => {
        const open = !acc.classList.contains('is-open');
        $$('[data-mobile-accordion]').forEach(other => {
          if (other !== acc) setAccordion(other, false);
        });
        setAccordion(acc, open);
      });
      on(panel, 'transitionend', event => {
        if (event.propertyName === 'height' && acc.classList.contains('is-open')) panel.style.height = 'auto';
      });
    });
  }

  function bindDrawer() {
    const hamburger = $(SELECTORS.hamburger);
    const overlay = $(SELECTORS.overlay);
    on(hamburger, 'click', () => {
      const drawer = $(SELECTORS.drawer);
      if (drawer && drawer.classList.contains('is-open')) closeDrawer(); else openDrawer();
    });
    on(overlay, 'click', closeDrawer);
    $$('#geesMobileDrawer a').forEach(link => on(link, 'click', closeDrawer));
  }

  function bindSearch() {
    $$('[data-gees-search-toggle]').forEach(btn => {
      on(btn, 'click', event => {
        event.preventDefault();
        const isMobileSearch = window.matchMedia('(max-width:1080px)').matches;
        const drawer = $(SELECTORS.drawer);
        if (isMobileSearch && drawer && drawer.classList.contains('is-open')) {
          closeDrawer();
          return;
        }
        const panel = $(SELECTORS.search);
        if (panel && panel.classList.contains('is-open')) closeSearch(); else openSearch();
      });
    });

    const form = $('.gees-search-box');
    const input = $(SELECTORS.searchInput);
    on(input, 'input', () => renderResults(input.value, SELECTORS.searchResults, 'desktop'));
    on(form, 'submit', event => {
      if (!input || !input.value.trim()) {
        event.preventDefault();
        if (input) input.focus();
      }
    });

    const drawerForm = $('.gees-drawer-search');
    const drawerInput = $(SELECTORS.drawerSearch);
    const drawerResults = $(SELECTORS.drawerResults);
    const drawerDefault = $(SELECTORS.drawerDefault);
    on(drawerInput, 'input', () => {
      const q = drawerInput.value.trim();
      if (!drawerResults || !drawerDefault) return;
      if (!q) {
        drawerResults.classList.remove('is-searching');
        drawerDefault.classList.remove('is-searching');
        drawerResults.innerHTML = '';
        return;
      }
      drawerResults.classList.add('is-searching');
      drawerDefault.classList.add('is-searching');
      renderResults(q, drawerResults, 'drawer');
    });
    on(drawerForm, 'submit', event => {
      if (!drawerInput || !drawerInput.value.trim()) {
        event.preventDefault();
        if (drawerInput) drawerInput.focus();
      }
    });

    on(window, 'scroll', () => {
      const panel = $(SELECTORS.search);
      if (!panel || !panel.classList.contains('is-open')) return;
      if (document.activeElement === input) return;
      closeSearch();
    }, { passive: true });
  }

  function bindTheme() {
    const initial = getInitialTheme();
    document.documentElement.setAttribute('data-theme', initial);
    updateThemeIcon(initial);
    const btn = $('[data-gees-theme-toggle]');
    on(btn, 'click', () => {
      if (btn) {
        btn.classList.remove('is-switching');
        void btn.offsetWidth;
        btn.classList.add('is-switching');
        window.setTimeout(() => btn.classList.remove('is-switching'), 460);
      }
      const current = document.documentElement.getAttribute('data-theme');
      requestAnimationFrame(() => setTheme(current === 'dark' ? 'light' : 'dark'));
    });
  }

  function bindKeyboard() {
    on(document, 'keydown', event => {
      const drawer = $(SELECTORS.drawer);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
        return;
      }
      if (event.key === 'Escape') {
        closeSearch();
        closeDropdowns();
        if (drawer && drawer.classList.contains('is-open')) closeDrawer();
        return;
      }
      if (event.key === 'Tab' && drawer && drawer.classList.contains('is-open')) {
        const focusables = getFocusable(drawer).concat([$(SELECTORS.hamburger)].filter(Boolean));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  function bindScroll() {
    const header = $(SELECTORS.header);
    if (!header) return;
    state.lastScrollY = window.scrollY;
    on(window, 'scroll', () => {
      if (state.scrollTicking) return;
      state.scrollTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - state.lastScrollY;
        const noAutoHide = document.body.hasAttribute('data-gees-header-no-autohide');
        header.classList.toggle('is-scrolled', y > 8);
        if (noAutoHide || isHeaderBusy() || y < 44) {
          header.classList.remove('is-hidden');
        } else if (Math.abs(delta) >= 8) {
          if (delta > 0 && y > 110) header.classList.add('is-hidden');
          if (delta < 0) header.classList.remove('is-hidden');
          state.lastScrollY = Math.max(y, 0);
        }
        state.scrollTicking = false;
      });
    }, { passive: true });
  }

  function applyActiveState() {
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    let activeLabel = '';
    CONFIG.nav.forEach(item => {
      const exact = item.match && item.match.includes(file);
      const pref = item.matchPrefix && item.matchPrefix.some(prefix => file.startsWith(prefix) || file.includes(prefix));
      if (exact || pref) activeLabel = item.label;
    });
    $$('[data-nav-link]').forEach(link => {
      const active = activeLabel && link.dataset.navLink === activeLabel;
      link.classList.toggle('is-active', !!active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    const apply = $('.gees-apply:not(.gees-drawer__apply)');
    if (apply) apply.classList.toggle('is-active', file === 'contact-us.html');
    const portalBtn = $('.gees-portal-btn');
    const portalPages = ['/portal/auth/student-login.html', '/portal/auth/student-signup.html', '/portal/auth/agent-login.html', '/portal/auth/agent-signup.html', '/portal/auth/staff-login.html', '/portal/auth/staff-signup.html', '/portal/auth/admin-login.html'];
    if (portalBtn) portalBtn.classList.toggle('is-active', portalPages.includes(file));
  }

  function bindResize() {
    on(window, 'resize', () => {
      if (window.innerWidth > 1080) closeDrawer();
      closeDropdowns();
      $$('[data-mobile-accordion].is-open').forEach(acc => {
        const panel = $('.gees-accordion__panel', acc);
        if (panel) panel.style.height = 'auto';
      });
    }, { passive: true });
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    ensureAssets();
    document.documentElement.setAttribute('data-theme', getInitialTheme());
    const placeholder = ensurePlaceholder();
    placeholder.innerHTML = template();
    bindTheme();
    applyActiveState();
    bindDropdowns();
    bindAccordions();
    bindDrawer();
    bindSearch();
    bindKeyboard();
    bindScroll();
    bindResize();
    renderResults('', SELECTORS.searchResults, 'desktop');
    emit('gees:header-ready', { version: CONFIG.version, source: 'header.js' });
  }

  function destroy() {
    state.cleanup.splice(0).forEach(fn => fn());
    unlockScroll();
    const placeholder = document.getElementById(CONFIG.placeholderId);
    if (placeholder) placeholder.innerHTML = '';
    state.initialized = false;
    window.GEES_HEADER_LOADED = false;
  }

  window.GEESHeader = {
    init,
    destroy,
    reload() {
      destroy();
      window.GEES_HEADER_LOADED = true;
      init();
    },
    openDrawer,
    closeDrawer,
    openSearch,
    closeSearch,
    setTheme,
    config: CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
