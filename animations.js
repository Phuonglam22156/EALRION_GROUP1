/**
 * ELARION — Advanced Animation Engine
 * animations.js — GSAP + Lenis + Three.js + Howler
 * 
 * Load order: GSAP, ScrollTrigger, Lenis, Three.js, Howler → this file
 */

'use strict';

/* ============================================================
   PERFORMANCE: Respect reduced motion preference
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const cpuTier = navigator.hardwareConcurrency >= 8 ? 'high' : navigator.hardwareConcurrency >= 4 ? 'mid' : 'low';
const PARTICLE_COUNT = cpuTier === 'high' ? 180 : cpuTier === 'mid' ? 100 : 60;

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Sync with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

/* ============================================================
   LOADING SCREEN — GSAP CINEMATIC TIMELINE
   ============================================================ */
function initCinematicLoader() {
  const screen = document.getElementById('loading-screen');
  const logoImg = document.querySelector('.loading-logo-img');
  const fill = document.getElementById('loading-fill');
  const percentText = document.getElementById('loading-percent');
  const runeCanvas = document.getElementById('loading-rune-canvas');
  const sword = document.getElementById('loading-sword');
  const crystalGlow = document.querySelector('.loading-crystal-glow');
  const energyRings = document.querySelectorAll('.loading-energy-ring');

  if (!screen) return;

  // Skip fancy animation if gsap not loaded
  if (typeof gsap === 'undefined') return;

  gsap.set(logoImg, { opacity: 0, scale: 0.85, filter: 'brightness(0)' });
  gsap.set(sword, { opacity: 0, y: -160, scale: 0.7 });
  gsap.set(crystalGlow, { opacity: 0, scale: 0 });
  energyRings.forEach(r => gsap.set(r, { opacity: 0, scale: 0 }));

  const tl = gsap.timeline({ delay: 0.2 });

  // Logo fades in
  tl.to(logoImg, {
    opacity: 1,
    scale: 1,
    filter: 'brightness(1)',
    duration: 1.4,
    ease: 'power2.out'
  });

  // Crystal glows
  tl.to(crystalGlow, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'back.out(2)'
  }, '-=0.6');

  // Energy rings spread
  tl.to(energyRings, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  }, '-=0.4');

  // Silver light sweep across logo
  tl.to('.loading-sweep', {
    x: '200%',
    duration: 0.9,
    ease: 'power2.inOut'
  }, '-=0.2');

  // Sword descends
  tl.to(sword, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    ease: 'elastic.out(1, 0.6)'
  }, '-=0.4');

  // Progress bar fills
  let pct = 0;
  const messages = [
    'Entering the realm...',
    'Summoning ancient magic...',
    'Raising the keep...',
    'Awakening the heroes...',
    'Welcome to Elarion!'
  ];

  const progressTween = { v: 0 };
  tl.to(progressTween, {
    v: 100,
    duration: 2.2,
    ease: 'power1.inOut',
    onUpdate: function() {
      const val = Math.round(progressTween.v);
      if (fill) fill.style.width = val + '%';
      if (percentText) percentText.textContent = val + '%';
      const idx = Math.min(Math.floor(val / 25), messages.length - 1);
      const textEl = document.getElementById('loading-text');
      if (textEl) textEl.textContent = messages[idx];
    }
  }, '-=0.8');

  // Fade out loading screen
  tl.to(screen, {
    opacity: 0,
    duration: 0.9,
    ease: 'power2.inOut',
    onComplete: () => {
      screen.style.display = 'none';
      document.body.classList.remove('loading');
      // Trigger hero entrance
      triggerHeroEntrance();
    }
  }, '+=0.2');

  // Animate rune rotation
  if (runeCanvas) {
    animateLoadingRune(runeCanvas);
  }
}

function animateLoadingRune(canvas) {
  const ctx = canvas.getContext('2d');
  const size = 240;
  canvas.width = size;
  canvas.height = size;
  const cx = size / 2;
  const cy = size / 2;
  let angle = 0;

  function drawRune() {
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(109, 40, 217, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rune segments
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r1 = 75;
      const r2 = 100;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.strokeStyle = `rgba(37, 99, 235, ${0.2 + Math.abs(Math.sin(angle * 2 + i)) * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Inner stars
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = 50;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${0.4 + Math.abs(Math.sin(angle + i * 0.5)) * 0.6})`;
      ctx.fill();
    }

    ctx.restore();

    // Counter-rotate inner ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-angle * 1.5);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const r = 88;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
      ctx.fill();
    }
    ctx.restore();

    angle += 0.008;
    requestAnimationFrame(drawRune);
  }

  drawRune();
}

/* ============================================================
   HERO ENTRANCE ANIMATION
   ============================================================ */
function triggerHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  const badge = document.querySelector('.hero-badge');
  const logoImg = document.querySelector('.hero-logo-img');
  const subtitle = document.querySelector('.hero-subtitle');
  const desc = document.querySelector('.hero-desc');
  const actions = document.querySelector('.hero-actions');
  const stats = document.querySelector('.hero-stats');

  gsap.set([badge, logoImg, subtitle, desc, actions, stats], {
    opacity: 0,
    y: 30
  });

  gsap.to([badge, logoImg, subtitle, desc, actions, stats], {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.1
  });

  // Start particle systems after hero loads
  setTimeout(() => {
    initHeroThreeJs();
  }, 400);
}

/* ============================================================
   CUSTOM CURSOR — CRYSTAL TRAIL
   ============================================================ */
function initCrystalCursor() {
  if (isMobile) return;

  const canvas = document.getElementById('cursor-trail-canvas');
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const ctx = canvas.getContext('2d');

  const trail = [];
  const MAX_TRAIL = 28;
  let mouseX = -200, mouseY = -200;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    trail.push({
      x: mouseX,
      y: mouseY,
      life: 1,
      size: 3 + Math.random() * 3,
      hue: 210 + Math.random() * 40, // blue range
      sparkle: Math.random() > 0.7
    });

    if (trail.length > MAX_TRAIL) trail.shift();
  });

  // Click ripple
  document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
  });

  function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.getElementById('cursor-ripple-container').appendChild(ripple);
    setTimeout(() => ripple.remove(), 900);
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      p.life -= 0.04;
      if (p.life <= 0) { trail.splice(i, 1); i--; continue; }

      const alpha = p.life * 0.85;
      const size = p.size * p.life;

      if (p.sparkle) {
        // Star shape
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * 3);
        drawStar(ctx, 0, 0, size * 1.2, size * 0.5, 4);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${alpha * 0.7})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.5)`;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
    }

    requestAnimationFrame(render);
  }

  function drawStar(ctx, cx, cy, outerR, innerR, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
  }

  render();

  // Magnetic hover on buttons
  if (!prefersReducedMotion) {
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .btn-pricing').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.12;
        const dy = (e.clientY - cy) * 0.12;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }
}

/* ============================================================
   THREE.JS — HERO MAGIC PARTICLES
   ============================================================ */
function initHeroThreeJs() {
  if (typeof THREE === 'undefined' || isMobile || prefersReducedMotion) return;

  const canvas = document.getElementById('hero-magic-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.z = 3;

  // Particle geometry
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

    // Blue/gold colors
    const isgold = Math.random() > 0.8;
    colors[i * 3] = isgold ? 0.83 : 0.15 + Math.random() * 0.2;
    colors[i * 3 + 1] = isgold ? 0.69 : 0.3 + Math.random() * 0.3;
    colors[i * 3 + 2] = isgold ? 0.21 : 0.85 + Math.random() * 0.15;

    sizes[i] = 0.5 + Math.random() * 2.5;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Mouse parallax
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
  });

  const clock = new THREE.Clock();
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;

    // Breathing scale
    const breathe = 1 + Math.sin(t * 0.5) * 0.03;
    particles.scale.setScalar(breathe);

    // Mouse parallax
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (-targetY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Pause when not in viewport
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) {
        cancelAnimationFrame(animId);
      } else {
        animate();
      }
    });
  });
  observer.observe(canvas);
}

/* ============================================================
   GSAP SCROLL REVEAL SYSTEM
   ============================================================ */
function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback to CSS class-based
    return;
  }

  // Register plugin
  gsap.registerPlugin(ScrollTrigger);

  // Sync lenis with GSAP
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
  }

  // ----- Fade Up -----
  gsap.utils.toArray('.anim-fade-up').forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  // ----- Slide Left -----
  gsap.utils.toArray('.anim-slide-left').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      x: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  // ----- Slide Right -----
  gsap.utils.toArray('.anim-slide-right').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      x: 80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  // ----- Scale In -----
  gsap.utils.toArray('.anim-scale-in').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      scale: 0.8,
      opacity: 0,
      duration: 0.9,
      ease: 'back.out(1.5)',
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  // ----- Blur Reveal -----
  gsap.utils.toArray('.anim-blur-reveal').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      filter: 'blur(20px)',
      opacity: 0,
      y: 30,
      duration: 1.1,
      ease: 'power2.out',
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  // ----- Rotate Reveal -----
  gsap.utils.toArray('.anim-rotate-reveal').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      rotationX: 35,
      opacity: 0,
      transformOrigin: 'top center',
      duration: 1,
      ease: 'power3.out',
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  // ----- Stagger grid items -----
  gsap.utils.toArray('.anim-stagger-grid').forEach(grid => {
    const items = grid.querySelectorAll('.anim-stagger-item');
    gsap.from(items, {
      scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' },
      y: 50,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: 'power3.out',
    });
  });

  // ----- Parallax backgrounds -----
  gsap.utils.toArray('.anim-parallax-bg').forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: '25%',
      ease: 'none',
    });
  });

  // ----- Timeline items scroll narrative -----
  document.querySelectorAll('.timeline-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  });

  // ----- Section headers cinematic -----
  document.querySelectorAll('.section-title').forEach(title => {
    splitTextReveal(title);
  });

  // ----- Parallax floating layers at diff speeds -----
  initParallaxLayers();

  // ----- Product box 3D rotation on scroll -----
  initProductBoxAnimation();
}

/* ============================================================
   TEXT SPLIT — CINEMATIC CHARACTER REVEAL
   ============================================================ */
function splitTextReveal(el) {
  if (!el || typeof gsap === 'undefined') return;
  if (el.dataset.split) return; // already processed
  el.dataset.split = '1';

  const text = el.textContent;
  el.innerHTML = '';
  el.style.overflow = 'visible';

  // Wrap in mask
  const mask = document.createElement('div');
  mask.style.cssText = 'overflow:hidden; display:inline-block;';

  const inner = document.createElement('div');
  inner.style.display = 'inline-block';

  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00a0' : char;
    span.style.cssText = 'display:inline-block; will-change:transform;';
    inner.appendChild(span);
  });

  mask.appendChild(inner);
  el.appendChild(mask);

  const chars = inner.querySelectorAll('span');
  gsap.set(chars, { y: '105%', opacity: 0 });

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(chars, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.025,
        ease: 'power3.out',
      });
    }
  });
}

/* ============================================================
   PARALLAX FLOATING LAYERS
   ============================================================ */
function initParallaxLayers() {
  if (typeof gsap === 'undefined') return;

  // Hero background parallax (scrub)
  const heroBg = document.getElementById('hero-bg-img');
  if (heroBg) {
    gsap.to(heroBg, {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
      y: '20%',
      scale: 1.1,
      ease: 'none',
    });
  }

  // Fog layers
  document.querySelectorAll('.fog-layer').forEach((fog, i) => {
    gsap.to(fog, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1 + i * 0.5,
      },
      y: -(50 + i * 30),
      ease: 'none',
    });
  });
}

/* ============================================================
   PRODUCT BOX 3D ANIMATION
   ============================================================ */
function initProductBoxAnimation() {
  const boxes = document.querySelectorAll('.component-img-wrap');

  boxes.forEach(box => {
    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = x * 18;
      const rotX = -y * 14;

      if (typeof gsap !== 'undefined') {
        gsap.to(box, {
          rotationY: rotY,
          rotationX: rotX,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power2.out',
        });
        const shine = box.querySelector('.component-shine');
        if (shine) {
          gsap.to(shine, {
            x: x * 100 + '%',
            y: y * 100 + '%',
            opacity: 0.6,
            duration: 0.3,
          });
        }
      }
    });

    box.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(box, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
        const shine = box.querySelector('.component-shine');
        if (shine) {
          gsap.to(shine, { opacity: 0, duration: 0.3 });
        }
      }
    });
  });
}

/* ============================================================
   3D CARD TILT EFFECT
   ============================================================ */
function initCardTilt() {
  const cards = document.querySelectorAll(
    '.hero-card, .gameplay-card, .faction-card, .gallery-item, .pricing-card, .team-card, .component-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = -y * 12;
      const rotY = x * 14;

      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotationX: rotX,
          rotationY: rotY,
          transformPerspective: 900,
          z: 20,
          scale: 1.03,
          duration: 0.2,
          ease: 'power2.out',
        });
      }

      // Glass highlight
      const highlight = card.querySelector('.card-glass-highlight');
      if (highlight) {
        highlight.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
        highlight.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          z: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      }
      const highlight = card.querySelector('.card-glass-highlight');
      if (highlight) highlight.style.opacity = '0';
    });
  });
}

/* ============================================================
   HERO MOUSE PARALLAX — CONTENT
   ============================================================ */
function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  let cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    cx += (x - cx) * 0.06;
    cy += (y - cy) * 0.06;
    heroContent.style.transform = `translate(${cx}px, ${cy}px)`;
  });
}

/* ============================================================
   BUTTON EFFECTS — ENERGY BORDER + RIPPLE
   ============================================================ */
function initButtonEffects() {
  // Click ripple on all buttons
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-pricing, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple-effect';
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.cssText = `left:${x}px;top:${y}px;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Energy pulse on .btn-primary hover
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (typeof gsap === 'undefined') return;
      gsap.fromTo(btn, { boxShadow: '0 0 0px rgba(109,40,217,0)' }, {
        boxShadow: '0 0 40px rgba(109,40,217,0.7), 0 0 80px rgba(37,99,235,0.3)',
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      if (typeof gsap === 'undefined') return;
      gsap.to(btn, {
        boxShadow: '0 0 0px rgba(109,40,217,0)',
        duration: 0.4,
      });
    });
  });
}

/* ============================================================
   FACTION CARDS — UNIQUE ANIMATIONS
   ============================================================ */
function initFactionAnimations() {
  // Fire faction — animated flame using requestAnimationFrame on canvas
  const fireCard = document.getElementById('faction-fire');
  if (fireCard) {
    const canvas = fireCard.querySelector('.faction-element-canvas');
    if (canvas) animateFire(canvas);
  }

  // Water faction
  const waterCard = document.getElementById('faction-water');
  if (waterCard) {
    const canvas = waterCard.querySelector('.faction-element-canvas');
    if (canvas) animateWater(canvas);
  }

  // Time faction
  const timeCard = document.getElementById('faction-time');
  if (timeCard) {
    const canvas = timeCard.querySelector('.faction-element-canvas');
    if (canvas) animateTime(canvas);
  }

  // Dream faction
  const dreamCard = document.getElementById('faction-dream');
  if (dreamCard) {
    const canvas = dreamCard.querySelector('.faction-element-canvas');
    if (canvas) animateDream(canvas);
  }

  // Guardian faction
  const guardianCard = document.getElementById('faction-guardian');
  if (guardianCard) {
    const canvas = guardianCard.querySelector('.faction-element-canvas');
    if (canvas) animateGuardian(canvas);
  }

  // Thunder faction
  const thunderCard = document.getElementById('faction-thunder');
  if (thunderCard) {
    const canvas = thunderCard.querySelector('.faction-element-canvas');
    if (canvas) animateThunder(canvas);
  }

  // Hover expand + bg change
  const factionCards = document.querySelectorAll('.faction-card');
  const factionSection = document.getElementById('factions');

  const factionColors = {
    'faction-fire': '#1a0800',
    'faction-water': '#001a2e',
    'faction-time': '#0d0d1a',
    'faction-dream': '#120d1a',
    'faction-guardian': '#001a0a',
    'faction-thunder': '#0d1a00',
  };

  factionCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const bg = factionColors[card.id] || '#09090B';
      if (typeof gsap !== 'undefined' && factionSection) {
        gsap.to(factionSection, { backgroundColor: bg, duration: 0.5 });
      }
    });
    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined' && factionSection) {
        gsap.to(factionSection, { backgroundColor: '#09090B', duration: 0.5 });
      }
    });
  });
}

// --- Fire ---
function animateFire(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120;
  const H = canvas.height = 120;
  const particles = [];

  for (let i = 0; i < 50; i++) particles.push(newFireParticle(W, H));

  function newFireParticle(W, H) {
    return {
      x: W / 2 + (Math.random() - 0.5) * 40,
      y: H - 5,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(1.5 + Math.random() * 2.5),
      life: 1,
      decay: 0.012 + Math.random() * 0.018,
      size: 4 + Math.random() * 8,
    };
  }

  function drawFire() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.04;
      p.life -= p.decay;
      if (p.life <= 0) Object.assign(p, newFireParticle(W, H));

      const alpha = p.life;
      const r = Math.round(255);
      const g = Math.round(p.life * 200);
      const b = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * p.life);
      grad.addColorStop(0, `rgba(${r},${g},0,${alpha * 0.9})`);
      grad.addColorStop(1, `rgba(255,50,0,0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(drawFire);
  }
  drawFire();
}

// --- Water ---
function animateWater(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120;
  const H = canvas.height = 120;
  let t = 0;

  function drawWater() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 3; i >= 0; i--) {
      ctx.beginPath();
      const baseY = H * 0.4 + i * 8;
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= W; x += 2) {
        const y = baseY + Math.sin((x / W) * Math.PI * 3 + t + i * 1.2) * (8 - i);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const alpha = 0.15 + i * 0.12;
      ctx.fillStyle = `rgba(37, 150, 235, ${alpha})`;
      ctx.fill();
    }

    // Bubbles
    for (let b = 0; b < 6; b++) {
      const bx = (Math.sin(t * 0.5 + b * 1.7) * 0.5 + 0.5) * W;
      const by = H - ((t * 20 + b * 18) % H);
      ctx.beginPath();
      ctx.arc(bx, by, 2 + b * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 200, 255, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    t += 0.025;
    requestAnimationFrame(drawWater);
  }
  drawWater();
}

// --- Time ---
function animateTime(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120;
  const H = canvas.height = 120;
  const cx = W / 2, cy = H / 2;
  let t = 0;
  const floatingClocks = Array.from({ length: 12 }, (_, i) => ({
    a: (i / 12) * Math.PI * 2,
    r: 35 + Math.random() * 15,
    speed: 0.003 + Math.random() * 0.004,
    size: 3 + Math.random() * 4,
  }));

  function drawTime() {
    ctx.clearRect(0, 0, W, H);

    // Clock face
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(150, 100, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * 36;
      const y1 = cy + Math.sin(a) * 36;
      const x2 = cx + Math.cos(a) * 42;
      const y2 = cy + Math.sin(a) * 42;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(200, 160, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Hands
    const hAngle = t * 0.2 - Math.PI / 2;
    const mAngle = t * 1.2 - Math.PI / 2;
    const sAngle = t * 6 - Math.PI / 2;

    [[30, hAngle, 'rgba(180,130,255,0.9)', 2.5],
     [38, mAngle, 'rgba(130,100,255,0.8)', 1.5],
     [40, sAngle, 'rgba(255,200,100,0.9)', 1]].forEach(([len, angle, color, w]) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,200,100,0.9)';
    ctx.fill();

    // Floating clock particles
    floatingClocks.forEach(p => {
      p.a += p.speed;
      const px = cx + Math.cos(p.a) * p.r;
      const py = cy + Math.sin(p.a) * p.r;
      ctx.beginPath();
      ctx.arc(px, py, p.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160, 120, 255, ${0.3 + Math.abs(Math.sin(p.a * 3)) * 0.5})`;
      ctx.fill();
    });

    t += 0.012;
    requestAnimationFrame(drawTime);
  }
  drawTime();
}

// --- Dream ---
function animateDream(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120;
  const H = canvas.height = 120;
  const stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: 0.5 + Math.random() * 2.5,
    speed: 0.003 + Math.random() * 0.01,
    phase: Math.random() * Math.PI * 2,
    isShooting: Math.random() > 0.85,
    tx: 0, ty: 0,
  }));
  let t = 0;

  function drawDream() {
    ctx.clearRect(0, 0, W, H);
    // Nebula
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, 60);
    grad.addColorStop(0, `rgba(80, 30, 120, ${0.1 + Math.sin(t * 0.5) * 0.05})`);
    grad.addColorStop(1, 'rgba(30,10,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    for (let s of stars) {
      const twinkle = Math.abs(Math.sin(t * s.speed * 20 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 180, 255, ${twinkle * 0.9})`;
      ctx.shadowColor = 'rgba(200, 150, 255, 0.8)';
      ctx.shadowBlur = s.size * 3;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Shooting stars
      if (s.isShooting) {
        s.tx += 0.8;
        s.ty += 0.4;
        if (s.tx > W) { s.tx = 0; s.ty = 0; s.x = Math.random() * W * 0.3; s.y = Math.random() * H * 0.3; }
        ctx.beginPath();
        ctx.moveTo(s.x + s.tx, s.y + s.ty);
        ctx.lineTo(s.x + s.tx - 15, s.y + s.ty - 8);
        ctx.strokeStyle = `rgba(230, 200, 255, ${twinkle * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    t += 0.02;
    requestAnimationFrame(drawDream);
  }
  drawDream();
}

// --- Guardian (Leaves) ---
function animateGuardian(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120;
  const H = canvas.height = 120;
  const leaves = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -0.3 - Math.random() * 0.5,
    size: 4 + Math.random() * 8,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.05,
    phase: Math.random() * Math.PI * 2,
    green: 120 + Math.random() * 80,
  }));
  let t = 0;

  function drawGuardian() {
    ctx.clearRect(0, 0, W, H);
    for (let l of leaves) {
      l.x += l.vx + Math.sin(t * 0.5 + l.phase) * 0.4;
      l.y += l.vy;
      l.rot += l.rotSpeed;
      if (l.y < -l.size) { l.y = H + l.size; l.x = Math.random() * W; }

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.beginPath();
      // Leaf shape
      ctx.moveTo(0, -l.size);
      ctx.quadraticCurveTo(l.size * 0.7, -l.size * 0.3, 0, l.size);
      ctx.quadraticCurveTo(-l.size * 0.7, -l.size * 0.3, 0, -l.size);
      ctx.fillStyle = `rgba(30, ${l.green}, 50, 0.7)`;
      ctx.shadowColor = `rgba(50, 200, 80, 0.4)`;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
    t += 0.02;
    requestAnimationFrame(drawGuardian);
  }
  drawGuardian();
}

// --- Thunder ---
function animateThunder(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 120;
  const H = canvas.height = 120;
  let t = 0;
  let lightningTimer = 0;
  let lightningPath = null;

  function generateLightning(x, y) {
    const points = [{ x, y }];
    let cx = x, cy = y;
    while (cy < H) {
      cx += (Math.random() - 0.5) * 25;
      cy += 12 + Math.random() * 8;
      points.push({ x: cx, y: cy });
    }
    return points;
  }

  function drawThunder() {
    ctx.clearRect(0, 0, W, H);

    // Spark particles
    for (let i = 0; i < 12; i++) {
      const a = t * 0.08 + i * (Math.PI * 2 / 12);
      const r = 28 + Math.sin(t * 2 + i) * 10;
      const px = W / 2 + Math.cos(a) * r;
      const py = H / 2 + Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 255, 100, ${0.4 + Math.abs(Math.sin(t + i)) * 0.5})`;
      ctx.fill();
    }

    lightningTimer += 0.03;
    if (lightningTimer > 1.2 || !lightningPath) {
      lightningTimer = 0;
      lightningPath = generateLightning(W * 0.3 + Math.random() * W * 0.4, 5);
    }

    if (lightningTimer < 0.15 && lightningPath) {
      ctx.beginPath();
      ctx.moveTo(lightningPath[0].x, lightningPath[0].y);
      lightningPath.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = 'rgba(200, 255, 80, 0.95)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(180, 255, 50, 1)';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glow
      ctx.strokeStyle = 'rgba(255, 255, 200, 0.4)';
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    t += 0.05;
    requestAnimationFrame(drawThunder);
  }
  drawThunder();
}

/* ============================================================
   FOG TRANSITION BETWEEN SECTIONS
   ============================================================ */
function initFogTransitions() {
  if (typeof gsap === 'undefined') return;

  // Fog particles travel from one section to next
  document.querySelectorAll('.section-fog-transition').forEach(fog => {
    gsap.to(fog.querySelectorAll('.fog-particle'), {
      scrollTrigger: {
        trigger: fog,
        start: 'top 70%',
        end: 'bottom top',
        scrub: 1.5,
      },
      y: -80,
      opacity: 0,
      stagger: { each: 0.1, from: 'random' },
      ease: 'power1.inOut',
    });
  });
}

/* ============================================================
   FOOTER CONSTELLATION CANVAS
   ============================================================ */
function initFooterConstellation() {
  const canvas = document.getElementById('footer-constellation');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  canvas.width = W;
  canvas.height = H;

  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: 0.5 + Math.random() * 2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.7,
    vx: (Math.random() - 0.5) * 0.15,
  }));

  // Create constellation connections
  const connections = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) connections.push([i, j, d]);
    }
  }

  let t = 0;

  function drawConstellation() {
    ctx.clearRect(0, 0, W, H);

    // Move stars
    stars.forEach(s => {
      s.x += s.vx;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
    });

    // Draw connections
    connections.forEach(([i, j, maxD]) => {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        const alpha = (1 - d / 100) * 0.2;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    // Draw stars
    stars.forEach((s, idx) => {
      const twinkle = Math.abs(Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 200, ${0.3 + twinkle * 0.7})`;
      if (s.size > 1.5) {
        ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
        ctx.shadowBlur = 4;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    t += 0.02;
    requestAnimationFrame(drawConstellation);
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) drawConstellation();
  });
  observer.observe(canvas);
}

/* ============================================================
   FOOTER RUNE ROTATION
   ============================================================ */
function initFooterRune() {
  const rune = document.getElementById('footer-rune');
  if (!rune || typeof gsap === 'undefined') return;

  gsap.to(rune, {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none',
  });
}

/* ============================================================
   MAGIC CIRCLE EFFECT ON SECTION HEADERS
   ============================================================ */
function initMagicCircles() {
  document.querySelectorAll('.magic-circle').forEach(circle => {
    if (typeof gsap === 'undefined') return;

    ScrollTrigger.create({
      trigger: circle,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(circle, {
          scale: 0,
          opacity: 0,
          rotation: -180,
        }, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.2,
          ease: 'back.out(1.5)',
        });
      }
    });

    gsap.to(circle, {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: 'none',
    });
  });
}

/* ============================================================
   CONTACT PORTAL ANIMATION
   ============================================================ */
function initContactPortal() {
  const portal = document.getElementById('contact-portal');
  if (!portal || typeof gsap === 'undefined') return;

  // Rotating portal rings
  gsap.to('.portal-ring-outer', {
    rotation: 360,
    duration: 8,
    repeat: -1,
    ease: 'none',
  });
  gsap.to('.portal-ring-mid', {
    rotation: -360,
    duration: 12,
    repeat: -1,
    ease: 'none',
  });
  gsap.to('.portal-ring-inner', {
    rotation: 360,
    duration: 6,
    repeat: -1,
    ease: 'none',
  });

  // Portal reveal on scroll
  ScrollTrigger.create({
    trigger: portal,
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.portal-ring-outer, .portal-ring-mid, .portal-ring-inner', {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.5)',
      });
    }
  });

  // Energy beams pulse
  gsap.to('.portal-beam', {
    opacity: 0.2,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.3,
  });
}

/* ============================================================
   GALLERY CINEMATIC REVEAL
   ============================================================ */
function initGalleryAnimations() {
  if (typeof gsap === 'undefined') return;

  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      clipPath: 'inset(100% 0 0 0)',
      opacity: 0,
      duration: 0.9,
      delay: (i % 3) * 0.1,
      ease: 'power3.out',
    });
  });
}

/* ============================================================
   SOUND SYSTEM — HOWLER.JS + AUDIO API
   ============================================================ */
let audioContext = null;
let musicGainNode = null;
let isMuted = false;
let musicPlaying = false;
let musicNodes = [];

function initSoundSystem() {
  const playBtn = document.getElementById('enter-world-btn');
  const muteBtn = document.getElementById('mute-btn');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      startFantasyAmbience();
      playBtn.classList.add('music-started');
      playBtn.innerHTML = `<span>🎵</span><span>Music Playing</span>`;
      playBtn.style.pointerEvents = 'none';
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (musicGainNode) {
        musicGainNode.gain.setTargetAtTime(isMuted ? 0 : 0.18, audioContext.currentTime, 0.3);
      }
      muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', isMuted ? 'Unmute music' : 'Mute music');
      muteBtn.classList.toggle('muted', isMuted);
    });
  }
}

function startFantasyAmbience() {
  if (musicPlaying) return;
  musicPlaying = true;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    musicGainNode = audioContext.createGain();
    musicGainNode.gain.setValueAtTime(0, audioContext.currentTime);
    musicGainNode.gain.linearRampToValueAtTime(0.18, audioContext.currentTime + 3);
    musicGainNode.connect(audioContext.destination);

    // Fantasy drone — layered sine oscillators
    const notes = [110, 138.6, 165, 220, 277.2]; // A2, C#3, E3, A3, C#4 — A major
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      lfo.frequency.setValueAtTime(0.2 + i * 0.07, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.003, audioContext.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gainNode.gain.setValueAtTime(0.12 - i * 0.015, audioContext.currentTime);

      osc.connect(gainNode);
      gainNode.connect(musicGainNode);
      osc.start();
      lfo.start();
      musicNodes.push(osc, lfo);
    });

    // Crystal shimmer — high frequency sparkle
    function playShimmer() {
      if (!musicPlaying || !audioContext) return;
      const freq = 1200 + Math.random() * 2400;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      gain.gain.setValueAtTime(0, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.025, audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(musicGainNode);
      osc.start();
      osc.stop(audioContext.currentTime + 1.5);
      setTimeout(playShimmer, 800 + Math.random() * 3000);
    }
    setTimeout(playShimmer, 1000);

    // Wind ambience — filtered noise
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const windFilter = audioContext.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(400, audioContext.currentTime);
    windFilter.Q.setValueAtTime(0.3, audioContext.currentTime);

    const windGain = audioContext.createGain();
    windGain.gain.setValueAtTime(0.04, audioContext.currentTime);

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(musicGainNode);
    noiseSource.start();

  } catch (err) {
    console.warn('Audio context error:', err);
  }
}

/* ============================================================
   HOVER SOUND EFFECTS — SHORT TONES
   ============================================================ */
function initHoverSounds() {
  document.querySelectorAll('.btn-primary, .nav-cta, .btn-pricing-featured').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (!audioContext || isMuted) return;
      try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, audioContext.currentTime + 0.06);
        gain.gain.setValueAtTime(0.04, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 0.2);
      } catch {}
    });
  });
}

/* ============================================================
   GSAP GLOBAL SETUP + SCROLLTRIGGER DEFAULTS
   ============================================================ */
function setupGSAP() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({
      markers: false,
    });
  }
  if (typeof CustomEase !== 'undefined') {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('magicEase', 'M0,0 C0.14,0 0.242,0.438 0.272,0.561 0.313,0.728 0.354,0.963 0.362,1 0.37,1.037 0.414,1 1,1');
  }
}

/* ============================================================
   REVEAL CLASS (legacy — CSS fallback)
   ============================================================ */
function initLegacyReveal() {
  if (typeof gsap !== 'undefined') return; // Use GSAP instead

  const elements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.style.getPropertyValue('--delay') || 0);
        setTimeout(() => entry.target.classList.add('revealed'), delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   LOGO FLOATING + CRYSTAL PULSE
   ============================================================ */
function initLogoAnimations() {
  if (typeof gsap === 'undefined') return;

  const logo = document.querySelector('.hero-logo-img');
  if (!logo) return;

  // Floating bob
  gsap.to(logo, {
    y: -14,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Crystal pulse every 3s
  setInterval(() => {
    if (typeof gsap === 'undefined') return;
    gsap.fromTo(logo, {
      filter: 'drop-shadow(0 0 56px rgba(109,40,217,0.65)) drop-shadow(0 0 112px rgba(37,99,235,0.35))',
    }, {
      filter: 'drop-shadow(0 0 90px rgba(37,99,235,0.95)) drop-shadow(0 0 160px rgba(109,40,217,0.6)) drop-shadow(0 0 30px rgba(255,255,255,0.4))',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });
  }, 3500);
}

/* ============================================================
   SECTION BG AURORA / GOD RAYS
   ============================================================ */
function initAuroraEffects() {
  const aurora = document.querySelectorAll('.aurora-layer');
  if (!aurora.length || typeof gsap === 'undefined') return;

  aurora.forEach((layer, i) => {
    gsap.to(layer, {
      xPercent: i % 2 === 0 ? 8 : -8,
      yPercent: 3,
      duration: 8 + i * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}

/* ============================================================
   INITIALIZE EVERYTHING
   ============================================================ */
function init() {
  setupGSAP();
  initLenis();

  // Loading screen runs immediately
  if (typeof gsap !== 'undefined') {
    initCinematicLoader();
  }

  // Everything else after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initCrystalCursor();
    initHeroParallax();
    initCardTilt();
    initButtonEffects();
    initSoundSystem();
    initFactionAnimations();
    initFooterConstellation();
    initFooterRune();
    initAuroraEffects();
    initLegacyReveal();

    // GSAP-dependent inits
    if (typeof gsap !== 'undefined') {
      initScrollReveals();
      initMagicCircles();
      initContactPortal();
      initGalleryAnimations();
      initFogTransitions();
      initLogoAnimations();
    }
  });

  // After window load
  window.addEventListener('load', () => {
    initHoverSounds();
    ScrollTrigger && ScrollTrigger.refresh();
  });
}

init();
