/**
 * Number Block Component
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

// Character limits for number block fields
const MAX_TITLE_LENGTH = 7;
const MAX_DESCRIPTION_LENGTH = 40;

/**
 * Truncate text content to specified length
 * @param {HTMLElement} element - The element to truncate
 * @param {number} maxLength - Maximum allowed length
 */
function truncateTextContent(element, maxLength) {
  if (!element) return;

  const textContent = element.textContent || '';
  if (textContent.length > maxLength) {
    const truncated = textContent.substring(0, maxLength);
    element.textContent = truncated;
    // eslint-disable-next-line no-console
    console.warn(`Text truncated to ${maxLength} characters: "${truncated}"`);
  }
}

/**
 * Decorates a number-block element
 * @param {HTMLElement} block - The number-block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Create number block container
  const numberBlock = document.createElement('div');
  numberBlock.className = 'number-block';

  const numberBlockWrapper = document.createElement('div');
  numberBlockWrapper.className = 'number-block-cont';

  for (let i = 0; i <= 5; i += 2) {
    const firstRow = rows[i];
    const secondRow = rows[i + 1];
    if (firstRow && secondRow) {
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'number-block';

      const processRow = (row, rowIndex) => {
        if (!row) return;
        const hasInstrumentation = row.hasAttribute('data-aue-resource')
            || row.hasAttribute('data-richtext-prop')
            || row.querySelector('[data-aue-resource]')
            || row.querySelector('[data-richtext-prop]');
        const hasContent = row.textContent?.trim();
        if (hasInstrumentation || hasContent) {
          const inner = document.createElement('div');

          // Add class for title rows (numeric values)
          if (rowIndex === 0 || rowIndex === 2 || rowIndex === 4) {
            inner.classList.add('text-block-number');
          }

          while (row.firstChild) {
            inner.appendChild(row.firstChild);
          }
          moveInstrumentation(row, inner);

          // Apply character limits
          // Titles (rows 0, 2, 4): max 7 characters
          // Descriptions (rows 1, 3, 5): max 40 characters
          if (rowIndex === 0 || rowIndex === 2 || rowIndex === 4) {
            truncateTextContent(inner, MAX_TITLE_LENGTH);
          } else if (rowIndex === 1 || rowIndex === 3 || rowIndex === 5) {
            truncateTextContent(inner, MAX_DESCRIPTION_LENGTH);
          }

          itemWrapper.appendChild(inner);
        }
      };

      processRow(firstRow, i);
      processRow(secondRow, i + 1);

      if (itemWrapper.children.length > 0) {
        numberBlockWrapper.appendChild(itemWrapper);
      }
    }
  }

  if (numberBlockWrapper.children.length > 0) {
    numberBlock.appendChild(numberBlockWrapper);
  }

  // Preserve ALL block instrumentation attributes before replacing content
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      numberBlock.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    numberBlock.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  numberBlock.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block') {
        numberBlock.classList.add(cls);
      }
    });
  }

  // Replace block content with number block
  block.replaceWith(numberBlock);
}
