/**
 * Number Block Component
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

// Character limits for number block fields
export const MAX_TITLE_LENGTH = 7;
export const MAX_DESCRIPTION_LENGTH = 40;

/**
 * Truncate text content to specified length
 * @param {HTMLElement} element - The element to truncate
 * @param {number} maxLength - Maximum allowed length
 */
function truncateTextContent(element, maxLength) {
  if (!element) return;

  // Get text content and trim whitespace/newlines
  const textContent = (element.textContent || '').trim();

  // Only process if there's actual content
  if (!textContent) return;

  if (textContent.length > maxLength) {
    const truncated = textContent.substring(0, maxLength);
    element.textContent = truncated;
    // eslint-disable-next-line no-console
    console.warn(`Text truncated to ${maxLength} characters: "${truncated}"`);
  } else {
    // Set trimmed content even if not truncated to remove whitespace
    element.textContent = textContent;
  }
}

/**
 * Extract number item (title + description) from rows
 * @param {HTMLElement} titleRow - Row containing the numeric value
 * @param {HTMLElement} descRow - Row containing the description
 * @returns {Object} Object with titleElement and descriptionElement
 */
function extractNumberItem(titleRow, descRow) {
  const item = { titleElement: null, descriptionElement: null };

  // Extract title (numeric value)
  if (titleRow) {
    const hasInstrumentation = titleRow.hasAttribute('data-aue-resource')
      || titleRow.hasAttribute('data-richtext-prop')
      || titleRow.querySelector('[data-aue-resource]')
      || titleRow.querySelector('[data-richtext-prop]');
    const hasContent = titleRow.textContent?.trim();

    if (hasInstrumentation || hasContent) {
      const titleElement = document.createElement('div');
      titleElement.classList.add('text-block-number');

      while (titleRow.firstChild) {
        titleElement.appendChild(titleRow.firstChild);
      }
      moveInstrumentation(titleRow, titleElement);
      // Truncation will be applied in createNumberBlock() if needed

      item.titleElement = titleElement;
    }
  }

  // Extract description
  if (descRow) {
    const hasInstrumentation = descRow.hasAttribute('data-aue-resource')
      || descRow.hasAttribute('data-richtext-prop')
      || descRow.querySelector('[data-aue-resource]')
      || descRow.querySelector('[data-richtext-prop]');
    const hasContent = descRow.textContent?.trim();

    if (hasInstrumentation || hasContent) {
      // Check if there's an existing paragraph (common in richtext)
      const existingPara = descRow.querySelector('p');
      
      if (existingPara) {
        // If textRow has other children besides the paragraph, move them into the paragraph
        // This ensures all content and instrumentation from child elements is preserved
        const children = Array.from(descRow.childNodes);
        children.forEach((child) => {
          if (child !== existingPara && child.nodeType === Node.ELEMENT_NODE) {
            // Move element and its instrumentation into the paragraph
            existingPara.appendChild(child);
          } else if (
            child !== existingPara
            && child.nodeType === Node.TEXT_NODE
            && child.textContent.trim()
          ) {
            // Move text nodes into the paragraph
            existingPara.appendChild(child);
          }
        });
        
        // Move instrumentation from descRow to existingPara
        // This must be done AFTER moving children to preserve their instrumentation
        moveInstrumentation(descRow, existingPara);
        
        // Wrap the paragraph in a div for consistent structure
        const descElement = document.createElement('div');
        descElement.appendChild(existingPara);
        
        item.descriptionElement = descElement;
      } else {
        // No existing paragraph, create one and wrap it
        const descElement = document.createElement('div');
        const para = document.createElement('p');
        
        while (descRow.firstChild) {
          para.appendChild(descRow.firstChild);
        }
        moveInstrumentation(descRow, para);
        
        descElement.appendChild(para);
        // Truncation will be applied in createNumberBlock() if needed

        item.descriptionElement = descElement;
      }
    }
  }

  return item;
}

/**
 * Preserve block-level attributes on the new element
 * @param {HTMLElement} sourceBlock - Original block element
 * @param {HTMLElement} targetBlock - New block element
 */
function preserveBlockAttributes(sourceBlock, targetBlock) {
  // Preserve ALL block instrumentation attributes
  [...sourceBlock.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      targetBlock.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (sourceBlock.dataset.blockName) {
    targetBlock.dataset.blockName = sourceBlock.dataset.blockName;
  }

  // Preserve block classes
  if (sourceBlock.classList.length > 0) {
    sourceBlock.classList.forEach((cls) => {
      if (cls !== 'block' && !targetBlock.classList.contains(cls)) {
        targetBlock.classList.add(cls);
      }
    });
  }
}

/**
 * Create a number block element programmatically
 *
 * This is the SINGLE SOURCE OF TRUTH for number block creation.
 * Used by both the decorate() function (AEM EDS) and Storybook.
 *
 * @param {Array} items - Array of number items (up to 3)
 * @param {HTMLElement|string} items[].title - Title element or text (numeric value)
 * @param {HTMLElement|string} items[].description - Description element or text
 * @returns {HTMLElement} The number block element
 */
export function createNumberBlock(items = []) {
  // Create number block container
  const numberBlock = document.createElement('div');
  numberBlock.className = 'number-block block';

  const numberBlockWrapper = document.createElement('div');
  numberBlockWrapper.className = 'number-block-cont';

  // Process each item (max 3)
  items.slice(0, 3).forEach((item) => {
    if (!item || (!item.title && !item.description)) return;

    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'number-block';

    // Add title (numeric value)
    if (item.title) {
      let titleElement;

      if (item.title instanceof HTMLElement) {
        // Use existing element (from AEM EDS)
        titleElement = item.title;
        if (!titleElement.classList.contains('text-block-number')) {
          titleElement.classList.add('text-block-number');
        }
        // Apply truncation to existing element
        truncateTextContent(titleElement, MAX_TITLE_LENGTH);
      } else {
        // Create new element (for Storybook)
        titleElement = document.createElement('div');
        titleElement.className = 'text-block-number';
        titleElement.textContent = item.title;
        truncateTextContent(titleElement, MAX_TITLE_LENGTH);
      }

      itemWrapper.appendChild(titleElement);
    }

    // Add description
    if (item.description) {
      let descElement;

      if (item.description instanceof HTMLElement) {
        // Use existing element (from AEM EDS)
        descElement = item.description;
        // Apply truncation to existing element
        truncateTextContent(descElement, MAX_DESCRIPTION_LENGTH);
      } else {
        // Create new element (for Storybook)
        descElement = document.createElement('div');
        const para = document.createElement('p');
        para.textContent = item.description;
        descElement.appendChild(para);
        truncateTextContent(para, MAX_DESCRIPTION_LENGTH);
      }

      itemWrapper.appendChild(descElement);
    }

    if (itemWrapper.children.length > 0) {
      numberBlockWrapper.appendChild(itemWrapper);
    }
  });

  if (numberBlockWrapper.children.length > 0) {
    numberBlock.appendChild(numberBlockWrapper);
  }

  return numberBlock;
}

/**
 * Decorates a number-block element
 *
 * This function extracts data from Universal Editor structure and delegates
 * the actual component creation to createNumberBlock().
 *
 * @param {HTMLElement} block - The number-block element
 */
export default async function decorate(block) {
  if (!block) return;

  // === STEP 1: Extract rows from Universal Editor ===
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // === STEP 2: Extract data from rows ===
  const items = [];

  // Extract 3 number items (pairs of rows: 0-1, 2-3, 4-5)
  for (let i = 0; i <= 5; i += 2) {
    const titleRow = rows[i];
    const descRow = rows[i + 1];

    if (titleRow && descRow) {
      const item = extractNumberItem(titleRow, descRow);

      if (item.titleElement || item.descriptionElement) {
        items.push({
          title: item.titleElement,
          description: item.descriptionElement,
        });
      }
    }
  }

  // === STEP 3: Create the number block using the centralized function ===
  const numberBlock = createNumberBlock(items);

  // === STEP 4: Preserve AEM instrumentation and metadata ===
  preserveBlockAttributes(block, numberBlock);

  // === STEP 5: Replace the original block ===
  block.replaceWith(numberBlock);
}
