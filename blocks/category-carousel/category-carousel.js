/**
 * Category Carousel Component
 *
 * A carousel block that displays a horizontal scrollable list of card components.
 * Uses card as a molecule component, which in turn uses primary-button as an atom.
 *
 * Features:
 * - Horizontal scroll with navigation arrows
 * - Dot indicators for slide position
 * - Responsive design (mobile: 1 card, tablet: 2 cards, desktop: 3-4 cards)
 * - Smooth scrolling with snap points
 * - Touch/swipe support on mobile
 * - Keyboard navigation (arrow keys)
 * - Preserves Universal Editor instrumentation
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { loadBlock } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import createScrollIndicator from '../scroll-indicator/scroll-indicator.js';
import { initCarouselAnimations } from '../../scripts/reveal.js';
import loadSwiper from '../../scripts/delayed.js';
import { handleSlideChange } from '../../scripts/utils.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/category-card/category-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

/**
 *
 * @param {Object} Swiper the swiper instance
 * @param {HTMLElement} carousel the carousel element
 * @param {HTMLElement} leftIconButton the left navigation button
 * @param {HTMLElement} rightIconButton the right navigation button
 */
const initSwiper = (
  Swiper,
  carousel,
  leftIconButton = null,
  rightIconButton = null,
) => {
  const swiperInstance = new Swiper(carousel, {
    a11y: { enabled: false },
    navigation: {
      prevEl: leftIconButton || carousel.querySelector('.swiper-button-prev'),
      nextEl: rightIconButton || carousel.querySelector('.swiper-button-next'),
      addIcons: false,
    },
    speed: 700,
    slidesPerView: 2.5,
    allowTouchMove: true,
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: 'slide',
    // Enable debugger
    debugger: true,
  });

  return swiperInstance;
};

let leftIconButton = null;
let scrollIndicator = null;
let rightIconButton = null;
let setExpandedDot = null;
let Swiper = null;
let swiperInstance = null;

async function initCategoryCarousel(carousel, block) {
  // eslint-disable-next-line max-len
  (
    {
      leftIconButton,
      scrollIndicator,
      rightIconButton,
      setExpandedDot,
    } = await createScrollIndicator()
  );
  Swiper = await loadSwiper();
  block.appendChild(scrollIndicator);
  swiperInstance = initSwiper(Swiper, carousel, leftIconButton, rightIconButton);
  handleSlideChange(swiperInstance, setExpandedDot, leftIconButton, rightIconButton);
}

function destroyCategoryCarousel() {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  if (scrollIndicator) {
    scrollIndicator.remove();
    scrollIndicator = null;
  }
}

async function handleTabletChange(e, carousel, block) {
  if (e.matches) {
    await initCategoryCarousel(carousel, block);
  } else {
    destroyCategoryCarousel();
  }
}

/**
 * Decorates the category carousel block
 * @param {HTMLElement} block - The carousel block element
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  // Check if block has instrumentation (Universal Editor)
  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  // Import card component dynamically
  const cardModule = await import(
    '../category-card/category-card.js'
  );
  const decorateCategoryCard = cardModule.default;

  // Create carousel container structure
  const carousel = document.createElement('div');
  carousel.className = 'category-carousel-root-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Category carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'category-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);

  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Category Carousel: No cards found');
    return;
  }

  // Process each row as a card
  const cardPromises = rows.map(async (row) => {
    const slide = document.createElement('div');
    slide.className = 'category-card-wrapper swiper-slide reveal-in-up';
    slide.setAttribute('role', 'listitem');

    // Preserve instrumentation from row to slide
    moveInstrumentation(row, slide);

    // Create a card block element to decorate
    const cardBlock = document.createElement('div');
    cardBlock.className = 'category-card-container';
    cardBlock.dataset.blockName = 'category-card';

    // Preserve row instrumentation on card block if present
    if (row.hasAttribute('data-aue-resource')) {
      cardBlock.setAttribute(
        'data-aue-resource',
        row.getAttribute('data-aue-resource'),
      );
      const aueBehavior = row.getAttribute('data-aue-behavior');
      if (aueBehavior) cardBlock.setAttribute('data-aue-behavior', aueBehavior);
      const aueType = row.getAttribute('data-aue-type');
      if (aueType) cardBlock.setAttribute('data-aue-type', aueType);
      const aueLabel = row.getAttribute('data-aue-label');
      if (aueLabel) cardBlock.setAttribute('data-aue-label', aueLabel);
    }

    // Move all children from row to card block (preserves their instrumentation)
    while (row.firstElementChild) {
      cardBlock.appendChild(row.firstElementChild);
    }

    // Temporarily append cardBlock to slide
    slide.appendChild(cardBlock);

    // Decorate the card using card component
    await decorateCategoryCard(cardBlock);

    // Load card styles
    const decoratedCard = slide.querySelector('.category-card-container, .card')
      || slide.firstElementChild;
    if (decoratedCard && decoratedCard.dataset.blockName) {
      await loadBlock(decoratedCard);
    }

    return slide;
  });

  // Wait for all cards to be processed
  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((slide) => {
    if (slide && !hasInstrumentation && slide.innerText) {
      track.appendChild(slide);
    } else if (slide && hasInstrumentation) {
      track.appendChild(slide);
    }
  });

  carousel.appendChild(track);
  initCarouselAnimations(carousel);

  // Preserve blockName if present
  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  block.innerText = '';
  // Preserve block class
  carousel.classList.add('block', 'category-carousel-block');
  // Replace block with carousel
  block.appendChild(carousel);

  const tabletMQ = window.matchMedia(
    '(min-width: 768px) and (max-width: 953px)',
  );

  await handleTabletChange(tabletMQ, carousel, block);

  tabletMQ.addEventListener('change', (e) => handleTabletChange(e, carousel, block));
}
