/**
 * Footer Section - Section Decorator
 * Decorates footer-section to organize blocks into footer structure
 * Follows the same pattern as kpi-highlights-widget
 */

import { createFooterUnipol } from '../footer-unipol/footer-unipol.js';

/**
 * Waits for all blocks in a section to be loaded
 *
 * @param {HTMLElement} section - The section element
 * @returns {Promise<boolean>} True if all blocks are loaded
 */
async function waitForBlocks(section) {
  const blocks = section.querySelectorAll('[data-block-name]');
  if (blocks.length === 0) return false;

  // Check if all blocks are loaded
  const allLoaded = Array.from(blocks).every((block) => block.dataset.blockStatus === 'loaded');

  if (!allLoaded) {
    // Wait a bit and check again
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
    return waitForBlocks(section);
  }

  return true;
}

/**
 * Decorates a footer-section
 * Organizes child blocks into the footer structure
 * This is called after all blocks in the section are loaded
 *
 * @param {HTMLElement} section - The section element
 */
export default async function decorate(section) {
  if (!section) return;
  if (!section.classList.contains('footer-section')) return;

  // Wait for all blocks to be loaded
  const allBlocksLoaded = await waitForBlocks(section);
  if (!allBlocksLoaded) {
    // Retry after a delay if blocks aren't ready
    setTimeout(() => decorate(section), 200);
    return;
  }

  // Extract blocks from section
  // Blocks are wrapped in divs by decorateSections
  const childBlocks = Array.from(section.children).filter((child) => {
    // Look for blocks (they have data-block-name or are .block elements)
    return child.querySelector('[data-block-name]')
      || child.querySelector('.block')
      || (child.classList.contains('block') && child.hasAttribute('data-block-name'));
  });

  const config = {};

  // Process blocks in order
  const linkColumns = [];
  let downloadSection = null;
  let utilityLinks = null;
  let bottom = null;

  childBlocks.forEach((childBlock) => {
    // Find the actual block element (might be nested in wrapper)
    const blockElement = childBlock.querySelector('[data-block-name]')
      || childBlock.querySelector('.block')
      || childBlock;

    // Check if it's a text-list (link column)
    if (blockElement.classList.contains('text-list')
        || blockElement.querySelector('.text-list')
        || blockElement.classList.contains('footer-link-column')
        || blockElement.querySelector('.footer-link-column')) {
      const textList = blockElement.querySelector('.text-list')
        || blockElement.querySelector('.footer-link-column')
        || blockElement;
      linkColumns.push(textList);
    } else if (blockElement.classList.contains('footer-download-section')
        || blockElement.querySelector('.footer-download-section')
        || blockElement.classList.contains('footer-download-link')
        || blockElement.querySelector('.footer-download-link')) {
      // Download section
      const download = blockElement.querySelector('.footer-download-section')
        || blockElement.querySelector('.footer-download-link')
        || blockElement;
      downloadSection = download;
    } else if (blockElement.classList.contains('footer-utility-links')
        || blockElement.querySelector('.footer-utility-links')
        || blockElement.classList.contains('footer-privacy-link-list')
        || blockElement.querySelector('.footer-privacy-link-list')) {
      // Utility links
      const utility = blockElement.querySelector('.footer-utility-links')
        || blockElement.querySelector('.footer-privacy-link-list')
        || blockElement;
      utilityLinks = utility;
    } else if (blockElement.classList.contains('footer-bottom')
        || blockElement.querySelector('.footer-bottom')) {
      // Bottom section
      const bottomElement = blockElement.querySelector('.footer-bottom') || blockElement;
      bottom = bottomElement;
    }
  });

  config.linkColumns = linkColumns;
  if (downloadSection) config.downloadSection = downloadSection;
  if (utilityLinks) config.utilityLinks = utilityLinks;
  if (bottom) config.bottom = bottom;

  // Create footer structure
  const footer = createFooterUnipol(config);

  // Replace section content with footer
  section.innerHTML = '';
  section.appendChild(footer);
  section.classList.add('footer-section-decorated');
}
