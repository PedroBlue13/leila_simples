(function () {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const body = document.body;
  const reducedMotion = motionQuery.matches;

  if (reducedMotion) {
    body.classList.add('reduced-motion');
  }

  const sectionSelector = '.hero, .section, .cta-banner, .footer';
  document.querySelectorAll(sectionSelector).forEach((section) => {
    if (section.querySelector('.ambient-texture-layer')) {
      return;
    }

    const layer = document.createElement('div');
    layer.className = 'ambient-texture-layer';
    layer.setAttribute('aria-hidden', 'true');
    section.prepend(layer);
  });

  const animeApi = window.anime || null;

  function initReveal() {
    const targets = [
      ...document.querySelectorAll('.esp-item'),
      ...document.querySelectorAll('.processo-visual .visual-step'),
      ...document.querySelectorAll('.footer-brand, .footer-col, .footer-bottom')
    ];

    targets.forEach((el, index) => {
      el.dataset.revealDelay = String(index % 4);
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const delaySlot = Number(entry.target.dataset.revealDelay || '0');

        if (animeApi) {
          animeApi({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [18, 0],
            duration: 720,
            delay: delaySlot * 90,
            easing: 'easeOutCubic'
          });
        } else {
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }

        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach((el) => revealObserver.observe(el));
  }

  function initAnimeLoops() {
    if (!animeApi || reducedMotion) {
      return;
    }

    animeApi({
      targets: '.visual-icon',
      translateY: [0, -4],
      scale: [1, 1.03],
      duration: 2600,
      delay: animeApi.stagger(160),
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true
    });

    animeApi({
      targets: '.btn-primary svg, .btn-cta svg, .whatsapp-float svg',
      translateY: [0, -1.5],
      duration: 1700,
      delay: animeApi.stagger(120),
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true
    });

    animeApi({
      targets: '.nav-logo',
      rotate: [0, 2.5],
      duration: 2400,
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true
    });
  }

  function initParallax() {
    if (reducedMotion) {
      return;
    }

    const items = [];

    document.querySelectorAll('.hero-img-wrapper img').forEach((el) => {
      items.push({ el, host: el.closest('.hero'), x: 0, y: 18, mode: 'image' });
    });

    document.querySelectorAll('.sobre-img-composition img').forEach((el) => {
      items.push({ el, host: el.closest('.sobre'), x: 0, y: 14, mode: 'image' });
    });

    document.querySelectorAll('.hero .deco-circle').forEach((el, index) => {
      items.push({
        el,
        host: el.closest('.hero'),
        x: index % 2 === 0 ? 10 : -10,
        y: index % 2 === 0 ? 18 : -18,
        mode: 'circle'
      });
    });

    document.querySelectorAll('.sobre .deco-circle').forEach((el, index) => {
      items.push({
        el,
        host: el.closest('.sobre'),
        x: index % 2 === 0 ? -8 : 8,
        y: index % 2 === 0 ? 15 : -15,
        mode: 'circle'
      });
    });

    document.querySelectorAll('.ambient-texture-layer').forEach((el) => {
      items.push({ el, host: el.parentElement, x: 0, y: 16, mode: 'texture' });
    });

    let ticking = false;

    const render = () => {
      const viewportHeight = window.innerHeight || 1;

      items.forEach((item) => {
        if (!item.host) {
          return;
        }

        const rect = item.host.getBoundingClientRect();
        const centerDelta = ((rect.top + (rect.height / 2)) - (viewportHeight / 2)) / viewportHeight;
        const clamp = Math.max(-1.25, Math.min(1.25, centerDelta));
        const x = -(clamp * item.x);
        const y = -(clamp * item.y);

        if (item.mode === 'texture') {
          item.el.style.setProperty('--ambient-shift', y.toFixed(2) + 'px');
          return;
        }

        item.el.style.setProperty('--parallax-x', x.toFixed(2) + 'px');
        item.el.style.setProperty('--parallax-y', y.toFixed(2) + 'px');
      });

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  function initParticles() {
    const canvas = document.getElementById('ambient-particles');

    if (!canvas || reducedMotion) {
      return;
    }

    const context = canvas.getContext('2d', { alpha: true });

    if (!context) {
      return;
    }

    const palette = [
      'rgba(91, 123, 94, 0.34)',
      'rgba(168, 153, 104, 0.28)',
      'rgba(255, 255, 255, 0.26)'
    ];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let particles = [];

    function buildParticles() {
      const total = width < 640 ? 16 : width < 1024 ? 22 : 30;
      particles = Array.from({ length: total }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.22,
        vy: Math.random() * 0.18 + 0.05,
        alpha: Math.random() * 0.28 + 0.16,
        color: palette[Math.floor(Math.random() * palette.length)]
      }));
    }

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function drawLink(source, target, distance) {
      const maxDistance = width < 768 ? 90 : 120;
      if (distance > maxDistance) {
        return;
      }

      const opacity = ((maxDistance - distance) / maxDistance) * 0.16;
      context.strokeStyle = 'rgba(91, 123, 94, ' + opacity.toFixed(3) + ')';
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
      context.stroke();
    }

    function tick() {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy + (scrollVelocity * 0.012);

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.beginPath();
        context.fillStyle = particle.color.replace(/[\d.]+\)$/u, particle.alpha.toFixed(3) + ')');
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();

        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
          const other = particles[otherIndex];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt((dx * dx) + (dy * dy));
          drawLink(particle, other, distance);
        }
      });

      scrollVelocity *= 0.92;
      animationFrame = window.requestAnimationFrame(tick);
    }

    resizeCanvas();
    tick();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.max(-12, Math.min(12, currentScrollY - lastScrollY));
      lastScrollY = currentScrollY;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
        return;
      }

      window.cancelAnimationFrame(animationFrame);
      tick();
    });
  }

  initReveal();
  initAnimeLoops();
  initParallax();
  initParticles();
}());
