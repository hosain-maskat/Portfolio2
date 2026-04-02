/* ============================================================
   PORTFOLIO SCRIPT — Graduate CSE Student
   Handles: Canvas BG, Typed Text, Scroll Reveal,
            Navbar, Tabs, Project Filter, Proficiency Bars,
            Contact Form
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. CANVAS ANIMATED BACKGROUND ─────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x    = Math.random() * canvas.width;
      this.y    = init ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color  = Math.random() > 0.5 ? '0,229,255' : '168,85,247';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  class Line {
    constructor() { this.reset(); }
    reset() {
      this.x1 = Math.random() * canvas.width;
      this.y1 = Math.random() * canvas.height;
      this.x2 = this.x1 + (Math.random() - 0.5) * 200;
      this.y2 = this.y1 + (Math.random() - 0.5) * 200;
      this.opacity = Math.random() * 0.08 + 0.02;
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < Math.min(count, 80); i++) particles.push(new Particle());
  }

  function drawGrid() {
    const step = 60;
    ctx.strokeStyle = 'rgba(0,229,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animateCanvas);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  resizeCanvas();
  initParticles();
  animateCanvas();

  /* ── 2. TYPED TEXT EFFECT ───────────────────────────────────── */
  const roles = [
    'AI & ML Engineer',
    'Full-Stack Developer',
    'Distributed Systems Enthusiast',
    'Open Source Contributor',
    'Graduate Researcher',
  ];

  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const typedEl = document.getElementById('typed-text');

  function typeEffect() {
    const current = roles[roleIdx];
    if (!isDeleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeEffect, isDeleting ? 50 : 90);
  }

  typeEffect();

  /* ── 3. NAVBAR SCROLL EFFECT ────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  }, { passive: true });

  /* ── 4. HAMBURGER MOBILE MENU ───────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── 5. ACTIVE NAV LINK ON SCROLL ──────────────────────────── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const link   = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    });
  }

  /* ── 6. SCROLL REVEAL ───────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── 7. PROFICIENCY BARS ────────────────────────────────────── */
  const profList = document.getElementById('proficiency-list');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.prof-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (profList) barObserver.observe(profList);

  /* ── 8. PROJECT FILTER ──────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (match) {
          card.style.opacity   = '1';
          card.style.transform = 'scale(1)';
          card.style.display   = 'flex';
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (btn.dataset.filter === document.querySelector('.filter-btn.active').dataset.filter
                && filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
              // keep hidden
            }
          }, 400);
        }
      });

      // Re-observe for reveal animation
      setTimeout(() => {
        projectCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? 'flex' : 'none';
        });
      }, 400);
    });
  });

  /* ── 9. TABS (Education / Work) ─────────────────────────────── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.timeline-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById(btn.getAttribute('aria-controls')).classList.add('active');

      // Re-trigger reveal for newly shown items
      document.querySelectorAll('.timeline-panel.active .reveal:not(.visible)').forEach(el => {
        revealObserver.observe(el);
      });
    });
  });

  /* ── 10. CONTACT FORM ───────────────────────────────────────── */
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('form-name').value.trim();
      const email   = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        shakeForm();
        return;
      }

      const btn = document.getElementById('form-submit');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      btn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        form.style.display        = 'none';
        formSuccess.style.display = 'block';
      }, 1500);
    });
  }

  function shakeForm() {
    const cf = document.querySelector('.contact-form');
    cf.style.animation = 'none';
    cf.offsetHeight; // reflow
    cf.style.animation = 'shake 0.4s ease';
  }

  // Inject shake keyframes dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-5px); }
      80%    { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  /* ── 11. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 12. SKILL TAG HOVER RIPPLE ─────────────────────────────── */
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'translateY(-2px) scale(1.05)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
    });
  });

})();
