import loadSwiper from '../../scripts/delayed.js';

let stylesLoaded = false;

/**
 * Loads the widget stylesheet once prior to initializing Swiper behavior.
 *
 * @returns {Promise<void>} resolves when the CSS is fetched
 */
async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const widgetCssPath = `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`;
  await Promise.all([loadCSS(widgetCssPath)]);
  stylesLoaded = true;
}

/**
 * Applies or removes the dark theme on the closest section based on authored data.
 *
 * @param {HTMLElement} carousel - Carousel element containing the dark theme flag row
 */
function applyDarkTheme(carousel) {
  const rows = [...carousel.children];
  const darkThemeText = rows[1]?.textContent?.trim().toLowerCase();
  const darkThemeValue = darkThemeText === 'true';
  const section = carousel.closest('.section');
  if (darkThemeValue) {
    section?.classList.add('theme-dark');
  } else {
    section?.classList.remove('theme-dark');
  }
}

/**
 * Creates a Swiper plugin that syncs expanding dots and navigation state.
 *
 * @param {HTMLElement} carousel - Carousel element the plugin will control
 * @returns {(params: Object) => void} Swiper module initializer
 */
function createPlugin(carousel) {
  return function editorialCarousel({ extendParams, on }) {
    extendParams({ debugger: false });

    let endReached = false;
    let startReached = false;

    const setExpandedDot = ({ isBeginning, isEnd }) => {
      const expandingDots = carousel.querySelector('.expanding-dots');
      const dots = expandingDots?.querySelectorAll('span') || [];
      dots.forEach((dot) => dot.classList.remove('expanded'));
      if (isBeginning) {
        dots[0]?.classList.add('expanded');
      } else if (isEnd) {
        dots[2]?.classList.add('expanded');
      } else {
        dots[1]?.classList.add('expanded');
      }
    };

    on('init', () => {
      carousel.querySelectorAll('.swiper-navigation-icon').forEach((el) => el.remove());
      carousel.querySelectorAll('.swiper-notification').forEach((el) => el.remove());
    });

    on('slideChange', () => {
      if (endReached || startReached) return;
      endReached = false;
      startReached = false;
      setExpandedDot({ isBeginning: false, isEnd: false });
    });

    on('fromEdge', () => {
      endReached = false;
      startReached = false;
    });

    on('reachBeginning', () => {
      startReached = true;
      setExpandedDot({ isBeginning: true, isEnd: false });
    });

    on('reachEnd', () => {
      endReached = true;
      setExpandedDot({ isBeginning: false, isEnd: true });
    });
  };
}

/**
 * Initializes Swiper on a carousel element using the expanding-dots plugin.
 * Guards against double initialization via a data flag.
 *
 * @param {HTMLElement} carousel - Carousel to enhance with Swiper
 * @param {typeof Swiper} SwiperLib - Swiper constructor from CDN
 */
function initSwiper(carousel, SwiperLib) {
  if (carousel.dataset.initialized) return;
  carousel.dataset.initialized = 'true';

  const plugin = createPlugin(carousel);

  // eslint-disable-next-line no-unused-vars
  const swiper = new SwiperLib(carousel, {
    modules: [plugin],
    a11y: false,
    navigation: {
      nextEl: carousel.querySelector('.swiper-button-next'),
      prevEl: carousel.querySelector('.swiper-button-prev'),
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
}

/**
 * Bootstraps all editorial carousel instances on the page: loads styles,
 * fetches Swiper, applies theme toggles, and initializes navigation behavior.
 *
 * @returns {Promise<void>} resolves when initialization completes or exits early
 */
export default async function handleEditorialProductCarouselWidget() {
  const carousels = document.querySelectorAll('.editorial-carousel-container');
  if (!carousels.length) return;

  await ensureStylesLoaded();

  let SwiperLib;
  try {
    SwiperLib = await loadSwiper();
  } catch {
    return;
  }

  carousels.forEach((carousel) => {
    applyDarkTheme(carousel);
    initSwiper(carousel, SwiperLib);
  });
}
