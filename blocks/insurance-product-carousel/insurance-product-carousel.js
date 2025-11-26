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

/**
 * Create an insurance product carousel element programmatically
 *
 * This is the SINGLE SOURCE OF TRUTH for carousel creation.
 * Used by both the decorate() function (AEM EDS) and Storybook.
 *
 * @param {HTMLElement[]} cardElements - Array of already-decorated card elements
 * @param {boolean} showScrollIndicator - Whether to show scroll indicator (default: auto-detect if > 4 cards)
 * @returns {HTMLElement} The carousel element
 */
export async function createInsuranceProductCarousel(
  cardElements = [],
  showScrollIndicator = null,
) {
  if (!cardElements || cardElements.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Insurance Product Carousel: No cards provided');
    return null;
  }

  // Create carousel container structure
  const carousel = document.createElement('div');
  carousel.className = 'insurance-product-carousel-container swiper';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Product carousel');
  carousel.setAttribute('tabindex', '0');

  // Create carousel track (scrollable container)
  const track = document.createElement('div');
  track.className = 'insurance-product-carousel swiper-wrapper';
  track.setAttribute('role', 'list');

  // Wrap each card element in a slide
  cardElements.forEach((cardElement) => {
    if (!cardElement) return;

    const slide = document.createElement('div');
    slide.className = 'insurance-product-card-wrapper swiper-slide';
    slide.setAttribute('role', 'listitem');

    // If cardElement is already a decorated card, wrap it
    // Otherwise, assume it's already a slide
    if (cardElement.classList.contains('insurance-product-card-container') ||
        cardElement.classList.contains('card-block')) {
      slide.appendChild(cardElement);
    } else {
      // Already a slide or wrapper, use as is
      slide.appendChild(cardElement);
    }

    track.appendChild(slide);
  });

  // Add scroll indicator if needed
  const shouldShowIndicator = showScrollIndicator !== null
    ? showScrollIndicator
    : cardElements.length > 4;

  let scrollIndicator = null;
  if (shouldShowIndicator) {
    scrollIndicator = await createScrollIndicator();
  }

  carousel.appendChild(track);
  if (scrollIndicator) {
    carousel.appendChild(scrollIndicator);
  }

  // Preserve block class
  carousel.classList.add('block', 'insurance-product-carousel-block');

  return carousel;
}

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

  // Get all rows (each row will be a card)
  const rows = Array.from(block.children);

  if (rows.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Insurance Product Carousel: No cards found');
    return;
  }

  // Create a temporary container for card blocks (needed for replaceWith to work)
  const tempContainer = document.createElement('div');
  tempContainer.style.display = 'none';
  document.body.appendChild(tempContainer);

  // Process each row as a card
  const cardPromises = rows.map(async (row) => {
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

    // Append to temporary container (needed for replaceWith to work)
    tempContainer.appendChild(cardBlock);

    // Decorate the card using card component
    // Note: decorateInsuranceProductCard replaces cardBlock with the decorated card
    await decorateInsuranceProductCard(cardBlock);

    // Get the decorated card (cardBlock was replaced, so it's now the child of tempContainer)
    // The decorated card should be the only child with class 'card-block'
    const decoratedCard = Array.from(tempContainer.children).find(
      (child) => child.classList.contains('card-block') || child.classList.contains('insurance-product-card-container')
    );
    
    // Load card styles if needed
    if (decoratedCard && decoratedCard.dataset.blockName) {
      await loadBlock(decoratedCard);
    }

    // Remove from temp container and return
    if (decoratedCard && decoratedCard.parentElement === tempContainer) {
      tempContainer.removeChild(decoratedCard);
    }

    return decoratedCard || cardBlock;
  });

  // Wait for all cards to be processed
  const decoratedCards = await Promise.all(cardPromises);
  
  // Clean up temporary container
  document.body.removeChild(tempContainer);
  
  // Filter out empty cards
  const validCards = decoratedCards.filter((card) => {
    if (!card) return false;
    if (!hasInstrumentation && !card.innerText?.trim()) return false;
    return true;
  });

  // Use the centralized createInsuranceProductCarousel function
  const carousel = await createInsuranceProductCarousel(validCards);

  if (!carousel) {
    return;
  }

  // Preserve blockName if present
  if (block.dataset.blockName) {
    carousel.dataset.blockName = block.dataset.blockName;
  }

  // Preserve instrumentation
  moveInstrumentation(block, carousel);

  // Replace block with carousel
  block.replaceWith(carousel);
}
