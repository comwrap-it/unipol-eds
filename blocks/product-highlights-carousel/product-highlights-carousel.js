import loadSwiper from '../../scripts/delayed.js';

// #region CONSTANTS
const CAROUSEL_CLASS = 'product-highlights-carousel';
const TRACK_CLASS = 'product-highlights-carousel-track';
export const PRODUCT_HIGHLIGHTS_SWIPER_SPEED = 12000;
export const PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW = PRODUCT_HIGHLIGHTS_SWIPER_SPEED * 3;
const PRODUCT_HIGHLIGHTS_MIN_LOOP_SLIDES = 5;
// #endregion

// #region HELPERS
let isStylesLoaded = false;
let stylesLoadingPromise = null;
/**
 * Ensures the carousel and card styles are loaded once.
 * @returns {Promise<void>}
 */
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  if (!stylesLoadingPromise) {
    stylesLoadingPromise = (async () => {
      const { loadCSS } = await import('../../scripts/aem.js');
      await Promise.all([
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/product-highlights-carousel/product-highlights-carousel.css`,
        ),
        loadCSS(
          `${window.hlx.codeBasePath}/blocks/photo-card/photo-card.css`,
        ),
      ]);
      isStylesLoaded = true;
    })();
  }
  await stylesLoadingPromise;
}

/**
 * Updates swiper autoplay speed and restarts the animation.
 * @param {Object} swiperInstance
 * @param {number} speed
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
 * Enables hover-based speed slowdown for autoplay.
 * @param {HTMLElement} carousel
 * @param {Object} swiperInstance
 */
const setupHoverSlowdown = (carousel, swiperInstance) => {
  if (!carousel || !swiperInstance || carousel.dataset.productHighlightsHover === 'true') return;
  if (!swiperInstance.params?.autoplay) return;

  const handleMouseEnter = () => {
    carousel.dataset.productHighlightsHoverState = 'true';
    if (carousel.dataset.productHighlightsPaused === 'true') return;
    setProductHighlightsSwiperSpeed(swiperInstance, PRODUCT_HIGHLIGHTS_SWIPER_SPEED_SLOW);
  };

  const handleMouseLeave = () => {
    carousel.dataset.productHighlightsHoverState = 'false';
    if (carousel.dataset.productHighlightsPaused === 'true') return;
    setProductHighlightsSwiperSpeed(swiperInstance, PRODUCT_HIGHLIGHTS_SWIPER_SPEED);
  };

  carousel.addEventListener('mouseenter', handleMouseEnter);
  carousel.addEventListener('mouseleave', handleMouseLeave);
  carousel.dataset.productHighlightsHover = 'true';
};

/**
 * Initializes Swiper for the product highlights carousel.
 * @param {HTMLElement} carousel
 * @param {number} slideCount
 * @returns {Promise<Object|null>}
 */
const initSwiper = async (carousel, slideCount) => {
  if (!carousel || carousel.swiper || slideCount < 2) return carousel?.swiper || null;

  const Swiper = await loadSwiper();
  const track = carousel.querySelector(`.${TRACK_CLASS}`);
  let effectiveSlideCount = slideCount;
  const computedStyles = window.getComputedStyle(carousel);
  const gapValue = computedStyles.getPropertyValue('--product-highlights-carousel-gap');
  const spaceBetween = Number.parseFloat(gapValue) || 0;

  if (track) {
    Array.from(track.children).forEach((slide) => {
      if (slide.dataset.productHighlightsClone === 'true') {
        slide.remove();
      }
    });

    const slides = Array.from(track.children);
    effectiveSlideCount = slides.length;
    const slideWidth = slides[0]?.getBoundingClientRect().width || 0;
    const containerWidth = carousel.getBoundingClientRect().width || 0;
    const minSlides = slideWidth
      ? Math.max(
        PRODUCT_HIGHLIGHTS_MIN_LOOP_SLIDES,
        Math.ceil(
          (containerWidth + slideWidth)
          / Math.max(slideWidth + spaceBetween, 1),
        ),
      )
      : PRODUCT_HIGHLIGHTS_MIN_LOOP_SLIDES;

    if (slides.length && effectiveSlideCount < minSlides) {
      let index = 0;
      while (effectiveSlideCount < minSlides) {
        const source = slides[index % slides.length];
        const clone = source.cloneNode(true);
        clone.dataset.productHighlightsClone = 'true';
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;

        [clone, ...clone.querySelectorAll('*')].forEach((element) => {
          Array.from(element.attributes).forEach((attr) => {
            if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
              element.removeAttribute(attr.name);
            }
          });
          if (element.id) element.removeAttribute('id');
        });

        track.appendChild(clone);
        effectiveSlideCount += 1;
        index += 1;
      }
    }
  }

  const shouldLoop = effectiveSlideCount >= PRODUCT_HIGHLIGHTS_MIN_LOOP_SLIDES;
  const swiperInstance = new Swiper(carousel, {
    slidesPerView: 'auto',
    loop: shouldLoop,
    centeredSlides: true,
    centeredSlidesBounds: true,
    speed: PRODUCT_HIGHLIGHTS_SWIPER_SPEED,
    allowTouchMove: true,
    spaceBetween,
    autoplay: shouldLoop ? {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: true,
    } : false,
    freeMode: {
      enabled: true,
      momentum: false,
    },
    a11y: { enabled: false },
  });

  carousel.dataset.productHighlightsPaused = 'false';
  carousel.dataset.productHighlightsHoverState = carousel.matches(':hover') ? 'true' : 'false';
  setupHoverSlowdown(carousel, swiperInstance);
  return swiperInstance;
};
// #endregion

// #region CREATE
/**
 * Creates or decorates a product highlights carousel.
 * @param {Object} [options]
 * @param {Array<HTMLElement|Object>} [options.cards]
 * @param {HTMLElement|null} [options.root]
 * @param {HTMLElement|null} [options.track]
 * @returns {Promise<HTMLElement>}
 */
export async function createProductHighlightsCarousel({
  cards = [],
  root = null,
  track = null,
} = {}) {
  /*
   * Root
   */
  const carousel = root || document.createElement('div');
  carousel.classList.add(CAROUSEL_CLASS, 'swiper');

  /*
   * Track
   */
  const trackElement = track
    || carousel.querySelector(`:scope > .${TRACK_CLASS}`)
    || document.createElement('div');
  trackElement.classList.add(TRACK_CLASS, 'swiper-wrapper');
  if (trackElement.parentElement !== carousel) carousel.appendChild(trackElement);

  /*
   * Cards
   */
  const { default: decoratePhotoCard, createPhotoCard } = await import('../photo-card/photo-card.js');
  const cardElements = await Promise.all((cards || []).map(async (card) => {
    if (card instanceof HTMLElement) {
      await decoratePhotoCard(card);
      card.classList.add('swiper-slide');
      return card;
    }
    const createdCard = createPhotoCard(card);
    createdCard.classList.add('swiper-slide');
    return createdCard;
  }));

  cardElements.forEach((cardElement) => {
    if (cardElement && cardElement.parentElement !== trackElement) {
      trackElement.appendChild(cardElement);
    }
  });

  return carousel;
}
// #endregion

// #region PARSE
/**
 * Parses the carousel block for cards and/or existing track.
 * @param {HTMLElement} block
 * @returns {{track: HTMLElement|null, cards: HTMLElement[]}}
 */
function parse(block) {
  /*
   * Existing track
   */
  const existingTrack = block.querySelector(`:scope > .${TRACK_CLASS}`);
  if (existingTrack) {
    return { track: existingTrack, cards: Array.from(existingTrack.children) };
  }

  /*
   * Rows
   */
  const wrapper = block.querySelector(':scope > .default-content-wrapper');
  const cards = wrapper ? Array.from(wrapper.children) : Array.from(block.children);

  return { track: wrapper, cards };
}
// #endregion

// #region DECORATE
/**
 * Decorates the product highlights carousel block.
 * @param {HTMLElement} block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const props = parse(block);
  const carousel = await createProductHighlightsCarousel({ root: block, ...props });
  const slideCount = carousel.querySelectorAll('.swiper-slide').length;
  const doc = block?.ownerDocument || document;
  const root = doc.documentElement;
  const isEditor = root?.classList.contains('adobe-ue-edit');

  if (isEditor) {
    carousel.classList.remove('swiper');
    const track = carousel.querySelector(`.${TRACK_CLASS}`);
    track?.classList.remove('swiper-wrapper');
    carousel.querySelectorAll('.swiper-slide').forEach((slide) => {
      if (slide.dataset.productHighlightsClone === 'true') {
        slide.remove();
        return;
      }
      slide.classList.remove('swiper-slide');
    });
    return;
  }

  const swiperInstance = await initSwiper(carousel, slideCount);
  if (swiperInstance) carousel.swiper = swiperInstance;
}
// #endregion
