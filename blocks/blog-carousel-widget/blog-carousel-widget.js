/* eslint-disable import/extensions */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import loadSwiper from '../../scripts/delayed.js';

export default async function handleBlogCarouselWidget() {
  let isStylesLoaded = false;

  async function ensureStylesLoaded() {
    if (isStylesLoaded) return;
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(`${window.hlx.codeBasePath}/blocks/blog-carousel-widget/blog-carousel-widget.css`),
    ]);
    isStylesLoaded = true;
  }

  await ensureStylesLoaded();

  // Initialize Swiper
  loadSwiper().then((Swiper) => {
    try {
      const carousels = document.querySelectorAll('.blog-carousel-wrapper');
      carousels.forEach((carousel) => {
        const swiperEl = carousel.querySelector('.swiper');

        if (swiperEl.dataset.initialized) return;

        swiperEl.dataset.initialized = 'true';

        // eslint-disable-next-line no-unused-vars
        function blogCarousel({ swiper, extendParams, on }) {
          extendParams({
            debugger: false,
          });

          let endReached = false;
          let startReached = false;

          function reorderExpandingDots(orderCallback) {
            const expandingDots = carousel.querySelector('.scroll-indicator .expanding-dots');
            if (!expandingDots) return;

            const rectangle = expandingDots.querySelector('.rectangle')?.cloneNode(true);
            const svgs = [...expandingDots.querySelectorAll('svg')].map((svg) => svg.cloneNode(true));

            expandingDots.textContent = '';

            const orderedNodes = orderCallback({ rectangle, svgs });

            orderedNodes.forEach((node) => {
              if (node) expandingDots.appendChild(node);
            });
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
            reorderExpandingDots(({ rectangle, svgs }) => {
              const [ellipseOne, ellipseTwo] = svgs;
              return [ellipseOne, rectangle, ellipseTwo];
            });
          });
          on('fromEdge', () => {
            endReached = false;
            startReached = false;
          });
          on('reachBeginning', () => {
            startReached = true;
            reorderExpandingDots(({ rectangle, svgs }) => [rectangle, ...svgs]);
          });
          on('reachEnd', () => {
            endReached = true;
            reorderExpandingDots(({ rectangle, svgs }) => [...svgs, rectangle]);
          });
        }

        // Init Swiper
        // eslint-disable-next-line no-unused-vars
        const swiper = new Swiper(swiperEl, {
          // Install Plugin To Swiper
          modules: [blogCarousel],
          a11y: false,
          navigation: {
            nextEl: carousel.querySelector('.swiper-button-next'),
            prevEl: carousel.querySelector('.swiper-button-prev'),
          },
          speed: 700,
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          breakpoints: {
            // when window width is >= 768px
            768: {
              slidesPerView: 'auto',
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
  }).catch(() => {
    // Error loading Swiper from CDN
  });
}
