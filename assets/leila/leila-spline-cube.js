const runtimeUrl = 'https://unpkg.com/@splinetool/runtime@1.12.69/build/runtime.js';
// Cena de referência: https://my.spline.design/rubik39scube-V5wJIA6B7IWVz4LIqjeqrFNt/
const sceneUrl = new URL('rubik-tea.splinecode', import.meta.url).href;
const teaColors = ['#2F6FB0', '#4F9D69', '#F2C94C', '#D95D5D'];

async function loadTeaCube(host) {
  const canvas = host.querySelector('.neurodivergencia-canvas');
  const status = host.querySelector('.neurodivergencia-loading');

  if (!canvas || host.dataset.splineLoaded === 'true') {
    return;
  }

  host.dataset.splineLoaded = 'true';
  host.classList.add('is-loading');

  try {
    const { Application } = await import(runtimeUrl);
    const app = new Application(canvas, { renderMode: 'continuous' });
    await app.load(sceneUrl);
    app.setBackgroundColor('rgba(0, 0, 0, 0)');

    const colorableObjects = app.getAllObjects().filter((object) => object.material);

    colorableObjects.forEach((object, index) => {
      object.color = teaColors[index % teaColors.length];
    });

    host.classList.remove('is-loading');
    host.classList.add('is-loaded');
    window.leilaTeaCube = app;

    if (status) {
      status.textContent = 'Cubo interativo carregado';
    }
  } catch (error) {
    host.classList.remove('is-loading');
    host.classList.add('has-error');
    console.error('Falha ao carregar o cubo Spline:', error);

    if (status) {
      status.textContent = 'Não foi possível carregar o cubo interativo.';
    }
  }
}

const cubeHosts = document.querySelectorAll('[data-spline-tea-cube]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      loadTeaCube(entry.target);
      currentObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: '240px 0px'
  });

  cubeHosts.forEach((host) => observer.observe(host));
} else {
  cubeHosts.forEach(loadTeaCube);
}
