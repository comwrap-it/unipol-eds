import loadSwiper from '../../scripts/delayed.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createDynamicGalleryCardFromRows } from '../dynamic-gallery-card/dynamic-gallery-card.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/dynamic-gallery-card/dynamic-gallery-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

/**
 * Duplicates slides to ensure enough for loop mode
 * @param {HTMLElement} wrapper - The swiper-wrapper element
 * @param {number} minSlides - Minimum number of slides needed
 */
const ensureEnoughSlides = (wrapper, minSlides = 10) => {
  const originalSlides = Array.from(wrapper.children);
  const originalCount = originalSlides.length;

  if (originalCount === 0) return;

  // Calculate how many times we need to duplicate
  const duplicationsNeeded = Math.ceil(minSlides / originalCount);

  for (let i = 1; i < duplicationsNeeded; i += 1) {
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      // Remove any instrumentation from clones to avoid duplicate IDs
      clone.removeAttribute('data-aue-resource');
      clone.removeAttribute('data-aue-model');
      clone.removeAttribute('data-aue-type');
      wrapper.appendChild(clone);
    });
  }
};

const waitForMeasurableWidth = (el, cb, maxFrames = 180) => {
  let frames = 0;
  const tick = () => {
    if (!el?.isConnected) return;
    const { width } = el.getBoundingClientRect();
    if (width > 5) {
      cb();
      return;
    }
    frames += 1;
    if (frames >= maxFrames) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const startAutoplaySafely = (swiper, carousel) => {
  if (!swiper || !carousel) return;
  waitForMeasurableWidth(
    carousel,
    () => {
      if (swiper.destroyed) return;
      swiper.update();
      swiper.autoplay?.stop();
      swiper.autoplay?.start();
    },
    240,
  );
};

const setSwiperSpeedAndRestart = (swiper, speed) => {
  if (!swiper || swiper.destroyed) return;
  swiper.params.speed = speed;
  // Some Swiper internals read from originalParams after init.
  swiper.originalParams.speed = speed;

  // Changing speed mid-transition won’t affect the current transition.
  // If we are currently animating, cancel the transition and restart autoplay
  // so the new speed takes effect immediately.
  if (!swiper.autoplay?.running) return;
  swiper.autoplay.stop();

  if (swiper.animating) {
    swiper.setTranslate(swiper.getTranslate());
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();

    [
      'onSlideToWrapperTransitionEnd',
      'onTranslateToWrapperTransitionEnd',
    ].forEach((key) => {
      swiper.wrapperEl.removeEventListener('transitionend', swiper[key]);
      swiper[key] = null;
    });
    swiper.animating = false;
  }

  requestAnimationFrame(() => {
    if (swiper.destroyed) return;
    swiper.update();
    swiper.autoplay.start();
  });
};

const SWIPER_SPEED = 3000;
const FASTER_SWIPER_SPEED = 2000;
const SWIPER_SLOW_SPEED = SWIPER_SPEED * 3;
const FASTER_SWIPER_SLOW_SPEED = FASTER_SWIPER_SPEED * 3;

const isSecondSectionRow = (block) => {
  if (!block) return false;
  const parentSection = block.closest('.section');
  const rows = Array.from(
    parentSection.querySelectorAll('.dynamic-gallery-row.block'),
  );
  return rows.length > 1 && rows[1] === block;
};

/**
 *
 * @param {} Swiper the swiper instance
 * @param {HTMLElement} carousel the carousel element
 * @param {HTMLElement} block the block element
 */
const initSwiper = (Swiper, carousel, block = null) => {
  let isSecondRow = false;
  if (block) {
    isSecondRow = isSecondSectionRow(block);
  } else {
    const closestBlock = carousel.closest('.block.dynamic-gallery-row');
    isSecondRow = isSecondSectionRow(closestBlock);
  }
  const swiper = new Swiper(carousel, {
    slidesPerView: 'auto',
    speed: isSecondRow ? FASTER_SWIPER_SPEED : SWIPER_SPEED,
    loop: true,
    loopAdditionalSlides: 0,
    centeredSlides: false,
    allowTouchMove: false,
    simulateTouch: false,
    observer: true,
    observeParents: true,
    resizeObserver: true,
    watchSlidesProgress: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
      waitForTransition: true,
    },
    freeMode: {
      enabled: true,
      momentum: false,
      momentumBounce: false,
      sticky: false,
    },
    effect: 'slide',
    navigation: false,
    pagination: false,
    keyboard: { enabled: false },
    a11y: { enabled: false },
  });

  return swiper;
};

const setupListeners = (swiperInstance, block, carousel) => {
  if (!swiperInstance || !block) return;
  const isSecondRow = isSecondSectionRow(block);
  carousel.addEventListener('mouseenter', () => {
    setSwiperSpeedAndRestart(
      swiperInstance,
      isSecondRow ? FASTER_SWIPER_SLOW_SPEED : SWIPER_SLOW_SPEED,
    );
  });
  carousel.addEventListener('mouseleave', () => {
    setSwiperSpeedAndRestart(
      swiperInstance,
      isSecondRow ? FASTER_SWIPER_SPEED : SWIPER_SPEED,
    );
  });
};

export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  const rows = Array.from(block.children);

  const carousel = document.createElement('div');
  carousel.className = 'swiper';
  const galleryRow = document.createElement('div');
  galleryRow.className = 'dynamic-gallery-row swiper-wrapper marquee-swiper';

  const promises = rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const card = await createDynamicGalleryCardFromRows(childrenRows);
    if (card) {
      moveInstrumentation(row, card);
      card.classList.add('swiper-slide');
      galleryRow.appendChild(card);
    }
  });

  await Promise.all(promises);

  // Ensure enough slides for loop mode
  ensureEnoughSlides(galleryRow, 10);

  carousel.appendChild(galleryRow);
  block.replaceChildren(carousel);

  const Swiper = await loadSwiper();
  const swiperInstance = initSwiper(Swiper, carousel, block);
  startAutoplaySafely(swiperInstance, carousel);
  setupListeners(swiperInstance, block, carousel);
}

export const createDynamicGalleryRowFromRows = async (rows) => {
  await ensureStylesLoaded();
  const carousel = document.createElement('div');
  carousel.className = 'swiper';
  const galleryRow = document.createElement('div');
  galleryRow.className = 'dynamic-gallery-row swiper-wrapper marquee-swiper';

  if (rows.length === 0) return null;

  const promises = rows.map(async (row) => {
    const childrenRows = Array.from(row.children);
    const card = await createDynamicGalleryCardFromRows(childrenRows);
    if (card) {
      moveInstrumentation(row, card);
      card.classList.add('swiper-slide');
      galleryRow.appendChild(card);
    }
  });

  await Promise.all(promises);

  // Ensure enough slides for loop mode
  ensureEnoughSlides(galleryRow, 10);

  carousel.appendChild(galleryRow);
  const Swiper = await loadSwiper();
  const swiperInstance = initSwiper(Swiper, carousel, null);
  // This helper may be used before insertion into DOM; only start once measurable.
  startAutoplaySafely(swiperInstance, carousel);

  return carousel;
};
