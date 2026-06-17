(function () {
  const storageKey = 'leila-theme';
  const root = document.documentElement;
  const panel = document.getElementById('palette-panel');
  const trigger = document.getElementById('palette-trigger');
  const navItem = document.querySelector('.nav-palette-item');
  const closeButton = document.getElementById('palette-close');
  const optionButtons = Array.from(document.querySelectorAll('.palette-option'));
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const navLinks = document.getElementById('nav-links');
  const defaultTheme = 'sage';

  if (!panel || !trigger || !navItem || optionButtons.length === 0) {
    return;
  }

  document.body.appendChild(panel);

  let panelOpen = false;

  function updateThemeMeta(color) {
    if (themeMeta && color) {
      themeMeta.setAttribute('content', color);
    }
  }

  function setTheme(themeName) {
    const nextTheme = themeName || defaultTheme;
    root.setAttribute('data-theme', nextTheme);

    optionButtons.forEach((button) => {
      const isActive = button.dataset.theme === nextTheme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      if (isActive) {
        updateThemeMeta(button.dataset.themeColor);
      }
    });

    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch (error) {
      // noop
    }
  }

  function openPanel() {
    positionPanel();
    panelOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    panelOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function togglePanel() {
    if (panelOpen) {
      closePanel();
      return;
    }

    openPanel();
  }

  function positionPanel() {
    const rect = trigger.getBoundingClientRect();
    const isMobile = window.innerWidth <= 600;
    const panelWidth = Math.min(isMobile ? 320 : 360, window.innerWidth - 24);
    const maxHeight = Math.min(isMobile ? window.innerHeight - 96 : Math.round(window.innerHeight * 0.68), 560);

    panel.style.width = panelWidth + 'px';
    panel.style.maxHeight = maxHeight + 'px';

    let left = isMobile
      ? rect.left + ((rect.width - panelWidth) / 2)
      : rect.right - panelWidth;

    left = Math.max(12, Math.min(left, window.innerWidth - panelWidth - 12));

    let top = rect.bottom + 12;
    const measuredHeight = Math.min(panel.scrollHeight || maxHeight, maxHeight);

    if (top + measuredHeight > window.innerHeight - 12) {
      top = Math.max(80, rect.top - measuredHeight - 12);
    }

    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }

  const initialTheme = (function () {
    try {
      return localStorage.getItem(storageKey) || root.getAttribute('data-theme') || defaultTheme;
    } catch (error) {
      return root.getAttribute('data-theme') || defaultTheme;
    }
  }());

  setTheme(initialTheme);

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    togglePanel();
  });

  if (closeButton) {
    closeButton.addEventListener('click', closePanel);
  }

  optionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(button.dataset.theme || defaultTheme);
      closePanel();
    });
  });

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closePanel);
    });
  }

  document.addEventListener('click', (event) => {
    if (!panelOpen) {
      return;
    }

    if (navItem.contains(event.target) || panel.contains(event.target)) {
      return;
    }

    closePanel();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panelOpen) {
      closePanel();
    }
  });

  window.addEventListener('resize', () => {
    if (!panelOpen) {
      return;
    }

    positionPanel();
  });

  window.addEventListener('pageshow', () => {
    try {
      const savedTheme = localStorage.getItem(storageKey) || defaultTheme;
      setTheme(savedTheme);
    } catch (error) {
      setTheme(defaultTheme);
    }
  });
}());
