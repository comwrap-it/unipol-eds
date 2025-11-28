/**
 * Text Block Component
 *
 * A content block component that displays a title, text content, and an optional button.
 * Uses primary-button as an atom component for call-to-action buttons.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import {
  createButton, BUTTON_VARIANTS, BUTTON_ICON_SIZES, createButtonFromRows,
} from '../atoms/buttons/standard-button/standard-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Export constants for external use
export { BUTTON_VARIANTS, BUTTON_ICON_SIZES };

let isPrimaryBtnStyleLoaded = false;
async function ensureBtnStylesLoaded() {
  if (isPrimaryBtnStyleLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(
    `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
  );
  isPrimaryBtnStyleLoaded = true;
}

/**
 * Extract title element from row with instrumentation
 * @param {HTMLElement} titleRow - The row containing the title
 * @returns {HTMLElement|null} The title element with instrumentation
 */
function extractTitleElement(titleRow) {
  if (!titleRow) return null;

  const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
  if (existingHeading) {
    moveInstrumentation(titleRow, existingHeading);
    return existingHeading;
  }

  const title = document.createElement('h2');
  while (titleRow.firstChild) {
    title.appendChild(titleRow.firstChild);
  }
  moveInstrumentation(titleRow, title);

  return title.textContent?.trim() ? title : null;
}

/**
 * Extract text element from row with instrumentation
 * @param {HTMLElement} textRow - The row containing the text
 * @returns {HTMLElement|null} The text element with instrumentation
 */
function extractTextElement(textRow) {
  if (!textRow) return null;

  const hasInstrumentation = textRow.hasAttribute('data-aue-resource')
    || textRow.hasAttribute('data-richtext-prop')
    || textRow.querySelector('[data-aue-resource]')
    || textRow.querySelector('[data-richtext-prop]');

  if (!hasInstrumentation && !textRow.textContent?.trim()) {
    return null;
  }

  const existingPara = textRow.querySelector('p');
  if (existingPara) {
    // If textRow has other children besides the paragraph, move them into the paragraph
    // This ensures all content and instrumentation from child elements is preserved
    const children = Array.from(textRow.childNodes);
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

    // Move instrumentation from textRow to existingPara
    // This must be done AFTER moving children to preserve their instrumentation
    moveInstrumentation(textRow, existingPara);

    return existingPara;
  }

  const text = document.createElement('p');
  while (textRow.firstChild) {
    text.appendChild(textRow.firstChild);
  }
  moveInstrumentation(textRow, text);

  return (hasInstrumentation || text.textContent?.trim()) ? text : null;
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
 * Create a text block element programmatically
 *
 * This is the SINGLE SOURCE OF TRUTH for text block creation.
 * Used by both the decorate() function (AEM EDS) and Storybook.
 *
 * @param {HTMLElement|string} titleContent - Title element or text
 * @param {boolean} centered - Whether to center content and show text
 * @param {HTMLElement|string} textContent - Text element or string
 *   (visible only if centered is true)
 * @param {HTMLElement} buttonElement - Pre-created button element (optional)
 * @param {Object} buttonConfig - Button configuration object
 *   (alternative to buttonElement, for Storybook)
 * @param {string} buttonConfig.label - Button label
 * @param {string} buttonConfig.href - Button URL
 * @param {string} buttonConfig.variant - Button variant
 *   (primary, secondary, accent)
 * @param {string} buttonConfig.iconSize - Icon size
 * @param {string} buttonConfig.leftIcon - Left icon
 * @param {string} buttonConfig.rightIcon - Right icon
 * @returns {HTMLElement} The text block element
 */
export function createTextBlock(
  titleContent,
  centered = true,
  textContent = '',
  buttonElement = null,
  buttonConfig = null,
) {
  // Create text block container
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block block';
  textBlock.classList.add(centered ? 'text-block-center' : 'text-block-left');

  // Create main text content container
  const textContentContainer = document.createElement('div');
  textContentContainer.className = 'text-block-container';

  // Add title
  if (titleContent) {
    let titleElement;

    if (titleContent instanceof HTMLElement) {
      // Use existing element (from AEM EDS)
      titleElement = titleContent;
      titleElement.className = 'text-block-title';
    } else {
      // Create new element (for Storybook)
      titleElement = document.createElement('h2');
      titleElement.className = 'text-block-title';
      titleElement.textContent = titleContent;
    }

    textContentContainer.appendChild(titleElement);
  }

  // Add text (only if centered)
  if (centered && textContent) {
    let textElement;

    if (textContent instanceof HTMLElement) {
      // Use existing element (from AEM EDS)
      textElement = textContent;
      textElement.className = 'text-block-text';
    } else {
      // Create new element (for Storybook)
      textElement = document.createElement('p');
      textElement.className = 'text-block-text';
      textElement.textContent = textContent;
    }

    textContentContainer.appendChild(textElement);
  }

  // Add button
  let finalButtonElement = buttonElement;

  // If no button element provided but config is, create button from config
  if (!finalButtonElement && buttonConfig && buttonConfig.label) {
    finalButtonElement = createButton(
      buttonConfig.label || 'Button',
      buttonConfig.href || '',
      buttonConfig.variant || BUTTON_VARIANTS.PRIMARY,
      buttonConfig.iconSize || BUTTON_ICON_SIZES.MEDIUM,
      buttonConfig.leftIcon || '',
      buttonConfig.rightIcon || '',
      buttonConfig.instrumentation || {},
    );
  }

  if (finalButtonElement) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'text-block-button';
    buttonContainer.appendChild(finalButtonElement);
    textContentContainer.appendChild(buttonContainer);
  }

  // Append the main text container to textBlock
  textBlock.appendChild(textContentContainer);

  return textBlock;
}

/**
 * Decorates a text-block element
 *
 * This function extracts data from Universal Editor structure and delegates
 * the actual component creation to createTextBlock().
 *
 * @param {HTMLElement} block - The text-block element
 */
export default async function decorate(block) {
  if (!block) return;
  ensureBtnStylesLoaded();

  // === STEP 1: Extract rows from Universal Editor ===
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // === STEP 2: Extract data from rows ===

  // ROW 0: Title
  const titleRow = rows[0];
  const titleElement = extractTitleElement(titleRow);

  // ROW 1: Content Alignment (boolean)
  const alignmentRow = rows[1];
  const centered = alignmentRow?.querySelector('p')?.textContent
    .trim().toLowerCase() === 'true';

  // ROW 2: Text (subtitle/description)
  const textRow = rows[2];
  const textElement = centered ? extractTextElement(textRow) : null;

  // ROWS 3-8: Button fields (from button-container)
  // Note: Container fields are flattened at the parent level in Universal Editor
  const buttonRows = rows.slice(3, 9);
  const buttonElement = createButtonFromRows(buttonRows);

  // === STEP 3: Create the text block using the centralized function ===
  const textBlock = createTextBlock(
    titleElement,
    centered,
    textElement,
    buttonElement,
  );

  // === STEP 4: Preserve AEM instrumentation and metadata ===
  preserveBlockAttributes(block, textBlock);

  // === STEP 5: Replace the original block ===
  block.replaceWith(textBlock);
}
