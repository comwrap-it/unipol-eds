/**
 * Insurance Product Carousel Module
 *
 * A section module that contains:
 * 1. text-block component (title + subtitle + button)
 * 2. insurance-product-carousel component (horizontal carousel of cards)
 *
 * Each card uses primary-button as an atom.
 *
 * Structure:
 * - text-block (block) → primary-button (atom)
 * - insurance-product-carousel (block) → card (molecule) → primary-button (atom)
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 * Optimized for performance with lazy loading.
 */

import { decorateBlock, loadBlock } from '../../scripts/aem.js';

/**
 * Decorates the insurance product carousel module
 * @param {HTMLElement} block - The module section element
 */
export default async function decorate(block) {
  if (!block) return;

  // Find child blocks within this section
  // Universal Editor or authored content creates these blocks
  const textBlock = block.querySelector('.text-block');
  const carouselBlock = block.querySelector('.insurance-product-carousel');

  // Process text-block (header section with title, text, button)
  if (textBlock) {
    if (!textBlock.dataset.blockStatus || textBlock.dataset.blockStatus === 'initialized') {
      decorateBlock(textBlock);
      await loadBlock(textBlock);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('Insurance Product Carousel Module: No text-block found');
  }

  // Process insurance-product-carousel (horizontal carousel of cards)
  if (carouselBlock) {
    if (!carouselBlock.dataset.blockStatus || carouselBlock.dataset.blockStatus === 'initialized') {
      decorateBlock(carouselBlock);
      await loadBlock(carouselBlock);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('Insurance Product Carousel Module: No insurance-product-carousel found');
  }

  // The module acts as a simple container
  // Both blocks are now decorated and loaded with their respective styles
}
