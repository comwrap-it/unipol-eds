import loadSwiper from '../../scripts/delayed.js';

let isStylesLoaded = false;

/**
 * Ensures widget styles are loaded once.
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`,
    ),
  ]);
  isStylesLoaded = true;
}

/**
 * Toggles dark theme on the enclosing section based on authored flag.
 * @param {Element} block
 */
function applyDarkTheme(block) {
  const rows = [...block.children];
  const darkThemeText = rows[1]?.textContent?.trim().toLowerCase();
  const darkThemeValue = darkThemeText === 'true';

  const section = block.closest('.section');
  if (darkThemeValue) {
    section?.classList.add('theme-dark');
  } else {
    section?.classList.remove('theme-dark');
  }
}

/**
 * Creates the Swiper plugin used to manage dots and notifications.
 * @param {HTMLElement} carousel
 * @returns {(params: {swiper: any, extendParams: Function, on: Function}) => void}
 */
function createEditorialCarouselPlugin(carousel) {
  return function editorialCarousel({ extendParams, on }) {
    extendParams({
      debugger: false,
    });

    let endReached = false;
    let startReached = false;

    function setExpandedDot({ isBeginning, isEnd }) {
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
    }

    on('init', () => {
      carousel.querySelectorAll('.swiper-navigation-icon').forEach((el) => {
        el.remove();
      });
      carousel.querySelectorAll('.swiper-notification').forEach((el) => {
        el.remove();
      });
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
 * Creates a Swiper instance for a single carousel element.
 * @param {HTMLElement} carousel
 * @param {typeof import('swiper').default} Swiper
 */
function initSwiper(carousel, Swiper) {
  const swiperEl = carousel;
  if (swiperEl.dataset.initialized) return;

  swiperEl.dataset.initialized = 'true';
  const plugin = createEditorialCarouselPlugin(carousel);

  // eslint-disable-next-line no-unused-vars
  const swiper = new Swiper(swiperEl, {
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
 * Entry point: decorates all editorial carousels found on the page.
 * @returns {Promise<void>}
 */
export default async function handleEditorialProductCarouselWidget() {
  const carousels = document.querySelectorAll('.editorial-carousel-container');
  if (!carousels.length) return;

  await ensureStylesLoaded();

  try {
    const Swiper = await loadSwiper();
    carousels.forEach((carousel) => {
      applyDarkTheme(carousel);
      initSwiper(carousel, Swiper);
    });
  } catch {
    // Error creating Swiper instance
  }
}
