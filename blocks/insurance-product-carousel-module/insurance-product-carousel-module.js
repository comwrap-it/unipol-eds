/**
 * Insurance Product Carousel Module
 *
 * A section module that contains a text-block component.
 * The text-block includes a primary-button atom.
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

  // Find the text-block element within this section
  // Text block is created by Universal Editor or authored content
  const textBlock = block.querySelector('.text-block');

  // If no text-block found, log warning and return
  if (!textBlock) {
    // eslint-disable-next-line no-console
    console.warn('Insurance Product Carousel Module: No text-block found');
    return;
  }

  // Decorate and load the text-block if it hasn't been already
  // This will also load the primary-button atom inside text-block
  if (!textBlock.dataset.blockStatus || textBlock.dataset.blockStatus === 'initialized') {
    decorateBlock(textBlock);
    await loadBlock(textBlock);
  }

  // The module acts as a simple container - block already has correct structure
  // No need to replace or manipulate further
}
