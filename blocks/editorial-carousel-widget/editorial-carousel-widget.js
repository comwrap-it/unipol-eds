import loadSwiper from '../../scripts/delayed.js';

let stylesLoaded = false;

async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const widgetCssPath = `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`;
  await Promise.all([loadCSS(widgetCssPath)]);
  stylesLoaded = true;
}

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
