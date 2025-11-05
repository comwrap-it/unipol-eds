/**
 * Text Block Component
 *
 * Displays a title, text content, and an optional button.
 * Fully compatible with AEM Universal Editor.
 * Preserves instrumentation for edit support.
 */

import { createButton, extractButtonData, validateButtonProps } from '../primary-button/primary-button.js';

/**
 * Get Universal Editor instrumentation attributes from an element
 * @param {HTMLElement} element - Element to extract instrumentation from
 * @returns {Object} Object with instrumentation attributes
 */
function getInstrumentation(element) {
  if (!element) return {};

  const instrumentation = {};

  // Check direct attributes
  [...element.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      instrumentation[attr.name] = attr.value;
    }
  });

  // Check child elements for instrumentation
  const instrumentedChild = element.querySelector('[data-aue-resource], [data-richtext-prop]');
  if (instrumentedChild) {
    [...instrumentedChild.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
        instrumentation[attr.name] = attr.value;
      }
    });
  }

  return instrumentation;
}

/**
 * Check if element has Universal Editor instrumentation
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element has instrumentation
 */
function hasInstrumentation(element) {
  if (!element) return false;

  return element.hasAttribute('data-aue-resource')
    || element.hasAttribute('data-richtext-prop')
    || !!element.querySelector('[data-aue-resource], [data-richtext-prop]');
}

/**
 * Decorates a text-block element
 * @param {HTMLElement} block - The text-block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Get rows from block - handle both direct children and wrapped structure
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Ensure minimum 2 rows (title and text)
  if (rows.length < 2) return;

  // Create text block container
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';

  // ===== TITLE (Row 0) =====
  const titleRow = rows[0];
  if (titleRow && titleRow.textContent?.trim()) {
    const title = document.createElement('h2');
    title.className = 'text-block-title';

    // Preserve Universal Editor instrumentation
    const titleInstrumentation = getInstrumentation(titleRow);
    Object.entries(titleInstrumentation).forEach(([key, value]) => {
      title.setAttribute(key, value);
    });

    // Clone content preserving richtext formatting
    while (titleRow.firstChild) {
      title.appendChild(titleRow.firstChild.cloneNode(true));
    }

    if (title.textContent?.trim()) {
      textBlock.appendChild(title);
    }
  }

  // ===== TEXT CONTENT (Row 1) =====
  const textRow = rows[1];
  if (textRow) {
    const hasTextContent = textRow.textContent?.trim();
    const hasInstrumentationAttr = hasInstrumentation(textRow);

    if (hasTextContent || hasInstrumentationAttr) {
      const text = document.createElement('p');
      text.className = 'text-block-text';

      // Preserve Universal Editor instrumentation
      const textInstrumentation = getInstrumentation(textRow);
      Object.entries(textInstrumentation).forEach(([key, value]) => {
        text.setAttribute(key, value);
      });

      // Clone content
      while (textRow.firstChild) {
        text.appendChild(textRow.firstChild.cloneNode(true));
      }

      textBlock.appendChild(text);
    }
  }

  // ===== BUTTON (Row 2+) - Optional =====
  // Button can be in row 2 with multiple cells: text, variant, size, href
  if (rows.length > 2) {
    const buttonRow = rows[2];

    // Check if this is a button container structure
    const buttonCells = Array.from(buttonRow.children || []);

    if (buttonCells.length > 0 && buttonRow.textContent?.trim()) {
      // Check if button row has instrumentation (Universal Editor)
      const buttonHasInstrumentation = hasInstrumentation(buttonRow);

      if (buttonHasInstrumentation) {
        // PRESERVE STRUCTURE for Universal Editor
        // Create wrapper to preserve original cell structure
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'text-block-button-wrapper';

        // Preserve instrumentation from row to wrapper
        const buttonInstrumentation = getInstrumentation(buttonRow);
        Object.entries(buttonInstrumentation).forEach(([key, value]) => {
          buttonWrapper.setAttribute(key, value);
        });

        // Move all cells to wrapper (preserve structure for Universal Editor)
        while (buttonRow.firstChild) {
          buttonWrapper.appendChild(buttonRow.firstChild);
        }

        // Extract button configuration from preserved cells
        const preservedCells = Array.from(buttonWrapper.children);
        const buttonData = extractButtonData(preservedCells);
        const { variant, size } = validateButtonProps(buttonData.variant, buttonData.size);

        // Debug log: button property change detected
        // eslint-disable-next-line no-console
        console.log('[Text-Block] Button property change detected:', {
          extracted: buttonData,
          validated: { variant, size },
          cells: {
            text: preservedCells[0]?.textContent?.trim(),
            variant: preservedCells[1]?.textContent?.trim(),
            size: preservedCells[2]?.textContent?.trim(),
            href: preservedCells[3]?.textContent?.trim(),
          },
        });

        // Find or create button element
        let buttonElement = preservedCells[0]?.querySelector('a, button');

        if (!buttonElement) {
          // Create button with extracted data
          // eslint-disable-next-line no-console
          console.log('[Text-Block] Creating new button element');
          buttonElement = createButton(buttonData.text, buttonData.href, variant, size);

          // Preserve instrumentation from first cell to button
          const firstCellInstrumentation = getInstrumentation(preservedCells[0]);
          Object.entries(firstCellInstrumentation).forEach(([key, value]) => {
            buttonElement.setAttribute(key, value);
          });

          // Insert button into first cell
          preservedCells[0].textContent = '';
          preservedCells[0].appendChild(buttonElement);
        } else {
          // Update existing button with new values
          const oldClasses = buttonElement.className;
          // eslint-disable-next-line no-console
          console.log('[Text-Block] Updating existing button:', {
            oldClasses,
            newVariant: variant,
            newSize: size,
          });

          const firstCellInstrumentation = getInstrumentation(preservedCells[0]);
          buttonElement = createButton(buttonData.text, buttonData.href, variant, size);
          Object.entries(firstCellInstrumentation).forEach(([key, value]) => {
            buttonElement.setAttribute(key, value);
          });

          const oldButton = preservedCells[0].querySelector('a, button');
          if (oldButton) {
            oldButton.replaceWith(buttonElement);
            // eslint-disable-next-line no-console
            console.log('[Text-Block] Button replaced:', {
              oldClasses,
              newClasses: buttonElement.className,
            });
          }
        }

        // Add wrapper to container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-block-button';
        buttonContainer.appendChild(buttonWrapper);
        textBlock.appendChild(buttonContainer);
      } else {
        // No instrumentation - create button normally
        const buttonData = extractButtonData(buttonCells);
        const { variant, size } = validateButtonProps(buttonData.variant, buttonData.size);
        const button = createButton(buttonData.text, buttonData.href, variant, size);

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'text-block-button';
        buttonWrapper.appendChild(button);
        textBlock.appendChild(buttonWrapper);
      }
    }
  }

  // Preserve block instrumentation before replacing content
  const blockInstrumentation = getInstrumentation(block);
  Object.entries(blockInstrumentation).forEach(([key, value]) => {
    textBlock.setAttribute(key, value);
  });

  // Preserve block class
  textBlock.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block') {
        textBlock.classList.add(cls);
      }
    });
  }

  // Replace block content
  block.replaceWith(textBlock);
}
