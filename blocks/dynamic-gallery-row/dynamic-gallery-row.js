import loadSwiper from '../../scripts/delayed.js';
import { createIconButton } from '../../scripts/libs/ds/components/atoms/buttons/icon-button/icon-button.js';
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

/**
 * Waits until the element has a measurable width before invoking the callback.
 * @param {HTMLElement} el - The element to measure
 * @param {Function} cb - The callback to invoke once measurable
 * @param {number} maxFrames - Maximum number of animation frames to wait
 */
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

/**
 * Gets the rendered translateX value of the swiper wrapper element.
 * @param {Swiper} swiper - The Swiper instance
 * @returns {number} The translateX value
 */
const getRenderedTranslateX = (swiper) => {
  const el = swiper?.wrapperEl;
  if (!el) return swiper.getTranslate();

  const t = getComputedStyle(el).transform;
  if (!t || t === 'none') return swiper.getTranslate();

  // matrix(a,b,c,d,tx,ty) or matrix3d(..., tx, ty, tz)
  const m3d = t.match(/^matrix3d\((.+)\)$/);
  if (m3d) {
    const parts = m3d[1].split(',').map((v) => parseFloat(v.trim()));
    return Number.isFinite(parts[12]) ? parts[12] : swiper.getTranslate();
  }
  const m2d = t.match(/^matrix\((.+)\)$/);
  if (m2d) {
    const parts = m2d[1].split(',').map((v) => parseFloat(v.trim()));
    return Number.isFinite(parts[4]) ? parts[4] : swiper.getTranslate();
  }
  return swiper.getTranslate();
};

/**
 * Freezes the swiper's current position immediately.
 * @param {Swiper} swiper - The Swiper instance
 */
const freezeSwiperNow = (swiper) => {
  if (!swiper || swiper.destroyed) return;

  const x = getRenderedTranslateX(swiper);

  // cancel current transition immediately
  swiper.setTransition?.(0);
  if (swiper.wrapperEl) swiper.wrapperEl.style.transitionDuration = '0ms';

  swiper.setTranslate(x);
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  swiper.animating = false;
};

/**
 * Starts Swiper autoplay safely after ensuring the carousel has measurable width.
 * @param {Swiper} swiper - The Swiper instance
 * @param {HTMLElement} carousel - The carousel element
 */
const startAutoplaySafely = (swiper, carousel) => {
  if (!swiper || !carousel) return;
  waitForMeasurableWidth(
    carousel,
    () => {
      freezeSwiperNow(swiper);
      swiper.autoplay?.stop();
      swiper.autoplay?.start();
    },
    240,
  );
};

/**
 * Stops Swiper autoplay immediately and freezes its position.
 * @param {Swiper} swiper - The Swiper instance
 */
const stopSwiperImmediately = (swiper) => {
  if (!swiper || swiper.destroyed) return;

  // freeze at the exact rendered position and cancel transition
  freezeSwiperNow(swiper);

  // then stop future autoplay ticks
  swiper.autoplay?.stop();
};

/**
 * Sets the swiper speed and restarts autoplay while preserving position.
 * @param {Swiper} swiper - The Swiper instance
 * @param {number} speed - The new speed in milliseconds
 */
const setSwiperSpeedAndRestart = (swiper, speed) => {
  if (!swiper || swiper.destroyed) return;

  swiper.params.speed = speed;
  swiper.originalParams.speed = speed;

  if (!swiper.autoplay?.running) return;

  swiper.autoplay.stop();
  freezeSwiperNow(swiper);

  requestAnimationFrame(() => {
    if (swiper.destroyed) return;
    swiper.autoplay.start();
  });
};

const SWIPER_SPEED = 4000;
const FASTER_SWIPER_SPEED = 3000;
const SWIPER_SLOW_SPEED = SWIPER_SPEED * 3;
const FASTER_SWIPER_SLOW_SPEED = FASTER_SWIPER_SPEED * 3;

/**
 *
 * @param {HTMLElement} block the block element
 * @returns {boolean} true if the block is the second dynamic-gallery-row in its section
 */
const isSecondSectionRow = (block) => {
  if (!block) return false;
  const parentSection = block.closest('.section');
  const rows = Array.from(
    parentSection?.querySelectorAll('.dynamic-gallery-row.block'),
  );
  return rows.length > 1 && rows[1] === block;
};

/**
 * Initializes a Swiper instance for the given carousel element.
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

/**
 * Sets up event listeners for mouse enter/leave and custom play/pause events.
 * @param {} swiperInstance the swiper instance
 * @param {HTMLElement} carousel the carousel element
 * @param {HTMLElement} block the block element
 */
const setupListeners = (swiperInstance, carousel, block = null) => {
  if (!swiperInstance) return;
  let isSecondRow;
  if (block) {
    isSecondRow = isSecondSectionRow(block);
  } else {
    const closestBlock = carousel.closest('.block.dynamic-gallery-row');
    isSecondRow = isSecondSectionRow(closestBlock);
  }
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

  const section = block?.closest('.section') || carousel.closest('.section');

  section.addEventListener('pauseDynamicGallery', () => {
    stopSwiperImmediately(swiperInstance);
  });

  section.addEventListener('playDynamicGallery', () => {
    startAutoplaySafely(swiperInstance, carousel);
  });
};

/**
 * Adds a play/pause button to the section containing the block.
 * @param {HTMLElement} block the block element
 */
const addPlayPauseBtnToSection = (block) => {
  if (!block) return;
  const section = block.closest('.section');
  if (!section) return;
  const alreadyExistentButton = section.querySelector(
    '.dynamic-gallery-play-pause-btn',
  );
  if (alreadyExistentButton) return;
  const button = createIconButton(
    'un-icon-pause-circle',
    'secondary',
    'extra-large',
    null,
    false,
  );
  button.classList.add('dynamic-gallery-play-pause-btn');
  const iconSpan = button.querySelector('span');
  button.addEventListener('click', () => {
    if (iconSpan.classList.contains('un-icon-pause-circle')) {
      iconSpan.classList.remove('un-icon-pause-circle');
      iconSpan.classList.add('un-icon-play-circle');
      const event = new Event('pauseDynamicGallery');
      section.dispatchEvent(event);
    } else if (iconSpan.classList.contains('un-icon-play-circle')) {
      iconSpan.classList.remove('un-icon-play-circle');
      iconSpan.classList.add('un-icon-pause-circle');
      const event = new Event('playDynamicGallery');
      section.dispatchEvent(event);
    }
  });
  section.appendChild(button);
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
  addPlayPauseBtnToSection(block);

  const Swiper = await loadSwiper();
  const swiperInstance = initSwiper(Swiper, carousel, block);
  startAutoplaySafely(swiperInstance, carousel);
  setupListeners(swiperInstance, carousel, block);
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
  setupListeners(swiperInstance, carousel, null);

  return carousel;
};
