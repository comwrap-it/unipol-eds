import loadSwiper from '../../scripts/delayed.js';

/**
 * Entry point: decorates all editorial carousels found on the page.
 * Monolithic implementation with region markers for clarity.
 * @returns {Promise<void>}
 */
export default async function handleEditorialProductCarouselWidget() {
  // #region Guard clauses
  const carousels = document.querySelectorAll('.editorial-carousel-container');
  if (!carousels.length) return;
  // #endregion

  // #region Load styles once
  if (!handleEditorialProductCarouselWidget.stylesLoaded) {
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(
        `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`,
      ),
    ]);
    handleEditorialProductCarouselWidget.stylesLoaded = true;
  }
  // #endregion

  // #region Load Swiper
  let Swiper;
  try {
    Swiper = await loadSwiper();
  } catch {
    return;
  }
  // #endregion

  // #region Initialize each carousel
  carousels.forEach((carousel) => {
    // #region Dark theme toggle
    const rows = [...carousel.children];
    const darkThemeText = rows[1]?.textContent?.trim().toLowerCase();
    const darkThemeValue = darkThemeText === 'true';
    const section = carousel.closest('.section');
    if (darkThemeValue) {
      section?.classList.add('theme-dark');
    } else {
      section?.classList.remove('theme-dark');
    }
    // #endregion

    // #region Prevent double initialization
    if (carousel.dataset.initialized) return;
    carousel.dataset.initialized = 'true';
    // #endregion

    // #region Swiper plugin and instance
    const plugin = function editorialCarousel({ extendParams, on }) {
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

    // eslint-disable-next-line no-unused-vars
    const swiper = new Swiper(carousel, {
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
    // #endregion
  });
  // #endregion
}
