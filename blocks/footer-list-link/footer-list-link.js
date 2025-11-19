/**
 * Footer List link Block Component
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates a Footer List link element
 * @param {HTMLElement} block - The Footer List link element
 */
export default async function decorate(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Create footer List Link container
  const footerListLink = document.createElement('div');
  footerListLink.className = 'footer-list-link';

  const footerListLinkWrapper = document.createElement('div');
  footerListLinkWrapper.className = 'footer-list-link-wrapper';

  rows.forEach((row) => {
    const cells = Array.from(row.children).filter(c => c.textContent.trim() !== '');
    if (cells.length < 2) return;

    const label = cells[0].querySelector('p')?.textContent.trim() || '';
    const linkEl = cells[1].querySelector('a');
    if (!linkEl) return;

    const href = linkEl.getAttribute('href');
    const title = linkEl.getAttribute('title') || label || '';
    const text = label || linkEl.textContent.trim();

    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'footer-list-link-item';

    const inner = document.createElement('div');
    inner.innerHTML = `<a href="${href}" title="${title}" class="button">${text}</a>`;

    // Move instrumentation if present
    moveInstrumentation(row, inner);

    itemWrapper.appendChild(inner);
    footerListLinkWrapper.appendChild(itemWrapper);
  });

  if (footerListLinkWrapper.children.length > 0) {
    footerListLink.appendChild(footerListLinkWrapper);
  }

  // Preserve ALL block instrumentation attributes
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      footerListLink.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    footerListLink.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  footerListLink.classList.add('block');
  block.classList.forEach((cls) => {
    if (cls !== 'block') {
      footerListLink.classList.add(cls);
    }
  });

  // Replace block content with button block
  block.replaceWith(footerListLink);


}
