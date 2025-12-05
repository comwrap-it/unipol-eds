import loadSwiper from '../../scripts/lib/utils.js';

let isStylesLoaded = false;

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

export default async function handleEditorialProductCarouselWidget() {
  const block = document.querySelector('.editorial-carousel-container');
  if (!block) return;

  applyDarkTheme(block);
  await ensureStylesLoaded();

  // Initialize Swiper
  try {
    const Swiper = await loadSwiper();
    const carousels = document.querySelectorAll('.editorial-carousel-wrapper');
    carousels.forEach((carousel) => {
      const swiperEl = carousel.querySelector('.swiper');

      if (swiperEl.dataset.initialized) return;

      swiperEl.dataset.initialized = 'true';

      // eslint-disable-next-line no-unused-vars
      function insuranceProductCarousel({ swiper, extendParams, on }) {
        extendParams({
          debugger: false,
        });

        let endReached = false;
        let startReached = false;

        function setExpandedDot({ isBeginning, isEnd }) {
          const expandingDots = carousel.querySelector('.expanding-dots');
          const dots = expandingDots.querySelectorAll('span');
          // Clear previous state
          dots.forEach((dot) => dot.classList.remove('expanded'));
          // Decide which to expand
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
      }

      // Init Swiper
      // eslint-disable-next-line no-unused-vars
      const swiper = new Swiper(swiperEl, {
        // Install Plugin To Swiper
        modules: [insuranceProductCarousel],
        a11y: false,
        navigation: {
          nextEl: carousel.querySelector('.swiper-button-next'),
          prevEl: carousel.querySelector('.swiper-button-prev'),
        },
        speed: 700,
        slidesPerView: 3,
        slidesPerGroup: 1,
        breakpoints: {
          // width >= 1200
          1200: {
            slidesPerView: 4,
            allowTouch: false,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 3,
            allowTouchMove: false,
          },
        },
        resistanceRatio: 0.85,
        touchReleaseOnEdges: true,
        effect: 'slide',
        // Enable debugger
        debugger: true,
      });
    });
  } catch {
    // Error creating Swiper instance
  }
}
