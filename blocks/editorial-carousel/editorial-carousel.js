/**
 * Editorial Carousel Component
 *
 * A carousel block that displays a horizontal scrollable list of card components.
 * Uses editorial-carousel-card as a molecule component.
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

import { moveInstrumentation } from '../../scripts/scripts.js';
import createScrollIndicator from '../scroll-indicator/scroll-indicator.js';
import {
  createButton,
  BUTTON_VARIANTS,
  BUTTON_ICON_SIZES,
} from '../atoms/buttons/standard-button/standard-button.js';
import { createEditorialCarouselCard } from '../editorial-carousel-card/editorial-carousel-card.js';
import { initCarouselAnimations } from '../../scripts/reveal.js';
import loadSwiper from '../../scripts/delayed.js';
import { handleSlideChange } from '../../scripts/utils.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/editorial-carousel-card/editorial-carousel-card.css`,
    ),
  ]);
  isStylesLoaded = true;
}

export function createEditorialCarousel(
  {
    cards = [],
    showMoreButtonLabel = 'Mostra di più',
  } = {},
) {
  const carousel = document.createElement('div');
  carousel.className = 'editorial-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Editorial carousel');
  carousel.setAttribute('tabindex', '0');

  const track = document.createElement('div');
  track.className = 'editorial-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  const mq = window.matchMedia('(min-width: 768px)');
  const slideElements = (cards || []).map((card, index) => {
    const slide = document.createElement('div');
    slide.className = 'editorial-carousel-card-wrapper swiper-slide reveal-in-up';
    slide.setAttribute('role', 'listitem');

    const cardElement = card instanceof HTMLElement
      ? card
      : createEditorialCarouselCard({ ...card, isFirstCard: index === 0 });

    slide.appendChild(cardElement);

    if (!mq.matches && index >= 4) {
      slide.classList.add('hidden');
    }

    return slide;
  });

  slideElements.forEach((slide) => track.appendChild(slide));
  carousel.appendChild(track);

  if (!mq.matches && slideElements.length > 4) {
    const button = createButton(
      showMoreButtonLabel,
      '',
      false,
      BUTTON_VARIANTS.SECONDARY,
      BUTTON_ICON_SIZES.MEDIUM,
      '',
      '',
    );

    button.addEventListener('click', (e) => {
      e.preventDefault();
      slideElements.forEach((slide) => slide.classList.remove('hidden'));
      button.remove();
    });

    carousel.appendChild(button);
  }

  return carousel;
}

export const create = createEditorialCarousel;

/**
 *
 * @param {} Swiper the swiper instance
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
    slidesPerView: 'auto',
    allowTouchMove: true,
    breakpoints: {
      // width >= 1200
      1200: {
        allowTouchMove: false,
      },
    },
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: 'slide',
    // Enable debugger
    debugger: true,
  });

  return swiperInstance;
};
/**
 * Decorates the editorial carousel block
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
    '../editorial-carousel-card/editorial-carousel-card.js'
  );
  const decorateEditorialCarouselCard = cardModule.default;

  // Create carousel container structure
  const carousel = document.createElement('div');
  carousel.className = 'editorial-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Editorial carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'editorial-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);

  const showMoreButtonLabel = rows[0].textContent?.trim() || 'Mostra di più';
  const showMoreElement = rows.shift();

  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Editorial Carousel: No cards found');
    return;
  }

  // Process each row as a card
  const cardPromises = rows.map(async (row, index) => {
    const slide = document.createElement('div');
    slide.className = 'editorial-carousel-card-wrapper swiper-slide reveal-in-up';
    slide.setAttribute('role', 'listitem');

    // Preserve instrumentation from row to slide
    moveInstrumentation(row, slide);

    // Create a card block element to decorate
    const cardBlock = document.createElement('div');
    cardBlock.className = 'editorial-carousel-card-container';
    cardBlock.dataset.blockName = 'editorial-carousel-card';

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
    // First card (index 0) is LCP candidate - optimize image loading
    const isFirstCard = index === 0;
    await decorateEditorialCarouselCard(cardBlock, isFirstCard);

    return slide;
  });

  const mq = window.matchMedia('(min-width: 768px)');

  // Wait for all cards to be processed
  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((slide, index) => {
    if (slide && !hasInstrumentation && slide.innerText) {
      if (index >= 4 && !mq.matches) {
        slide.classList.add('hidden');
      }
      track.appendChild(slide);
    } else if (slide && hasInstrumentation) {
      track.appendChild(slide);
    }
  });

  let scrollIndicatorProps = {};
  let showMoreButton;

  function handleShowMoreButton(e) {
    e.preventDefault();
    cardElements.forEach((slide) => {
      if (slide.classList.contains('hidden')) {
        slide.classList.remove('hidden');
      }
    });
    showMoreButton.remove();
  }

  if (mq.matches) {
    if (cardElements && cardElements.length > 4) {
      const {
        leftIconButton,
        scrollIndicator,
        rightIconButton,
        setExpandedDot,
      } = await createScrollIndicator();
      scrollIndicatorProps = {
        leftIconButton,
        scrollIndicator,
        rightIconButton,
        setExpandedDot,
      };
    }
  } else if (cardElements && cardElements.length > 4) {
    showMoreButton = createButton(
      showMoreButtonLabel,
      '',
      false,
      BUTTON_VARIANTS.SECONDARY,
      BUTTON_ICON_SIZES.MEDIUM,
      '',
      '',
    );
    showMoreButton.addEventListener('click', handleShowMoreButton);
  }

  carousel.appendChild(track);
  initCarouselAnimations(carousel);

  if (scrollIndicatorProps.scrollIndicator) {
    carousel.appendChild(scrollIndicatorProps.scrollIndicator);
  } else if (showMoreButton) {
    carousel.appendChild(showMoreButton);
  }

  showMoreElement.remove();

  // Preserve blockName if present
  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  block.innerText = '';
  // Preserve block class
  carousel.classList.add('block', 'editorial-carousel-block');
  // Replace block with carousel
  block.appendChild(carousel);

  if (mq.matches) {
    // Initialize Swiper after DOM insertion
    const Swiper = await loadSwiper();
    const swiperInstance = initSwiper(
      Swiper,
      carousel,
      scrollIndicatorProps.leftIconButton,
      scrollIndicatorProps.rightIconButton,
    );
    handleSlideChange(
      swiperInstance,
      scrollIndicatorProps.setExpandedDot,
      scrollIndicatorProps.leftIconButton,
      scrollIndicatorProps.rightIconButton,
    );
    const handleEditorialCarouselWidget = await import(
      '../editorial-carousel-widget/editorial-carousel-widget.js'
    );
    handleEditorialCarouselWidget.default();
  }
}
