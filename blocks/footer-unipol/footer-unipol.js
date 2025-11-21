/**
 * Footer Unipol - Main footer component
 * Organism that combines all footer sections
 */

import { createFooterDownloadSection } from '../molecules/footer-download-section/footer-download-section.js';
import { createFooterUtilityLinks } from '../molecules/footer-utility-links/footer-utility-links.js';
import { createFooterBottom } from '../molecules/footer-bottom/footer-bottom.js';

/**
 * Creates the footer-unipol component
 *
 * @param {Object} config - Configuration object
 * @param {Array<HTMLElement>} config.linkColumns - Array of footer link column elements
 * @param {HTMLElement|Object} config.downloadSection - Download section element or config
 * @param {HTMLElement|Array<Object>} config.utilityLinks - Utility links element or config
 * @param {HTMLElement|Object} config.bottom - Bottom section element or config
 * @returns {HTMLElement} The complete footer element
 */
export function createFooterUnipol(config = {}) {
  const footer = document.createElement('footer');
  footer.className = 'footer-unipol block';

  const footerContainer = document.createElement('div');
  footerContainer.className = 'footer-unipol-container';

  // Top Section: Link Columns + Download Section
  const topSection = document.createElement('div');
  topSection.className = 'footer-unipol-top';

  // Link Columns Container
  const linkColumnsContainer = document.createElement('div');
  linkColumnsContainer.className = 'footer-unipol-link-columns';

  if (config.linkColumns && config.linkColumns.length > 0) {
    config.linkColumns.forEach((column) => {
      if (column) {
        linkColumnsContainer.appendChild(column);
      }
    });
  }

  topSection.appendChild(linkColumnsContainer);

  // Download Section
  if (config.downloadSection) {
    const downloadElement = config.downloadSection instanceof HTMLElement
      ? config.downloadSection
      : createFooterDownloadSection(config.downloadSection);
    topSection.appendChild(downloadElement);
  }

  footerContainer.appendChild(topSection);

  // Middle Section: Utility Links
  if (config.utilityLinks) {
    const utilityElement = config.utilityLinks instanceof HTMLElement
      ? config.utilityLinks
      : createFooterUtilityLinks(config.utilityLinks);
    utilityElement.className = 'footer-unipol-utility';
    footerContainer.appendChild(utilityElement);
  }

  // Bottom Section: Copyright + Social Icons
  if (config.bottom) {
    const bottomElement = config.bottom instanceof HTMLElement
      ? config.bottom
      : createFooterBottom(config.bottom);
    bottomElement.className = 'footer-unipol-bottom';
    footerContainer.appendChild(bottomElement);
  }

  footer.appendChild(footerContainer);
  return footer;
}

/**
 * Extracts link columns from AEM blocks
 *
 * @param {Array<HTMLElement>} blocks - Array of block elements
 * @returns {Array<HTMLElement>} Array of link column elements
 */
function extractLinkColumns(blocks) {
  const columns = [];

  blocks.forEach((block) => {
    // Look for footer-link-column or text-list blocks
    const column = block.querySelector('.footer-link-column') || block.querySelector('.text-list');
    if (column) {
      columns.push(column);
    } else if (block.classList.contains('footer-link-column') || block.classList.contains('text-list')) {
      columns.push(block);
    }
  });

  return columns;
}

/**
 * Preserves AEM Universal Editor instrumentation and metadata
 *
 * @param {HTMLElement} originalBlock - Original block with AEM attributes
 * @param {HTMLElement} newBlock - New block to receive attributes
 */
function preserveBlockAttributes(originalBlock, newBlock) {
  [...originalBlock.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-')) {
      newBlock.setAttribute(attr.name, attr.value);
    }
  });

  if (originalBlock.id) {
    newBlock.id = originalBlock.id;
  }

  [...originalBlock.classList].forEach((className) => {
    if (!className.startsWith('footer-unipol') && className !== 'block') {
      newBlock.classList.add(className);
    }
  });
}

/**
 * Decorator for footer-unipol block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  if (!block) return;

  // Extract sections from block
  const sections = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const actualSections = wrapper ? Array.from(wrapper.children) : sections;

  const config = {};

  // Extract link columns (text-list blocks)
  const linkColumnBlocks = actualSections.filter((section) => section.classList.contains('text-list')
      || section.querySelector('.text-list')
      || section.classList.contains('footer-link-column'));
  config.linkColumns = extractLinkColumns(linkColumnBlocks);

  // Extract download section
  const downloadBlock = actualSections.find((section) => section.classList.contains('footer-download-section')
      || section.querySelector('.footer-download-section'));
  if (downloadBlock) {
    const downloadElement = downloadBlock.querySelector('.footer-download-section') || downloadBlock;
    config.downloadSection = downloadElement;
  }

  // Extract utility links
  const utilityBlock = actualSections.find((section) => section.classList.contains('footer-utility-links')
      || section.classList.contains('footer-privacy-link-list')
      || section.querySelector('.footer-utility-links'));
  if (utilityBlock) {
    const utilityElement = utilityBlock.querySelector('.footer-utility-links') || utilityBlock;
    config.utilityLinks = utilityElement;
  }

  // Extract bottom section
  const bottomBlock = actualSections.find((section) => section.classList.contains('footer-bottom')
      || (section.querySelector('.footer-text') && section.querySelector('.footer-social-icon, .footer-social-list')));
  if (bottomBlock) {
    const bottomElement = bottomBlock.querySelector('.footer-bottom') || bottomBlock;
    config.bottom = bottomElement;
  }

  // Create footer using factory function
  const footer = createFooterUnipol(config);

  // Preserve AEM instrumentation and metadata
  preserveBlockAttributes(block, footer);

  // Replace the original block
  block.replaceWith(footer);
}
