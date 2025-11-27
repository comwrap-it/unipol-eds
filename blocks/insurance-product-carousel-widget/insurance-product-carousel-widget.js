/* eslint-disable import/extensions */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

export default async function decorate() {
  let isStylesLoaded = false;
  async function ensureStylesLoaded() {
    if (isStylesLoaded) return;
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(`${window.hlx.codeBasePath}/blocks/insurance-product-carousel-widget/insurance-product-carousel-widget.css`),
    ]);
    isStylesLoaded = true;
  }

  await ensureStylesLoaded();

  function reorderExpandingDots(orderCallback) {
    const expandingDots = document.querySelector('.scroll-indicator .expanding-dots');
    if (!expandingDots) return;

    const rectangle = expandingDots.querySelector('.rectangle')?.cloneNode(true);
    const svgs = [...expandingDots.querySelectorAll('svg')].map((svg) => svg.cloneNode(true));

    expandingDots.textContent = '';

    const orderedNodes = orderCallback({ rectangle, svgs });

    orderedNodes.forEach((node) => {
      if (node) expandingDots.appendChild(node);
    });
  }

  // eslint-disable-next-line no-unused-vars
  function insuranceProductCarousel({ swiper, extendParams, on }) {
    extendParams({
      debugger: false,
    });

    let endReached = false;
    let startReached = false;

    on('init', () => {
      document.querySelectorAll('.swiper-navigation-icon').forEach((el) => { el.remove(); });
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
  const swiper = new Swiper('.swiper', {
    // Install Plugin To Swiper
    modules: [insuranceProductCarousel],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    speed: 700,
    slidesPerView: 3,
    slidesPerGroup: 1,
    breakpoints: {
      // when window width is >= 768px
      768: {
        slidesPerView: 4,
        allowTouchMove: false,
      },
    },
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: 'slide',
    // Enable debugger
    debugger: true,
  });
}
