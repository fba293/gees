/* Extracted from index.html. Do not paste page JS inline. */

// Robust image fallback: local upload -> previous source -> lightweight GEES placeholder.
(function(){
  function placeholder(label){
    const safe = String(label || 'GEES').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])).slice(0,40);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#eff6ff"/><stop offset=".56" stop-color="#fff7d6"/><stop offset="1" stop-color="#ecfdf5"/></linearGradient></defs><rect width="900" height="620" fill="url(#g)"/><text x="50%" y="48%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="44" font-weight="900" fill="#003366">${safe}</text><text x="50%" y="57%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="800" fill="#64748b">GEES</text></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }
  document.addEventListener('error', function(event){
    const img = event.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.geesFallbackDone === '1') return;
    const original = img.getAttribute('data-original-src');
    if (original && img.src !== original) {
      img.dataset.geesFallbackDone = '1';
      img.src = original;
      return;
    }
    img.dataset.geesFallbackDone = '1';
    img.src = placeholder(img.getAttribute('data-fallback-label') || img.alt || 'GEES');
  }, true);
})();

(function(){document.documentElement.classList.add("js");})();

  (function() {
    // ============================================
    // CONFIGURATION
    // ============================================
    let logoCount = 45; // Full set
    const logoBasePath = 'images/slider-logos/';
    let connectionType = '4g';
    
    // Detect connection type (serve fewer logos on slow networks)
    if ('connection' in navigator) {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        connectionType = conn.effectiveType || conn.type;
        if (connectionType === '2g' || connectionType === 'slow-2g') {
          logoCount = 45; // Keep full set; animation auto-pauses on constrained devices
        } else if (connectionType === '3g') {
          logoCount = 45; // Keep full set; lazy loading controls performance
        }
      }
    }
    
    const wrapper = document.getElementById('sliderWrapper');
    const track = document.getElementById('sliderTrack');
    const pauseBtn = document.getElementById('pauseBtn');
    const progressBar = document.getElementById('progressBar');
    const loadingProgress = document.getElementById('loadingProgress');
    const slowConnectionBtn = document.getElementById('slowConnectionBtn');
    
    // University data for modal
    const universityData = {
      1: { name: "Alfa University College", desc: "Premier institution offering diverse programs in health sciences and business.", url: "/partners/alfa-university" },
      2: { name: "Asia Pacific University (APU)", desc: "Malaysia's top tech university with award-winning digital programs.", url: "/partners/apu" },
      3: { name: "Binary University", desc: "Specialized in management and entrepreneurship studies.", url: "/partners/binary" },
      4: { name: "Brickfields Asia College (BAC)", desc: "Leading law and business college in Malaysia.", url: "/partners/bac" },
      5: { name: "City University", desc: "Comprehensive university with strong industry connections.", url: "/partners/city-university" },
      6: { name: "Curtin University Malaysia", desc: "Australian education in Sarawak – top-ranked globally.", url: "/partners/curtin" },
      7: { name: "Erican College", desc: "Specialized in business and accounting programs.", url: "/partners/erican" },
      8: { name: "Genovasi University College", desc: "Malaysia's first design thinking university.", url: "/partners/genovasi" },
      9: { name: "Geomatica College", desc: "Focus area: Geospatial and surveying technology.", url: "/partners/geomatica" },
      10: { name: "HELP University", desc: "Renowned for psychology and business excellence.", url: "/partners/help" },
      11: { name: "Heriot-Watt University Malaysia", desc: "British education with a focus on engineering and business.", url: "/partners/heriot-watt" },
      12: { name: "IHM College", desc: "Specialist in hospitality and tourism management.", url: "/partners/ihm" },
      13: { name: "IIUM", desc: "International Islamic University Malaysia – holistic education.", url: "/partners/iium" },
      14: { name: "IMU", desc: "Malaysia's premier private medical and health sciences university.", url: "/partners/imu" },
      15: { name: "INTI Subang", desc: "Part of INTI's network of excellence.", url: "/partners/inti-subang" },
      16: { name: "INTI International University", desc: "Global university pathways and quality education.", url: "/partners/inti" },
      17: { name: "King's University College", desc: "Focused on business and accounting excellence.", url: "/partners/kings" },
      18: { name: "Limkokwing University", desc: "Creative and innovative university with global presence.", url: "/partners/limkokwing" },
      19: { name: "Lincoln University College", desc: "Multi-disciplinary university with strong research focus.", url: "/partners/lincoln" },
      20: { name: "LSBF College", desc: "UK-based business and finance education in Malaysia.", url: "/partners/lsbf" },
      21: { name: "MAHSA University", desc: "Specialized in medical and health sciences.", url: "/partners/mahsa" },
      22: { name: "MSU", desc: "Management & Science University – holistic education.", url: "/partners/msu" },
      23: { name: "Mantissa College", desc: "Focus on technology and digital innovation.", url: "/partners/mantissa" },
      24: { name: "MILA University", desc: "Emerging university with modern program offerings.", url: "/partners/mila" },
      25: { name: "Monash Malaysia", desc: "World-class Australian education in Malaysia.", url: "/partners/monash" },
      26: { name: "MMU", desc: "Multimedia University – Malaysia's premier tech university.", url: "/partners/mmu" },
      27: { name: "Newton College", desc: "Specialized in business and technology programs.", url: "/partners/newton" },
      28: { name: "Perdana University", desc: "Focus on graduate studies and research excellence.", url: "/partners/perdana" },
      29: { name: "SEGi University", desc: "Comprehensive private university with global partnerships.", url: "/partners/segi" },
      30: { name: "Sentral Digital", desc: "Digital skills and technology-focused institution.", url: "/partners/sentral" },
      31: { name: "Spectrum International", desc: "Broad range of programs with industry alignment.", url: "/partners/spectrum" },
      32: { name: "Sunway University", desc: "Top private university with strong industry links.", url: "/partners/sunway" },
      33: { name: "Sunway College", desc: "Foundation and diploma pathways to Sunway University.", url: "/partners/sunway-college" },
      34: { name: "Taylor's University", desc: "Malaysia's #1 private university in QS rankings.", url: "/partners/taylors" },
      35: { name: "UCSI University", desc: "Top private university with global recognition.", url: "/partners/ucsi" },
      36: { name: "UNITAR", desc: "Open and distance learning pioneer.", url: "/partners/unitar" },
      37: { name: "Universiti Malaya", desc: "Malaysia's oldest and most prestigious public university.", url: "/partners/um" },
      38: { name: "UTM", desc: "Leading engineering and technology university.", url: "/partners/utm" },
      39: { name: "UNITEN", desc: "Focus on energy, engineering, and business.", url: "/partners/uniten" },
      40: { name: "UCMI", desc: "Specialized in medical and health sciences education.", url: "/partners/ucmi" },
      41: { name: "University of Cyberjaya", desc: "Modern university with focus on digital economy.", url: "/partners/uoc" },
      42: { name: "Nottingham Malaysia", desc: "UK top-100 university campus in Malaysia.", url: "/partners/nottingham" },
      43: { name: "UOW KDU", desc: "Australian education with strong career outcomes.", url: "/partners/uow-kdu" },
      44: { name: "Vision University", desc: "Focus on technology and innovation.", url: "/partners/vision" },
      45: { name: "Xiamen University", desc: "Chinese prestigious university in Malaysia.", url: "/partners/xiamen" }
    };
    
    function getUniversityData(index) {
      return universityData[index + 1] || { 
        name: `University Partner ${index + 1}`, 
        desc: "Premier educational institution in Malaysia", 
        url: "#" 
      };
    }
    
    // ============================================
    // BUILD SKELETON LOADER
    // ============================================
    function showSkeletonLoader() {
      let skeletonHtml = '';
      for (let i = 0; i < logoCount; i++) {
        skeletonHtml += `<div class="skeleton-card"></div>`;
      }
      track.innerHTML = skeletonHtml + skeletonHtml; // duplicate for infinite scroll
      if (progressBar) loadingProgress.style.display = 'block';
    }
    
    showSkeletonLoader();
    
    // ============================================
    // BUILD ACTUAL LOGOS (with lazy loading)
    // ============================================
    function createLogoSet() {
      let html = '';
      for (let i = 0; i < logoCount; i++) {
        const uniData = getUniversityData(i);
        const urlWebp = `${logoBasePath}logo-${i + 1}.webp`;
        const urlFallback = `${logoBasePath}logo-${i + 1}.png`;
        
        html += `
          <div class="logo-card" data-name="${uniData.name}" data-index="${i}" data-url="${uniData.url}">
            <picture>
              <source srcset="${urlWebp}" type="image/webp">
              <img data-src="${urlWebp}" alt="${uniData.name}" class="lazy-logo" width="180" height="70" loading="lazy" decoding="async">
            </picture>
          </div>
        `;
      }
      return html;
    }
    
    let imagesLoaded = 0;
    
    function loadActualLogos() {
      track.innerHTML = createLogoSet() + createLogoSet();
      
      const lazyImages = document.querySelectorAll('.lazy-logo');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              imagesLoaded++;
              if (progressBar) {
                const percent = (imagesLoaded / (logoCount * 2)) * 100;
                progressBar.style.width = `${Math.min(percent, 100)}%`;
              }
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
      
      lazyImages.forEach(img => imageObserver.observe(img));
      
      // Hide progress bar when all images are loaded
      const checkComplete = setInterval(() => {
        if (imagesLoaded >= logoCount * 2) {
          if (loadingProgress) loadingProgress.style.display = 'none';
          clearInterval(checkComplete);
        }
      }, 500);
      
      attachCardEvents();
    }
    
    // Load logos without showing a manual slow-connection button.
    if (slowConnectionBtn) slowConnectionBtn.hidden = true;
    setTimeout(() => {
      loadActualLogos();
    }, (connectionType === '2g' || connectionType === 'slow-2g') ? 1200 : 450);
    
    // ============================================
    // TOUCH INTERACTION: Pause animation on touch
    // ============================================
    const trackElem = track;
    let touchTimeout = null;
    let isUserInteracting = false;
    
    function pauseAnimation() {
      if (trackElem && !isUserInteracting) {
        wrapper.classList.add('user-interacting');
        isUserInteracting = true;
        if (trackElem.style.animationPlayState !== 'paused') {
          trackElem.style.animationPlayState = 'paused';
        }
      }
    }
    
    function resumeAnimation() {
      if (touchTimeout) clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        if (isUserInteracting && trackElem && !wrapper.classList.contains('paused')) {
          wrapper.classList.remove('user-interacting');
          trackElem.style.animationPlayState = 'running';
          isUserInteracting = false;
        }
      }, 2000);
    }
    
    wrapper.addEventListener('touchstart', () => { pauseAnimation(); resumeAnimation(); });
    wrapper.addEventListener('mousedown', () => pauseAnimation());
    wrapper.addEventListener('mouseup', () => resumeAnimation());
    
    // ============================================
    // PAGE VISIBILITY API (Pause when tab hidden)
    // ============================================
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (trackElem) trackElem.style.animationPlayState = 'paused';
      } else {
        if (trackElem && !wrapper.classList.contains('paused') && !isUserInteracting) {
          trackElem.style.animationPlayState = 'running';
        }
      }
    });

    // Pause partner slider when it is not visible to keep page scrolling smooth.
    if ('IntersectionObserver' in window && wrapper && trackElem) {
      const logoVisibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) trackElem.style.animationPlayState = 'paused';
          else if (!wrapper.classList.contains('paused') && !isUserInteracting && !document.hidden) trackElem.style.animationPlayState = 'running';
        });
      }, { threshold: 0.08 });
      logoVisibilityObserver.observe(wrapper);
    }
    
    // ============================================
    // SWIPE HINT (auto-hide)
    // ============================================
    const swipeHint = document.getElementById('swipeHint');
    if (swipeHint) {
      setTimeout(() => swipeHint.classList.add('hide'), 5000);
      wrapper.addEventListener('touchstart', () => {
        if (swipeHint && !swipeHint.classList.contains('hide')) swipeHint.classList.add('hide');
      }, { once: true });
    }
    
    // ============================================
    // PAUSE BUTTON
    // ============================================
    let isPaused = false;
    if (pauseBtn && wrapper) {
      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isPaused = !isPaused;
        if (isPaused) {
          wrapper.classList.add('paused');
          pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
          wrapper.classList.remove('paused');
          wrapper.classList.remove('user-interacting');
          trackElem.style.animationPlayState = 'running';
          pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
      });
      
      let hasInteracted = false;
      wrapper.addEventListener('touchstart', () => {
        if (!hasInteracted && pauseBtn) {
          hasInteracted = true;
          pauseBtn.classList.add('visible');
          setTimeout(() => pauseBtn.classList.remove('visible'), 3000);
        }
      }, { passive: true });
    }
    
    // ============================================
    // MODAL FUNCTIONALITY (FIXED – LOGO LOADS)
    // ============================================
    const modal = document.getElementById('logoModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalLoader = document.getElementById('modalLoader');
    const modalLogo = document.getElementById('modalLogo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalLink = document.getElementById('modalLink');
    
    function openModal(name, imgSrc, link, index) {
      const uniData = getUniversityData(index);
      modalLoader.style.display = 'flex';
      modalLogo.style.display = 'none';
      modalTitle.textContent = uniData.name;
      modalDesc.textContent = uniData.desc;
      modalLink.href = link;
      
      // Use the correct image source from the logo card
      // If imgSrc is empty, try to find the logo from the card's picture/source
      let finalImgSrc = imgSrc;
      if (!finalImgSrc || finalImgSrc === '') {
        // Fallback: use the constructed path
        finalImgSrc = `${logoBasePath}logo-${index + 1}.webp`;
      }
      
      const tempImg = new Image();
      tempImg.onload = function() {
        modalLogo.src = finalImgSrc;
        modalLoader.style.display = 'none';
        modalLogo.style.display = 'block';
      };
      tempImg.onerror = function() {
        // If WebP fails, try PNG
        const fallbackSrc = `${logoBasePath}logo-${index + 1}.png`;
        const fallbackImg = new Image();
        fallbackImg.onload = function() {
          modalLogo.src = fallbackSrc;
          modalLoader.style.display = 'none';
          modalLogo.style.display = 'block';
        };
        fallbackImg.onerror = function() {
          modalLoader.innerHTML = '<div class="initials" style="font-size:1.5rem; font-weight:700;">' + uniData.name.split(' ').map(w => w[0]).join('').slice(0, 3) + '</div>';
        };
        fallbackImg.src = fallbackSrc;
      };
      tempImg.src = finalImgSrc;
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      // Reset modal loader for next time
      modalLoader.style.display = 'flex';
      modalLoader.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
      modalLogo.style.display = 'none';
    }
    
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
    
    function attachCardEvents() {
      const cards = document.querySelectorAll('.logo-card');
      cards.forEach(card => {
        card.removeEventListener('click', cardClickHandler);
        card.addEventListener('click', cardClickHandler);
      });
    }
    
    function cardClickHandler(e) {
      e.stopPropagation();
      const name = this.getAttribute('data-name');
      // Find the actual image source
      let imgSrc = '';
      const picture = this.querySelector('picture');
      if (picture) {
        const webpSource = picture.querySelector('source[type="image/webp"]');
        if (webpSource && webpSource.srcset) {
          imgSrc = webpSource.srcset;
        } else {
          const img = picture.querySelector('img');
          if (img && img.src) imgSrc = img.src;
        }
      } else {
        const img = this.querySelector('img');
        if (img && img.src) imgSrc = img.src;
      }
      const link = this.getAttribute('data-url');
      const index = parseInt(this.getAttribute('data-index'));
      openModal(name, imgSrc, link, index);
    }
    
    // ============================================
    // DESKTOP DRAG WITH MOMENTUM
    // ============================================
    let isDown = false;
    let startX, scrollLeft;
    let desktopVelocity = 0;
    let momentumId = null;
    
    function pauseDesktopAnimation() {
      if (trackElem && trackElem.style.animationPlayState !== 'paused' && !isPaused) {
        trackElem.style.animationPlayState = 'paused';
      }
    }
    
    function resumeDesktopAnimation() {
      if (!isPaused && trackElem && trackElem.style.animationPlayState !== 'running' && !wrapper.classList.contains('user-interacting')) {
        trackElem.style.animationPlayState = 'running';
      }
    }
    
    const applyMomentum = () => {
      if (Math.abs(desktopVelocity) > 0.3) {
        wrapper.scrollLeft -= desktopVelocity;
        desktopVelocity *= 0.96;
        momentumId = requestAnimationFrame(applyMomentum);
      } else {
        cancelAnimationFrame(momentumId);
        momentumId = null;
        resumeDesktopAnimation();
      }
    };
    
    wrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX;
      scrollLeft = wrapper.scrollLeft;
      pauseDesktopAnimation();
      if (momentumId) cancelAnimationFrame(momentumId);
      desktopVelocity = 0;
      wrapper.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX;
      const walk = (x - startX) * 1.2;
      wrapper.scrollLeft = scrollLeft - walk;
      desktopVelocity = walk * 0.2;
    });
    
    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        wrapper.style.cursor = 'grab';
        if (Math.abs(desktopVelocity) > 0.3) {
          momentumId = requestAnimationFrame(applyMomentum);
        } else {
          resumeDesktopAnimation();
        }
      }
    });
    
    console.log(`Logo slider initialized. Connection: ${connectionType}, Logos: ${logoCount}`);
  })();

;

  (function() {
    // View Guide Button functionality
    const guideBtn = document.getElementById('viewGuideBtn');
    if (guideBtn) {
      guideBtn.addEventListener('click', () => {
        window.location.href = 'contact-us.html?source=admission-guide';
      });
    }
    
    // Scroll-triggered card animations
    const cards = document.querySelectorAll('.process-card');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
      observer.observe(card);
    });
    
    // Progress Tracker based on scroll position
    const progressTrackerBar = document.getElementById('progressTrackerBar');
    const trackerDots = document.querySelectorAll('.tracker-dot');
    const section = document.querySelector('.admission-process-section');
    
    function updateProgress() {
      if (!section || !progressTrackerBar) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visible = Math.max(0, Math.min(1, (windowHeight - rect.top) / (rect.height + windowHeight)));
      if (progressTrackerBar) {
        progressTrackerBar.style.width = `${visible * 100}%`;
      }
      const activeStep = Math.floor(visible * 6) + 1;
      trackerDots.forEach((dot, idx) => {
        if (idx + 1 <= activeStep) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    setTimeout(updateProgress, 100);
    
    // Mobile Sticky CTA (appears after scrolling past header)
    const stickyCta = document.getElementById('stickyCta');
    const processHeader = document.querySelector('.process-header');
    let headerVisible = true;
    
    window.addEventListener('scroll', () => {
      if (processHeader && stickyCta) {
        const rect = processHeader.getBoundingClientRect();
        const isVisible = rect.bottom > 0;
        if (isVisible !== headerVisible) {
          headerVisible = isVisible;
          if (!headerVisible) {
            stickyCta.classList.add('visible');
          } else {
            stickyCta.classList.remove('visible');
          }
        }
      }
    });
    
    // GSAP animations for step numbers (optional – only if GSAP is available)
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(".step-number", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: ".process-grid", start: "top 80%" } }
      );
    }
  })();

;

  (function() {
    // Horizontal scroll with drag (mouse + touch)
    const trackContainer = document.getElementById('fullTrackContainer');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    if (trackContainer) {
      trackContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - trackContainer.offsetLeft;
        scrollLeft = trackContainer.scrollLeft;
        trackContainer.style.cursor = 'grabbing';
        e.preventDefault();
      });
      
      trackContainer.addEventListener('mouseleave', () => {
        isDown = false;
        trackContainer.style.cursor = 'grab';
      });
      
      trackContainer.addEventListener('mouseup', () => {
        isDown = false;
        trackContainer.style.cursor = 'grab';
      });
      
      trackContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - trackContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        trackContainer.scrollLeft = scrollLeft - walk;
      });
      
      // Touch events
      trackContainer.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - trackContainer.offsetLeft;
        scrollLeft = trackContainer.scrollLeft;
      });
      
      trackContainer.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - trackContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        trackContainer.scrollLeft = scrollLeft - walk;
      });
      
      trackContainer.addEventListener('touchend', () => {
        isDown = false;
      });
    }
    
    // Navigation buttons
    const prevBtn = document.getElementById('fullPrevBtn');
    const nextBtn = document.getElementById('fullNextBtn');
    
    if (prevBtn && trackContainer) {
      prevBtn.addEventListener('click', () => {
        trackContainer.scrollBy({ left: -320, behavior: 'smooth' });
      });
    }
    if (nextBtn && trackContainer) {
      nextBtn.addEventListener('click', () => {
        trackContainer.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }
    
    // Progress Bar based on scroll position
    const trackElement = document.querySelector('.journey-full-track');
    const progressBar = document.getElementById('fullProgressBar');
    
    function updateProgress() {
      if (!trackContainer || !progressBar || !trackElement) return;
      const scrollWidth = trackElement.scrollWidth - trackContainer.clientWidth;
      const scrolled = trackContainer.scrollLeft;
      if (scrollWidth > 0) {
        const percent = (scrolled / scrollWidth) * 100;
        progressBar.style.width = `${Math.min(percent, 100)}%`;
      }
    }
    
    if (trackContainer) {
      trackContainer.addEventListener('scroll', updateProgress);
      window.addEventListener('resize', updateProgress);
      setTimeout(updateProgress, 100);
    }
    
    // Scroll-triggered visibility animation
    const cards = document.querySelectorAll('.journey-full-card');
    const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    cards.forEach(card => observer.observe(card));
  })();

;

  (function () {
    // Partners logo movement is CSS-only and continuous. JS only duplicates rows once for a seamless loop.
    function preparePartnerRows() {
      document.querySelectorAll('.home-partners-section .marquee-wrapper').forEach((container) => {
        const track = container.querySelector('.marquee-track');
        if (!track || track.dataset.geesSmoothReady === '1') return;
        const originals = Array.from(track.children).filter((item) => !item.dataset.geesClone);
        if (!originals.length) return;
        const cloneSet = () => originals.forEach((item) => {
          const clone = item.cloneNode(true);
          clone.dataset.geesClone = 'true';
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
        cloneSet();
        requestAnimationFrame(() => {
          let guard = 0;
          while (track.scrollWidth < container.clientWidth * 2.4 && guard < 4) {
            cloneSet();
            guard += 1;
          }
          track.dataset.geesSmoothReady = '1';
          container.classList.remove('is-paused');
        });
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preparePartnerRows, { once: true });
    else preparePartnerRows();
    window.addEventListener('resize', preparePartnerRows, { passive: true });
  })();

;

  (function () {
    const carousel = document.getElementById('reviewsCarousel');
    const prevBtn = document.getElementById('prevReviewBtn');
    const nextBtn = document.getElementById('nextReviewBtn');
    const cards = Array.from(document.querySelectorAll('.review-card.gees-testimonial-card'));
    const dots = Array.from(document.querySelectorAll('.gees-testimonial-dots .dot'));

    if (!carousel || !prevBtn || !nextBtn || !cards.length) return;

    let currentIndex = 0;
    let autoScrollInterval = null;
    let touchStartX = 0;
    let touchDeltaX = 0;

    function normalizeIndex(index) {
      return (index + cards.length) % cards.length;
    }

    function updateCarouselPosition() {
      carousel.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        const active = index === currentIndex;
        dot.classList.toggle('is-active', active);
        dot.classList.toggle('bg-blue-600', active);
        dot.classList.toggle('dark:bg-blue-400', active);
        dot.classList.toggle('w-4', active);
        dot.classList.toggle('bg-gray-400', !active);
        dot.classList.toggle('dark:bg-gray-600', !active);
        dot.classList.toggle('w-2', !active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function goTo(index, shouldResetAuto = true) {
      currentIndex = normalizeIndex(index);
      updateCarouselPosition();
      updateDots();
      if (shouldResetAuto) resetAutoScroll();
    }

    function goToNext() {
      goTo(currentIndex + 1);
    }

    function goToPrev() {
      goTo(currentIndex - 1);
    }

    function resetAutoScroll() {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => goTo(currentIndex + 1, false), 6000);
    }

    cards.forEach((card) => {
      card.style.flex = '0 0 100%';
      card.style.maxWidth = '100%';
      card.style.minWidth = '100%';
    });

    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goTo(index));
    });

    carousel.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    carousel.addEventListener('touchmove', (event) => {
      touchDeltaX = event.touches[0].clientX - touchStartX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 45) {
        touchDeltaX < 0 ? goToNext() : goToPrev();
      }
      touchStartX = 0;
      touchDeltaX = 0;
    });

    window.addEventListener('resize', updateCarouselPosition);

    goTo(0, false);
    resetAutoScroll();
  })();

;

  // Dark mode
  const themeToggle = document.getElementById('themeToggleBtn');
  const htmlElem = document.documentElement;
  function setTheme(theme) {
    if (theme === 'dark') { htmlElem.classList.add('dark'); htmlElem.setAttribute('data-theme', 'dark'); }
    else { htmlElem.classList.remove('dark'); htmlElem.setAttribute('data-theme', 'light'); }
    if(themeToggle) themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  const savedTheme = localStorage.getItem('gees_theme');
  if (savedTheme === 'dark') setTheme('dark');
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  else setTheme('light');
  themeToggle?.addEventListener('click', () => {
    const newTheme = htmlElem.classList.contains('dark') ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('gees_theme', newTheme);
  });
  
  // Universal mobile header behavior is handled by /header.js.
  
  // Glow effect handled by global.js with requestAnimationFrame throttling.
  
  // Modal open/close (clean version) – NO ALERTS
  const knowBtn = document.getElementById('knowMoreBtnClean');
  const modal = document.getElementById('countryModalClean');
  const closeModal = document.getElementById('closeModalCleanBtn');
  if (knowBtn && modal) {
    knowBtn.addEventListener('click', () => {
      modal.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100', 'pointer-events-auto');
      const inner = modal.querySelector('div:first-child');
      if (inner) inner.classList.remove('scale-95');
    });
  }
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
      modal.classList.add('invisible', 'opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      const inner = modal.querySelector('div:first-child');
      if (inner) inner.classList.add('scale-95');
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal.click(); });
  }

  // Homepage live fuzzy search moved to index-search.js.

  // Keep dark class and universal data-theme perfectly synced.
  (function () {
    function syncHomeTheme(theme) {
      const isDark = theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.toggle('light', !isDark);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
    const saved = localStorage.getItem('gees_theme');
    if (saved === 'dark' || saved === 'light') syncHomeTheme(saved);
    document.addEventListener('gees:theme-change', function (event) {
      syncHomeTheme(event.detail && event.detail.theme === 'dark' ? 'dark' : 'light');
    });
  })();

;

(function(){
  'use strict';
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  ready(function(){
    const root = document.documentElement;
    document.body.classList.add('gees-home-page');
    document.body.setAttribute('data-page','home');

    // Instant dark-mode sync fallback, so there is no visible delay.
    const applyTheme = (theme) => {
      const dark = theme === 'dark';
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      root.classList.toggle('dark', dark);
      root.classList.toggle('light', !dark);
    };
    try { const saved = localStorage.getItem('gees_theme'); if (saved === 'dark' || saved === 'light') applyTheme(saved); } catch(e) {}
    document.addEventListener('click', function(e){
      const t = e.target.closest('[data-gees-theme-toggle], #themeToggle, #themeToggleBtn, .theme-toggle, [data-theme-toggle]');
      if (!t) return;
      setTimeout(() => applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'), 0);
    }, true);
    document.addEventListener('gees:theme-change', (e) => applyTheme(e.detail && e.detail.theme === 'dark' ? 'dark' : 'light'));

    // Replace old hero copy if old HTML still exists.
    const heroP = document.querySelector('main > section:first-of-type p');
    if (heroP && /Navigating global education/i.test(heroP.textContent)) {
      heroP.innerHTML = "<strong>Connecting you to the world's best education.</strong><br><span class='home-rotating-copy'>Expert guidance for admissions in <span class='home-country-rotator' id='homeCountryRotator'>Malaysia</span> and beyond.</span>";
    }

    // Rotating country typography.
    const rotator = document.getElementById('homeCountryRotator');
    if (rotator && !rotator.dataset.ready) {
      rotator.dataset.ready = '1';
      const countries = ['Malaysia','China','United Kingdom','Canada','Australia','USA','Ireland','New Zealand','Germany','France','UAE','Singapore','Japan','South Korea','Italy','Spain','Turkey'];
      let i = 0;
      setInterval(() => {
        rotator.classList.add('is-changing');
        setTimeout(() => { i = (i + 1) % countries.length; rotator.textContent = countries[i]; rotator.classList.remove('is-changing'); }, 220);
      }, 1850);
    }

    // Add count-up attributes if missing and animate when visible.
    const statLabels = [
      ['25K+', '25', 'K+'], ['150+', '150', '+'], ['98%', '98', '%'], ['12+', '12', '+']
    ];
    statLabels.forEach(([txt, count, suffix]) => {
      [...document.querySelectorAll('.text-h2, .font-h2')].find(el => el.textContent.trim() === txt)?.setAttribute('data-count', count);
      const el = [...document.querySelectorAll('.text-h2, .font-h2')].find(el => el.textContent.trim() === txt || (el.dataset.count === count && !el.dataset.countReady));
      if (el) { el.dataset.count = count; el.dataset.suffix = suffix; el.dataset.duration = '1200'; el.dataset.countReady = '1'; }
    });
    const counters = [...document.querySelectorAll('[data-count]')];
    const seen = new WeakSet();
    function animate(el){
      if (seen.has(el)) return; seen.add(el);
      const target = Number(el.dataset.count || 0), suffix = el.dataset.suffix || '', duration = Number(el.dataset.duration || 1200);
      let start = performance.now();
      function tick(now){
        const p = Math.min(1, (now-start)/duration); const eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); } }), {threshold:.35});
      counters.forEach(c => io.observe(c));
    } else counters.forEach(animate);

    // Scroll reveal: light, GPU-friendly, staggered.
    const revealTargets = [...document.querySelectorAll('main > section, .process-card, .expert-card, .journey-full-card, .review-card, main article')];
    revealTargets.forEach((el, idx) => { if (!el.classList.contains('gees-home-reveal')) { el.classList.add('gees-home-reveal'); el.style.transitionDelay = Math.min(idx % 8 * 45, 240) + 'ms'; } });
    if ('IntersectionObserver' in window) {
      const rio = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); rio.unobserve(entry.target); } }), {threshold:.08, rootMargin:'0px 0px -8% 0px'});
      revealTargets.forEach(el => rio.observe(el));
    } else revealTargets.forEach(el => el.classList.add('is-visible'));

    // Make all images cheaper to decode unless explicitly hero/eager.
    document.querySelectorAll('main img').forEach(img => {
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
      if (!img.hasAttribute('fetchpriority') && !img.hasAttribute('loading')) img.setAttribute('loading','lazy');
    });
  });
})();


// GEES index hardening: ensure slow partner button stays hidden and images are decoded async.
document.addEventListener('DOMContentLoaded', function(){
  var slow = document.getElementById('slowConnectionBtn');
  if (slow) { slow.hidden = true; slow.style.display = 'none'; }
  document.querySelectorAll('img').forEach(function(img){ if(!img.decoding) img.decoding='async'; });
});


/* =========================================================
   GEES INDEX FINAL ADJUSTMENTS — SEARCH + SERVICES + SCROLL
   ========================================================= */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  ready(function () {
    // Keep desktop mouse-wheel scrolling enabled even if a previous modal/slider left overflow locked.
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    document.body.classList.remove('gees-scroll-locked');

    // Move the search dropdown into the search shell so it always opens directly under the input.
    const input = document.getElementById('mainSearchInput');
    const panel = document.getElementById('homeSearchSuggestions');
    const shell = input && input.closest('.command-bar.home-search-shell, .yu-hero-search');
    if (input && panel && shell && panel.parentElement !== shell) {
      shell.appendChild(panel);
    }

    if (input) {
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('spellcheck', 'false');
    }

    // Prevent horizontal sliders from trapping normal desktop vertical wheel scrolling.
    document.querySelectorAll('.slider-wrapper, .journey-full-track-container, .gees-services-rail, .marquee-wrapper').forEach((el) => {
      el.addEventListener('wheel', function (event) {
        if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) return;
      }, { passive: true });
    });
  });
})();

(function () {
  'use strict';

  const state = {
    rail: null,
    track: null,
    originals: [],
    offset: 0,
    baseWidth: 0,
    speed: 34,
    paused: false,
    last: 0,
    raf: 0
  };

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  function normalize() {
    if (!state.baseWidth) return;
    while (state.offset >= state.baseWidth) state.offset -= state.baseWidth;
    while (state.offset < 0) state.offset += state.baseWidth;
  }

  function render() {
    normalize();
    if (state.track) state.track.style.transform = `translate3d(${-state.offset}px, 0, 0)`;
  }

  function measure() {
    if (!state.track || !state.originals.length) return;
    const firstClone = state.track.querySelector('[data-service-clone="true"]');
    state.baseWidth = firstClone ? firstClone.offsetLeft : Math.max(1, state.track.scrollWidth / 2);
    render();
  }

  function tick(now) {
    if (!state.last) state.last = now;
    const delta = Math.min(64, now - state.last);
    state.last = now;
    if (!state.paused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      state.offset += (state.speed * delta) / 1000;
      render();
    }
    state.raf = requestAnimationFrame(tick);
  }

  function step(direction) {
    if (!state.originals.length) return;
    const first = state.originals[0];
    const gap = parseFloat(getComputedStyle(state.track).columnGap || getComputedStyle(state.track).gap || '0') || 0;
    const amount = Math.max(220, Math.min(state.rail.clientWidth * 0.82, first.getBoundingClientRect().width + gap));
    state.offset += direction * amount;
    render();
  }

  function setupServicesSlider() {
    const rail = document.querySelector('[data-gees-service-rail], .gees-services-rail');
    if (!rail || rail.dataset.geesInfiniteReady === '1') return;

    const currentSlides = Array.from(rail.querySelectorAll(':scope > .gees-service-slide'));
    if (!currentSlides.length) return;

    const track = document.createElement('div');
    track.className = 'gees-services-track';
    currentSlides.forEach((slide) => track.appendChild(slide));
    rail.appendChild(track);

    const originals = Array.from(track.children).filter((slide) => !slide.dataset.serviceClone);
    originals.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.dataset.serviceClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    state.rail = rail;
    state.track = track;
    state.originals = originals;
    rail.dataset.geesInfiniteReady = '1';

    requestAnimationFrame(() => {
      let guard = 0;
      while (track.scrollWidth < rail.clientWidth * 2.4 && guard < 4) {
        originals.forEach((slide) => {
          const clone = slide.cloneNode(true);
          clone.dataset.serviceClone = 'true';
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
        guard += 1;
      }
      measure();
      cancelAnimationFrame(state.raf);
      state.raf = requestAnimationFrame(tick);
    });

    rail.addEventListener('mouseenter', () => { state.paused = true; });
    rail.addEventListener('mouseleave', () => { state.paused = false; });
    rail.addEventListener('focusin', () => { state.paused = true; });
    rail.addEventListener('focusout', () => { state.paused = false; });

    document.querySelector('[data-service-scroll="prev"]')?.addEventListener('click', () => step(-1));
    document.querySelector('[data-service-scroll="next"]')?.addEventListener('click', () => step(1));

    window.addEventListener('resize', measure, { passive: true });
  }

  ready(setupServicesSlider);
})();
