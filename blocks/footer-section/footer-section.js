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

  // Find all blocks by their data-block-name attribute
  // After loadSection, blocks are decorated and may be replaced
  const allBlocks = section.querySelectorAll('[data-block-name]');
  
  Array.from(allBlocks).forEach((block) => {
    const blockName = block.getAttribute('data-block-name');

    // text-list blocks (link columns)
    if (blockName === 'text-list' || blockName === 'footer-link-column') {
      // text-list modifies in-place, so the block itself is what we need
      // But we need to ensure it has the right structure
      if (!linkColumns.includes(block)) {
        linkColumns.push(block);
      }
    }
    // footer-download-section or footer-download-link
    else if (blockName === 'footer-download-section' || blockName === 'footer-download-link') {
      // These blocks are replaced, so find the decorated element
      const decorated = section.querySelector(`.footer-download-section, .footer-download-link`);
      if (decorated && !downloadSection) {
        downloadSection = decorated;
      }
    }
    // footer-utility-links or footer-privacy-link-list
    else if (blockName === 'footer-utility-links' || blockName === 'footer-privacy-link-list') {
      const decorated = section.querySelector(`.footer-utility-links, .footer-privacy-link-list`);
      if (decorated && !utilityLinks) {
        utilityLinks = decorated;
      }
    }
    // footer-bottom
    else if (blockName === 'footer-bottom') {
      const decorated = section.querySelector('.footer-bottom');
      if (decorated && !bottom) {
        bottom = decorated;
      }
    }
  });

  // Fallback: also check section children directly for decorated elements
  // (in case blocks were replaced and data-block-name is lost)
  Array.from(section.children).forEach((child) => {
    // Check for decorated download section
    if (!downloadSection) {
      const download = child.querySelector('.footer-download-section') || child.querySelector('.footer-download-link');
      if (download) {
        downloadSection = download;
      } else if (child.classList.contains('footer-download-section') || child.classList.contains('footer-download-link')) {
        downloadSection = child;
      }
    }

    // Check for decorated utility links
    if (!utilityLinks) {
      const utility = child.querySelector('.footer-utility-links') || child.querySelector('.footer-privacy-link-list');
      if (utility) {
        utilityLinks = utility;
      } else if (child.classList.contains('footer-utility-links') || child.classList.contains('footer-privacy-link-list')) {
        utilityLinks = child;
      }
    }

    // Check for decorated bottom
    if (!bottom) {
      const bottomEl = child.querySelector('.footer-bottom');
      if (bottomEl) {
        bottom = bottomEl;
      } else if (child.classList.contains('footer-bottom')) {
        bottom = child;
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
