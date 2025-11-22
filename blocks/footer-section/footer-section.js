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
  // After decoration, some blocks are replaced, others are modified in-place
  // We need to find blocks by their data-block-name attribute
  const config = {};

  // Process blocks in order
  const linkColumns = [];
  let downloadSection = null;
  let utilityLinks = null;
  let bottom = null;

  // Find blocks by walking through section children (wrappers created by decorateSections)
  // Each wrapper contains a block
  Array.from(section.children).forEach((wrapper) => {
    // Find the block element inside the wrapper
    const block = wrapper.querySelector('[data-block-name]') || wrapper.querySelector('.block');
    if (!block) return;

    const blockName = block.getAttribute('data-block-name');

    // text-list blocks (link columns) - these modify in-place
    if (blockName === 'text-list' || blockName === 'footer-link-column') {
      // Use the block itself (text-list doesn't replace, it modifies)
      if (!linkColumns.includes(block)) {
        linkColumns.push(block);
      }
    } else if (blockName === 'footer-download-section' || blockName === 'footer-download-link') {
      // footer-download-section - these are replaced
      // Look for decorated element (replaced block)
      const decorated = wrapper.querySelector('.footer-download-section') || wrapper.querySelector('.footer-download-link');
      if (decorated && !downloadSection) {
        downloadSection = decorated;
      } else if (!downloadSection && block.classList.contains('footer-download-section')) {
        // Block might not be decorated yet, use it anyway
        downloadSection = block;
      }
    } else if (blockName === 'footer-utility-links' || blockName === 'footer-privacy-link-list') {
      // footer-utility-links - these are replaced
      const decorated = wrapper.querySelector('.footer-utility-links') || wrapper.querySelector('.footer-privacy-link-list');
      if (decorated && !utilityLinks) {
        utilityLinks = decorated;
      } else if (!utilityLinks && (block.classList.contains('footer-utility-links') || block.classList.contains('footer-privacy-link-list'))) {
        utilityLinks = block;
      }
    } else if (blockName === 'footer-bottom') {
      // footer-bottom - these are replaced
      const decorated = wrapper.querySelector('.footer-bottom');
      if (decorated && !bottom) {
        bottom = decorated;
      } else if (!bottom && block.classList.contains('footer-bottom')) {
        bottom = block;
      }
    }
  });

  // Clone elements before clearing section (they will be moved, not copied)
  config.linkColumns = linkColumns.map((col) => col.cloneNode(true));
  if (downloadSection) config.downloadSection = downloadSection.cloneNode(true);
  if (utilityLinks) config.utilityLinks = utilityLinks.cloneNode(true);
  if (bottom) config.bottom = bottom.cloneNode(true);

  // Create footer structure
  const footer = createFooterUnipol(config);

  // Replace section content with footer
  section.innerHTML = '';
  section.appendChild(footer);
  section.classList.add('footer-section-decorated');
}
