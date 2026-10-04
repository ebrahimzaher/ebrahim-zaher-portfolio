/* =========================================
   EBRAHIM ZAHER PORTFOLIO — SCRIPTS
   ========================================= */

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links-list');
const hamburger = document.getElementById('hamburger-btn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNavLink();
});

// ── HAMBURGER MENU ──
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  const navCta = document.querySelector('.nav-cta');
  if (navCta) navCta.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    const navCta = document.querySelector('.nav-cta');
    if (navCta) navCta.classList.remove('open');
  });
});

// ── ACTIVE NAV HIGHLIGHT ──
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.id;
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ── TYPEWRITER EFFECT ──
const typewriterTarget = document.getElementById('typewriter-target');
const phrases = [
  'Multi-Agent AI Systems',
  'RAG Pipelines',
  'LLM-Powered Backends',
  'Agentic Workflows',
  'Production AI Products',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typewriterTarget.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterTarget.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typewriterTimeout = setTimeout(typeWriter, delay);
}

typeWriter();

// ── PARTICLES CANVAS ──
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '79,142,247' : '139,92,246';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  const maxDist = 140;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,142,247,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animationId = requestAnimationFrame(animateParticles);
}

// Only run particles in hero section viewport
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!animationId) animateParticles();
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });
}, { threshold: 0.1 });

heroObserver.observe(document.getElementById('hero'));
resizeCanvas();
initParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// ── COUNTER ANIMATION ──
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.getElementById('hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── SCROLL REVEAL ──
function addRevealClasses() {
  const animatables = [
    { selector: '.skill-card',      delayBase: 0 },
    { selector: '.project-card',    delayBase: 0 },
    { selector: '.timeline-item',   delayBase: 0 },
    { selector: '.section-header',  delayBase: 0 },
    { selector: '.about-text',      delayBase: 0 },
    { selector: '.about-visual',    delayBase: 100 },
    { selector: '.edu-card',        delayBase: 0 },
    { selector: '.certs-card',      delayBase: 100 },
    { selector: '.contact-info',    delayBase: 0 },
    { selector: '.contact-form',    delayBase: 100 },
  ];

  animatables.forEach(({ selector, delayBase }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i > 0) el.style.transitionDelay = `${delayBase + i * 80}ms`;
    });
  });
}

addRevealClasses();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── CONTACT FORM ──
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('contact-name-input').value.trim();
    const email   = document.getElementById('contact-email-input').value.trim();
    const message = document.getElementById('contact-message-input').value.trim();
    const btn     = document.getElementById('contact-submit-btn');

    if (!name || !email || !message) {
      showFormToast('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormToast('Please enter a valid email address.', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Send data to FormSubmit API
    fetch('https://formsubmit.co/ajax/ebrahimzaherr0@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: `New Portfolio Message from ${name}`
      })
    })
    .then(response => response.json())
    .then(data => {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      contactForm.reset();
      showFormToast('Message sent! I will get back to you soon.', 'success');
    })
    .catch(error => {
      console.error(error);
      btn.disabled = false;
      btn.textContent = 'Send Message';
      showFormToast('Error sending message. Please try again.', 'error');
    });
  });
}

function showFormToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 0.92rem;
    font-weight: 500;
    z-index: 9999;
    animation: toastIn 0.4s ease;
    max-width: 340px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    ${type === 'success'
      ? 'background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #86efac;'
      : 'background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5;'}
  `;
  document.body.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = `@keyframes toastIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }`;
  document.head.appendChild(style);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── SMOOTH SCROLL for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── SKILL CARD TILT ──
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
