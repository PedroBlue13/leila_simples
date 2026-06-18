(function () {
  const runtimeUrl = 'https://unpkg.com/@splinetool/runtime@1.12.69/build/runtime.js';
  const defaultColors = ['#2F6FB0', '#4F9D69', '#F2C94C', '#D95D5D'];
  const scriptUrl = document.currentScript?.src || window.location.href;

  function getColors(host) {
    const customColors = (host.dataset.colors || '')
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);

    return customColors.length ? customColors : defaultColors;
  }

  function applyFallbackColors(host, colors) {
    const normalized = [...colors];

    while (normalized.length < 4) {
      normalized.push(defaultColors[normalized.length]);
    }

    host.style.setProperty('--tea-blue', normalized[0]);
    host.style.setProperty('--tea-green', normalized[1]);
    host.style.setProperty('--tea-yellow', normalized[2]);
    host.style.setProperty('--tea-red', normalized[3]);
  }

  async function loadCube(host) {
    const canvas = host.querySelector('.tea-cube-widget__canvas');
    const status = host.querySelector('.tea-cube-widget__status');
    const colors = getColors(host);

    applyFallbackColors(host, colors);

    if (!canvas || host.dataset.cubeLoaded === 'true') {
      return;
    }

    host.dataset.cubeLoaded = 'true';

    if (window.location.protocol === 'file:') {
      return;
    }

    host.classList.add('is-loading');

    try {
      const { Application } = await import(runtimeUrl);
      const sceneUrl = new URL('rubik-tea.splinecode', scriptUrl).href;
      const app = new Application(canvas, { renderMode: 'continuous' });

      await app.load(sceneUrl);
      app.setBackgroundColor('rgba(0, 0, 0, 0)');

      const colorableObjects = app.getAllObjects().filter((object) => object.material);

      colorableObjects.forEach((object, index) => {
        object.color = colors[index % colors.length];
      });

      host.classList.remove('is-loading');
      host.classList.add('is-loaded');
      host.teaCubeApplication = app;

      if (status) {
        status.textContent = 'Cubo interativo carregado';
      }

      host.dispatchEvent(new CustomEvent('tea-cube:ready', {
        detail: { application: app }
      }));
    } catch (error) {
      host.classList.remove('is-loading');
      host.classList.add('has-error');

      if (status) {
        status.textContent = 'O fallback 3D está sendo exibido.';
      }

      console.error('Falha ao carregar o cubo Spline:', error);
    }
  }

  const hosts = document.querySelectorAll('[data-tea-cube]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        loadCube(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, {
      rootMargin: '240px 0px'
    });

    hosts.forEach((host) => observer.observe(host));
  } else {
    hosts.forEach(loadCube);
  }
}());
