/**
 * Footer Utility Links - Molecule Component
 * Horizontal row of utility links (privacy, terms, etc.)
 */

import { createFooterLink } from '../../atoms/footer-link/footer-link.js';

/**
 * Creates a footer utility links container
 *
 * @param {Array<Object>} links - Array of link configurations
 * @param {Array<HTMLElement>} [linkElements] - Pre-created link elements
 * @returns {HTMLElement} Footer utility links container
 */
export function createFooterUtilityLinks(links = [], linkElements = []) {
  const container = document.createElement('nav');
  container.className = 'footer-utility-links';
  container.setAttribute('role', 'navigation');
  container.setAttribute('aria-label', 'Footer utility links');

  // Use pre-created elements or create new ones
  if (linkElements && linkElements.length > 0) {
    linkElements.forEach((element) => {
      if (element) {
        container.appendChild(element);
      }
    });
  } else if (links && links.length > 0) {
    links.forEach((linkConfig) => {
      const link = createFooterLink(
        linkConfig.label || '',
        linkConfig.href || '#',
        'utility',
        linkConfig.instrumentation || {},
      );
      container.appendChild(link);
    });
  }

  return container;
}

/**
 * Extracts utility links from AEM rows
 *
 * @param {Array<HTMLElement>} rows - Array of row elements
 * @returns {Array<HTMLElement>} Array of link elements
 */
function extractUtilityLinks(rows) {
  const links = [];

  rows.forEach((row) => {
    const linkElement = row.querySelector('a');
    if (linkElement) {
      const label = linkElement.textContent?.trim() || '';
      const href = linkElement.href || linkElement.getAttribute('href') || '#';

      const instrumentation = {};
      [...row.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
          instrumentation[attr.name] = attr.value;
        }
      });

      const link = createFooterLink(label, href, 'utility', instrumentation);
      links.push(link);
    }
  });

  return links;
}

/**
 * Decorates a footer-utility-links block (AEM EDS)
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  const actualRows = wrapper ? Array.from(wrapper.children) : rows;

  const linkElements = extractUtilityLinks(actualRows);
  const container = createFooterUtilityLinks(null, linkElements);

  // Preserve block attributes for Universal Editor
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      container.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    container.dataset.blockName = block.dataset.blockName;
  }

  // Preserve id if present
  if (block.id) {
    container.id = block.id;
  }

  block.replaceWith(container);
}
