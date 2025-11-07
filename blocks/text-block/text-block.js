/**
 * Text Block Component
 *
 * A content block component that displays a title, text content, and an optional button.
 * Uses primary-button as an atom component for call-to-action buttons.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButton, BUTTON_VARIANTS, BUTTON_SIZES } from '../primary-button/primary-button.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates a text-block element
 * @param {HTMLElement} block - The text-block element
 */
export default async function decorate(block) {
  if (!block) return;

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Extract text block data
  // Row 0: Title
  // Row 1: Text
  // Row 2: Button (optional)

  // Create text block container
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';

  // Title - Row 0
  const titleRow = rows[0];
  if (titleRow) {
    // Try to preserve existing heading element
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      // Move existing heading and preserve instrumentation
      existingHeading.className = 'text-block-title';
      moveInstrumentation(titleRow, existingHeading);
      textBlock.appendChild(existingHeading);
    } else {
      // Create new heading but preserve instrumentation
      const title = document.createElement('h2');
      title.className = 'text-block-title';
      // Clone child nodes to preserve richtext instrumentation
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      // Move instrumentation from row to title
      moveInstrumentation(titleRow, title);
      if (title.textContent?.trim()) {
        textBlock.appendChild(title);
      }
    }
  }

  // Text Content - Row 1 (subtitle field)
  const textRow = rows[1];
  if (textRow) {
    // Always process row if it has instrumentation, even if empty
    const hasInstrumentation = textRow.hasAttribute('data-aue-resource')
      || textRow.hasAttribute('data-richtext-prop')
      || textRow.querySelector('[data-aue-resource]')
      || textRow.querySelector('[data-richtext-prop]');

    if (hasInstrumentation || textRow.textContent?.trim()) {
      // Try to preserve existing paragraph
      const existingPara = textRow.querySelector('p');
      if (existingPara) {
        existingPara.className = 'text-block-text';
        moveInstrumentation(textRow, existingPara);
        textBlock.appendChild(existingPara);
      } else {
        // Create new paragraph but preserve instrumentation
        const text = document.createElement('p');
        text.className = 'text-block-text';
        // Clone child nodes to preserve richtext instrumentation
        while (textRow.firstChild) {
          text.appendChild(textRow.firstChild);
        }
        // Move instrumentation from row to text
        moveInstrumentation(textRow, text);
        // Always append if it has instrumentation, even if empty
        if (hasInstrumentation || text.textContent?.trim()) {
          textBlock.appendChild(text);
        }
      }
    }
  }

  // Button - Row 2 (optional)
  // Button can be defined in two ways:
  // 1. As a container with instrumentation (Universal Editor) - Row 2 contains nested fields
  // 2. As simple text rows - Row 2 contains button text, variant, size, href
  const buttonRow = rows[2];
  if (buttonRow && buttonRow.textContent?.trim()) {
    // Check if button row has instrumentation (Universal Editor)
    const hasInstrumentation = buttonRow.hasAttribute('data-aue-resource')
      || buttonRow.querySelector('[data-aue-resource]')
      || buttonRow.querySelector('[data-richtext-prop]');

    // If button row has instrumentation, preserve structure and apply button styles
    // Universal Editor will re-decorate the block when values change via editor-support.js
    // Otherwise, create button using primary-button atom
    if (hasInstrumentation) {
      // Preserve original button structure for Universal Editor
      // Following AEM EDS best practices: preserve structure for editing
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'text-block-button-wrapper';

      // Move instrumentation from row to wrapper
      moveInstrumentation(buttonRow, buttonWrapper);

      // Move all children to preserve instrumentation for Universal Editor
      // These must remain visible and accessible for Universal Editor to work
      while (buttonRow.firstChild) {
        buttonWrapper.appendChild(buttonRow.firstChild);
      }

      // Extract button values from the preserved structure for styling
      // Universal Editor saves select values directly as textContent of the cell
      // Structure: buttonCells[0] = text, [1] = variant, [2] = size, [3] = href
      const buttonCells = Array.from(buttonWrapper.children);

      // DEBUG: Log della struttura per capire cosa contengono i cells
      // eslint-disable-next-line no-console
      console.log('🔍 DEBUG Button Cells:', {
        cellCount: buttonCells.length,
        cell0: buttonCells[0]?.outerHTML,
        cell1: buttonCells[1]?.outerHTML,
        cell2: buttonCells[2]?.outerHTML,
        cell3: buttonCells[3]?.outerHTML,
      });

      let variant = BUTTON_VARIANTS.PRIMARY;
      let size = BUTTON_SIZES.MEDIUM;

      // Extract variant and size from preserved structure
      // Universal Editor saves select values as textContent of the cell
      // We need to extract the text content, handling both direct text and nested elements
      if (buttonCells[1]) {
        // Get all text from cell (handles both direct textContent and nested elements)
        let variantText = buttonCells[1].textContent?.trim() || '';
        // If cell has children, prefer first child's textContent
        // (Universal Editor might wrap in elements)
        if (!variantText && buttonCells[1].firstChild) {
          variantText = buttonCells[1].firstChild.textContent?.trim() || '';
        }
        variantText = variantText.toLowerCase();

        // eslint-disable-next-line no-console
        console.log('🔍 DEBUG Variant:', {
          rawText: buttonCells[1].textContent,
          processed: variantText,
          isValid: Object.values(BUTTON_VARIANTS).includes(variantText),
          validValues: Object.values(BUTTON_VARIANTS),
        });

        // Validate that the extracted value is a valid variant
        if (variantText && Object.values(BUTTON_VARIANTS).includes(variantText)) {
          variant = variantText;
        }
      }

      if (buttonCells[2]) {
        // Get all text from cell (handles both direct textContent and nested elements)
        let sizeText = buttonCells[2].textContent?.trim() || '';
        // If cell has children, prefer first child's textContent
        // (Universal Editor might wrap in elements)
        if (!sizeText && buttonCells[2].firstChild) {
          sizeText = buttonCells[2].firstChild.textContent?.trim() || '';
        }
        sizeText = sizeText.toLowerCase();

        // eslint-disable-next-line no-console
        console.log('🔍 DEBUG Size:', {
          rawText: buttonCells[2].textContent,
          processed: sizeText,
          isValid: Object.values(BUTTON_SIZES).includes(sizeText),
          validValues: Object.values(BUTTON_SIZES),
        });

        // Validate that the extracted value is a valid size
        if (sizeText && Object.values(BUTTON_SIZES).includes(sizeText)) {
          size = sizeText;
        }
      }

      // eslint-disable-next-line no-console
      console.log('🎯 DEBUG Final Values:', { variant, size });

      // Apply button classes directly to the structure for styling
      // Find existing button/link element in the preserved structure
      let buttonElement = buttonCells[0]?.querySelector('a, button');
      if (!buttonElement && buttonCells[0]) {
        // If first cell has a link, use it
        buttonElement = buttonCells[0].querySelector('a');
      }
      if (!buttonElement && buttonCells[3]) {
        // Check href cell for link
        buttonElement = buttonCells[3].querySelector('a');
      }

      // Extract label and href from preserved structure
      // Label can be in buttonCells[0] textContent or in an existing button/link element
      let label = 'Button';
      if (buttonCells[0]) {
        const existingButton = buttonCells[0].querySelector('a, button');
        label = existingButton?.textContent?.trim() || buttonCells[0].textContent?.trim() || 'Button';
      }
      const href = buttonCells[3]?.querySelector('a')?.href || buttonCells[3]?.textContent?.trim() || '';

      // If no existing button/link, create button in first cell
      if (!buttonElement && buttonCells[0]) {
        // Create button using createButton() to get all functionality
        // (event listeners, accessibility)
        // Note: instrumentation stays on the cell (buttonCells[0]), not on the button
        // Universal Editor edits the cell content, the button is just the visual representation
        buttonElement = createButton(label, href, variant, size);

        // Replace first cell content with button element
        // Keep the cell's instrumentation intact (don't touch cell attributes)
        buttonCells[0].textContent = '';
        buttonCells[0].appendChild(buttonElement);
      } else if (buttonElement) {
        // Update existing button element - always recreate using createButton() to ensure
        // all functionality (event listeners, accessibility) is preserved
        // Recreate button using createButton() with current values (variant, size, href, label)
        // This ensures all event listeners and accessibility features are present
        const newButtonElement = createButton(label, href, variant, size);

        // Replace old element with new one
        // (new element has all functionality + correct variant/size)
        // Note: instrumentation stays on the parent cell, not on the button itself
        buttonElement.replaceWith(newButtonElement);
        buttonElement = newButtonElement;
      }

      // Wrap in container for styling
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'text-block-button';
      buttonContainer.appendChild(buttonWrapper);

      textBlock.appendChild(buttonContainer);
    } else {
      // Extract button data from row structure
      // Expected structure: Row 2 contains buttonText, buttonVariant, buttonSize, buttonHref
      const buttonData = Array.from(buttonRow.children);

      // Extract button text from first child or row text
      let label = 'Button';
      if (buttonData.length > 0) {
        label = buttonData[0]?.textContent?.trim() || buttonRow.textContent?.trim() || 'Button';
      } else {
        label = buttonRow.textContent?.trim() || 'Button';
      }

      // Extract href from link or button data
      const link = buttonRow.querySelector('a');
      let href = '';
      if (link && link.href) {
        href = link.href;
      } else if (buttonData.length > 1) {
        // Check if second child is a link
        const secondChildLink = buttonData[1]?.querySelector('a');
        if (secondChildLink && secondChildLink.href) {
          href = secondChildLink.href;
        } else {
          href = buttonData[1]?.textContent?.trim() || '';
        }
      }

      // Extract variant and size from button data or defaults
      let variant = BUTTON_VARIANTS.PRIMARY;
      let size = BUTTON_SIZES.MEDIUM;

      // Try to find variant and size in button data
      for (let i = 0; i < buttonData.length; i += 1) {
        const text = buttonData[i]?.textContent?.trim().toLowerCase();
        if (text && Object.values(BUTTON_VARIANTS).includes(text)) {
          variant = text;
        } else if (text && Object.values(BUTTON_SIZES).includes(text)) {
          size = text;
        }
      }

      // Create button using primary-button atom
      const button = createButton(label, href, variant, size);
      if (button) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-block-button';
        buttonContainer.appendChild(button);
        textBlock.appendChild(buttonContainer);
      }
    }
  }

  // Preserve ALL block instrumentation attributes before replacing content
  // Copy all data-aue-* and other instrumentation attributes
  [...block.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name === 'data-block-name') {
      textBlock.setAttribute(attr.name, attr.value);
    }
  });

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    textBlock.dataset.blockName = block.dataset.blockName;
  }

  // Preserve block class
  textBlock.classList.add('block');
  if (block.classList.length > 0) {
    block.classList.forEach((cls) => {
      if (cls !== 'block') {
        textBlock.classList.add(cls);
      }
    });
  }

  // Replace block content with text block
  block.replaceWith(textBlock);
}
