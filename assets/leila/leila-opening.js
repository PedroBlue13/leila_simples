(function () {
  const opening = document.getElementById('leila-opening');

  if (!opening) {
    return;
  }

  const revealButton = opening.querySelector('[data-opening-reveal]');
  const skipButton = opening.querySelector('[data-opening-skip]');
  const glassesFrame = opening.querySelector('.leila-opening__glasses-frame');
  const firstMessage = opening.querySelector('.leila-opening__message--first');
  const togetherMessage = opening.querySelector('.leila-opening__message--together');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const focusableSelector = 'button:not([disabled])';
  let isRevealing = false;
  let isClosing = false;
  let currentLens = null;
  let targetLens = null;
  let readyRequestTimer = 0;

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
      radiusX: 127 * scale,
      radiusY: 103 * scale,
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

  function renderLens() {
    if (!currentLens || !targetLens || !document.body.contains(opening)) {
      return;
    }

    Object.keys(currentLens).forEach((key) => {
      currentLens[key] += (targetLens[key] - currentLens[key]) * 0.16;
    });

    opening.style.setProperty('--lens-left-x', `${currentLens.leftX.toFixed(2)}px`);
    opening.style.setProperty('--lens-right-x', `${currentLens.rightX.toFixed(2)}px`);
    opening.style.setProperty('--lens-center-y', `${currentLens.centerY.toFixed(2)}px`);
    opening.style.setProperty('--lens-radius-x', `${currentLens.radiusX.toFixed(2)}px`);
    opening.style.setProperty('--lens-radius-y', `${currentLens.radiusY.toFixed(2)}px`);
    opening.style.setProperty('--glasses-shift-x', `${currentLens.shiftX.toFixed(2)}px`);
    opening.style.setProperty('--glasses-shift-y', `${currentLens.shiftY.toFixed(2)}px`);
    window.requestAnimationFrame(renderLens);
  }

  currentLens = makeDefaultLensTarget();
  targetLens = { ...currentLens };
  renderLens();

  function markSceneReady() {
    opening.classList.add('is-scene-ready');
    window.clearInterval(readyRequestTimer);
  }

  window.addEventListener('message', (event) => {
    if (event.data?.type === 'leila-glasses-ready') {
      markSceneReady();
      return;
    }

    if (event.data?.type === 'leila-glasses-pointer') {
      targetLens = makeLensTarget(
        event.data.x,
        event.data.y,
        event.data.width,
        event.data.height
      );
    }
  });

  opening.addEventListener('pointermove', (event) => {
    if (event.target === glassesFrame) {
      return;
    }

    targetLens = makeLensTarget(
      event.clientX,
      event.clientY,
      window.innerWidth,
      window.innerHeight
    );
  }, { passive: true });

  window.addEventListener('resize', () => {
    targetLens = makeDefaultLensTarget();
  });

  if (glassesFrame) {
    const requestReady = () => {
      glassesFrame.contentWindow?.postMessage({
        type: 'leila-glasses-ready-request'
      }, '*');
    };

    glassesFrame.addEventListener('load', () => {
      if (reducedMotion) {
        markSceneReady();
        return;
      }

      requestReady();
    }, { once: true });

    requestReady();
    readyRequestTimer = window.setInterval(requestReady, 450);
  } else {
    markSceneReady();
  }

  function finishOpening(delay) {
    window.setTimeout(() => {
      if (isClosing) {
        return;
      }

      isClosing = true;
      window.clearInterval(readyRequestTimer);
      opening.classList.add('is-leaving');
      document.body.classList.remove('opening-active', 'opening-clearing');

      window.setTimeout(() => {
        opening.remove();
      }, reducedMotion ? 20 : 820);
    }, delay);
  }

  function revealTogether() {
    if (isRevealing) {
      return;
    }

    isRevealing = true;
    opening.classList.add('is-revealing');

    if (revealButton) {
      revealButton.disabled = true;
    }

    window.setTimeout(() => {
      opening.classList.add('is-together');
      document.body.classList.add('opening-clearing');

      if (firstMessage) {
        firstMessage.setAttribute('aria-hidden', 'true');
      }

      if (togetherMessage) {
        togetherMessage.setAttribute('aria-hidden', 'false');
      }
    }, reducedMotion ? 10 : 420);

    finishOpening(reducedMotion ? 1400 : 3900);
  }

  function skipOpening() {
    if (isClosing) {
      return;
    }

    isClosing = true;
    window.clearInterval(readyRequestTimer);
    opening.classList.add('is-leaving');
    document.body.classList.remove('opening-active', 'opening-clearing');

    window.setTimeout(() => {
      opening.remove();
    }, reducedMotion ? 20 : 820);
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

  if (revealButton) {
    revealButton.addEventListener('click', revealTogether);
  }

  if (skipButton) {
    skipButton.addEventListener('click', skipOpening);
  }

  opening.addEventListener('keydown', trapFocus);

  window.requestAnimationFrame(() => {
    if (revealButton) {
      revealButton.focus({ preventScroll: true });
    }
  });
}());
