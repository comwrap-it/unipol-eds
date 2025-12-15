import loadSwiper from '../../scripts/delayed.js';

const DEBUG_FEATURE = 'editorial-carousel-widget';
const DEBUG_SNAPSHOT_STORE = '__EDS_DEBUG_SNAPSHOTS__';
const DEBUG_MAX_SNAPSHOTS = 50;

const SELECTORS = {
  carousel: '.editorial-carousel-container',
  expandingDots: '.expanding-dots',
  dot: 'span',
  swiperIcon: '.swiper-navigation-icon',
  swiperNotification: '.swiper-notification',
  navPrev: '.swiper-button-prev',
  navNext: '.swiper-button-next',
};

let dependenciesLoaded = false;
let debugEnabledMemo;

async function loadDependenciesOnce() {
  if (dependenciesLoaded) return;

  const { loadCSS } = await import('../../scripts/aem.js');
  const widgetCssPath = `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`;

  await loadCSS(widgetCssPath);
  dependenciesLoaded = true;
}

function parseDebugSelector(value) {
  const normalized = (value || '').trim().toLowerCase();
  if (!normalized) return false;

  if (['1', 'true', 'on', 'yes', '*', 'all'].includes(normalized)) return true;

  const parts = normalized
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.includes(DEBUG_FEATURE);
}

function computeDebugEnabled() {
  try {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.has('debug-editorial-carousel-widget');
    if (explicit) return true;

    const fromQuery = params.get('eds-debug') || params.get('debug');
    if (parseDebugSelector(fromQuery)) return true;
  } catch (e) {
    // ignore
  }

  try {
    const perComponent = window.localStorage?.getItem(
      'eds-debug-editorial-carousel-widget',
    );
    if (parseDebugSelector(perComponent)) return true;

    const globalFlag = window.localStorage?.getItem('eds-debug');
    if (parseDebugSelector(globalFlag)) return true;
  } catch (e) {
    // ignore
  }

  const global = window.EDS_DEBUG;
  if (global === true) return true;
  if (typeof global === 'string' && parseDebugSelector(global)) return true;
  if (Array.isArray(global)) {
    const normalized = global.map((value) => String(value).toLowerCase());
    if (normalized.includes(DEBUG_FEATURE)) return true;
  }

  return false;
}

function isDebugEnabled() {
  if (typeof debugEnabledMemo === 'boolean') return debugEnabledMemo;
  debugEnabledMemo = computeDebugEnabled();
  return debugEnabledMemo;
}

function persistDebugSnapshot(snapshot) {
  if (!snapshot) return;

  const store = window[DEBUG_SNAPSHOT_STORE] || (window[DEBUG_SNAPSHOT_STORE] = {});
  const list = store[DEBUG_FEATURE] || (store[DEBUG_FEATURE] = []);

  list.push(snapshot);
  if (list.length > DEBUG_MAX_SNAPSHOTS) {
    list.splice(0, list.length - DEBUG_MAX_SNAPSHOTS);
  }
}

/* eslint-disable no-console */
function printDebugSnapshot(snapshot) {
  if (!snapshot) return;

  const stage = snapshot.stage ? ` ${snapshot.stage}` : '';
  const label = `[EDS][${DEBUG_FEATURE}] ${snapshot.id}${stage}`;

  if (console.groupCollapsed) {
    console.groupCollapsed(label);
    console.debug(snapshot);
    console.groupEnd();
  } else {
    console.debug(label, snapshot);
  }
}
/* eslint-enable no-console */

function getDebugId(element) {
  if (!element) return 'page';

  return (
    element.getAttribute?.('data-aue-resource')
    || element.dataset?.blockName
    || element.id
    || element.className
    || 'unknown'
  );
}

function debugSnapshot(root, payload) {
  if (!isDebugEnabled()) return;

  const snapshot = {
    id: getDebugId(root),
    ...payload,
  };

  persistDebugSnapshot(snapshot);
  printDebugSnapshot(snapshot);
}

function parseDarkThemeFlag(carousel) {
  const rows = Array.from(carousel.children);
  const raw = rows[1]?.textContent?.trim().toLowerCase();

  return {
    raw: raw ?? null,
    enabled: raw === 'true',
  };
}

function applySectionTheme(carousel, isDarkTheme) {
  const section = carousel.closest('.section');

  if (isDarkTheme) {
    section?.classList.add('theme-dark');
  } else {
    section?.classList.remove('theme-dark');
  }
}

function getExpandingDotElements(carousel) {
  const container = carousel.querySelector(SELECTORS.expandingDots);
  return container?.querySelectorAll(SELECTORS.dot) || [];
}

function setExpandedDot(carousel, position) {
  const dots = getExpandingDotElements(carousel);
  dots.forEach((dot) => dot.classList.remove('expanded'));

  if (!dots.length) return;

  const indexByPosition = {
    start: 0,
    middle: 1,
    end: 2,
  };

  const index = indexByPosition[position] ?? indexByPosition.middle;
  dots[index]?.classList.add('expanded');
}

function createExpandingDotsPlugin(carousel) {
  return function editorialCarousel({ extendParams, on }) {
    extendParams({ debugger: false });

    let edgeState = null;

    on('init', () => {
      carousel.querySelectorAll(SELECTORS.swiperIcon).forEach((el) => el.remove());
      carousel
        .querySelectorAll(SELECTORS.swiperNotification)
        .forEach((el) => el.remove());
    });

    on('slideChange', () => {
      if (edgeState) return;
      setExpandedDot(carousel, 'middle');
    });

    on('fromEdge', () => {
      edgeState = null;
    });

    on('reachBeginning', () => {
      edgeState = 'start';
      setExpandedDot(carousel, 'start');
    });

    on('reachEnd', () => {
      edgeState = 'end';
      setExpandedDot(carousel, 'end');
    });
  };
}

function initSwiperOnce(carousel, SwiperLib) {
  if (carousel.dataset.initialized) {
    return { alreadyInitialized: true };
  }

  carousel.dataset.initialized = 'true';

  const plugin = createExpandingDotsPlugin(carousel);

  const swiperInstance = new SwiperLib(carousel, {
    modules: [plugin],
    a11y: false,
    navigation: {
      nextEl: carousel.querySelector(SELECTORS.navNext),
      prevEl: carousel.querySelector(SELECTORS.navPrev),
    },
    speed: 700,
    slidesPerView: 3,
    slidesPerGroup: 1,
    breakpoints: {
      1200: {
        slidesPerView: 4,
        allowTouch: false,
      },
      768: {
        slidesPerView: 3,
        allowTouchMove: false,
      },
    },
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: 'slide',
    debugger: true,
  });
  return {
    alreadyInitialized: false,
    slides: swiperInstance.slides?.length ?? null,
  };
}

async function loadSwiperSafely() {
  try {
    return await loadSwiper();
  } catch (e) {
    return null;
  }
}

function findCarousels() {
  return Array.from(document.querySelectorAll(SELECTORS.carousel));
}

export default async function decorateEditorialCarouselWidget(block) {
  const carousels = findCarousels();
  if (!carousels.length) return;

  await loadDependenciesOnce();

  const SwiperLib = await loadSwiperSafely();
  if (!SwiperLib) return;

  debugSnapshot(block, {
    stage: 'init',
    carousels: carousels.length,
  });

  const results = carousels.map((carousel) => {
    const darkTheme = parseDarkThemeFlag(carousel);
    applySectionTheme(carousel, darkTheme.enabled);

    const init = initSwiperOnce(carousel, SwiperLib);

    return {
      id: getDebugId(carousel),
      darkTheme,
      ...init,
    };
  });

  debugSnapshot(block, {
    stage: 'done',
    results: results.slice(0, 20),
    truncated: results.length > 20,
  });
}
