(function () {
  const storageKey = 'leila-theme';
  const root = document.documentElement;
  const panel = document.getElementById('palette-panel');
  const trigger = document.getElementById('palette-trigger');
  const navItem = document.querySelector('.nav-palette-item');
  const closeButton = document.getElementById('palette-close');
  const paletteGrid = document.querySelector('.palette-grid');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const navLinks = document.getElementById('nav-links');
  const defaultTheme = 'sage';
  const additionalThemes = [
    {
      id: 'lavanda',
      color: '#806E9C',
      swatches: ['#574766', '#D8C8B9', '#FBF8FC'],
      name: 'Lavanda Afetuosa',
      note: 'Calma e sensível, com um toque criativo sem perder seriedade.'
    },
    {
      id: 'ceu',
      color: '#5D85AA',
      swatches: ['#365A7A', '#D6C6B2', '#F9FBFD'],
      name: 'Céu de Infância',
      note: 'Leve e aberta, transmite clareza, confiança e tranquilidade.'
    },
    {
      id: 'menta',
      color: '#4F8C80',
      swatches: ['#305F58', '#D0C4A8', '#F6FBF9'],
      name: 'Menta Serena',
      note: 'Fresca e equilibrada para uma presença acolhedora e atual.'
    },
    {
      id: 'eucalipto',
      color: '#54776D',
      swatches: ['#334F48', '#CDBAA5', '#F7FAF8'],
      name: 'Eucalipto Natural',
      note: 'Orgânica e sóbria, aproxima saúde, natureza e cuidado.'
    },
    {
      id: 'oliva',
      color: '#78804F',
      swatches: ['#50572F', '#D1BC8D', '#FBFAF4'],
      name: 'Oliva Orgânica',
      note: 'Terrosa e estável, com personalidade discreta e profissional.'
    },
    {
      id: 'camomila',
      color: '#A77E3D',
      swatches: ['#735226', '#D9C49A', '#FFFBEF'],
      name: 'Camomila Solar',
      note: 'Iluminada e gentil, traz otimismo com suavidade visual.'
    },
    {
      id: 'areia',
      color: '#8B7765',
      swatches: ['#5C4B3E', '#CDBCA9', '#FCFAF7'],
      name: 'Areia Elegante',
      note: 'Neutra e refinada, ideal para uma comunicação serena.'
    },
    {
      id: 'cacau',
      color: '#8A6654',
      swatches: ['#5C4034', '#D4BBA5', '#FDF9F5'],
      name: 'Cacau Acolhedor',
      note: 'Quente e confiável, cria proximidade com elegância.'
    },
    {
      id: 'ameixa',
      color: '#80566F',
      swatches: ['#58384A', '#CFB9B7', '#FCF8FA'],
      name: 'Ameixa Editorial',
      note: 'Profunda e sofisticada, com delicadeza e presença.'
    },
    {
      id: 'cereja',
      color: '#9A5967',
      swatches: ['#6A3742', '#D7B5AD', '#FDF8F8'],
      name: 'Cereja Delicada',
      note: 'Afetiva e marcante na medida, sem perder leveza.'
    },
    {
      id: 'coral',
      color: '#AD685E',
      swatches: ['#78443E', '#DDB9A5', '#FFF9F6'],
      name: 'Coral Humano',
      note: 'Próxima e calorosa, favorece uma comunicação muito humana.'
    },
    {
      id: 'azul',
      color: '#5C729A',
      swatches: ['#3A4B6C', '#C9BBAA', '#F8FAFD'],
      name: 'Azul Horizonte',
      note: 'Confiante e organizado, equilibra clínica e acolhimento.'
    },
    {
      id: 'lilas',
      color: '#8F719B',
      swatches: ['#624C6B', '#D6C1B8', '#FCF9FD'],
      name: 'Lilás Lúdico',
      note: 'Imaginativo e delicado, conversa bem com o universo infantil.'
    },
    {
      id: 'petroleo',
      color: '#397681',
      swatches: ['#24515B', '#C7B69E', '#F5FAFA'],
      name: 'Petróleo Moderno',
      note: 'Contemporâneo e firme, com frescor e ótima presença digital.'
    },
    {
      id: 'esmeralda',
      color: '#3F7D62',
      swatches: ['#285642', '#CFBE9F', '#F5FAF7'],
      name: 'Esmeralda Confiante',
      note: 'Viva e segura, reforça crescimento, equilíbrio e evolução.'
    },
    {
      id: 'aurora',
      color: '#687BA3',
      swatches: ['#455678', '#D7B9BD', '#FAF9FC'],
      name: 'Aurora Suave',
      note: 'Mistura serenidade azulada e calor rosado com sutileza.'
    },
    {
      id: 'outono',
      color: '#A06546',
      swatches: ['#70422E', '#D5B287', '#FFF9F3'],
      name: 'Outono Afetivo',
      note: 'Terrosa e calorosa, comunica experiência e proximidade.'
    },
    {
      id: 'neblina',
      color: '#657482',
      swatches: ['#414F5A', '#C6BCAF', '#F8FAFB'],
      name: 'Neblina Contemporânea',
      note: 'Minimalista e tranquila para uma imagem limpa e moderna.'
    },
    {
      id: 'baunilha',
      color: '#A57A4E',
      swatches: ['#705033', '#DFC69B', '#FFFCF4'],
      name: 'Baunilha Quente',
      note: 'Suave e luminosa, com conforto visual e toque artesanal.'
    },
    {
      id: 'hibisco',
      color: '#9A5273',
      swatches: ['#67364D', '#D8B5B9', '#FDF8FB'],
      name: 'Hibisco Gentil',
      note: 'Expressiva e feminina, preservando equilíbrio e confiança.'
    }
  ];

  if (paletteGrid) {
    additionalThemes.forEach((theme) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'palette-option';
      button.dataset.theme = theme.id;
      button.dataset.themeColor = theme.color;
      button.setAttribute('aria-pressed', 'false');

      const swatches = theme.swatches
        .map((color) => `<span style="background:${color};"></span>`)
        .join('');

      button.innerHTML = `
        <span class="palette-swatches">${swatches}</span>
        <span class="palette-name">${theme.name}</span>
        <span class="palette-note">${theme.note}</span>
      `;

      paletteGrid.appendChild(button);
    });
  }

  const optionButtons = Array.from(document.querySelectorAll('.palette-option'));

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

    document.dispatchEvent(new CustomEvent('leila:themechange', {
      detail: { theme: nextTheme }
    }));
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
    const isCompact = window.innerWidth <= 960;
    const preferredWidth = isMobile ? 340 : isCompact ? 620 : 840;
    const panelWidth = Math.min(preferredWidth, window.innerWidth - 24);
    const maxHeight = Math.min(isMobile ? window.innerHeight - 96 : Math.round(window.innerHeight * 0.76), 680);

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
