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

  for (let i = 1; i < duplicationsNeeded; i++) {
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

const SWIPER_SPEED = 3000;

/**
 *
 * @param {} Swiper the swiper instance
 * @param {HTMLElement} carousel the carousel element
 */
const initSwiper = (Swiper, carousel) => {
  const swiper = new Swiper(carousel, {
    slidesPerView: 'auto',
    speed: SWIPER_SPEED,
    loop: true,
    centeredSlides: false,
    allowTouchMove: false,
    simulateTouch: false,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
      waitForTransition: false,
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
  const swiperInstance = initSwiper(Swiper, carousel);
  swiperInstance.update();
  swiperInstance.autoplay?.stop();
  swiperInstance.autoplay?.start();
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
  const swiperInstance = initSwiper(Swiper, carousel);
  swiperInstance.update();
  swiperInstance.autoplay?.stop();
  swiperInstance.autoplay?.start();

  return carousel;
};
