(function () {
  const opening = document.getElementById('leila-opening');

  if (!opening) {
    return;
  }

  const revealButton = opening.querySelector('[data-opening-reveal]');
  const skipButton = opening.querySelector('[data-opening-skip]');
  const glassesPoster = opening.querySelector('.leila-opening__glasses-poster');
  const firstMessage = opening.querySelector('.leila-opening__message--first');
  const glassesMessage = opening.querySelector('.leila-opening__message--glasses');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const focusableSelector = 'button:not([disabled])';
  const minimumFirstMessageTime = reducedMotion ? 9200 : 3800;
  const glassesLoadDelay = reducedMotion ? 0 : 450;
  const openingStartedAt = performance.now();

  let isLoadingScene = false;
  let isGlassesVisible = false;
  let isClosing = false;
  let currentLens = null;
  let targetLens = null;
  let lensAnimationFrame = 0;
  let showTimer = 0;

  document.body.classList.add('opening-active');

  function getLensGeometry() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(width / 960, height / 670);
    const offsetX = (width - (960 * scale)) / 2;
    const offsetY = (height - (670 * scale)) / 2;

    return {
      width,
      height,
      baseX: offsetX + (478 * scale),
      baseY: offsetY + (469 * scale),
      spacing: 202 * scale,
      radiusX: 147 * scale,
      radiusY: 140 * scale,
      limitX: 90 * scale,
      limitY: 60 * scale
    };
  }

  function makeLensTarget(pointerX, pointerY, sourceWidth, sourceHeight) {
    const geometry = getLensGeometry();
    const x = (pointerX / Math.max(sourceWidth, 1)) * geometry.width;
    const y = (pointerY / Math.max(sourceHeight, 1)) * geometry.height;
    const centerX = Math.max(
      geometry.baseX - geometry.limitX,
      Math.min(geometry.baseX + geometry.limitX, x)
    );
    const centerY = Math.max(
      geometry.baseY - geometry.limitY,
      Math.min(geometry.baseY + geometry.limitY, y)
    );

    return {
      leftX: centerX - geometry.spacing,
      rightX: centerX + geometry.spacing,
      centerY,
      radiusX: geometry.radiusX,
      radiusY: geometry.radiusY,
      shiftX: centerX - geometry.baseX,
      shiftY: centerY - geometry.baseY
    };
  }

  function makeDefaultLensTarget() {
    const geometry = getLensGeometry();

    return {
      leftX: geometry.baseX - geometry.spacing,
      rightX: geometry.baseX + geometry.spacing,
      centerY: geometry.baseY,
      radiusX: geometry.radiusX,
      radiusY: geometry.radiusY,
      shiftX: 0,
      shiftY: 0
    };
  }

  function writeLensStyles() {
    opening.style.setProperty('--lens-left-x', `${currentLens.leftX.toFixed(2)}px`);
    opening.style.setProperty('--lens-right-x', `${currentLens.rightX.toFixed(2)}px`);
    opening.style.setProperty('--lens-center-y', `${currentLens.centerY.toFixed(2)}px`);
    opening.style.setProperty('--lens-radius-x', `${currentLens.radiusX.toFixed(2)}px`);
    opening.style.setProperty('--lens-radius-y', `${currentLens.radiusY.toFixed(2)}px`);
    opening.style.setProperty('--glasses-shift-x', `${currentLens.shiftX.toFixed(2)}px`);
    opening.style.setProperty('--glasses-shift-y', `${currentLens.shiftY.toFixed(2)}px`);
  }

  function renderLens() {
    if (!currentLens || !targetLens || !document.body.contains(opening)) {
      lensAnimationFrame = 0;
      return;
    }

    let largestDifference = 0;

    Object.keys(currentLens).forEach((key) => {
      const difference = targetLens[key] - currentLens[key];
      largestDifference = Math.max(largestDifference, Math.abs(difference));
      currentLens[key] += difference * 0.18;
    });

    writeLensStyles();

    if (largestDifference > 0.08) {
      lensAnimationFrame = window.requestAnimationFrame(renderLens);
    } else {
      currentLens = { ...targetLens };
      writeLensStyles();
      lensAnimationFrame = 0;
    }
  }

  function scheduleLensRender() {
    if (!lensAnimationFrame) {
      lensAnimationFrame = window.requestAnimationFrame(renderLens);
    }
  }

  function updateLens(pointerX, pointerY, sourceWidth, sourceHeight) {
    if (!isGlassesVisible || isClosing) {
      return;
    }

    targetLens = makeLensTarget(pointerX, pointerY, sourceWidth, sourceHeight);
    scheduleLensRender();
  }

  currentLens = makeDefaultLensTarget();
  targetLens = { ...currentLens };
  writeLensStyles();

  function showGlasses() {
    if (isGlassesVisible || isClosing) {
      return;
    }

    isGlassesVisible = true;
    opening.classList.add('is-glasses-visible');

    if (firstMessage) {
      firstMessage.setAttribute('aria-hidden', 'true');
    }

    if (glassesMessage) {
      glassesMessage.setAttribute('aria-hidden', 'false');
    }

    if (revealButton) {
      revealButton.disabled = false;
    }
  }

  function queueGlassesReveal() {
    const elapsed = performance.now() - openingStartedAt;
    const remainingTime = Math.max(0, minimumFirstMessageTime - elapsed);

    window.clearTimeout(showTimer);
    showTimer = window.setTimeout(showGlasses, remainingTime);
  }

  function markSceneReady() {
    opening.classList.add('is-scene-ready');
    queueGlassesReveal();
  }

  function startGlassesLoad() {
    if (isLoadingScene || isClosing || !glassesPoster) {
      return;
    }

    isLoadingScene = true;
    opening.classList.add('is-scene-loading');

    glassesPoster.addEventListener('load', markSceneReady, { once: true });
    glassesPoster.addEventListener('error', queueGlassesReveal, { once: true });

    if (glassesPoster.dataset.src) {
      glassesPoster.src = glassesPoster.dataset.src;
    }

    if (glassesPoster.complete) {
      markSceneReady();
    }
  }

  opening.addEventListener('pointermove', (event) => {
    updateLens(
      event.clientX,
      event.clientY,
      window.innerWidth,
      window.innerHeight
    );
  }, { passive: true });

  window.addEventListener('resize', () => {
    currentLens = makeDefaultLensTarget();
    targetLens = { ...currentLens };
    writeLensStyles();
  });

  window.setTimeout(startGlassesLoad, glassesLoadDelay);

  function removeOpening() {
    window.clearTimeout(showTimer);
    window.cancelAnimationFrame(lensAnimationFrame);
    opening.remove();
    document.dispatchEvent(new CustomEvent('leila:openingcomplete'));
  }

  function revealSite() {
    if (isClosing || !isGlassesVisible) {
      return;
    }

    isClosing = true;
    opening.classList.add('is-revealing');
    document.body.classList.add('opening-clearing');

    if (revealButton) {
      revealButton.disabled = true;
    }

    window.setTimeout(() => {
      opening.classList.add('is-leaving');
      document.body.classList.remove('opening-active', 'opening-clearing');
    }, reducedMotion ? 20 : 780);

    window.setTimeout(removeOpening, reducedMotion ? 40 : 1500);
  }

  function skipOpening() {
    if (isClosing) {
      return;
    }

    isClosing = true;
    opening.classList.add('is-leaving');
    document.body.classList.remove('opening-active', 'opening-clearing');
    window.setTimeout(removeOpening, reducedMotion ? 20 : 820);
  }

  function trapFocus(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      skipOpening();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = [...opening.querySelectorAll(focusableSelector)]
      .filter((element) => element.offsetParent !== null);

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  revealButton?.addEventListener('click', revealSite);
  skipButton?.addEventListener('click', skipOpening);
  opening.addEventListener('keydown', trapFocus);
}());
