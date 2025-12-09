/**
 * Editorial Carousel Component
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
// eslint-disable-next-line max-len, import/no-duplicates
import { createButton } from '../atoms/buttons/standard-button/standard-button.js';
// eslint-disable-next-line import/no-duplicates
import { BUTTON_VARIANTS } from '../atoms/buttons/standard-button/standard-button.js';
// eslint-disable-next-line import/no-duplicates
import { BUTTON_ICON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';

let isStylesLoaded = false;

async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/editorial-carousel-widget/editorial-carousel-widget.css`,
    ),
  ]);
  isStylesLoaded = true;
}

/**
 * Check if block has instrumentation (Universal Editor)
 * @param {HTMLElement} block
 * @returns boolean
 */
function asInstrumentation(block) {
  return (
    block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]')
  );
}

/**
 * Decorates the editorial carousel block
 * @param {HTMLElement} block - The carousel block element
 */
export default async function decorate(block) {
  if (!block) return;

  await ensureStylesLoaded();

  const hasInstrumentation = asInstrumentation(block);

  // Import card component dynamically
  const cardModule = await import('../editorial-carousel-card/editorial-carousel-card.js');
  const decorateEditorialProductCard = cardModule.default;

  // Create carousel container structure
  const carousel = document.createElement('div');
  carousel.className = 'editorial-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Product carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'editorial-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);
  const showMoreElement = rows.shift();
  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Editorial Carousel: No cards found');
    return;
  }

  // Process each row as a card
  const cardPromises = rows.map(async (row) => {
    const slide = document.createElement('div');
    slide.className = 'editorial-carousel-card-wrapper swiper-slide';
    slide.setAttribute('role', 'listitem');

    // Preserve instrumentation from row to slide
    moveInstrumentation(row, slide);

    // Create a card block element to decorate
    const cardBlock = document.createElement('div');
    cardBlock.className = 'editorial-carousel-card';
    cardBlock.dataset.blockName = 'editorial-carousel-card';

    // Preserve row instrumentation on card block if present
    if (row.hasAttribute('data-aue-resource')) {
      cardBlock.setAttribute('data-aue-resource', row.getAttribute('data-aue-resource'));
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
    await decorateEditorialProductCard(cardBlock);

    // Load card styles
    const decoratedCard = slide.querySelector('.editorial-carousel-card-container, .card') || slide.firstElementChild;
    if (decoratedCard && decoratedCard.dataset.blockName) {
      await loadBlock(decoratedCard);
    }

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

  let scrollIndicator;
  let showMoreButton;

  /**
   * @param {PointerEvent} event
   */
  function handleShowMoreButton(event) {
    event.preventDefault();
    cardElements.forEach((slide) => {
      if (slide.classList.contains('hidden')) {
        slide.classList.remove('hidden');
      }
    });
    showMoreButton.remove();
  }

  if (mq.matches) {
    if (cardElements && cardElements.length > 4) {
      const { scrollIndicator: createdScrollIndicator } = await createScrollIndicator();
      scrollIndicator = createdScrollIndicator;
    }
  } else if (cardElements && cardElements.length > 4) {
    // eslint-disable-next-line max-len
    showMoreButton = createButton(
      '',
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

  if (scrollIndicator) {
    carousel.appendChild(scrollIndicator);
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
    // eslint-disable-next-line max-len
    const handleEditorialProductCarouselWidget = await import('../editorial-carousel-widget/editorial-carousel-widget.js');
    handleEditorialProductCarouselWidget.default();
  }
}
