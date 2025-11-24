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
 * Preserves AEM Universal Editor instrumentation and metadata
 *
 * @param {HTMLElement} originalBlock - Original block with AEM attributes
 * @param {HTMLElement} newBlock - New block to receive attributes
 */
function preserveBlockAttributes(originalBlock, newBlock) {
  // Preserve ALL block instrumentation attributes
  [...originalBlock.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      newBlock.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (originalBlock.dataset.blockName) {
    newBlock.dataset.blockName = originalBlock.dataset.blockName;
  }

  // Preserve id if present
  if (originalBlock.id) {
    newBlock.id = originalBlock.id;
  }

  // Preserve block classes
  [...originalBlock.classList].forEach((className) => {
    if (className !== 'block' && !className.startsWith('footer-unipol')) {
      newBlock.classList.add(className);
    }
  });
}

/**
 * Decorator for footer-unipol block (AEM EDS)
 * Extracts child components in order and builds footer structure
 *
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  if (!block) return;

  // Extract child blocks from block
  const childBlocks = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const actualBlocks = wrapper ? Array.from(wrapper.children) : childBlocks;

  const config = {};

  // Process blocks in order
  // Link columns (text-list) come prima, poi download, utility, bottom
  const linkColumns = [];
  let downloadSection = null;
  let utilityLinks = null;
  let bottom = null;

  actualBlocks.forEach((childBlock) => {
    // Check if it's a text-list (link column)
    if (childBlock.classList.contains('text-list')
        || childBlock.querySelector('.text-list')
        || childBlock.classList.contains('footer-link-column')
        || childBlock.querySelector('.footer-link-column')) {
      // Extract the actual text-list element
      const textList = childBlock.querySelector('.text-list') || childBlock.querySelector('.footer-link-column') || childBlock;
      linkColumns.push(textList);
    } else if (childBlock.classList.contains('footer-download-section')
        || childBlock.querySelector('.footer-download-section')
        || childBlock.classList.contains('footer-download-link')
        || childBlock.querySelector('.footer-download-link')) {
      // Check if it's download section
      const download = childBlock.querySelector('.footer-download-section')
        || childBlock.querySelector('.footer-download-link')
        || childBlock;
      downloadSection = download;
    } else if (childBlock.classList.contains('footer-utility-links')
        || childBlock.querySelector('.footer-utility-links')
        || childBlock.classList.contains('footer-privacy-link-list')
        || childBlock.querySelector('.footer-privacy-link-list')) {
      // Check if it's utility links
      const utility = childBlock.querySelector('.footer-utility-links')
        || childBlock.querySelector('.footer-privacy-link-list')
        || childBlock;
      utilityLinks = utility;
    } else if (childBlock.classList.contains('footer-bottom')
        || childBlock.querySelector('.footer-bottom')) {
      // Check if it's bottom section
      const bottomElement = childBlock.querySelector('.footer-bottom') || childBlock;
      bottom = bottomElement;
    }
  });

  config.linkColumns = linkColumns;
  if (downloadSection) config.downloadSection = downloadSection;
  if (utilityLinks) config.utilityLinks = utilityLinks;
  if (bottom) config.bottom = bottom;

  // Create footer using factory function
  const footer = createFooterUnipol(config);

  // Preserve AEM instrumentation and metadata
  preserveBlockAttributes(block, footer);

  // Replace the original block
  block.replaceWith(footer);
}
