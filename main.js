/**
 * ELARION — Premium Fantasy Board Game Landing Page
 * main.js — All interactive features & animations
 */

'use strict';

/* =============================================
   LOADING SCREEN
   ============================================= */
(function initLoader() {
  document.body.classList.add('loading');
  const fill = document.getElementById('loading-fill');
  const text = document.getElementById('loading-text');
  const screen = document.getElementById('loading-screen');

  const messages = [
    'Entering the realm...',
    'Summoning ancient magic...',
    'Raising the keep...',
    'Awakening the heroes...',
    'Welcome to Elarion!'
  ];

  let progress = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.classList.remove('loading');
        // Trigger initial animations
        triggerHeroAnimations();
      }, 500);
    }

    fill.style.width = Math.min(progress, 100) + '%';
    const newIdx = Math.min(Math.floor(progress / 25), messages.length - 1);
    if (newIdx !== msgIdx) {
      msgIdx = newIdx;
      text.style.opacity = '0';
      setTimeout(() => {
        text.textContent = messages[msgIdx];
        text.style.opacity = '1';
      }, 200);
    }
  }, 120);
})();

/* =============================================
   CUSTOM CURSOR
   ============================================= */
(function initCursor() {
  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  if (!outer || !inner) return;

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = mouseX + 'px';
    inner.style.top = mouseY + 'px';
  });

  function animateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    outer.style.left = outerX + 'px';
    outer.style.top = outerY + 'px';
    raf = requestAnimationFrame(animateOuter);
  }
  animateOuter();

  // Scale on interactive elements
  const interactiveEls = 'a, button, .gallery-item, .hero-card, .gameplay-card, .faq-question, .pricing-card';
  document.querySelectorAll(interactiveEls).forEach(el => {
    el.addEventListener('mouseenter', () => outer.style.transform = 'translate(-50%, -50%) scale(1.6)');
    el.addEventListener('mouseleave', () => outer.style.transform = 'translate(-50%, -50%) scale(1)');
  });

  document.addEventListener('mouseleave', () => {
    outer.style.opacity = '0';
    inner.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    outer.style.opacity = '1';
    inner.style.opacity = '1';
  });
})();

/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* =============================================
   NAVBAR
   ============================================= */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (!navbar) return;

  // Scroll state
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);

      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      }
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* =============================================
   PARTICLES
   ============================================= */
(function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const count = 40;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = 6 + Math.random() * 8;
    const del = Math.random() * -dur;
    const tx = (Math.random() - 0.5) * 120;
    const ty = -(50 + Math.random() * 150);
    const size = 1 + Math.random() * 3;

    p.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      --dur: ${dur}s;
      --del: ${del}s;
      --tx: ${tx}px;
      --ty: ${ty}px;
      width: ${size}px;
      height: ${size}px;
      opacity: ${0.3 + Math.random() * 0.7};
    `;

    container.appendChild(p);
  }
})();

/* =============================================
   PARALLAX HERO
   ============================================= */
(function initParallax() {
  const bg = document.getElementById('hero-bg-img');
  if (!bg) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const speed = 0.35;
    bg.style.transform = `scale(1.05) translateY(${scrollY * speed}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* =============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.style.getPropertyValue('--delay') || '0');
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay * 1000);

        // Trigger stat bars for hero cards
        if (el.classList.contains('hero-card')) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay * 1000 + 200);
        }

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   HERO ANIMATIONS ON LOAD
   ============================================= */
function triggerHeroAnimations() {
  initScrollReveal();
}

/* =============================================
   GALLERY LIGHTBOX
   ============================================= */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;

  function getImageData(item) {
    const img = item.querySelector('img');
    const label = item.querySelector('.gallery-label');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: label ? label.textContent : ''
    };
  }

  function openLightbox(index) {
    currentIndex = index;
    const data = getImageData(galleryItems[currentIndex]);
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    const data = getImageData(galleryItems[currentIndex]);
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      lightboxCaption.textContent = data.caption;
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  prevBtn && prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn && nextBtn.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (lightbox.style.display !== 'none' && lightbox.style.display !== '') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    }
  });
})();

/* =============================================
   VIDEO PLAY BUTTON
   ============================================= */
(function initVideo() {
  const playBtn = document.getElementById('play-btn');
  const placeholder = document.getElementById('video-placeholder');
  const videoFrame = document.getElementById('video-frame');

  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    // In production, replace with actual YouTube embed
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
    iframe.allow = 'autoplay; encrypted-media; fullscreen';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%;height:100%;border:none;aspect-ratio:16/9;border-radius:inherit;';
    iframe.title = 'ELARION Game Trailer';

    placeholder.style.opacity = '0';
    placeholder.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (videoFrame) {
        videoFrame.innerHTML = '';
        videoFrame.appendChild(iframe);
      }
    }, 300);

    showToast('🎬 Loading trailer...');
  });
})();

/* =============================================
   TESTIMONIALS CAROUSEL
   ============================================= */
(function initCarousel() {
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const slides = document.querySelectorAll('.testimonial-slide');

  if (!track || slides.length === 0) return;

  let current = 0;
  let autoPlay;
  const total = slides.length;

  // Create dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => goTo(idx));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === current);
    });
  }

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  function startAuto() {
    autoPlay = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(autoPlay);
    startAuto();
  }

  startAuto();

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
      resetAuto();
    }
  });
})();

/* =============================================
   FAQ ACCORDION
   ============================================= */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* =============================================
   SMOOTH SCROLL
   ============================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* =============================================
   NEWSLETTER FORM
   ============================================= */
function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsletter-email');
  const msg = document.getElementById('newsletter-msg');
  const btn = document.getElementById('newsletter-submit-btn');

  if (!input || !msg) return;

  const email = input.value.trim();
  if (!email) return;

  btn.disabled = true;
  btn.innerHTML = '⏳';
  msg.textContent = '';
  msg.className = 'newsletter-note';

  // Simulate API call
  setTimeout(() => {
    msg.textContent = '✓ Thank you! You\'ll hear from us soon.';
    msg.className = 'newsletter-note success';
    input.value = '';
    btn.innerHTML = '✓';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

    showToast('✉ Successfully subscribed to ELARION updates!');

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '→';
      btn.style.background = '';
    }, 5000);
  }, 1200);
}

/* =============================================
   TOAST NOTIFICATION
   ============================================= */
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* =============================================
   PRICING CARD PRE-ORDER BUTTONS
   ============================================= */
(function initPricingButtons() {
  const buttons = {
    'btn-std': { name: 'Standard Edition', price: '$79.99' },
    'btn-col': { name: 'Collector Edition', price: '$129.99' },
    'btn-leg': { name: 'Legendary Edition', price: '$249.99' }
  };

  Object.entries(buttons).forEach(([id, info]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`⚔ Pre-ordering ${info.name} — ${info.price}`);
    });
  });
})();

/* =============================================
   MAGICAL GLOW EFFECT ON SCROLL
   ============================================= */
(function initScrollGlow() {
  const logoImg = document.querySelector('.hero-logo-img');
  if (!logoImg) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const alpha = Math.max(0, 1 - scrollY / 500);
    const p = Math.round(56 * alpha);
    const b = Math.round(112 * alpha);
    logoImg.style.filter = alpha > 0.05
      ? `drop-shadow(0 0 ${p}px rgba(109,40,217,${0.65 * alpha})) drop-shadow(0 0 ${b}px rgba(37,99,235,${0.35 * alpha}))`
      : '';
  }, { passive: true });
})();

/* =============================================
   TIMELINE ANIMATION
   ============================================= */
(function initTimeline() {
  const line = document.querySelector('.timeline-line');
  if (!line) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        line.style.animation = 'fill-line 2s ease forwards';
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(line);
})();

/* =============================================
   FLOATING IMAGES EFFECT (World Map)
   ============================================= */
(function initMapFloat() {
  const mapFrame = document.querySelector('.world-map-frame');
  if (!mapFrame) return;

  let bounds;
  let isHovering = false;

  mapFrame.addEventListener('mouseenter', () => {
    isHovering = true;
    bounds = mapFrame.getBoundingClientRect();
  });

  mapFrame.addEventListener('mouseleave', () => {
    isHovering = false;
    mapFrame.style.transform = '';
  });

  mapFrame.addEventListener('mousemove', (e) => {
    if (!isHovering || !bounds) return;
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    const rotX = y * -6;
    const rotY = x * 8;
    mapFrame.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
    mapFrame.style.transition = 'transform 0.1s ease';
  });
})();

/* =============================================
   STATS COUNTER ANIMATION
   ============================================= */
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number, .vstat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const rawText = el.textContent;
      const match = rawText.match(/(\d+(?:\.\d+)?)(.*)/);
      if (!match) return;

      const target = parseFloat(match[1]);
      const suffix = match[2] || '';
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = target * ease;

        el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;

        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();

/* =============================================
   PRICING CARD SPARKLE EFFECT
   ============================================= */
(function initPricingSparkle() {
  const pricingCards = document.querySelectorAll('.pricing-card');

  pricingCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();

/* =============================================
   HERO SECTION MOUSE LIGHT EFFECT
   ============================================= */
(function initHeroMouseLight() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    hero.style.setProperty('--light-x', x + 'px');
    hero.style.setProperty('--light-y', y + 'px');
  });
})();

/* =============================================
   KEYBOARD NAVIGATION IMPROVEMENTS
   ============================================= */
(function initKeyboardNav() {
  // Add visible focus styles for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
})();

/* =============================================
   HERO SCROLL INDICATOR HIDE ON SCROLL
   ============================================= */
(function initScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 1 - window.scrollY / 200);
    indicator.style.opacity = opacity;
    indicator.style.pointerEvents = opacity < 0.1 ? 'none' : '';
  }, { passive: true });
})();

/* =============================================
   COMPONENT CARDS ANIMATION DELAY
   ============================================= */
(function setAnimationDelays() {
  // Gameplay cards stagger
  document.querySelectorAll('.gameplay-card').forEach((card, i) => {
    card.style.setProperty('--delay', (i * 0.07) + 's');
  });

  // Hero cards stagger
  document.querySelectorAll('.hero-card').forEach((card, i) => {
    card.style.setProperty('--delay', (i * 0.07) + 's');
  });
})();

/* =============================================
   INIT ON DOM READY
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll-based reveals after loading
  // (main initialization happens after loader)
  console.log('%c⚔ ELARION ⚔', 'color: #D4AF37; font-family: serif; font-size: 24px; font-weight: bold;');
  console.log('%cA Strategic Fantasy Board Game', 'color: #9CA3AF; font-size: 12px;');
});
