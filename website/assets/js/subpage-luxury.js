/* ═════════════════════════════════════════════════════════════════════════
   ASVEX TECHNOLOGIES — CORE 3D INTERACTION & PHYSICS ENGINE v4.0
   Smooth 60fps 3D perspective tilt, dynamic specular light glare, parallax
   inner depth, scroll-triggered 3D reveals, and mobile drawer ergonomics.
   ═════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Elevation State
  const navEl = document.querySelector('nav');
  if (navEl) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        navEl.classList.add('scrolled');
      } else {
        navEl.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. 3D Gyroscopic Card Tilt, Dynamic Specular Glare & Inner Parallax Depth
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const tiltCards = document.querySelectorAll('.card, .price-box, .feature-item, .stat-box');

  if (!isTouchDevice) {
    tiltCards.forEach(card => {
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.prepend(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6.5;
        const rotateY = ((x - centerX) / centerX) * 6.5;

        card.style.transition = 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Subtle inner parallax elevation
        const tag = card.querySelector('.card-tag, .sec-eyebrow, .stat-n');
        const title = card.querySelector('.card-title, .feature-title, .price-range-big');
        if (tag) tag.style.transform = 'translateZ(18px)';
        if (title) title.style.transform = 'translateZ(12px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.45s ease';
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        const tag = card.querySelector('.card-tag, .sec-eyebrow, .stat-n');
        const title = card.querySelector('.card-title, .feature-title, .price-range-big');
        if (tag) tag.style.transform = 'translateZ(0px)';
        if (title) title.style.transform = 'translateZ(0px)';
      });
    });
  }

  // 3. Staggered 3D Scroll Reveal Observer
  const revEls = document.querySelectorAll('.rev');
  if (revEls.length > 0) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    revEls.forEach(el => obs.observe(el));
  }

  // 4. Smooth FAQ Accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // 5. Mobile Navigation Drawer Controller
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');

  function openDrawer() {
    if (navToggle) navToggle.classList.add('active');
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (navToggle) navToggle.classList.remove('active');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
});
