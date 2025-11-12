/**
 * Text Block Component
 *
 * A content block component that displays a title, text content, and an optional button.
 * Uses primary-button as an atom component for call-to-action buttons.
 *
 * Preserves Universal Editor instrumentation for AEM EDS.
 */

import { createButton, BUTTON_VARIANTS, BUTTON_SIZES } from '../atoms/buttons/standard-button/standard-button.js';
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

    // === Row 2: Content Alignment ===
    const contentAlignmentRow = rows[2];
    let contentAlignment = contentAlignmentRow.textContent?.trim();

    if (contentAlignmentRow) {
      const alignmentField = contentAlignmentRow.querySelector('p[data-aue-prop="contentAlignment"]');
      if (alignmentField && alignmentField.textContent?.trim()) {
        contentAlignment = alignmentField.textContent.trim();
      }
    }

    if (contentAlignment === 'text-block-center') {
      textBlock.classList.add('align-center');
    } else if (contentAlignment === 'text-block-left') {
      textBlock.classList.add('align-left');
    }


  // Button - Rows 3-6 (optional)
  // Universal Editor creates separate rows for each button field:
  // Row 2 = text, Row 3 = variant, Row 4 = size, Row 5 = href
  const buttonTextRow = rows[3];
  const buttonVariantRow = rows[4];
  const buttonSizeRow = rows[5];
  const buttonHrefRow = rows[6];

  if (buttonTextRow && buttonTextRow.textContent?.trim()) {
    // Check if button row has instrumentation (Universal Editor)
    // Universal Editor uses data-aue-prop on the fields
    const hasInstrumentation = buttonTextRow.hasAttribute('data-aue-resource')
      || buttonTextRow.querySelector('[data-aue-resource]')
      || buttonTextRow.querySelector('[data-richtext-prop]')
      || buttonTextRow.querySelector('[data-aue-prop]'); // Universal Editor field marker

    // If button row has instrumentation, preserve structure and apply button styles
    // Universal Editor will re-decorate the block when values change via editor-support.js
    // Otherwise, create button using primary-button atom
    if (hasInstrumentation) {
      // Universal Editor creates separate rows for each button field
      // Read values from each row's data-aue-prop element
      const textField = buttonTextRow.querySelector('[data-aue-prop="text"]');
      const variantField = buttonVariantRow?.querySelector('[data-aue-prop="variant"]');
      const sizeField = buttonSizeRow?.querySelector('[data-aue-prop="size"]');
      const hrefField = buttonHrefRow?.querySelector('a');

      const label = textField?.textContent?.trim() || 'Button';
      let variant = variantField?.textContent?.trim()?.toLowerCase() || BUTTON_VARIANTS.PRIMARY;
      let size = sizeField?.textContent?.trim()?.toLowerCase() || BUTTON_SIZES.MEDIUM;
      const href = hrefField?.getAttribute('href')?.replace('.html', '') || '';

      // Validate variant and size
      if (!Object.values(BUTTON_VARIANTS).includes(variant)) {
        variant = BUTTON_VARIANTS.PRIMARY;
      }
      if (!Object.values(BUTTON_SIZES).includes(size)) {
        size = BUTTON_SIZES.MEDIUM;
      }

      // Create button with extracted values
      const buttonElement = createButton(label, href, variant, size);

      // Wrap button in container for styling
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'text-block-button';
      buttonContainer.appendChild(buttonElement);

      textBlock.appendChild(buttonContainer);
    } else {
      // No instrumentation - simple button creation
      // Extract button data from row structure
      const buttonData = Array.from(buttonTextRow.children);

      // Extract button text from first child or row text
      let label = 'Button';
      if (buttonData.length > 0) {
        label = buttonData[0]?.textContent?.trim() || buttonTextRow.textContent?.trim() || 'Button';
      } else {
        label = buttonTextRow.textContent?.trim() || 'Button';
      }

      // Extract href from link or button data
      const link = buttonTextRow.querySelector('a');
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
