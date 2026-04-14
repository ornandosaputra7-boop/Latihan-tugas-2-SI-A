// =======================================================
// script.js — Interactions: typing effect, mobile nav,
// reveal on scroll, progress bar animation, contact form
// =======================================================

document.addEventListener('DOMContentLoaded', function () {
  // 1) Typing effect (Hero)
  const typedElement = document.getElementById('typed-text');
  const phrases = ['Mahasiswa & Tech Enthusiast', 'Pengembang Web | Pembelajar', 'Eksperimen • Bangun • Belajar'];
  let typeIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const pauseAfter = 1400;

  function typeLoop() {
    const current = phrases[typeIndex];
    if (!deleting) {
      // add char
      typedElement.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        // wait then delete
        deleting = true;
        setTimeout(typeLoop, pauseAfter);
        return;
      }
    } else {
      // delete char
      typedElement.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        typeIndex = (typeIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? deletingSpeed : typingSpeed);
  }
  typeLoop();

  // 2) Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('primary-navigation');
  navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('show');
    // animate hamburger to cross
    this.querySelector('.hamburger').classList.toggle('open');
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 3) Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 4) Reveal on scroll using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal, .reveal-card');
  const options = { threshold: 0.12 };
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
        // If element contains progress bars, trigger them
        if (entry.target.querySelectorAll) {
          animateProgressBars(entry.target);
        }
      }
    });
  }, options);

  revealElements.forEach(el => revealObserver.observe(el));

  // 5) Animate progress bars when revealed
  function animateProgressBars(scope) {
    const progressContainers = (scope.tagName === 'DIV' && scope.classList.contains('progress')) ? [scope] : scope.querySelectorAll('.progress');
    progressContainers.forEach(pc => {
      const bar = pc.querySelector('.progress-bar');
      const target = parseInt(pc.getAttribute('data-progress') || '0', 10);
      // tween animation
      setTimeout(() => {
        bar.style.width = target + '%';
      }, 120); // slight delay to allow reveal transition
    });
  }

  // Also animate progress bars if they are already visible on load
  document.querySelectorAll('.progress').forEach(pc => {
    const rect = pc.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const bar = pc.querySelector('.progress-bar');
      const target = parseInt(pc.getAttribute('data-progress') || '0', 10);
      bar.style.width = target + '%';
    }
  });

  // 6) Contact form handling (simple demo - no server)
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // basic validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      feedback.textContent = 'Mohon isi semua kolom sebelum mengirim.';
      feedback.style.color = '#ffb4b4';
      return;
    }
    // show success message (in real usage, send to server)
    feedback.textContent = 'Terima kasih! Pesan Anda berhasil dikirim (demo).';
    feedback.style.color = '#b7ffd9';
    form.reset();
    // optional: clear message after a while
    setTimeout(() => feedback.textContent = '', 5000);
  });

  // 7) Set current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // 8) Keyboard accessibility: close nav with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});