// ── Menu mobile ──────────────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const spans = menuBtn.querySelectorAll('span');

function openMenu() {
  navLinks.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
  spans[1].style.opacity = '0';
  spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ── Sombra na nav ao rolar ────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

// ── FAQ toggle anim ──────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('summary').addEventListener('click', (e) => {
    const parent = e.currentTarget.parentElement;
    // Fechar outros abertos
    document.querySelectorAll('.faq-item[open]').forEach(other => {
      if (other !== parent) other.removeAttribute('open');
    });
  });
});


// ── Scroll reveal suave ──────────────────────────────────
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.card, .beneficio-card, .processo-step, .faq-item, ' +
  '.section-header, .sobre-img-composition, .sobre-text, ' +
  '.processo-visual, .cta-inner, .faq-footer'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── Hero fade-in no carregamento ─────────────────────────
document.querySelectorAll('.hero-text, .hero-img').forEach((el, i) => {
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 150 + i * 150);
});
