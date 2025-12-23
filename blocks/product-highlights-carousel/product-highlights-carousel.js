import loadSwiper from '../../scripts/delayed.js';

// #region CONSTANTS
const CAROUSEL_CLASS = 'product-highlights-carousel';
const TRACK_CLASS = 'product-highlights-carousel-track';

export const PRODUCT_HIGHLIGHTS_SWIPER_SPEED = 12000;
export const PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW = PRODUCT_HIGHLIGHTS_SWIPER_SPEED * 3; // 1/3
// #endregion

// #region HELPERS
let isStylesLoaded = false;
let stylesLoadingPromise = null;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      const { loadCSS } = await import('../../scripts/aem.js');
      await Promise.all([
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/product-highlights-carousel/product-highlights-carousel.css`,
        ),
        loadCSS(`${window.hlx.codeBasePath}/blocks/photo-card/photo-card.css`),
      ]);
      isStylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}

/**
 * Aggiorna speed e riavvia autoplay (se in esecuzione)
 */
export const setProductHighlightsSwiperSpeed = (swiperInstance, speed) => {
  if (!swiperInstance) return;
  swiperInstance.params.speed = speed;

  if (swiperInstance.autoplay?.running) {
    swiperInstance.autoplay.stop();
    swiperInstance.autoplay.start();
  }
};

/**
 * Init Swiper
 */
const initSwiper = async (carousel) => {
  if (!carousel || carousel.swiper) return carousel?.swiper || null;

  /* -------------------------------------------------------------------------- */
  /* Base elements and cleanup                                                  */
  /* -------------------------------------------------------------------------- */
  const track = carousel.querySelector(`.${TRACK_CLASS}`);
  if (!track) return null;

  Array.from(track.children).forEach((slide) => {
    const isDuplicate = slide?.dataset?.productHighlightsClone === 'true'
      || slide?.classList?.contains('swiper-slide-duplicate');
    if (isDuplicate) slide.remove();
  });

  const baseSlides = Array.from(track.children)
    .filter((node) => node?.classList?.contains('swiper-slide'));
  if (baseSlides.length < 2) return null;

  /* -------------------------------------------------------------------------- */
  /* Measurements and continuous loop config                                    */
  /* -------------------------------------------------------------------------- */
  const styles = window.getComputedStyle(carousel);
  const spaceBetween = Number.parseFloat(
    styles.getPropertyValue('--product-highlights-carousel-gap'),
  ) || 0;
  const initialIndex = Math.floor(baseSlides.length / 2);

  carousel.style.setProperty('--swiper-wrapper-transition-timing-function', 'linear');

  /* -------------------------------------------------------------------------- */
  /* Swiper init                                                                */
  /* -------------------------------------------------------------------------- */
  const Swiper = await loadSwiper();
  const swiperInstance = new Swiper(carousel, {
    slidesPerView: 'auto',
    spaceBetween,
    centeredSlides: true,
    centeredSlidesBounds: true,
    loop: true,
    loopedSlides: baseSlides.length,
    loopAdditionalSlides: baseSlides.length,
    speed: PRODUCT_HIGHLIGHTS_SWIPER_SPEED,
    allowTouchMove: false,
    simulateTouch: false,
    slideToClickedSlide: false,
    preventClicks: true,
    preventClicksPropagation: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: true,
      pauseOnMouseEnter: false,
      waitForTransition: false,
    },
    freeMode: {
      enabled: true,
      momentum: false,
      momentumBounce: false,
      sticky: false,
    },
    a11y: { enabled: false },
  });

  if (swiperInstance?.autoplay?.running) swiperInstance.autoplay.stop();
  swiperInstance.slideToLoop(initialIndex, 0, false);
  if (swiperInstance?.autoplay) swiperInstance.autoplay.start();

  /* -------------------------------------------------------------------------- */
  /* State, hover slowdown, and interaction guards                              */
  /* -------------------------------------------------------------------------- */
  carousel.dataset.productHighlightsPaused = 'false';
  carousel.dataset.productHighlightsHoverState = carousel.matches(':hover')
    ? 'true'
    : 'false';

  if (carousel.dataset.productHighlightsHover !== 'true' && swiperInstance.params?.autoplay) {
    const handleMouseEnter = () => {
      carousel.dataset.productHighlightsHoverState = 'true';
      if (carousel.dataset.productHighlightsPaused === 'true') return;
      swiperInstance.params.speed = PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW;
      if (swiperInstance.autoplay?.running) {
        swiperInstance.autoplay.stop();
        swiperInstance.autoplay.start();
      }
    };

    const handleMouseLeave = () => {
      carousel.dataset.productHighlightsHoverState = 'false';
      if (carousel.dataset.productHighlightsPaused === 'true') return;
      swiperInstance.params.speed = PRODUCT_HIGHLIGHTS_SWIPER_SPEED;
      if (swiperInstance.autoplay?.running) {
        swiperInstance.autoplay.stop();
        swiperInstance.autoplay.start();
      }
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.dataset.productHighlightsHover = 'true';
  }

  if (carousel.dataset.productHighlightsNoClick !== 'true') {
    carousel.addEventListener(
      'click',
      (event) => {
        const slide = event.target.closest('.swiper-slide');
        if (!slide || !carousel.contains(slide)) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
      },
      true,
    );
    carousel.dataset.productHighlightsNoClick = 'true';
  }

  if (carousel.dataset.productHighlightsResize !== 'true') {
    const handleResize = () => {
      const updatedStyles = window.getComputedStyle(carousel);
      const nextSpaceBetween = Number.parseFloat(
        updatedStyles.getPropertyValue('--product-highlights-carousel-gap'),
      ) || 0;
      if (swiperInstance.params.spaceBetween !== nextSpaceBetween) {
        swiperInstance.params.spaceBetween = nextSpaceBetween;
        swiperInstance.update();
      }
    };

    window.addEventListener('resize', handleResize);
    carousel.dataset.productHighlightsResize = 'true';
  }

  return swiperInstance;
};
// #endregion

// #region CREATE
export async function createProductHighlightsCarousel({
  cards = [],
  root = null,
  track = null,
} = {}) {
  const carousel = root || document.createElement('div');
  carousel.classList.add(CAROUSEL_CLASS, 'swiper');

  const trackElement = track
    || carousel.querySelector(`:scope > .${TRACK_CLASS}`)
    || document.createElement('div');

  trackElement.classList.add(TRACK_CLASS, 'swiper-wrapper');
  if (trackElement.parentElement !== carousel) carousel.appendChild(trackElement);

  const { default: decoratePhotoCard, createPhotoCard } = await import(
    '../photo-card/photo-card.js'
  );
  const cardElements = await Promise.all(
    (cards || []).map(async (card) => {
      if (card instanceof HTMLElement) {
        await decoratePhotoCard(card);
        card.classList.add('swiper-slide');
        return card;
      }
      const created = createPhotoCard(card);
      created.classList.add('swiper-slide');
      return created;
    }),
  );

  cardElements.forEach((el) => {
    if (el && el.parentElement !== trackElement) trackElement.appendChild(el);
  });

  return carousel;
}
// #endregion

// #region PARSE
function parse(block) {
  const existingTrack = block.querySelector(`:scope > .${TRACK_CLASS}`);
  if (existingTrack) return { track: existingTrack, cards: Array.from(existingTrack.children) };

  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const cards = wrapper
    ? Array.from(wrapper.children)
    : Array.from(block.children);
  return { track: wrapper, cards };
}
// #endregion

// #region DECORATE
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const props = parse(block);
  const carousel = await createProductHighlightsCarousel({
    root: block,
    ...props,
  });

  const doc = block?.ownerDocument || document;
  const isEditor = doc.documentElement?.classList.contains('adobe-ue-edit');

  if (isEditor) {
    carousel.classList.remove('swiper');
    const track = carousel.querySelector(`.${TRACK_CLASS}`);
    track?.classList.remove('swiper-wrapper');

    carousel.querySelectorAll('.swiper-slide').forEach((slide) => {
      if (slide.dataset.productHighlightsClone === 'true') slide.remove();
      else slide.classList.remove('swiper-slide');
    });
    return;
  }

  const swiperInstance = await initSwiper(carousel);
  if (swiperInstance) carousel.swiper = swiperInstance;
}
// #endregion
