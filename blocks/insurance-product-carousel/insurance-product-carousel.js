/**
 * Insurance Product Carousel Component
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
import { extractInstrumentationAttributes } from '../atoms/buttons/standard-button/standard-button.js';

/**
 * Decorates the insurance product carousel block
 * @param {HTMLElement} block - The carousel block element
 */
export default async function decorate(block) {
  if (!block) return;

  let isStylesLoaded = false;
  async function ensureStylesLoaded() {
    if (isStylesLoaded) return;
    const { loadCSS } = await import('../../scripts/aem.js');
    await Promise.all([
      loadCSS(`${window.hlx.codeBasePath}/blocks/insurance-product-card/insurance-product-card.css`),
    ]);
    isStylesLoaded = true;
  }

  await ensureStylesLoaded();

  // Check if block has instrumentation (Universal Editor)
  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  // Import card component dynamically
  const cardModule = await import('../insurance-product-card/insurance-product-card.js');
  const decorateInsuranceProductCard = cardModule.default;

  // Create carousel container structure
  const carousel = document.createElement('div');
  carousel.className = 'insurance-product-carousel-container';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Product carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'insurance-product-carousel';
  track.setAttribute('role', 'list');

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);

  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Insurance Product Carousel: No cards found');
    return;
  }

  // Process each row as a card
  const cardPromises = rows.map(async (row) => {
    const slide = document.createElement('div');
    slide.className = 'insurance-product-card-wrapper';
    slide.setAttribute('role', 'listitem');

    // Preserve instrumentation from row to slide
    moveInstrumentation(row, slide);

    // Create a card block element to decorate
    const cardBlock = document.createElement('div');
    cardBlock.className = 'insurance-product-card-container';
    cardBlock.dataset.blockName = 'insurance-product-card';

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
    await decorateInsuranceProductCard(cardBlock);

    // Load card styles
    const decoratedCard = slide.querySelector('.insurance-product-card-container, .card') || slide.firstElementChild;
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

  let scrollIndicator;
  if (cardElements && cardElements.length > 4) {
    scrollIndicator = await createScrollIndicator();
  }

  carousel.appendChild(track);
  if (scrollIndicator) {
    carousel.appendChild(scrollIndicator);
  }

  // Preserve blockName if present
  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  carousel.classList.add('block', 'insurance-product-carousel-block');
  moveInstrumentation(block, carousel);
  // Replace block with carousel
  block.replaceWith(carousel);
}
