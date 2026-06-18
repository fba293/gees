/* GEES Universal Footer — footer.js
   Self-contained universal footer. Add to any page:
   <script src="footer.js" defer></script>
*/
(function () {
  'use strict';

  if (window.GEES_FOOTER_LOADED) return;
  window.GEES_FOOTER_LOADED = true;

  const CONFIG = {
    version: '1.4.8',
    placeholderId: 'gees-footer-placeholder',
    year: new Date().getFullYear(),
    logoText: 'GEES',
    logoSubText: 'Global Education Expert Services',
    logoSubLines: ['Global Education', 'Expert Services'],
    logoHref: '/',
    email: 'info@globaleducationexpert.com',
    contacts: [
      ['Helpline', '+880 1805-529578', 'https://wa.me/8801805529578?text=Hello%20GEES%2C%20I%20need%20study%20abroad%20guidance.', 'fab fa-whatsapp'],
      ['Dhaka', '+880 1805-529578', 'https://wa.me/8801805529578?text=Hello%20GEES%2C%20I%20need%20study%20abroad%20guidance.', 'fab fa-whatsapp'],
      ['Kuala Lumpur', '+60 11-1237 6224', 'https://wa.me/601112376224?text=Hello%20GEES%2C%20I%20need%20study%20abroad%20guidance.', 'fab fa-whatsapp'],
      ['Email', 'info@globaleducationexpert.com', 'mailto:info@globaleducationexpert.com', 'fas fa-envelope']
    ],
    offices: [
      {
        title: 'Bangladesh',
        addressLines: [
          'Green City Regency,',
          'Road 27/1, Level 10, Room D-26, 27,',
          'Kakrail, Dhaka 1000'
        ],
        mapHref: 'https://www.google.com/maps/place/Global+Education+Expert+Services+(GEES)/@23.7380639,90.4072556,17z/data=!3m1!4b1!4m6!3m5!1s0x3755b9a6cbdc99ed:0x77ab55b22cdd3fbf!8m2!3d23.738059!4d90.4098305!16s%2Fg%2F11mslmvz0w?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D'
      },
      {
        title: 'Malaysia',
        addressLines: [
          'USJ 19 City Mall,',
          'Level 1, Subang Jaya,',
          'Selangor 47620'
        ],
        mapHref: 'https://www.google.com/maps/place/The+19+USJ+City+Mall+(Palazzo+19+Mall)/@3.0328396,101.5861413,17z/data=!3m2!4b1!5s0x31cdb334929b13d3:0xa3ca303a717066b6!4m6!3m5!1s0x31cdb33494e8c1d3:0xd40d4417a891ed7d!8m2!3d3.0328342!4d101.5887162!16s%2Fg%2F11bbt3js8n?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D'
      }
    ],
    footerLinks: [
      ['Blog', '/blog.html'],
      ['Courses', '/courses.html'],
      ['Privacy Policy', '/privacy-policy.html'],
      ['Home', '/'],
      ['Universities', '/universities.html'],
      ['Refund Policy', '/refund-policy.html'],
      ['Contact', '/contact-us.html'],
      ['Our Services', '/services.html'],
      ['Terms & Conditions', '/terms-and-conditions.html']
    ],
    social: [
      ['Facebook Page', 'https://www.facebook.com/globaleduexpert', 'fab fa-facebook-f', 'facebook'],
      ['Messenger', 'https://www.facebook.com/messages/t/globaleduexpert/', 'fab fa-facebook-messenger', 'messenger'],
      ['Facebook Group', 'https://www.facebook.com/groups/bsim.official', 'fas fa-users'],
      ['Instagram', 'https://www.instagram.com/global.eduexpert', 'fab fa-instagram', 'instagram'],
      ['TikTok', 'https://www.tiktok.com/@globaleduexpert', 'fab fa-tiktok', 'tiktok'],
      ['YouTube', 'https://www.youtube.com/@globaleduexpert', 'fab fa-youtube', 'youtube'],
      ['X', 'https://x.com/globaleduexpert', 'fab fa-x-twitter', 'x'],
      ['LinkedIn', 'https://www.linkedin.com/company/globaleduexpert', 'fab fa-linkedin-in', 'linkedin']
    ]
  };

  const state = {
    initialized: false,
    cleanup: []
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function ensurePlaceholder() {
    let placeholder = document.getElementById(CONFIG.placeholderId);

    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.id = CONFIG.placeholderId;
      document.body.appendChild(placeholder);
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
    ensureStylesheet(
      'gees-footer-fontawesome-css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
    );

    ensureStylesheet(
      'gees-footer-fonts',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap'
    );
  }

  function buildOffices() {
    return CONFIG.offices.map(office => {
      const addressLines = Array.isArray(office.addressLines)
        ? office.addressLines
        : [office.address || ''];
      const addressMarkup = addressLines.map(line => escapeHTML(line)).join('<br>');

      return `
      <a class="gees-footer__office-card" href="${escapeHTML(office.mapHref)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHTML(office.title)} office location on Google Maps">
        <h3>${escapeHTML(office.title)} <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></h3>
        <address>${addressMarkup}</address>
      </a>
    `;
    }).join('');
  }

  function buildContacts() {
    return CONFIG.contacts.map(([label, value, href, icon]) => `
      <li>
        <a class="gees-footer__contact-link" href="${escapeHTML(href)}" target="${String(href).startsWith('http') ? '_blank' : '_self'}" rel="${String(href).startsWith('http') ? 'noopener noreferrer' : ''}">
          <i class="${escapeHTML(icon)}" aria-hidden="true"></i>
          <span class="gees-footer__contact-label">${escapeHTML(label)}:</span>
          <span class="gees-footer__contact-value">${escapeHTML(value)}</span>
        </a>
      </li>
    `).join('');
  }

  function buildLinks(links, className) {
    return links.map(([label, href]) => `
      <a class="${escapeHTML(className)}" href="${escapeHTML(href)}">${escapeHTML(label)}</a>
    `).join('');
  }

  function buildSocial() {
    return CONFIG.social.map(([label, href, icon, type = 'default']) => `
      <a class="gees-footer__social-link gees-footer__social-link--${escapeHTML(type)}" href="${escapeHTML(href)}" aria-label="${escapeHTML(label)}" target="_blank" rel="noopener noreferrer">
        <i class="${escapeHTML(icon)}" aria-hidden="true"></i>
      </a>
    `).join('');
  }

  function styles() {
    return `
<style id="gees-universal-footer-css">
@layer gees-footer {
  :root {
    --gees-footer-page-bg: #f6f7f9;
    --gees-footer-page-bg-soft: #fbfcfe;
    --gees-footer-card: #ffffff;
    --gees-footer-card-2: #ffffff;
    --gees-footer-text: #1f2933;
    --gees-footer-soft: #3f4652;
    --gees-footer-muted: #747b88;
    --gees-footer-line: #e8ebef;
    --gees-footer-line-strong: #dfe4eb;
    --gees-footer-blue: #003366;
    --gees-footer-gold: #ffd21a;
    --gees-footer-red: #d82329;
    --gees-footer-shadow: 0 22px 60px rgba(15,23,42,.075), 0 2px 10px rgba(15,23,42,.035);
    --gees-footer-ease: cubic-bezier(.2,.8,.2,1);
    --gees-footer-container: 1368px;
  }

  [data-theme="dark"] {
    --gees-footer-page-bg: #07111f;
    --gees-footer-page-bg-soft: #0b1424;
    --gees-footer-card: #0f172a;
    --gees-footer-card-2: rgba(15,23,42,.88);
    --gees-footer-text: #f3f6fb;
    --gees-footer-soft: #d6deea;
    --gees-footer-muted: #aab5c4;
    --gees-footer-line: rgba(255,255,255,.10);
    --gees-footer-line-strong: rgba(255,255,255,.18);
    --gees-footer-shadow: 0 28px 90px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.08);
  }

  .gees-footer,
  .gees-footer * {
    box-sizing: border-box;
  }

  .gees-footer {
    position: relative;
    isolation: isolate;
    margin: 0;
    padding: clamp(32px, 5.4vw, 76px) 0 calc(clamp(28px, 4.2vw, 56px) + env(safe-area-inset-bottom, 0px));
    color: var(--gees-footer-text);
    background:
      linear-gradient(180deg,
        #ffffff 0,
        var(--gees-footer-page-bg-soft) 72px,
        var(--gees-footer-page-bg) 170px,
        var(--gees-footer-page-bg) 100%);
    overflow-x: clip;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  /* Dark-mode footer should never fade from white.
   This fixes the white strip above the footer on non-home pages. */
html.dark .gees-footer,
html[data-theme="dark"] .gees-footer,
[data-theme="dark"] .gees-footer {
  background: var(--gees-footer-page-bg) !important;
  background-image: none !important;
}

  .gees-footer__card {
    width: min(calc(100vw - 48px), var(--gees-footer-container));
    margin-inline: auto;
    padding: clamp(34px, 4.8vw, 68px) clamp(28px, 4.3vw, 58px) clamp(24px, 3.4vw, 38px);
    border: 1px solid var(--gees-footer-line);
    border-radius: clamp(28px, 4vw, 44px);
    background: var(--gees-footer-card);
    box-shadow: var(--gees-footer-shadow);
  }

  [data-theme="dark"] .gees-footer__card {
    border-color: rgba(255,255,255,.08);
    background:
      linear-gradient(135deg, rgba(15,23,42,.95), rgba(15,23,42,.84)),
      var(--gees-footer-card);
  }

  .gees-footer__brand {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    width: max-content;
    max-width: 100%;
    color: inherit;
    text-decoration: none;
    transform: translateZ(0);
    transition: transform .24s var(--gees-footer-ease), opacity .24s var(--gees-footer-ease);
  }

  .gees-footer__brand:hover {
    transform: translate3d(0,-2px,0);
  }

  .gees-footer__logo {
    display: block;
    width: max-content;
    font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif;
    font-size: clamp(34px, 3.3vw, 50px);
    font-weight: 700;
    line-height: .84;
    letter-spacing: .12em;
    text-transform: uppercase;
    background: linear-gradient(90deg, #101114, #d82329 34%, #ffd21a 50%, #003366 68%, #101114);
    background-size: 240% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: geesFooterLogoShine 7s ease-in-out infinite;
  }

  [data-theme="dark"] .gees-footer__logo {
    background-image: linear-gradient(90deg, #f8fafc, #ff7b7f 34%, #ffd21a 50%, #8dbdff 68%, #f8fafc);
  }

  .gees-footer__logo-sub {
    display: grid;
    gap: 3px;
    width: max-content;
    max-width: 100%;
    margin-left: 1px;
    color: var(--gees-footer-muted);
    font: 650 clamp(8.8px, .58vw, 9.8px)/1.12 Inter, system-ui, sans-serif;
    letter-spacing: .105em;
    text-transform: uppercase;
  }

  .gees-footer__logo-sub span {
    display: block;
    white-space: nowrap;
    text-align: left;
    background: linear-gradient(90deg, var(--gees-footer-muted), var(--gees-footer-text), var(--gees-footer-muted));
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: geesFooterSubtitleSheen 8.5s ease-in-out infinite;
  }

  .gees-footer__logo-sub span:nth-child(2) {
    animation-delay: .35s;
  }

  @keyframes geesFooterSubtitleSheen {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes geesFooterLogoShine {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .gees-footer__main {
    display: grid;
    grid-template-columns: minmax(120px, .55fr) minmax(280px, 1.05fr) minmax(380px, 1.22fr) minmax(340px, 1.05fr);
    gap: clamp(30px, 2.2vw, 34px);
    align-items: start;
  }

  .gees-footer__main > section {
    min-width: 0;
  }

  .gees-footer__heading {
    margin: 0 0 14px;
    color: var(--gees-footer-text);
    font-size: clamp(17px, 1.3vw, 22px);
    line-height: 1.15;
    font-weight: 600;
    letter-spacing: -.025em;
  }

  .gees-footer__office-list {
    display: grid;
    gap: 18px;
  }

  .gees-footer__office-card {
    display: block;
    color: inherit;
    text-decoration: none;
    border-radius: 18px;
    transform: translateZ(0);
    transition: transform .22s var(--gees-footer-ease), background-color .22s var(--gees-footer-ease);
  }

  .gees-footer__office-card h3 {
    margin: 0 0 8px;
    color: var(--gees-footer-text);
    font-size: clamp(16px, 1.16vw, 20px);
    line-height: 1.15;
    font-weight: 600;
    letter-spacing: -.02em;
  }

  .gees-footer__office-card h3 i {
    margin-left: 7px;
    color: var(--gees-footer-muted);
    font-size: .72em;
    opacity: .74;
    transform: translateY(-1px);
    transition: transform .22s var(--gees-footer-ease), color .22s var(--gees-footer-ease), opacity .22s var(--gees-footer-ease);
  }

  .gees-footer__office-card address {
    margin: 0;
    color: var(--gees-footer-soft);
    font-style: normal;
    font-size: clamp(13px, .92vw, 15px);
    line-height: 1.58;
    font-weight: 400;
    max-width: 430px;
  }

  @media (hover: hover) {
    .gees-footer__office-card:hover {
      transform: translate3d(3px,0,0);
    }

    .gees-footer__office-card:hover h3 i {
      color: var(--gees-footer-red);
      opacity: 1;
      transform: translate3d(2px,-2px,0);
    }
  }

  .gees-footer__contact-list {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .gees-footer__contact-link {
    display: grid;
    grid-template-columns: 18px 106px minmax(0, 1fr);
    align-items: start;
    gap: 9px;
    width: 100%;
    max-width: 100%;
    color: var(--gees-footer-soft);
    text-decoration: none;
    font-size: clamp(13px, .9vw, 15px);
    line-height: 1.45;
    font-weight: 500;
    overflow-wrap: normal;
    word-break: normal;
    transform: translateZ(0);
    transition: color .22s var(--gees-footer-ease), transform .22s var(--gees-footer-ease);
  }

  .gees-footer__contact-list i {
    width: 17px;
    min-width: 17px;
    color: var(--gees-footer-red);
    text-align: center;
    transform: translateY(2px);
  }

  .gees-footer__contact-label {
    color: var(--gees-footer-text);
    font-weight: 600;
    white-space: nowrap;
  }

  .gees-footer__contact-value {
    min-width: 0;
    color: var(--gees-footer-soft);
    font-weight: 500;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  @media (min-width: 1181px) {
    .gees-footer__contact-link[href^="mailto:"] .gees-footer__contact-value {
      font-size: inherit;
      letter-spacing: inherit;
      white-space: nowrap;
      overflow-wrap: normal;
      word-break: normal;
    }
  }

  @media (hover: hover) {
    .gees-footer__contact-link:hover {
      color: var(--gees-footer-text);
      transform: translate3d(3px,0,0);
    }
  }

  .gees-footer__links-grid {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 13px 18px;
    align-items: start;
    justify-content: start;
    max-width: 100%;
  }

  .gees-footer__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: max-content;
    max-width: 100%;
    min-height: 28px;
    color: var(--gees-footer-soft);
    text-decoration: none;
    font-size: clamp(12.8px, .88vw, 14.5px);
    line-height: 1.25;
    font-weight: 500;
    white-space: nowrap;
    transform: translateZ(0);
    transition: color .22s var(--gees-footer-ease), transform .22s var(--gees-footer-ease);
  }

  @media (min-width: 1181px) and (max-width: 1320px) {
    .gees-footer__links-grid {
      gap: 12px 16px;
    }

    .gees-footer__link {
      font-size: 13px;
    }
  }

  .gees-footer__link::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--gees-footer-red), var(--gees-footer-gold));
    transform: scaleX(0);
    transform-origin: right;
    transition: transform .26s var(--gees-footer-ease);
  }

  @media (hover: hover) {
    .gees-footer__link:hover {
      color: var(--gees-footer-text);
      transform: translate3d(0,-1px,0);
    }

    .gees-footer__link:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }

  .gees-footer__divider {
    height: 1px;
    margin: clamp(30px, 4.2vw, 54px) 0 24px;
    background: linear-gradient(90deg, transparent, var(--gees-footer-line-strong), transparent);
  }

  .gees-footer__bottom {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 20px;
  }

  .gees-footer__copyright {
    margin: 0;
    color: var(--gees-footer-soft);
    font-size: clamp(13px, .9vw, 15px);
    line-height: 1.55;
    font-weight: 400;
  }

  .gees-footer__copyright strong {
    color: var(--gees-footer-text);
    font-weight: 600;
  }

  .gees-footer__social {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  .gees-footer__social-link {
    width: clamp(42px, 3vw, 52px);
    height: clamp(42px, 3vw, 52px);
    display: grid;
    place-items: center;
    border: 1px solid var(--gees-footer-line-strong);
    border-radius: 999px;
    background: #ffffff;
    color: var(--gees-footer-soft);
    text-decoration: none;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.72);
    transform: translateZ(0);
    transition: transform .22s var(--gees-footer-ease), background-color .22s var(--gees-footer-ease), border-color .22s var(--gees-footer-ease), color .22s var(--gees-footer-ease), box-shadow .22s var(--gees-footer-ease);
  }

  [data-theme="dark"] .gees-footer__social-link {
    background: rgba(255,255,255,.05);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
  }

  .gees-footer__social-link i {
    font-size: clamp(15px, 1.08vw, 18px);
  }

  @media (hover: hover) {
    .gees-footer__social-link:hover {
      color: var(--gees-footer-red);
      border-color: rgba(216,35,41,.28);
      background: rgba(216,35,41,.06);
      transform: translate3d(0,-3px,0) scale(1.02);
      box-shadow: 0 12px 26px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.82);
    }

    [data-theme="dark"] .gees-footer__social-link:hover {
      color: var(--gees-footer-gold);
      border-color: rgba(255,210,26,.25);
      background: rgba(255,210,26,.08);
    }
  }

  .gees-footer a:focus-visible {
    outline: 3px solid rgba(255,210,26,.62);
    outline-offset: 3px;
    border-radius: 12px;
  }

  @media (max-width: 1180px) {
    .gees-footer__main {
      grid-template-columns: minmax(160px, .8fr) minmax(320px, 1.4fr);
      gap: 34px 52px;
    }

    .gees-footer__link-col {
      grid-column: 1 / -1;
    }

    .gees-footer__links-grid {
      max-width: 720px;
    }
  }

  @media (max-width: 760px) {
    .gees-footer {
      padding: 22px 0 calc(22px + env(safe-area-inset-bottom, 0px));
    }

    .gees-footer__card {
      width: min(calc(100vw - 22px), 620px);
      padding: 28px 24px 24px;
      border-radius: 28px;
    }

    .gees-footer__main {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .gees-footer__brand-col {
      display: grid;
      justify-items: start;
      gap: 0;
    }

    .gees-footer__logo {
      font-size: clamp(38px, 14vw, 50px);
    }

    .gees-footer__logo-sub {
      width: max-content;
      max-width: 100%;
      font-size: clamp(8.8px, 2.35vw, 9.8px);
      letter-spacing: .105em;
    }

    .gees-footer__office-list {
      gap: 20px;
    }

    .gees-footer__office-card address {
      max-width: 100%;
    }

    .gees-footer__contact-link {
      grid-template-columns: 18px 106px minmax(0, 1fr);
      gap: 9px;
    }

    .gees-footer__contact-link[href^="mailto:"] .gees-footer__contact-value {
      font-size: 13px;
      letter-spacing: -0.02em;
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .gees-footer__links-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px 12px;
      max-width: 100%;
      justify-content: stretch;
    }

    .gees-footer__link {
      font-size: 13px;
      white-space: normal;
      width: auto;
      min-height: auto;
    }

    .gees-footer__bottom {
      grid-template-columns: 1fr;
      gap: 22px;
    }

    .gees-footer__social {
      display: grid;
      grid-template-columns: repeat(4, 52px);
      justify-content: start;
      gap: 12px;
    }

    .gees-footer__social-link {
      width: 52px;
      height: 52px;
    }
  }

  @media (max-width: 390px) {
    .gees-footer__card {
      width: min(calc(100vw - 16px), 620px);
      padding: 24px 18px 22px;
      border-radius: 24px;
    }

    .gees-footer__main {
      gap: 21px;
    }

    .gees-footer__contact-link {
      grid-template-columns: 18px 96px minmax(0, 1fr);
      gap: 8px;
    }

    .gees-footer__contact-label,
    .gees-footer__contact-value {
      font-size: 12.5px;
    }

    .gees-footer__contact-link[href^="mailto:"] .gees-footer__contact-value {
      font-size: 12px;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .gees-footer__links-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px 8px;
    }

    .gees-footer__link {
      font-size: 12px;
      line-height: 1.25;
      white-space: normal;
      min-height: auto;
    }

    .gees-footer__social {
      grid-template-columns: repeat(4, 48px);
      gap: 10px;
    }

    .gees-footer__social-link {
      width: 48px;
      height: 48px;
    }
  }

  @media (max-width: 940px) and (orientation: landscape) {
    .gees-footer {
      padding-top: 18px;
      padding-bottom: calc(18px + env(safe-area-inset-bottom, 0px));
    }

    .gees-footer__card {
      padding: 24px;
      border-radius: 26px;
    }

    .gees-footer__main {
      grid-template-columns: minmax(150px, .8fr) minmax(280px, 1.2fr) minmax(220px, .8fr);
      gap: 22px;
    }

    .gees-footer__link-col {
      grid-column: 1 / -1;
    }

    .gees-footer__social {
      display: grid;
      grid-template-columns: repeat(4, minmax(42px, 48px));
      justify-content: start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gees-footer,
    .gees-footer * {
      transition: none !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }
  }
}
</style>`;
  }

  function template() {
    return `${styles()}
<footer class="gees-footer" id="geesUniversalFooter" data-gees-footer>
  <div class="gees-footer__card">
    <div class="gees-footer__main">
      <section class="gees-footer__brand-col" aria-label="GEES brand">
        <a class="gees-footer__brand" href="${escapeHTML(CONFIG.logoHref)}" aria-label="GEES home">
          <span class="gees-footer__logo">${escapeHTML(CONFIG.logoText)}</span>
          <span class="gees-footer__logo-sub">${(CONFIG.logoSubLines || [CONFIG.logoSubText]).map(line => `<span>${escapeHTML(line)}</span>`).join('')}</span>
        </a>
      </section>

      <section class="gees-footer__office-col" aria-label="GEES offices">
        <h2 class="gees-footer__heading">Offices</h2>
        <div class="gees-footer__office-list">
          ${buildOffices()}
        </div>
      </section>

      <section class="gees-footer__contact-col" aria-label="Contact us">
        <h2 class="gees-footer__heading">Contact us</h2>
        <ul class="gees-footer__contact-list">
          ${buildContacts()}
        </ul>
      </section>

      <section class="gees-footer__link-col" aria-label="Footer navigation">
        <h2 class="gees-footer__heading">Quick links</h2>
        <nav class="gees-footer__links-grid" aria-label="Footer quick and policy links">
          ${buildLinks(CONFIG.footerLinks, 'gees-footer__link')}
        </nav>
      </section>
    </div>

    <div class="gees-footer__divider" aria-hidden="true"></div>

    <div class="gees-footer__bottom">
      <p class="gees-footer__copyright">Copyright ${CONFIG.year} <strong>Global Education Expert Services</strong>. All rights reserved.</p>
      <div class="gees-footer__social" aria-label="Social links">
        ${buildSocial()}
      </div>
    </div>
  </div>
</footer>`;
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;

    ensureAssets();

    const placeholder = ensurePlaceholder();
    placeholder.innerHTML = template();

    emit('gees:footer-ready', {
      version: CONFIG.version,
      source: 'footer.js'
    });
  }

  function destroy() {
    state.cleanup.splice(0).forEach(fn => fn());

    const placeholder = document.getElementById(CONFIG.placeholderId);
    if (placeholder) placeholder.innerHTML = '';

    state.initialized = false;
    window.GEES_FOOTER_LOADED = false;
  }

  window.GEESFooter = {
    init,
    destroy,
    reload() {
      destroy();
      window.GEES_FOOTER_LOADED = true;
      init();
    },
    config: CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();