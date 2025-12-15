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

// #region CONFIGS

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

  return function editorialCarousel({ on }) {
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
 * @returns {Object | null} Swiper instance, or null if already initialized.
 */
function createSwiperFromCarousel(carousel, SwiperLib) {
  if (carousel.dataset.initialized) return null;
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
  });

  return swiperInstance;
}

// #endregion

// #region RENDER

/**
 * Enhances all editorial carousel instances found.
 *
 * Assembly is kept monolithic (except for `create*From*` helpers).
 *
 * @param {HTMLElement[]} carousels
 * @param {Function} SwiperLib
 */
function renderEditorialCarouselWidget(carousels, SwiperLib) {
  /**
   * LOOP: enhance each carousel instance.
   */
  carousels.forEach((carousel) => {
    /**
     * PARSE: read per-carousel configuration (dark theme flag).
     */
    const darkTheme = parseDarkThemeFlagFromCarousel(carousel);

    /**
     * APPLY: toggle section theme.
     */
    const section = carousel.closest('.section');
    if (darkTheme.enabled) {
      section?.classList.add('theme-dark');
    } else {
      section?.classList.remove('theme-dark');
    }

    /**
     * INIT: Swiper (only once per carousel).
     */
    createSwiperFromCarousel(carousel, SwiperLib);
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
  if (block) {
    // no-op: parameter is accepted for block-loader compatibility
  }

  /**
   * DISCOVER: find all carousel containers.
   */
  const carousels = Array.from(document.querySelectorAll(SELECTORS.carousel));
  if (!carousels.length) return;

  /**
   * LOAD: CSS + Swiper library.
   */
  await ensureStylesLoaded();

  let SwiperLib;
  try {
    SwiperLib = await loadSwiper();
  } catch (e) {
    return;
  }

  /**
   * RENDER: enhance all instances.
   */
  renderEditorialCarouselWidget(carousels, SwiperLib);
}

// #endregion
