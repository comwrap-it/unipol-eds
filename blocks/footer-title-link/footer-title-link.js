/**
 * Footer Title Link Component
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates a footer-title-link element
 * @param {HTMLElement} block - The footer-title-link element
 */
export default async function decorate(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Create footer Title Link container
  const footerTitleLink = document.createElement('div');
  footerTitleLink.className = 'footer-title-link';

  const footerTitleLinkWrapper = document.createElement('div');
  footerTitleLinkWrapper.className = 'footer-title-link-cont';


  if (footerTitleLinkWrapper.children.length > 0) {
    footerTitleLink.appendChild(footerTitleLinkWrapper);
  }

  // Preserve ALL block instrumentation attributes before replacing content
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      footerTitleLink.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    footerTitleLink.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  footerTitleLink.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block') {
        footerTitleLink.classList.add(cls);
      }
    });
  }

  // Replace block content with footer Title Link
  block.replaceWith(footerTitleLink);
}
