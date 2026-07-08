// ============================================================
// DIGITAL LOOKS — Site scripts
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  const HEADER_OFFSET = document.querySelector('.site-header').offsetHeight;

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburgerBtn');
  const navMobile = document.getElementById('navMobile');

  const closeMobileMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.classList.remove('open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------- Smooth scroll for all in-page nav links ---------- */
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - (HEADER_OFFSET - 1);
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
      history.pushState(null, '', href);
    });
  });

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  const sections = ['home', 'about', 'services', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: `-${HEADER_OFFSET + 40}px 0px -60% 0px`, threshold: 0.1 });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------- Reveal-on-scroll for cards/sections ---------- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .stat-card, .process-step, .industry-card, .faq-item, .about-text, .contact-info, .contact-form, .hero-copy'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Count-up stats ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (progress >= 1 ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + '+';
    };
    requestAnimationFrame(step);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => countObserver.observe(el));

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Sticky FAB (Call / WhatsApp) ---------- */
  const fab = document.getElementById('fab');
  const fabMain = document.getElementById('fabMain');
  const fabIcon = document.getElementById('fabIcon');

  fabMain.addEventListener('click', () => {
    const isOpen = fab.classList.toggle('open');
    fabIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-comment-dots';
  });

  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) {
      fab.classList.remove('open');
      fabIcon.className = 'fa-solid fa-comment-dots';
    }
  });

  /* ---------- Contact form -> WhatsApp redirect ---------- */
  const WHATSAPP_NUMBER = '917838290777';
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const service = document.getElementById('cf-service').value;
    const message = document.getElementById('cf-message').value.trim();

    const text =
      `Hello Digital Looks, I'd like to get in touch.%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Email:* ${encodeURIComponent(email)}%0A` +
      `*Service Needed:* ${encodeURIComponent(service)}%0A` +
      `*Message:* ${encodeURIComponent(message)}`;

    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(waLink, '_blank', 'noopener');
    contactForm.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
