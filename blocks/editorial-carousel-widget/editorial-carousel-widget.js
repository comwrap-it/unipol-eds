/**
 * Editorial Carousel Widget
 *
 * Enhances all `.editorial-carousel-container` instances on the page with Swiper behavior.
 *
 * This module is designed as a page-level enhancer:
 * - It scans the document for carousel instances.
 * - It initializes Swiper once per carousel (guarded via `data-initialized`).
 * - It applies an optional dark theme to the closest section.
 */

import { loadCSS } from '../../scripts/aem.js';
import loadSwiper from '../../scripts/delayed.js';

/**
 * @typedef {Object} DarkThemeFlag
 * @property {string | null} raw
 * @property {boolean} enabled
 */

/**
 * @typedef {Object} SwiperInitResult
 * @property {boolean} alreadyInitialized
 * @property {number | null} slides
 */

// #region CONFIGS

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

// #endregion

// #region DEPENDENCIES

let stylesLoaded = false;

/**
 * Ensures widget CSS is loaded once.
 *
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (stylesLoaded) return;

  const widgetCssPath = `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`;
  await loadCSS(widgetCssPath);

  stylesLoaded = true;
}

// #endregion

// #region DEBUG

let debugEnabledMemo;

/**
 * Memoized debug check for this feature.
 *
 * @returns {boolean}
 */
function isDebugEnabled() {
  if (typeof debugEnabledMemo === 'boolean') return debugEnabledMemo;

  const parseSelector = (value) => {
    const normalized = (value || '').trim().toLowerCase();
    if (!normalized) return false;

    if (['1', 'true', 'on', 'yes', '*', 'all'].includes(normalized)) return true;

    return normalized
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .includes(DEBUG_FEATURE);
  };

  let enabled = false;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('debug-editorial-carousel-widget')) enabled = true;

    const fromQuery = params.get('eds-debug') || params.get('debug');
    if (parseSelector(fromQuery)) enabled = true;
  } catch (e) {
    // ignore
  }

  try {
    const perComponent = window.localStorage?.getItem('eds-debug-editorial-carousel-widget');
    if (parseSelector(perComponent)) enabled = true;

    const globalFlag = window.localStorage?.getItem('eds-debug');
    if (parseSelector(globalFlag)) enabled = true;
  } catch (e) {
    // ignore
  }

  const global = window.EDS_DEBUG;
  if (global === true) enabled = true;
  if (typeof global === 'string' && parseSelector(global)) enabled = true;
  if (Array.isArray(global)) {
    const normalized = global.map((value) => String(value).toLowerCase());
    if (normalized.includes(DEBUG_FEATURE)) enabled = true;
  }

  debugEnabledMemo = enabled;
  return enabled;
}

/* eslint-disable no-console */
/**
 * Emits a debug snapshot in console and stores it in `window.__EDS_DEBUG_SNAPSHOTS__`.
 *
 * @param {HTMLElement | undefined} root
 * @param {Object} payload
 */
function debugSnapshot(root, payload) {
  if (!isDebugEnabled()) return;
  const id = (
    root?.getAttribute?.('data-aue-resource')
    || root?.dataset?.blockName
    || root?.id
    || root?.className
    || 'page'
  );

  const snapshot = { id, ...payload };

  const store = window[DEBUG_SNAPSHOT_STORE] || (window[DEBUG_SNAPSHOT_STORE] = {});
  const list = store[DEBUG_FEATURE] || (store[DEBUG_FEATURE] = []);

  list.push(snapshot);
  if (list.length > DEBUG_MAX_SNAPSHOTS) {
    list.splice(0, list.length - DEBUG_MAX_SNAPSHOTS);
  }

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

// #endregion

// #region PARSE

/**
 * Parses the dark theme flag for a given carousel.
 *
 * Note: the flag is currently derived from the second child node of the carousel container.
 *
 * @param {HTMLElement} carousel
 * @returns {DarkThemeFlag}
 */
function parseDarkThemeFlagFromCarousel(carousel) {
  const rows = Array.from(carousel.children);
  const raw = rows[1]?.textContent?.trim().toLowerCase();

  return {
    raw: raw ?? null,
    enabled: raw === 'true',
  };
}

// #endregion

// #region CREATE

/**
 * Creates a Swiper plugin that controls the "expanding dots" indicator.
 *
 * @param {HTMLElement} carousel
 * @returns {(params: { extendParams: Function, on: Function }) => void}
 */
function createExpandingDotsPluginFromCarousel(carousel) {
  const getDots = () => {
    const container = carousel.querySelector(SELECTORS.expandingDots);
    return container?.querySelectorAll(SELECTORS.dot) || [];
  };

  const setExpandedDot = (position) => {
    const dots = getDots();
    dots.forEach((dot) => dot.classList.remove('expanded'));

    if (!dots.length) return;

    const indexByPosition = { start: 0, middle: 1, end: 2 };
    const index = indexByPosition[position] ?? indexByPosition.middle;

    dots[index]?.classList.add('expanded');
  };

  return function editorialCarousel({ extendParams, on }) {
    extendParams({ debugger: false });

    let edgeState = null;

    on('init', () => {
      carousel.querySelectorAll(SELECTORS.swiperIcon).forEach((el) => el.remove());
      carousel.querySelectorAll(SELECTORS.swiperNotification).forEach((el) => el.remove());
    });

    on('slideChange', () => {
      if (edgeState) return;
      setExpandedDot('middle');
    });

    on('fromEdge', () => {
      edgeState = null;
    });

    on('reachBeginning', () => {
      edgeState = 'start';
      setExpandedDot('start');
    });

    on('reachEnd', () => {
      edgeState = 'end';
      setExpandedDot('end');
    });
  };
}

/**
 * Creates the Swiper instance for a carousel, guarded by `data-initialized`.
 *
 * @param {HTMLElement} carousel
 * @param {Function} SwiperLib
 * @returns {SwiperInitResult}
 */
function createSwiperFromCarousel(carousel, SwiperLib) {
  if (carousel.dataset.initialized) {
    return { alreadyInitialized: true, slides: null };
  }

  carousel.dataset.initialized = 'true';

  const plugin = createExpandingDotsPluginFromCarousel(carousel);

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

// #endregion

// #region RENDER

/**
 * Renders (enhances) all editorial carousel instances found.
 *
 * Assembly is kept monolithic (except for `create*From*` helpers).
 *
 * @param {HTMLElement | undefined} block
 * @param {HTMLElement[]} carousels
 * @param {Function} SwiperLib
 */
function renderEditorialCarouselWidget(block, carousels, SwiperLib) {
  debugSnapshot(block, {
    stage: 'init',
    carousels: carousels.length,
  });

  const results = carousels.map((carousel) => {
    const darkTheme = parseDarkThemeFlagFromCarousel(carousel);

    const section = carousel.closest('.section');
    if (darkTheme.enabled) {
      section?.classList.add('theme-dark');
    } else {
      section?.classList.remove('theme-dark');
    }

    const init = createSwiperFromCarousel(carousel, SwiperLib);

    return {
      id: carousel.getAttribute('data-aue-resource')
        || carousel.dataset.blockName
        || carousel.id
        || carousel.className,
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

// #endregion

// #region DECORATE

/**
 * Decorates the Editorial Carousel Widget.
 *
 * This is a page-level enhancer: it scans the document for carousels.
 *
 * @param {HTMLElement} [block]
 * @returns {Promise<void>}
 */
export default async function decorateEditorialCarouselWidget(block) {
  const carousels = Array.from(document.querySelectorAll(SELECTORS.carousel));
  if (!carousels.length) return;

  await ensureStylesLoaded();

  let SwiperLib;
  try {
    SwiperLib = await loadSwiper();
  } catch (e) {
    return;
  }

  renderEditorialCarouselWidget(block, carousels, SwiperLib);
}

// #endregion
