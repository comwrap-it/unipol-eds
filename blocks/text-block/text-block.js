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

    // If button row has instrumentation, preserve the original structure
    // Otherwise, create button using primary-button atom
    if (hasInstrumentation) {
      // Preserve original button structure for Universal Editor
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'text-block-button-wrapper';
      // Clone all children to preserve instrumentation
      while (buttonRow.firstChild) {
        buttonWrapper.appendChild(buttonRow.firstChild);
      }
      // Move instrumentation from row to wrapper
      moveInstrumentation(buttonRow, buttonWrapper);
      textBlock.appendChild(buttonWrapper);
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

  // Preserve block instrumentation before replacing content
  if (block.hasAttribute('data-aue-resource')) {
    textBlock.setAttribute('data-aue-resource', block.getAttribute('data-aue-resource'));
    textBlock.setAttribute('data-aue-behavior', block.getAttribute('data-aue-behavior') || 'component');
    textBlock.setAttribute('data-aue-type', block.getAttribute('data-aue-type') || 'block');
    const aueLabel = block.getAttribute('data-aue-label');
    if (aueLabel) {
      textBlock.setAttribute('data-aue-label', aueLabel);
    }
  }

  // Preserve blockName if present (needed for loadBlock)
  if (block.dataset.blockName) {
    textBlock.dataset.blockName = block.dataset.blockName;
  }

  // Replace block content with text block
  // Preserve block class and instrumentation
  textBlock.classList.add('block');
  block.replaceWith(textBlock);
}
